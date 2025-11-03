# SmartSpend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication → Sign-in method → Email/Password
   - Create Firestore Database (start in test mode)
   - Go to Project Settings → General → Your apps → Web app
   - Copy the Firebase config values

3. **Create `.env` file:**
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id

   # Optional: For AI insights
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Set up Firestore Security Rules:**
   In Firebase Console → Firestore Database → Rules:
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

5. **Create Firestore Index:**
   - Go to Firestore Database → Indexes
   - Create a composite index:
     - Collection: `expenses`
     - Fields: `userId` (Ascending), `date` (Descending)

6. **Run the app:**
   ```bash
   npm run dev
   ```

## Optional: Gemini API Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` as `VITE_GEMINI_API_KEY`
3. Restart the dev server

## Troubleshooting

- **"Missing or insufficient permissions"**: Check Firestore security rules
- **Authentication not working**: Verify Firebase config in `.env`
- **Charts not showing**: Ensure you have expenses added
- **AI insights not loading**: Check Gemini API key or use mock mode (works without key)

