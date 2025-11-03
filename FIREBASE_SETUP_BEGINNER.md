# 🔥 Firebase Setup Guide - Complete Beginner Tutorial

This guide assumes you've **never used Firebase before**. We'll walk through every step together!

---

## What is Firebase?

Firebase is Google's platform that provides:
- **Authentication** - Handles user sign-up and login
- **Firestore Database** - Stores your expenses in the cloud
- **Free tier** - Perfect for learning and small projects!

**You don't need to write any server code** - Firebase handles everything for you!

---

## 📋 Before You Start

You'll need:
- ✅ A Google account (Gmail account)
- ✅ 10-15 minutes
- ✅ Your SmartSpend project folder (`smartspend`)

---

## Step-by-Step Setup

### STEP 1: Go to Firebase Website

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **https://console.firebase.google.com/**
3. You'll see the Firebase Console

**Note:** If you're not logged in, Google will ask you to sign in with your Google account.

---

### STEP 2: Create Your First Firebase Project

1. Click the big button that says **"Add project"** or **"Create a project"**
   - It's usually in the center of the page or top right

2. **Step 2.1 - Name your project:**
   - Project name: Type `smartspend` (or any name you like)
   - This is just for your reference
   - Click **"Continue"**

3. **Step 2.2 - Google Analytics (Optional):**
   - You'll see "Enable Google Analytics for this project"
   - **Uncheck the box** or click **"Not now"**
   - We don't need it for this app
   - Click **"Continue"**

4. **Step 2.3 - Wait:**
   - Firebase is creating your project
   - This takes 10-30 seconds
   - You'll see "Setting up your project..."
   - When done, click **"Continue"**

**✅ Congratulations!** You just created your first Firebase project!

---

### STEP 3: Enable User Authentication (Login/Signup)

Now we'll enable the ability for users to create accounts and log in.

1. **Find the sidebar on the left side** of the Firebase Console
   - Look for icons: Home, Authentication, Firestore Database, etc.

2. **Click on "Authentication"**
   - It has a key icon 🔑
   - If you see "Get started", click it

3. **Click the "Sign-in method" tab** at the top
   - You'll see a list of sign-in providers

4. **Find "Email/Password" in the list**
   - Click on it

5. **Enable Email/Password:**
   - Toggle the switch at the top to **ON** (Enabled)
   - Leave "Email link (passwordless sign-in)" **OFF** (unchecked)
   - Click **"Save"** at the bottom

**✅ Done!** Users can now sign up and log in with email/password.

---

### STEP 4: Create the Database (Firestore)

This is where your app will store all the expenses.

1. **Click on "Firestore Database" in the left sidebar**
   - It has a database icon 📊

2. **Click "Create database"** button
   - It's a big button in the center

