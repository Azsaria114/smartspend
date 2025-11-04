# SmartSpend - Deployment Guide

This guide will walk you through deploying your SmartSpend app step-by-step. Choose the platform that works best for you.

---

## 🚀 Option 1: Vercel (Recommended for First-Time - Easiest)

Vercel is the easiest platform for deploying React apps. It's free and takes about 5 minutes.

### Step 1: Prepare Your Code
```bash
# Make sure all your code is committed
git status
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with your GitHub account (recommended)

### Step 3: Import Your Project
1. Click "Add New Project"
2. Find your `smartspend` repository
3. Click "Import"

### Step 4: Configure Settings
Vercel will auto-detect your settings, but verify:
- **Framework Preset:** Vite
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 5: Add Environment Variables
1. Click "Environment Variables"
2. Add all your Firebase keys from `.env`:
   ```
   VITE_FIREBASE_API_KEY=your-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-domain-here
   VITE_FIREBASE_PROJECT_ID=your-project-id-here
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket-here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
   VITE_FIREBASE_APP_ID=your-app-id-here
   VITE_FIREBASE_MEASUREMENTID=your-measurement-id-here
   VITE_GEMINI_API_KEY=your-gemini-key-here (optional)
   ```
3. Click "Save"

### Step 6: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at `smartspend.vercel.app` (or your custom domain)

### Step 7: Test Your Deployed App
1. Visit the URL provided
2. Test login/signup
3. Test adding expenses
4. Verify all features work

**That's it! Your app is live!** 🎉

---

## 🔥 Option 2: Firebase Hosting (Recommended - Since You Use Firebase)

Since you're already using Firebase, this is a great option.

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
This will open your browser to authenticate.

### Step 3: Initialize Firebase Hosting
```bash
firebase init hosting
```

**When prompted:**
1. **Select Firebase project:** Choose your existing `smartspend-c8e7c` project
2. **What do you want to use as your public directory?** → Type: `dist`
3. **Configure as a single-page app?** → Type: `Yes`
4. **Set up automatic builds and deploys with GitHub?** → Type: `No` (for now)
5. **File dist/index.html already exists. Overwrite?** → Type: `No`

### Step 4: Build Your App
```bash
npm run build
```

### Step 5: Deploy
```bash
firebase deploy --only hosting
```

### Step 6: Access Your App
Your app will be live at:
```
https://smartspend-c8e7c.web.app
```
or
```
https://smartspend-c8e7c.firebaseapp.com
```

### Step 7: Configure Environment Variables
Since Firebase Hosting serves static files, you need to:
1. Create a `.env.production` file with your keys
2. Or use Firebase Remote Config (advanced)
3. Or hardcode in a config file (not recommended for API keys)

**Better Option:** Use Vercel's environment variables or Netlify's (they support build-time env vars better)

---

## 🌐 Option 3: Netlify (Also Easy)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 2: Deploy from GitHub
1. Click "Add new site" → "Import an existing project"
2. Select your `smartspend` repository
3. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** `./`

### Step 3: Add Environment Variables
1. Go to Site settings → Environment variables
2. Add all your `.env` variables (same as Vercel)

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your app is live!

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] `.env` file is NOT committed (it's in `.gitignore`)
- [ ] App builds successfully locally (`npm run build`)
- [ ] Test the built version locally:
  ```bash
  npm run build
  npm run preview
  ```
- [ ] All environment variables are ready to add to hosting platform
- [ ] Firebase project is set up correctly
- [ ] Firebase Authentication is enabled
- [ ] Firestore Database is set up
- [ ] Gemini API key is ready (optional)

---

## 🔧 Fixing Common Build Issues

### Issue: Build fails with "Cannot find module"
**Solution:**
```bash
npm install
npm run build
```

### Issue: Environment variables not working
**Solution:**
- Make sure all `VITE_` prefixed variables are added to hosting platform
- Rebuild after adding environment variables

### Issue: Routing doesn't work (404 errors)
**Solution:**
- For Vercel: Create `vercel.json` (see below)
- For Netlify: Create `_redirects` file (see below)
- For Firebase: Already configured in `firebase.json`

### Issue: Firebase errors in production
**Solution:**
- Check Firebase Console → Authentication → Authorized domains
- Add your deployment domain (e.g., `smartspend.vercel.app`)

---

## 📁 Required Configuration Files

### For Vercel: `vercel.json`
Create this file in your project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### For Netlify: `public/_redirects`
Create `public/_redirects` file:

```
/*    /index.html   200
```

### For Firebase: `firebase.json` (auto-created)
Should look like:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🎯 Recommended: Vercel Deployment (Step-by-Step)

### Quick Start (5 minutes)

1. **Push code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to vercel.com and sign up** with GitHub

3. **Import your repository**:
   - Click "Add New Project"
   - Select `smartspend`
   - Click "Import"

4. **Add environment variables**:
   - Click "Environment Variables"
   - Add each variable from your `.env` file:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     VITE_FIREBASE_MEASUREMENTID
     VITE_GEMINI_API_KEY (optional)
     ```
   - Copy values from your `.env` file

5. **Click "Deploy"**

6. **Wait 2-3 minutes** for deployment

7. **Test your live app** at the provided URL

8. **Update Firebase Authorized Domains**:
   - Go to Firebase Console
   - Authentication → Settings → Authorized domains
   - Add your Vercel domain (e.g., `smartspend.vercel.app`)

**Done! Your app is live!** 🚀

---

## 🔐 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Environment variables** must be added to your hosting platform
3. **Firebase rules** - Make sure Firestore security rules are set
4. **API keys** - Keep your Gemini API key secure

---

## 📱 Testing After Deployment

Check these features:
- [ ] Login/Signup works
- [ ] Can add expenses
- [ ] Dashboard loads correctly
- [ ] Insights page works
- [ ] AI advice generates
- [ ] Budget planner functions
- [ ] Charts display properly
- [ ] Mobile responsive design

---

## 🆘 Troubleshooting

### App shows blank page
- Check browser console for errors
- Verify environment variables are set
- Check Firebase configuration

### Authentication not working
- Add deployment domain to Firebase Authorized domains
- Check Firebase Authentication settings

### Build fails
- Check build logs for specific errors
- Make sure all dependencies are in `package.json`
- Try building locally first: `npm run build`

### Environment variables not working
- Variables must start with `VITE_` to be exposed
- Rebuild after adding variables
- Check variable names match exactly

---

## 📞 Need Help?

If you encounter issues:
1. Check the build logs on your hosting platform
2. Test locally first: `npm run build && npm run preview`
3. Verify all environment variables are correct
4. Check Firebase Console for any errors

---

## 🎉 Success!

Once deployed, share your app URL and celebrate! Your SmartSpend app is now live and accessible to users worldwide.

