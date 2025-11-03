# ⚡ Firebase Quick Start - Visual Checklist

Use this checklist as you go through the setup!

## 📍 Where to Find Everything in Firebase Console

```
┌─────────────────────────────────────────┐
│  Firebase Console                       │
├─────────────────────────────────────────┤
│  [🏠 Project Overview]                  │
│  [🔑 Authentication] ← Click here       │
│  [📊 Firestore Database] ← Click here   │
│  [⚙️ Project Settings] ← Get config     │
└─────────────────────────────────────────┘
```

## ✅ Setup Checklist

### Phase 1: Project Setup
- [ ] Went to https://console.firebase.google.com/
- [ ] Created new project (named it `smartspend`)
- [ ] Waited for project creation to finish

### Phase 2: Authentication
- [ ] Clicked "Authentication" in sidebar
- [ ] Clicked "Get started"
- [ ] Went to "Sign-in method" tab
- [ ] Clicked "Email/Password"
- [ ] Enabled it (turned toggle ON)
- [ ] Clicked "Save"

### Phase 3: Database
- [ ] Clicked "Firestore Database" in sidebar
- [ ] Clicked "Create database"
- [ ] Selected "Start in test mode"
- [ ] Chose a location
- [ ] Clicked "Enable"
- [ ] Waited for database to be created

### Phase 4: Security
- [ ] Went to Firestore Database → "Rules" tab
- [ ] Copied the security rules code
- [ ] Pasted into rules editor
- [ ] Clicked "Publish"

### Phase 5: Index
- [ ] Went to Firestore Database → "Indexes" tab
- [ ] Clicked "Create index"
- [ ] Collection: `expenses`
- [ ] Field 1: `userId` (Ascending)
- [ ] Field 2: `date` (Descending)
- [ ] Clicked "Create"
- [ ] Waited for index to be "Enabled" (green checkmark)

### Phase 6: Configuration
- [ ] Clicked gear icon ⚙️ → "Project settings"
- [ ] Scrolled to "Your apps" section
- [ ] Clicked Web icon `</>` or "Add app" → Web
- [ ] Entered app nickname
- [ ] Clicked "Register app"
- [ ] **COPIED all 6 values from the config**

### Phase 7: .env File
- [ ] Created `.env` file in `smartspend` folder
- [ ] Opened it in text editor
- [ ] Added all 6 Firebase config values
- [ ] Saved the file

### Phase 8: Test
- [ ] Ran `npm run dev` from `smartspend` folder
- [ ] Opened browser to http://localhost:5173
- [ ] Created a test account
- [ ] Successfully logged in!

## 🔍 Where to Find Your Firebase Config Values

When you register your web app, you'll see this screen:

```
┌─────────────────────────────────────────────┐
│  Your Firebase SDK configuration            │
├─────────────────────────────────────────────┤
│                                             │
│  const firebaseConfig = {                   │
│    apiKey: "AIza..."  ← Copy this           │
│    authDomain: "..."  ← Copy this           │
│    projectId: "..."   ← Copy this           │
│    storageBucket: "..." ← Copy this         │
│    messagingSenderId: "..." ← Copy this      │
│    appId: "1:..."     ← Copy this           │
│  };                                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Your .env file should look like:**

```env
VITE_FIREBASE_API_KEY=AIza...paste-here...
VITE_FIREBASE_AUTH_DOMAIN=...paste-here...
VITE_FIREBASE_PROJECT_ID=...paste-here...
VITE_FIREBASE_STORAGE_BUCKET=...paste-here...
VITE_FIREBASE_MESSAGING_SENDER_ID=...paste-here...
VITE_FIREBASE_APP_ID=...paste-here...
```

## 🚨 Common Mistakes

❌ **Mistake:** Created .env in wrong folder  
✅ **Fix:** Must be in `smartspend` folder, not parent folder

❌ **Mistake:** Forgot to restart dev server after creating .env  
✅ **Fix:** Stop server (Ctrl+C) and run `npm run dev` again

❌ **Mistake:** Added quotes around values in .env  
✅ **Fix:** Don't use quotes: `VITE_FIREBASE_API_KEY=AIza...` (not `"AIza..."`)

❌ **Mistake:** Index still building when testing  
✅ **Fix:** Wait 2-5 minutes for index to finish, check Indexes tab

❌ **Mistake:** Security rules not published  
✅ **Fix:** Go to Rules tab and click "Publish" button

## 📝 File Structure Reminder

```
STANDARD_AUDITING/
└── smartspend/          ← YOU MUST BE HERE!
    ├── .env            ← Create this file HERE
    ├── package.json
    ├── src/
    └── ...
```

**When running commands, always do:**
```powershell
cd C:\Users\susia\STANDARD_AUDITING\smartspend
npm run dev
```

## 🎯 Success Indicators

You'll know it's working when:
- ✅ You can create an account without errors
- ✅ You can log in and see the Dashboard
- ✅ You can add an expense
- ✅ Expenses appear in Firebase Console → Firestore → Data

## 📚 Need More Help?

See the full guide: `FIREBASE_SETUP_BEGINNER.md`

