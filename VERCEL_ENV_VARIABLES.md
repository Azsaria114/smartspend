# Vercel Environment Variables Configuration

## Required Environment Variables for Vercel Deployment

Add these environment variables in your Vercel project settings:

### Firebase Configuration

```
VITE_FIREBASE_API_KEY=AIzaSyD7oCv1WJ6depZFxIHuSQqeAiBfoDAWG2
VITE_FIREBASE_AUTH_DOMAIN=smartspend-c8e7c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smartspend-c8e7c
VITE_FIREBASE_STORAGE_BUCKET=smartspend-c8e7c.firebaseapp.com
VITE_FIREBASE_MESSAGING_SENDER_ID=659202943545
VITE_FIREBASE_APP_ID=1:659202943545:web:d295553ab4d715f9b67be8
```

### Optional: Gemini API Key (for AI features)

```
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

**Note:** If you don't have a Gemini API key, you can leave this empty or use a placeholder. The app will work with mock AI advice.

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable one by one:
   - **Key**: The variable name (e.g., `VITE_FIREBASE_API_KEY`)
   - **Value**: The actual value
   - **Environment**: Select `Production`, `Preview`, and `Development` (or select all)
4. Click **Save** after adding each variable
5. Redeploy your application for changes to take effect

## Important Notes

- All environment variables must start with `VITE_` to be accessible in your Vite React app
- After adding environment variables, you need to **redeploy** your application
- Make sure to add your Vercel domain to Firebase Authorized Domains in Firebase Console

## Firebase Authorized Domains Setup

After deployment, add your Vercel domain to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smartspend-c8e7c`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Vercel domain (e.g., `smartspend-xxx.vercel.app` or your custom domain)

