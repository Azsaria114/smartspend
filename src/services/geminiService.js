// Gemini API service for AI-powered financial advice
// Integrated with Google's Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Chat message handler
export async function sendChatMessage(userMessage, expenses, conversationHistory = []) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here' || GEMINI_API_KEY.trim() === '') {
    return generateMockChatResponse(userMessage, expenses);
  }

  try {
    // Calculate spending statistics
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`)
      .join(', ');

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;
    
    // Get date range
    const dates = expenses.map(e => new Date(e.date));
    const oldestDate = expenses.length > 0 ? new Date(Math.min(...dates)) : new Date();
    const newestDate = expenses.length > 0 ? new Date(Math.max(...dates)) : new Date();
    const daysDiff = expenses.length > 0 
      ? Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)) || 1 
      : 1;

    // Build conversation context
    const systemContext = `You are a friendly and expert personal finance advisor helping users in India. Your responses should be:
- Conversational and approachable
- Actionable with specific advice
- Encouraging and supportive
- Use Indian Rupee (₹) for all amounts
- Keep responses concise but informative (2-4 paragraphs max)

**User's Current Financial Data:**
- Total Expenses: ₹${totalSpent.toFixed(2)}
- Number of Transactions: ${expenses.length}
- Average Transaction: ₹${avgTransaction.toFixed(2)}
- Time Period: ${daysDiff} day(s)
- Top Spending Categories: ${categoryBreakdown || 'No expenses yet'}
- Top Category: ${topCategory}`;

    // Convert conversation history to Gemini format
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemContext }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I\'m ready to help you with your financial questions.' }]
      }
    ];

    // Add recent conversation history (last 6 messages to keep context manageable)
    const recentHistory = conversationHistory.slice(-6);
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in chat:', error);
    return generateMockChatResponse(userMessage, expenses);
  }
}

function generateMockChatResponse(userMessage, expenses) {
  const message = userMessage.toLowerCase();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  if (message.includes('biggest') || message.includes('largest') || message.includes('top category')) {
    return `Your biggest expense category is **${topCategory ? topCategory[0] : 'N/A'}** with ₹${topCategory ? topCategory[1].toFixed(2) : '0.00'} spent.\n\n${topCategory ? `Consider reviewing your ${topCategory[0]} expenses to identify potential savings opportunities.` : 'Add some expenses to get insights!'}`;
  }

  if (message.includes('save') || message.includes('saving') || message.includes('budget')) {
    return `Here are some quick savings tips:\n\n1. **Review your top category**: Focus on reducing expenses in your highest spending category\n2. **Set a daily limit**: Try limiting discretionary spending to ₹200-300 per day\n3. **Track consistently**: Keep logging expenses to spot patterns\n4. **Use the 24-hour rule**: Wait 24 hours before non-essential purchases\n\nBased on your current spending (₹${totalSpent.toFixed(2)}), aim to save 20-30% of your income monthly.`;
  }

  if (message.includes('budget') || message.includes('monthly')) {
    return `Based on your current spending pattern:\n\n**Suggested Monthly Budget:**\n• Essential Expenses: 50% (₹${(totalSpent * 2.5).toFixed(2)})\n• Savings: 20% (₹${(totalSpent * 0.5).toFixed(2)})\n• Wants/Entertainment: 20% (₹${(totalSpent * 0.5).toFixed(2)})\n• Emergency Fund: 10% (₹${(totalSpent * 0.25).toFixed(2)})\n\nStart with tracking your expenses for a full month to create a more accurate budget!`;
  }

  if (message.includes('trend') || message.includes('pattern') || message.includes('analysis')) {
    return `**Your Spending Analysis:**\n\n• Total tracked: ₹${totalSpent.toFixed(2)}\n• Transactions: ${expenses.length}\n• Average per transaction: ₹${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : '0.00'}\n\n${topCategory ? `Your spending is primarily focused on **${topCategory[0]}** (₹${topCategory[1].toFixed(2)}). Consider diversifying or optimizing this category.` : 'Keep adding expenses to see trends!'}`;
  }

  return `I can help you with:\n\n• **Spending analysis** - Ask "What's my biggest expense category?"\n• **Savings tips** - Ask "How can I save more?"\n• **Budget planning** - Ask "Create a monthly budget"\n• **Financial advice** - Ask any money-related question\n\nWhat specific aspect of your finances would you like help with?`;
}

export async function getFinancialAdvice(expenses) {
  // If no API key is configured, return mock advice
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here' || GEMINI_API_KEY.trim() === '') {
    return generateMockAdvice(expenses);
  }

  try {
    // Calculate spending statistics
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`)
      .join(', ');

    const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;
    
    // Get date range
    const dates = expenses.map(e => new Date(e.date));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    const daysDiff = Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)) || 1;

    const prompt = `You are a friendly personal finance advisor telling a story about someone's spending. Write your advice like you're having a conversation with them, making it easy to understand.

**Their Spending Story:**
- Total Amount Spent: ₹${totalSpent.toFixed(2)}
- Number of Transactions: ${expenses.length}
- Average Transaction: ₹${avgTransaction.toFixed(2)}
- Time Period: ${daysDiff} day(s)
- Top Spending Categories: ${categoryBreakdown}

**Your Task:**
Write a personalized financial story that:
1. Starts with a friendly observation about their spending (like "Looking at your expenses, I notice...")
2. Tells them what's working well and what could be improved (in simple, conversational language)
3. Gives 2-3 specific, actionable recommendations (like "Here's what I suggest...")
4. Ends with an encouraging note about their financial future

Write it as if you're talking directly to them - use "you" and "your". Make it feel like a story they can follow easily. Keep paragraphs short (2-3 sentences max). Use simple language. Keep it under 300 words total.`;

    // Use the latest Gemini API endpoint
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error fetching Gemini API:', error);
    // Fallback to mock advice on error
    return generateMockAdvice(expenses);
  }
}

function generateMockAdvice(expenses) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDaily = totalSpent / Math.max(1, expenses.length);
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  return `
Looking at your spending, I can see you've made ${expenses.length} transactions totaling ₹${totalSpent.toFixed(2)}. Your biggest expense category is ${topCategory ? topCategory[0] : 'various categories'} where you spent ₹${topCategory ? topCategory[1].toFixed(2) : '0.00'}.

Here's what I notice: Your average transaction is ₹${avgDaily.toFixed(2)}, which gives us a good starting point.

**What I suggest:**

1. Focus on ${topCategory ? topCategory[0] : 'your top spending area'} - this is where you're spending the most. Try setting a monthly limit that's 10% lower than what you're spending now. Small adjustments here can make a big difference.

2. The power of small changes - If you save just ₹50 each day by cutting one small unnecessary expense, you'll have ₹${(50 * 30).toFixed(2)} extra at the end of the month. That's money you can put toward something important to you.

3. Keep tracking - You're already doing great by recording your expenses! The more data you have, the better insights you'll get. Try to be consistent and add expenses daily.

**Your financial journey:**

Every small step counts. You're building awareness of your spending, which is the first step toward better financial control. Keep going, and you'll see your savings grow over time.

*Note: This is sample advice. Add your Gemini API key for personalized AI insights!*
  `.trim();
}

