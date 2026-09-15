import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Sparkles, CloudSun, Newspaper, ShieldCheck,
  RefreshCw, ChevronRight, User, HelpCircle, X, Maximize2, Minimize2
} from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  {
    topic: 'weather',
    label: '🌦️ Weather & Rain in Gondal',
    query: 'What is today\'s agricultural weather forecast, rain probability, and humidity in Gondal and Rajkot?',
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
    query: 'Is today\'s weather suitable for pesticide spraying and groundnut/chilli harvesting in Saurashtra?',
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

export default function AIChatbot({ t, lang = 'en', selectedTaluka = 'Gondal', isFloating = false, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: lang === 'gu'
        ? `નમસ્તે! હું **કિસાન AI સહાયક** છું. 🌾\n\nહું તમને **આજનું હવામાન, વરસાદની આગાહી, ૨૦૨૬ ના ટેકાના ભાવ (MSP), સરકારી સહાય યોજનાઓ (PM-KISAN, i-Khedut)** તેમજ **AGMARK ગુણવત્તા નિયમો** વિશે તાજી માહિતી આપી શકું છું.\n\nતમે નીચે આપેલા કોઈપણ પ્રશ્ન પર ક્લિક કરી શકો છો અથવા તમારો પ્રશ્ન ટાઈપ કરી શકો છો.`
        : `Namaste! I am your **Kisan AI Assistant** 🌾\n\nI provide instant intelligence on:\n- 🌦️ **Agricultural Weather & Rain Alerts** for Saurashtra\n- 📰 **Current Affairs & 2026 MSP Rates** (Groundnut, Cotton, Wheat, Spices)\n- 🏛️ **Government Schemes** (PM-KISAN, PMFBY, i-Khedut solar pump subsidies)\n- 🔬 **AGMARK & Crop Quality Standards**\n\nHow can I help you today? Feel free to ask or pick a suggestion below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim()) return;

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
        language: lang,
      });

      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: res?.reply || 'Information received. Please check back shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
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
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: lang === 'gu'
          ? 'ચેટ સાફ કરવામાં આવી છે. તમે નવો પ્રશ્ન પૂછી શકો છો.'
          : 'Chat cleared. Ask me about weather, MSP, or agricultural current affairs!',
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
          <button
            onClick={handleClearChat}
            className="chat-header-btn"
            title="Clear Chat"
          >
            <RefreshCw size={14} />
          </button>
          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="chat-header-btn"
              title="Close Chat"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="chat-filter-bar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`chat-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
        >
          <Sparkles size={12} /> All
        </button>
        <button
          onClick={() => setActiveFilter('pest')}
          className={`chat-filter-pill ${activeFilter === 'pest' ? 'active' : ''}`}
        >
          🐛 Pest Control
        </button>
        <button
          onClick={() => setActiveFilter('weather')}
          className={`chat-filter-pill ${activeFilter === 'weather' ? 'active' : ''}`}
        >
          <CloudSun size={12} /> Weather & Rain
        </button>
        <button
          onClick={() => setActiveFilter('current_affairs')}
          className={`chat-filter-pill ${activeFilter === 'current_affairs' ? 'active' : ''}`}
        >
          <Newspaper size={12} /> Current Affairs & MSP
        </button>
        <button
          onClick={() => setActiveFilter('schemes')}
          className={`chat-filter-pill ${activeFilter === 'schemes' ? 'active' : ''}`}
        >
          🏛️ Schemes
        </button>
        <button
          onClick={() => setActiveFilter('quality')}
          className={`chat-filter-pill ${activeFilter === 'quality' ? 'active' : ''}`}
        >
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
              <span className="chat-timestamp">{m.timestamp}</span>
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

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="chat-input-bar"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t?.askAiPlaceholder || "Ask about today's weather, rain, MSP rates, or PM-KISAN..."}
          disabled={loading}
          className="chat-text-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="chat-send-btn"
          title="Send Question"
        >
          <Send size={16} />
        </button>
      </form>
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
