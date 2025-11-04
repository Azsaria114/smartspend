# Quick Setup Instructions for Vercel Environment Variables

## ⚡ Step-by-Step Guide

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your **smartspend** project

### Step 2: Navigate to Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add Each Variable (One by One)

**Add these 8 variables in order:**

#### 1. Firebase API Key
- **Key:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyD7oCvK1WJ6depZFxIHuSQqeAiBfoDAWG8`
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

#### 2. Firebase Auth Domain
- **Key:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `smartspend-c8e7c.firebaseapp.com`
- **Environment:** Select all
- Click **Save**

#### 3. Firebase Project ID
- **Key:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `smartspend-c8e7c`
- **Environment:** Select all
- Click **Save**

#### 4. Firebase Storage Bucket
- **Key:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `smartspend-c8e7c.firebasestorage.app`
- **Environment:** Select all
- Click **Save**

#### 5. Firebase Messaging Sender ID
- **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `659202943545`
- **Environment:** Select all
- Click **Save**

#### 6. Firebase App ID
- **Key:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:659202943545:web:d295553ab4d715f9b67be8`
- **Environment:** Select all
- Click **Save**

#### 7. Firebase Measurement ID (Optional)
- **Key:** `VITE_FIREBASE_MEASUREMENTID`
- **Value:** `G-K1ZMKTSY7F`
- **Environment:** Select all
- Click **Save**

#### 8. Gemini API Key (Optional - for AI features)
- **Key:** `VITE_GEMINI_API_KEY`
- **Value:** `AIzaSyDvdCmbhaA0V44x3xLjKyrNDAIqEJ5mAjs`
- **Environment:** Select all
- Click **Save**

### Step 4: Verify All Variables
After adding all variables, you should see 8 environment variables in the list.

### Step 5: Redeploy Your Application
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots** (⋮) menu
4. Click **Redeploy**
5. Wait for the deployment to complete

### Step 6: Add Vercel Domain to Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **smartspend-c8e7c**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Vercel domain (e.g., `your-app-name.vercel.app`)
6. Click **Add**

### Step 7: Check API Key Restrictions (Important!)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **smartspend-c8e7c**
3. Go to **APIs & Services** → **Credentials**
4. Find your API key: `AIzaSyD7oCvK1WJ6depZFxIHuSQqeAiBfoDAWG8`
5. Click on it to edit
6. **API restrictions:** Set to "Don't restrict key" (or ensure "Identity Toolkit API" is enabled)
7. **Application restrictions:** Set to "None" (or add `*.vercel.app/*` to HTTP referrers)
8. Click **Save**

## ✅ Verification Checklist

After setup, verify:
- [ ] All 8 environment variables are added in Vercel
- [ ] All variables are enabled for Production, Preview, and Development
- [ ] Application has been redeployed
- [ ] Vercel domain is added to Firebase Authorized domains
- [ ] API key restrictions are properly configured
- [ ] Test sign-in/sign-up on the deployed app

## 🆘 Still Having Issues?

If you still see the API key error:
1. Wait 2-3 minutes after changing API key restrictions (propagation delay)
2. Clear your browser cache and try again
3. Check the browser console for specific error messages
4. Verify the API key in Google Cloud Console matches the one in Vercel

