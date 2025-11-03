# 🔥 Firebase Setup Guide for SmartSpend

This guide will walk you through setting up Firebase step-by-step.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `smartspend` (or any name you prefer)
4. **Disable Google Analytics** (optional - not needed for this app)
5. Click **"Create project"**
6. Wait for project creation, then click **"Continue"**

---

## Step 2: Enable Authentication (Email/Password)

1. In your Firebase project, click on **"Authentication"** in the left sidebar
2. Click **"Get started"** (if first time)
3. Click on the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. Click **"Save"**

✅ Authentication is now enabled!

---

## Step 3: Create Firestore Database

1. Click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules next)
4. Select a **Cloud Firestore location** (choose closest to you, e.g., `us-east1`)
5. Click **"Enable"**

✅ Firestore database is now created!

---

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, click on the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      // Users can only read/write their own expenses
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow creating expenses with matching userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

✅ Security rules are now active!

---

## Step 5: Create Firestore Index (Important!)

1. In Firestore Database, click on the **"Indexes"** tab
2. Click **"Create index"**
3. Set up the composite index:
   - **Collection ID:** `expenses`
   - **Fields to index:**
     - Field: `userId` → Order: **Ascending**
     - Field: `date` → Order: **Descending**
   - Click **"Create"**

⏳ Wait for the index to build (this may take a few minutes)

✅ Index will be ready when status shows "Enabled"

---

## Step 6: Get Firebase Configuration

1. Click on the **gear icon** ⚙️ next to "Project Overview" in the left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click on the **Web icon** `</>` or **"Add app"** → **Web**
5. Register your app:
   - **App nickname:** `SmartSpend Web` (or any name)
   - **Firebase Hosting:** Leave unchecked
   - Click **"Register app"**
6. You'll see your Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**Copy these values!** You'll need them for the `.env` file.

---

## Step 7: Create .env File

1. In your `smartspend` folder, create a file named `.env` (no extension)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIza...your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

**Important:** 
- Replace all the values with your actual Firebase config values
- Don't use quotes around the values
- Make sure there are no spaces around the `=` sign

---

## Step 8: Verify Setup

1. **Restart your dev server** (if it's running):
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

2. **Test the app:**
   - Go to http://localhost:5173
   - Try to create an account
   - If you see an error, check:
     - `.env` file exists and has correct values
     - Security rules are published
     - Firestore index is enabled (wait if still building)

---

## Troubleshooting

### ❌ "Firebase: Error (auth/invalid-api-key)"
- Check that your `.env` file has `VITE_FIREBASE_API_KEY` set correctly
- Make sure you restarted the dev server after creating `.env`

### ❌ "Missing or insufficient permissions"
- Check Firestore security rules are published
- Make sure the rule matches your data structure
- Verify you're logged in

### ❌ "The query requires an index"
- Go to Firestore → Indexes
- Click on the link in the error message (it will auto-create the index)
- Wait for index to build (can take a few minutes)

### ❌ "Failed to fetch"
- Check your internet connection
- Verify all Firebase services are enabled
- Make sure `.env` file is in the `smartspend` folder (not parent folder)

---

## ✅ You're All Set!

Once Firebase is configured, you can:
- ✨ Sign up and log in
- 💰 Add, edit, and delete expenses
- 📊 View spending analytics
- 🤖 Get AI financial insights

Enjoy SmartSpend! 🎉

