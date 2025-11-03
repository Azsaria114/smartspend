# Quick Start Guide - Testing SmartSpend

## 🚀 How to Run the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:5173`

3. **You'll be redirected to the login page.**
   - Create a new account by clicking "Sign Up"
   - Or use existing credentials if you've already signed up

## 📝 Sample Test Data

Use these sample expenses to test if the app is working correctly:

### Sample Expenses for Testing

**Food Category:**
- Description: "Starbucks Coffee"
  - Amount: $5.50
  - Category: Food
  - Date: Today (or any recent date)

- Description: "Grocery Shopping at Walmart"
  - Amount: $87.45
  - Category: Food
  - Date: 2 days ago

- Description: "Lunch with Team"
  - Amount: $23.99
  - Category: Food
  - Date: Yesterday

**Transport Category:**
- Description: "Uber Ride to Airport"
  - Amount: $45.00
  - Category: Transport
  - Date: Last week

- Description: "Gas Station"
  - Amount: $52.30
  - Category: Transport
  - Date: 3 days ago

- Description: "Monthly Metro Pass"
  - Amount: $120.00
  - Category: Transport
  - Date: Beginning of this month

**Shopping Category:**
- Description: "New Headphones"
  - Amount: $129.99
  - Category: Shopping
  - Date: Last week

- Description: "Office Supplies"
  - Amount: $34.50
  - Category: Shopping
  - Date: 5 days ago

**Bills Category:**
- Description: "Electric Bill"
  - Amount: $125.75
  - Category: Bills
  - Date: Beginning of this month

- Description: "Internet Subscription"
  - Amount: $79.99
  - Category: Bills
  - Date: Beginning of this month

- Description: "Phone Bill"
  - Amount: $89.00
  - Category: Bills
  - Date: Beginning of this month

**Entertainment Category:**
- Description: "Netflix Subscription"
  - Amount: $15.99
  - Category: Entertainment
  - Date: Beginning of this month

- Description: "Movie Tickets"
  - Amount: $24.00
  - Category: Entertainment
  - Date: Last weekend

- Description: "Concert Tickets"
  - Amount: $150.00
  - Category: Entertainment
  - Date: Last month

**Health Category:**
- Description: "Gym Membership"
  - Amount: $49.99
  - Category: Health
  - Date: Beginning of this month

- Description: "Pharmacy - Vitamins"
  - Amount: $28.50
  - Category: Health
  - Date: Last week

**Other Category:**
- Description: "Birthday Gift"
  - Amount: $65.00
  - Category: Other
  - Date: Yesterday

- Description: "Charity Donation"
  - Amount: $50.00
  - Category: Other
  - Date: Last week

## ✅ Testing Checklist

After adding the sample expenses, check:

1. **Dashboard Page:**
   - [ ] Expenses appear in the list
   - [ ] You can see total spending
   - [ ] Charts display correctly
   - [ ] You can edit an expense
   - [ ] You can delete an expense

2. **Insights Page:**
   - [ ] Navigate to Insights page
   - [ ] Charts show spending breakdown by category
   - [ ] Monthly/weekly trends are visible

3. **CRUD Operations:**
   - [ ] ✅ Create: Add new expenses
   - [ ] ✅ Read: View expenses list
   - [ ] ✅ Update: Edit existing expenses
   - [ ] ✅ Delete: Remove expenses

4. **Authentication:**
   - [ ] Can sign up with new account
   - [ ] Can log in with existing account
   - [ ] Can log out
   - [ ] Protected routes work (redirect to login if not authenticated)

## 🐛 Common Issues

**If the app doesn't start:**
- Make sure you've run `npm install`
- Check that your `.env` file has all Firebase credentials
- Verify Firebase Authentication is enabled in Firebase Console

**If expenses don't save:**
- Check Firebase Firestore rules are set correctly
- Verify you're logged in
- Check browser console for errors

**If you see authentication errors:**
- Make sure Email/Password authentication is enabled in Firebase Console
- Check your `.env` file has correct Firebase configuration

