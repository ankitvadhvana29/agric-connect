import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, Send, Sparkles, CloudSun, Newspaper, ShieldCheck,
  RefreshCw, User, X, Mic, MicOff, Volume2, VolumeX
} from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  {
    topic: 'weather',
    label: '🌦️ Weather & Rain in Gondal',
    query: "What is today's agricultural weather forecast, rain probability, and humidity in Gondal and Rajkot?",
  },
  {
    topic: 'pest',
    label: '🐛 Pink Bollworm & Tikka Control',
    query: 'How to control pink bollworm in cotton and tikka disease in groundnut? Provide exact spray dosage and traps.',
  },
  {
    topic: 'current_affairs',
    label: '📰 2026 MSP Rates (Groundnut & Cotton)',
    query: 'What are the latest 2026 government Minimum Support Prices (MSP) for Groundnut, Cotton, and Wheat?',
  },
  {
    topic: 'weather',
    label: '💧 Spraying & Harvesting Advisory',
    query: "Is today's weather suitable for pesticide spraying and groundnut/chilli harvesting in Saurashtra?",
  },
  {
    topic: 'schemes',
    label: '🏛️ PM-KISAN & i-Khedut 75% Subsidy',
    query: 'What are the current rules for PM-KISAN ₹6,000 installment and Gujarat i-Khedut solar water pump subsidy?',
  },
  {
    topic: 'quality',
    label: '🔬 AGMARK & Grain Quality Standards',
    query: 'What are the AGMARK physical checks, moisture limits, and lab testing parameters for grains and spices?',
  },
  {
    topic: 'current_affairs',
    label: '📊 Saurashtra Mandi Price Trends',
    query: 'What are the current mandi arrival and price trends for cumin seeds (jeera) and groundnuts in Gondal and Rajkot APMC?',
  },
];

