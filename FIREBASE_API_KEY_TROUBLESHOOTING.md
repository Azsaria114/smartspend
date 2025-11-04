# Firebase API Key Error - Troubleshooting Guide

## Error: "auth/api-key-not-valid.-please-pass-a-valid-api-key"

This error occurs when Firebase cannot validate your API key. Here are the steps to fix it:

---

## ✅ Solution 1: Verify Environment Variables in Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Verify all variables are set correctly:**
   - `VITE_FIREBASE_API_KEY=AIzaSyD7oCv1WJ6depZFxIHuSQqeAiBfoDAWG2`
   - `VITE_FIREBASE_AUTH_DOMAIN=smartspend-c8e7c.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID=smartspend-c8e7c`
   - `VITE_FIREBASE_STORAGE_BUCKET=smartspend-c8e7c.firebaseapp.com`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID=659202943545`
   - `VITE_FIREBASE_APP_ID=1:659202943545:web:d295553ab4d715f9b67be8`

3. **Important:** Make sure:
   - ✅ No extra spaces before or after the `=` sign
   - ✅ No quotes around the values
   - ✅ All variables are selected for **Production**, **Preview**, and **Development** environments
   - ✅ Click **Save** after each variable

4. **Redeploy your application** after adding/updating variables:
   - Go to **Deployments** tab
   - Click the **3 dots** (⋮) on the latest deployment
   - Click **Redeploy**

---

## ✅ Solution 2: Check Firebase API Key Restrictions

The API key might be restricted. Follow these steps:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
   - Select your project: `smartspend-c8e7c`

2. **Navigate to:** **APIs & Services** → **Credentials**

3. **Find your API key** (the one starting with `AIzaSyD7oCv1WJ6...`)

4. **Click on the API key** to edit it

5. **Check "API restrictions":**
   - If set to "Restrict key", make sure **Firebase Authentication API** is enabled
   - Or change to **"Don't restrict key"** (for testing)

6. **Check "Application restrictions":**
   - If set to "HTTP referrers", add your Vercel domains:
     - `*.vercel.app/*`
     - `your-vercel-domain.vercel.app/*`
   - Or change to **"None"** (for testing)

7. **Click "Save"**

---

## ✅ Solution 3: Get Fresh Firebase Configuration

If the API key is still not working, get a fresh one:

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
   - Select project: `smartspend-c8e7c`

2. **Click the gear icon** ⚙️ → **Project settings**

3. **Scroll to "Your apps"** section

4. **If you have a web app, click on it** or **"Add app"** → **Web**

5. **Copy the configuration values** (they should look like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // ← This is your API key
  authDomain: "smartspend-c8e7c.firebaseapp.com",
  projectId: "smartspend-c8e7c",
  storageBucket: "smartspend-c8e7c.firebaseapp.com",
  messagingSenderId: "659202943545",
  appId: "1:659202943545:web:..."
};
```

6. **Update Vercel environment variables** with the fresh values

7. **Redeploy** your application

---

## ✅ Solution 4: Verify Firebase Authentication is Enabled

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
   - Select project: `smartspend-c8e7c`

2. **Go to:** **Authentication** → **Sign-in method**

3. **Make sure "Email/Password" is enabled:**
   - Click on **Email/Password**
   - Toggle **"Enable"** to ON
   - Click **Save**

---

## ✅ Solution 5: Add Vercel Domain to Firebase Authorized Domains

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
   - Select project: `smartspend-c8e7c`

2. **Go to:** **Authentication** → **Settings** → **Authorized domains**

3. **Add your Vercel domain:**
   - Click **"Add domain"**
   - Enter: `your-app-name.vercel.app` (or your actual Vercel domain)
   - Click **Add**

4. **Common domains to add:**
   - `localhost` (for local development - usually already there)
   - `your-app-name.vercel.app`
   - `your-app-name-git-main-your-username.vercel.app`
   - Any custom domain you're using

---

## 🔍 Debug Steps

To check if environment variables are loading correctly:

1. **Check browser console** after deployment
2. Look for any Firebase configuration errors
3. The app will log which variables are missing (if any)

---

## 📝 Quick Checklist

- [ ] All environment variables are added in Vercel
- [ ] Environment variables are set for **all environments** (Production, Preview, Development)
- [ ] No spaces or quotes in environment variable values
- [ ] Application has been **redeployed** after adding variables
- [ ] Firebase Authentication → Email/Password is **enabled**
- [ ] Vercel domain is added to Firebase **Authorized domains**
- [ ] Firebase API key restrictions allow your Vercel domain (or restrictions are disabled)
- [ ] Firebase project is active and not deleted

---

## 🆘 Still Not Working?

If none of the above works:

1. **Create a new Firebase project** and get fresh credentials
2. **Update all environment variables** in Vercel with the new values
3. **Redeploy** the application

---

## 📞 Need More Help?

Check the build logs in Vercel:
1. Go to **Deployments** → Click on a deployment
2. Check the **Build Logs** for any errors
3. Check the **Function Logs** for runtime errors