3. **Choose security mode:**
   - You'll see two options:
     - **Production mode** - More secure, requires setup
     - **Start in test mode** - Easier, works immediately
   - **Select "Start in test mode"** (we'll secure it next)
   - Click **"Next"**

4. **Choose a location:**
   - Pick the location closest to you:
     - `us-east1` (US East)
     - `us-central1` (US Central)
     - `europe-west1` (Europe)
     - `asia-southeast1` (Asia)
   - Click **"Enable"**
   - Wait 30-60 seconds while it creates

**✅ Database created!** You'll see an empty database.

---

### STEP 5: Add Security Rules (Important!)

Right now, anyone could access your database. Let's secure it so only logged-in users can see their own expenses.

1. **Still in Firestore Database, click the "Rules" tab**
   - It's at the top, next to "Data" and "Indexes"

2. **You'll see some default rules.** Delete everything and replace with this:

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

3. **Copy the code above exactly** and paste it into the rules editor

4. **Click "Publish"** button (top right)
   - You might see a warning - that's okay, click "Publish" anyway

**What these rules do:**
- ✅ Users must be logged in (`request.auth != null`)
- ✅ Users can only see/edit their own expenses
- ✅ When creating expenses, the userId must match

**✅ Security rules are active!**

---

### STEP 6: Create Database Index (Required for Queries)

Your app needs to sort expenses by date. Firebase needs an index for this.

1. **Click the "Indexes" tab** (next to Rules)

2. **Click "Create index"** button

3. **Fill in the index settings:**
   - **Collection ID:** Type `expenses` (exactly as shown)
   - **Fields to index:** Click "Add field"
     - **Field:** `userId`
     - **Order:** Select **Ascending** ⬆️
     - Click "Add field" again
     - **Field:** `date`
     - **Order:** Select **Descending** ⬇️

4. **Click "Create"**
   - You'll see "Building index..."
   - This can take 1-5 minutes
   - Wait until it says "Enabled" (green checkmark)

**✅ Index will be ready soon!**

**Note:** If you see an error later asking for an index, Firebase will provide a link to create it automatically.

---

### STEP 7: Get Your Firebase Configuration

Your app needs to know how to connect to YOUR Firebase project. We'll get a special "key" that identifies your project.

1. **Look at the top left** of the Firebase Console
   - Find the **gear icon** ⚙️ next to "Project Overview"

2. **Click the gear icon**, then click **"Project settings"**

3. **Scroll down** until you see **"Your apps"** section
   - You'll see icons for iOS, Android, Web, etc.

4. **Click the Web icon `</>`** (or click "Add app" → Web)

5. **Register your app:**
   - **App nickname:** Type `SmartSpend Web` (or anything)
   - **Firebase Hosting:** Leave this **UNCHECKED** (we don't need it)
   - Click **"Register app"**

6. **You'll see your Firebase configuration!**
   It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuv",
  authDomain: "smartspend-12345.firebaseapp.com",
  projectId: "smartspend-12345",
  storageBucket: "smartspend-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**⚠️ IMPORTANT:** Copy each value individually. We'll put them in a file next.

---

### STEP 8: Create .env File for Your App

Now we'll create a file that stores your Firebase configuration safely.

1. **Open your `smartspend` folder** in File Explorer
   - Path: `C:\Users\susia\STANDARD_AUDITING\smartspend`

2. **Create a new file named `.env`**
   - Right-click → New → Text Document
   - Name it exactly: `.env` (with the dot at the beginning!)
   - If Windows asks "Are you sure?", click Yes

3. **Open `.env` in a text editor** (Notepad, VS Code, etc.)

4. **Copy this template and fill in YOUR values:**

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
VITE_FIREBASE_AUTH_DOMAIN=smartspend-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smartspend-12345
VITE_FIREBASE_STORAGE_BUCKET=smartspend-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

**How to fill it:**
- Replace `AIzaSyC1234567890...` with YOUR `apiKey` value
- Replace `smartspend-12345.firebaseapp.com` with YOUR `authDomain` value
- Replace `smartspend-12345` with YOUR `projectId` value
- And so on...

**Example:**
If your Firebase config shows:
```javascript
apiKey: "AIzaSyABC123XYZ"
authDomain: "my-app.firebaseapp.com"
projectId: "my-app-456"
```

Your `.env` should have:
```env
VITE_FIREBASE_API_KEY=AIzaSyABC123XYZ
VITE_FIREBASE_AUTH_DOMAIN=my-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-app-456
```

5. **Save the `.env` file**

**✅ Configuration file ready!**

---

### STEP 9: Test Your Setup

Let's verify everything works!

1. **Open PowerShell or Command Prompt**
2. **Navigate to your project:**
   ```powershell
   cd C:\Users\susia\STANDARD_AUDITING\smartspend
   ```

3. **Start the app:**
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   - Go to the URL shown (usually `http://localhost:5173`)

5. **Try signing up:**
   - Click "Sign Up"
   - Enter an email and password
   - Click "Sign Up"
   - You should be redirected to the Dashboard!

6. **Check Firebase Console:**
   - Go back to Firebase Console
   - Click "Authentication" → "Users" tab
   - You should see your new user! 🎉

**✅ Everything works!**

---

## 🎯 What You've Set Up

✅ **Firebase Project** - Your cloud backend  
✅ **Authentication** - Users can sign up/login  
✅ **Firestore Database** - Stores expenses securely  
✅ **Security Rules** - Only users see their own data  
✅ **Database Index** - Fast queries for expenses  
✅ **Configuration** - App connected to Firebase  

---

## 🆘 Troubleshooting

### Problem: "Firebase: Error (auth/invalid-api-key)"
**Solution:** 
- Check your `.env` file has the correct `VITE_FIREBASE_API_KEY`
- Make sure there are NO spaces around the `=` sign
- Make sure you restarted the dev server after creating `.env`

### Problem: "Missing or insufficient permissions"
**Solution:**
- Go back to Firebase Console → Firestore Database → Rules
- Make sure you clicked "Publish" on the rules
- Verify the rules code is exactly as shown in Step 5

### Problem: "The query requires an index"
**Solution:**
- Go to Firestore Database → Indexes
- Check if the index status shows "Enabled" (green checkmark)
- If still building, wait a few minutes
- If you see an error message with a link, click it to auto-create

### Problem: "Failed to fetch" or connection errors
**Solution:**
- Check your internet connection
- Verify all values in `.env` are correct
- Make sure `.env` is in the `smartspend` folder (not parent folder)
- Restart the dev server: Stop it (Ctrl+C) and run `npm run dev` again

---

## 📚 Understanding What You Just Did

**Firebase Authentication:**
- Handles user accounts
- Validates email/password
- Keeps users logged in across sessions

**Firestore Database:**
- Like a spreadsheet in the cloud
- Each user's expenses are stored separately
- Automatically synced across devices

**Security Rules:**
- Protect your data
- Users can only access their own expenses
- Prevents unauthorized access

**Configuration (.env file):**
- Like an address book for your app
- Tells the app which Firebase project to connect to
- Never commit this file to GitHub (it's already in .gitignore)

---

## 🎉 Next Steps

1. **Add some expenses** to test the app
2. **Try the Insights page** for AI financial advice
3. **Check Firebase Console** to see your data
   - Firestore Database → Data tab shows all expenses
   - Authentication → Users shows all accounts

**You're now a Firebase user!** 🚀

If you get stuck, check the error message - it usually tells you exactly what's wrong!