// Language code mapping for Web Speech API
const LANG_CODES = {
  en: 'en-IN',
  gu: 'gu-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

// Detect language from text using Unicode ranges
function detectLanguage(text) {
  if (!text || text.trim().length < 2) return null;
  const gujaratiRange = /[\u0A80-\u0AFF]/;
  const devanagariRange = /[\u0900-\u097F]/;
  if (gujaratiRange.test(text)) return 'gu';
  if (devanagariRange.test(text)) {
    // Differentiate Marathi vs Hindi by common words
    const marathiWords = ['आहे', 'करा', 'सांगा', 'काय', 'तुम्ही', 'मला', 'शेतकरी', 'पाऊस'];
    if (marathiWords.some((w) => text.includes(w))) return 'mr';
    return 'hi';
  }
  return 'en';
}

export default function AIChatbot({ t, lang = 'en', setLang, selectedTaluka = 'Gondal', isFloating = false, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: lang === 'gu'
        ? `નમસ્તે! હું **કિસાન AI સહાયક** છું. 🌾\n\nહું તમને **આજનું હવામાન, ૨૦૨૬ ના ટેકાના ભાવ (MSP), સરકારી સહાય યોજનાઓ** અને **AGMARK ગુણવત્તા** વિશે માહિતી આપી શકું છું. 🎤 **Voice** અથવા ⌨️ **Type** કરીને પૂછો!`
        : lang === 'hi'
        ? `नमस्ते! मैं **किसान AI सहायक** हूं। 🌾\n\nमैं **मौसम, 2026 MSP भाव, सरकारी योजनाएं** और **AGMARK मानक** पर जानकारी दे सकता हूं। 🎤 **बोलें** या ⌨️ **टाइप करें**!`
        : lang === 'mr'
        ? `नमस्कार! मी **शेतकरी AI मित्र** आहे. 🌾\n\nमी **हवामान, 2026 हमीभाव, सरकारी योजना** आणि **AGMARK मानक** याबद्दल माहिती देतो. 🎤 **बोला** किंवा ⌨️ **टाइप करा**!`
        : `Namaste! I am your **Kisan AI Assistant** 🌾\n\nI provide instant intelligence on weather, 2026 MSP rates, government schemes & AGMARK quality standards.\n\n🎤 Use the **voice button** to speak your question, or type below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  // TTS state
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [ttsSupported, setTtsSupported] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    setTtsSupported('speechSynthesis' in window);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Stop any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // Voice Input — Start/Stop
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CODES[lang] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      // Auto-detect language from spoken text and update lang if confident
      const detectedLang = detectLanguage(transcript);
      if (detectedLang && detectedLang !== lang && setLang) {
        setLang(detectedLang);
      }

      setInput(transcript);
      // Auto-send after a short delay
      setTimeout(() => {
        handleSendMessage(transcript);
      }, 300);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [isListening, lang, setLang]);

  // Text-to-Speech for a bot message
  const handleSpeak = useCallback((text, msgId) => {
    if (!window.speechSynthesis) return;

    // If already speaking this message, stop
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Strip markdown symbols for cleaner TTS
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/#+\s/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[•\-]\s/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANG_CODES[lang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Pick best available voice for the language
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith(LANG_CODES[lang]?.split('-')[0] || 'en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  }, [lang, speakingMsgId]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim()) return;

    // Auto-detect language from typed text
    const detectedLang = detectLanguage(query);
    const activeLang = detectedLang || lang;
    if (detectedLang && detectedLang !== lang && setLang) {
      setLang(detectedLang);
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithAI({
        message: query.trim(),
        history: messages.slice(-4),
        taluka: selectedTaluka,
        language: activeLang,
      });

      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: res?.reply || 'Information received. Please check back shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang: activeLang,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Auto-speak if voice was used for input
      if (isListening === false && textToSend && ttsSupported) {
        // Auto-speak bot reply when voice input was used
        setTimeout(() => handleSpeak(botMessage.text, botMessage.id), 400);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: 'Unable to connect to AI server. Please check your network.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: lang === 'gu'
          ? 'ચેટ સાફ કરવામાં આવી છે. નવો પ્રશ્ન પૂછો! 🎤 Voice અથવા ⌨️ Type'
          : lang === 'hi'
          ? 'चैट साफ हो गई। नया सवाल पूछें! 🎤 बोलें या ⌨️ टाइप करें'
          : lang === 'mr'
          ? 'चॅट साफ झाली. नवा प्रश्न विचारा! 🎤 बोला किंवा ⌨️ टाइप करा'
          : 'Chat cleared. Ask me about weather, MSP, or agricultural current affairs! 🎤 Voice or ⌨️ Type',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const filteredPrompts = activeFilter === 'all'
    ? QUICK_PROMPTS
    : QUICK_PROMPTS.filter((p) => p.topic === activeFilter);

  return (
    <div className={`chatbot-container ${isFloating ? 'floating-chatbot' : 'fullscreen-chatbot'}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="bot-avatar-icon">
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#111827' }}>
                {t?.aiChatbot || 'Kisan AI Assistant'}
              </h3>
              <span className="live-pill">
                <span className="live-dot"></span> LIVE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
              {t?.chatSubtitle || 'Agricultural Current Affairs, Mandi Rates & Weather'} • {selectedTaluka}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={handleClearChat} className="chat-header-btn" title="Clear Chat">
            <RefreshCw size={14} />
          </button>
          {isFloating && onClose && (
            <button onClick={onClose} className="chat-header-btn" title="Close Chat">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="chat-filter-bar">
        <button onClick={() => setActiveFilter('all')} className={`chat-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}>
          <Sparkles size={12} /> All
        </button>
        <button onClick={() => setActiveFilter('pest')} className={`chat-filter-pill ${activeFilter === 'pest' ? 'active' : ''}`}>
          🐛 Pest Control
        </button>
        <button onClick={() => setActiveFilter('weather')} className={`chat-filter-pill ${activeFilter === 'weather' ? 'active' : ''}`}>
          <CloudSun size={12} /> Weather & Rain
        </button>
        <button onClick={() => setActiveFilter('current_affairs')} className={`chat-filter-pill ${activeFilter === 'current_affairs' ? 'active' : ''}`}>
          <Newspaper size={12} /> Current Affairs & MSP
        </button>
        <button onClick={() => setActiveFilter('schemes')} className={`chat-filter-pill ${activeFilter === 'schemes' ? 'active' : ''}`}>
          🏛️ Schemes
        </button>
        <button onClick={() => setActiveFilter('quality')} className={`chat-filter-pill ${activeFilter === 'quality' ? 'active' : ''}`}>
          <ShieldCheck size={12} /> AGMARK Tests
        </button>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-area">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble-row ${m.sender === 'user' ? 'user-row' : 'bot-row'}`}>
            {m.sender === 'bot' && (
              <div className="bubble-avatar bot">
                <Bot size={14} color="#16a34a" />
              </div>
            )}
            <div className={`chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              <div className="chat-bubble-content">
                {m.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={idx} style={{ margin: '6px 0 4px', fontSize: '0.95rem', color: '#14532d', fontWeight: 'bold' }}>{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('- ') || line.startsWith('• ')) {
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '6px', margin: '2px 0', fontSize: '0.85rem' }}>
                        <span style={{ color: '#16a34a' }}>•</span>
                        <span>{formatInlineMarkdown(line.substring(2))}</span>
                      </div>
                    );
                  }
                  if (!line.trim()) {
                    return <div key={idx} style={{ height: '6px' }} />;
                  }
                  return <p key={idx} style={{ margin: '3px 0', fontSize: '0.85rem', lineHeight: '1.45' }}>{formatInlineMarkdown(line)}</p>;
                })}
              </div>

              {/* TTS Button for bot messages */}
              {m.sender === 'bot' && ttsSupported && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span className="chat-timestamp">{m.timestamp}</span>
                  <button
                    onClick={() => handleSpeak(m.text, m.id)}
                    title={speakingMsgId === m.id ? 'Stop Speaking' : 'Listen (Read Aloud)'}
                    style={{
                      background: speakingMsgId === m.id ? '#dcfce7' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: speakingMsgId === m.id ? '#16a34a' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.7rem',
                    }}
                  >
                    {speakingMsgId === m.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    {speakingMsgId === m.id ? 'Stop' : 'Listen'}
                  </button>
                </div>
              )}
              {m.sender === 'user' && (
                <span className="chat-timestamp" style={{ display: 'block', textAlign: 'right', marginTop: '2px' }}>{m.timestamp}</span>
              )}
            </div>
            {m.sender === 'user' && (
              <div className="bubble-avatar user">
                <User size={14} color="#ffffff" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-row bot-row">
            <div className="bubble-avatar bot">
              <Bot size={14} color="#16a34a" />
            </div>
            <div className="chat-bubble bot-bubble typing-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="chat-quick-prompts">
        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0 0 6px', fontWeight: '600' }}>
          💡 Suggested Topics & Fast Answers:
        </p>
        <div className="quick-prompts-scroll">
          {filteredPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.query)}
              disabled={loading}
              className="quick-prompt-chip"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar with Voice Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="chat-input-bar"
      >
        {/* Voice Input Button */}
        {voiceSupported && (
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? 'Stop listening' : `Speak your question (${LANG_CODES[lang] || 'en-IN'})`}
            style={{
              width: '38px', height: '38px', borderRadius: '50%', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
              background: isListening ? '#dc2626' : '#f0fdf4',
              color: isListening ? 'white' : '#16a34a',
              boxShadow: isListening ? '0 0 0 4px rgba(220,38,38,0.25)' : '0 1px 3px rgba(0,0,0,0.1)',
              animation: isListening ? 'pulse-mic 1s infinite' : 'none',
            }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening
              ? '🎤 Listening... speak now'
              : (t?.askAiPlaceholder || "Ask about today's weather, rain, MSP rates, or PM-KISAN...")
          }
          disabled={loading || isListening}
          className="chat-text-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || isListening}
          className="chat-send-btn"
          title="Send Question"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Voice status indicator */}
      {isListening && (
        <div style={{
          textAlign: 'center', padding: '4px 8px',
          background: '#fee2e2', borderTop: '1px solid #fecaca',
          fontSize: '0.75rem', color: '#dc2626', fontWeight: '600',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', animation: 'pulse-mic 1s infinite' }}></span>
          Listening in {LANG_CODES[lang] || 'en-IN'}... Speak your question clearly
        </div>
      )}
    </div>
  );
}

// Simple bold and link markdown formatter
function formatInlineMarkdown(text) {
  const parts = [];
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#16a34a', textDecoration: 'underline' }}
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}
