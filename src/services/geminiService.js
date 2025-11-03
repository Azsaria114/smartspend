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

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;
    
    // Get date range
    const dates = expenses.map(e => new Date(e.date));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    const daysDiff = Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)) || 1;

    const prompt = `You are an expert personal finance advisor. Analyze this spending data and provide clear, actionable financial advice.

**Spending Summary:**
- Total Amount: ₹${totalSpent.toFixed(2)}
- Number of Transactions: ${expenses.length}
- Average Transaction: ₹${avgTransaction.toFixed(2)}
- Time Period: ${daysDiff} day(s)
- Top Spending Categories: ${categoryBreakdown}

**Your Task:**
Provide personalized financial advice in a friendly, professional tone. Include:
1. A brief analysis of spending patterns (2-3 sentences)
2. Top 3 specific savings recommendations based on their spending
3. Practical tips to reduce expenses
4. A realistic monthly budget suggestion based on their current spending

Format your response clearly with sections. Be encouraging but realistic. Keep it concise (250-350 words). Use emojis sparingly for visual appeal.`;

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
### 📊 Spending Analysis

You've recorded ${expenses.length} transactions totaling **₹${totalSpent.toFixed(2)}**.

**Top Spending Category:** ${topCategory ? `${topCategory[0]} (₹${topCategory[1].toFixed(2)})` : 'N/A'}

**Average Transaction:** ₹${avgDaily.toFixed(2)}

### 💡 Recommendations

1. **Track Your Habits**: Your highest spending is in ${topCategory ? topCategory[0] : 'various categories'}. Consider setting a monthly budget for this category.

2. **Small Changes, Big Impact**: If you reduce daily small expenses by just ₹50, you could save approximately **₹${(50 * 30).toFixed(2)} per month**.

3. **Create Categories**: Continue categorizing expenses to identify patterns and opportunities for savings.

4. **Set Goals**: Consider setting a monthly savings goal of 20% of your income.

### 🎯 Next Steps

- Review your ${topCategory ? topCategory[0] : 'spending'} expenses for the past week
- Look for recurring subscriptions or memberships you might not need
- Try the "24-hour rule" for non-essential purchases

*Note: This is mock advice. Connect your Gemini API key in the environment variables for personalized AI-powered insights!*
  `.trim();
}

