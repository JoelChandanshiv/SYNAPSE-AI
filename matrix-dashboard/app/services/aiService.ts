// app/services/aiService.ts
const AI_API_BASE = '/api';

export interface Message {
  id?: string;
  text: string;
  sender?: string;
  timestamp?: string;
  intent?: string;
  sentiment?: string;
  recency_score?: number;
}

export const aiService = {
  async healthCheck() {
    try {
      const response = await fetch(`${AI_API_BASE}/health`);
      return await response.json();
    } catch (error) {
      console.error('AI Health check failed:', error);
      return { status: 'error', error };
    }
  },

  async summarize(messages: Message[]) {
    try {
      const response = await fetch(`${AI_API_BASE}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      return await response.json();
    } catch (error) {
      console.error('Summarization failed:', error);
      return { error: 'Summarization failed' };
    }
  },

  async analyzeSentiment(messages: Message[]) {
    try {
      const response = await fetch(`${AI_API_BASE}/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      return await response.json();
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return { error: 'Sentiment analysis failed' };
    }
  },

  async analyzeIntent(message: Message) {
    try {
      const response = await fetch(`${AI_API_BASE}/analyze-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      return await response.json();
    } catch (error) {
      console.error('Intent analysis failed:', error);
      return { error: 'Intent analysis failed' };
    }
  },

  async prioritizeConversations(messages: Message[]) {
    try {
      const response = await fetch(`${AI_API_BASE}/prioritize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      return await response.json();
    } catch (error) {
      console.error('Prioritization failed:', error);
      return { error: 'Prioritization failed' };
    }
  },

  async addToKnowledgeBase(text: string, metadata: any) {
    try {
      const response = await fetch(`${AI_API_BASE}/knowledge-base/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, metadata }),
      });
      return await response.json();
    } catch (error) {
      console.error('KB add failed:', error);
      return { error: 'KB add failed' };
    }
  },

  async searchKnowledgeBase(query: string, top_k = 5) {
    try {
      const response = await fetch(`${AI_API_BASE}/knowledge-base/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k }),
      });
      return await response.json();
    } catch (error) {
      console.error('KB search failed:', error);
      return { error: 'KB search failed' };
    }
  },

  async generateDailyReport(conversations: Message[], date: string) {
    try {
      const response = await fetch(`${AI_API_BASE}/daily-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations, date }),
      });
      return await response.json();
    } catch (error) {
      console.error('Daily report failed:', error);
      return { error: 'Daily report failed' };
    }
  },
};
