import express from 'express';
import { handleAIChat } from '../controllers/aiController.js';

const router = express.Router();

// Kisan AI Chatbot: Current Affairs, Weather & Agricultural Advisories
router.post('/chat', handleAIChat);

export default router;

