# Onboarding Flow Testing Checklist

## 🧪 Testing Steps

### 1. **Welcome Screen Test**
- [ ] Navigate to `http://localhost:5173` (or your dev server URL)
- [ ] Verify Welcome Screen appears first
- [ ] Check that logo, features, and CTAs are visible
- [ ] Click "Get Started" → Should go to Setup Profile
- [ ] Click "Sign In" → Should go to Login page

### 2. **Setup Profile Test**
- [ ] Verify form fields are present:
  - Name input (required)
  - Currency selection (INR, USD, EUR, GBP)
  - Monthly Income (optional)
  - Notifications toggle
- [ ] Try to submit without name → Should show validation error
- [ ] Enter name and select currency → Should save to localStorage
- [ ] Click "Back" → Should return to Welcome Screen
- [ ] Complete form and click "Continue" → Should go to Import Data

### 3. **Import Data Test**

#### Option A: Sample Data
- [ ] Click "Sample Data" button
- [ ] Verify loading state appears
- [ ] Check that 8 sample expenses are created
- [ ] Verify success message and continue button

#### Option B: CSV Import
- [ ] Click "CSV Import" button
- [ ] Verify CSV format instructions appear
- [ ] Try uploading a valid CSV file:
  ```
  description, amount, category, date
  Groceries, 2500, Food, 2024-01-15
  Uber Ride, 350, Transport, 2024-01-14
  ```
- [ ] Verify expenses are imported
- [ ] Try uploading invalid CSV → Should show error

#### Option C: Skip
- [ ] Click "Skip" button
- [ ] Verify onboarding is marked as completed
- [ ] Check redirect behavior

### 4. **Flow Completion Test**
- [ ] Complete all 3 steps
- [ ] If not logged in → Should redirect to Signup
- [ ] If logged in → Should redirect to Dashboard
- [ ] Verify `localStorage` has:
  - `smartspend.onboarding.completed` = `"true"`
  - `smartspend.profile` = `{...profile data}`

### 5. **Resume Flow Test**
- [ ] Clear onboarding completion from localStorage
- [ ] Keep profile data
- [ ] Refresh page → Should resume from Import Data step

### 6. **Signup Integration Test**
- [ ] Complete onboarding without logging in
- [ ] Go to Signup page
- [ ] Verify display name is pre-filled from onboarding
- [ ] Create account
- [ ] Verify pending expenses are imported after signup
- [ ] Check that expenses appear in Dashboard

### 7. **Protected Route Test**
- [ ] After completing onboarding, try accessing `/dashboard`
- [ ] Should allow access if logged in
- [ ] Clear `smartspend.onboarding.completed` from localStorage
- [ ] Try accessing `/dashboard` → Should redirect to `/onboarding`

### 8. **Edge Cases**
- [ ] Refresh during onboarding → Should maintain progress
- [ ] Navigate directly to `/onboarding` after completion → Should redirect to dashboard
- [ ] Complete onboarding multiple times → Should only show once after first completion
- [ ] Test on mobile viewport → Verify responsive design

## 🔍 What to Check

### Visual Checks
- ✅ Smooth animations between steps
- ✅ Progress indicators update correctly
- ✅ All buttons are clickable and responsive
- ✅ Loading states display properly
- ✅ Error messages appear when needed
- ✅ Responsive design on mobile/tablet

### Functional Checks
- ✅ Data persists in localStorage
- ✅ Navigation flows work correctly
- ✅ Form validation works
- ✅ CSV parsing handles edge cases
- ✅ Expenses import correctly after signup
- ✅ Redirects work as expected

### Console Checks
- [ ] No JavaScript errors in browser console
- [ ] No Firebase errors (if API keys are configured)
- [ ] localStorage operations succeed

## 🐛 Common Issues to Watch For

1. **Import fails silently** → Check browser console for errors
2. **CSV format issues** → Verify CSV has correct headers
3. **localStorage errors** → Check if localStorage is enabled
4. **Redirect loops** → Verify onboarding completion check
5. **Missing expenses** → Check Firebase connection and user authentication

## 📝 Test Results Template

```
Date: __________
Tester: __________

Welcome Screen: ✅ / ❌
Setup Profile: ✅ / ❌
Import Data (Sample): ✅ / ❌
Import Data (CSV): ✅ / ❌
Import Data (Skip): ✅ / ❌
Flow Completion: ✅ / ❌
Signup Integration: ✅ / ❌
Protected Routes: ✅ / ❌

Issues Found:
- 
- 

Notes:
- 
```

