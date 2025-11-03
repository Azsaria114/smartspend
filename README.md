# SmartSpend – AI Personal Finance Advisor

A modern React + Firebase web application that helps users track daily expenses, visualize spending patterns, and receive AI-powered financial advice.

## Features

- 🔐 **Firebase Authentication** - Secure email/password authentication
- 📊 **Expense Tracking** - Add, edit, and delete daily expenses with categories
- 📈 **Analytics Dashboard** - Visualize spending with interactive charts (Recharts)
- 🤖 **AI Insights** - Get personalized financial advice using Google Gemini API
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS
- **Database & Auth**: Firebase Firestore + Firebase Authentication
- **Charts**: Recharts
- **AI Integration**: Google Gemini API (optional)

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Firebase project (for backend)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd smartspend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id

   # Optional: For AI insights
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Set up Firestore Security Rules:**
   In Firebase Console → Firestore Database → Rules, use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /expenses/{expenseId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
smartspend/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseCharts.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # React context providers
│   │   └── AuthContext.jsx
│   ├── firebase/        # Firebase configuration
│   │   └── config.js
│   ├── hooks/           # Custom React hooks
│   │   └── useExpenses.js
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── Insights.jsx
│   ├── services/        # API services
│   │   └── geminiService.js
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
└── package.json
```

## Usage

1. **Sign Up / Login**: Create an account or log in with existing credentials
2. **Add Expenses**: Click "Add Expense" on the Dashboard to log daily spending
3. **View Analytics**: See spending patterns in charts and category breakdowns
4. **Get AI Insights**: Visit the Insights page for personalized financial advice

## Gemini API Setup (Optional)

To enable AI-powered financial insights:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file as `VITE_GEMINI_API_KEY`
3. The app will use real AI advice instead of mock recommendations

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

## Contributing

Feel free to open issues or submit pull requests!
