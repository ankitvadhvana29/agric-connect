import { chatWithKisanAI } from '../services/aiService.js';

/**
 * @desc    Chat with Kisan AI for Current Affairs, Weather & Agricultural Advisories
 * @route   POST /api/ai/chat
 * @access  Public
 */
export const handleAIChat = async (req, res, next) => {
  try {
    const { message, history, taluka, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required for AI Chat.',
      });
    }

    const response = await chatWithKisanAI({
      message: message.trim(),
      history: history || [],
      taluka: taluka || 'Gondal',
      language: language || 'en',
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

