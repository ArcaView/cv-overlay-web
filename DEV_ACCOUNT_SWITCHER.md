# Development Account Switcher

A development-only tool for quickly testing different user accounts and roles without needing to create real accounts or log in/out repeatedly.

## Overview

When running in development mode (`npm run dev`), a yellow floating button appears in the bottom-right corner that allows you to instantly switch between mock user accounts.

## Features

- **Development Only**: Automatically hidden in production builds
- **Quick Switching**: Instantly switch between users with one click
- **Multiple Test Accounts**: Pre-configured users including admin and regular users
- **Visual Indicators**:
  - Yellow "DEV" badge on the switcher button
  - Crown icon (👑) for admin accounts
  - User icon (👤) for regular accounts
  - Checkmark showing current active account

## Available Test Accounts

### Admin User
- **Name**: Admin User
- **Email**: admin@qualifyr.ai
- **Company**: Qualifyr.AI
- **Role**: Admin (has access to Admin Dashboard)

### Regular Users

1. **John Doe**
   - Email: john.doe@example.com
   - Company: Acme Corp

2. **Jane Smith**
   - Email: jane.smith@techco.com
   - Company: TechCo

3. **Bob Johnson**
   - Email: bob@startup.io
   - Company: Startup Inc

### Guest Mode
- Simulates a logged-out user
- Useful for testing authentication flows

## How to Use

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Look for the Yellow Button**:
   - Bottom-right corner of the screen
   - Shows current user name (or "Guest")
   - Has a yellow "DEV" badge

3. **Click to Open Dropdown**:
   - See all available test accounts
   - Current account is marked with a checkmark

4. **Select an Account**:
   - Click any user to instantly switch
   - All authentication-dependent features update immediately
   - Navbar, admin dashboard access, feature requests, etc. all reflect new user

## What Gets Updated

When you switch accounts:
- ✅ Navbar shows new user name and email
- ✅ Admin Dashboard access (if switching to/from admin)
- ✅ User dropdown menu
- ✅ Feature Requests authentication
- ✅ All user-dependent UI elements

## Testing Scenarios

### Test Admin Features
1. Switch to "Admin User" account
2. Notice "Admin Dashboard" appears in user dropdown
3. Access admin dashboard at `/admin`
4. See all admin controls in Feature Requests

### Test Regular User
1. Switch to any regular user (John, Jane, Bob)
2. Notice no "Admin Dashboard" in dropdown
3. Can access Feature Requests but not admin controls
4. See roadmap but no status change dropdowns

### Test Authentication Flow
1. Switch to "Guest (Logged Out)"
2. Try to access `/feature-requests` → Redirected to login
3. Navbar shows "Log In" and "Sign Up" buttons
4. Switch back to any user → Full access restored

## Adding New Test Accounts

Edit `src/components/DevAccountSwitcher.tsx`:

```typescript
const MOCK_USERS: MockUser[] = [
  // ... existing users
  {
    id: "user-4",
    firstName: "Your",
    lastName: "Name",
    email: "your.email@example.com",
    company: "Your Company",
    role: "user", // or "admin"
  },
];
```

## Technical Details

### How It Works

1. **UserContext Enhancement**: Added `devUser` state and `setDevUser` function
2. **Development Mode Detection**: Uses `import.meta.env.DEV` to only enable in dev
3. **User Override**: When `devUser` is set, it takes priority over real Supabase auth
4. **Production Safety**: Component returns `null` in production builds

### Files Modified

- `src/components/DevAccountSwitcher.tsx` - Main component
- `src/contexts/UserContext.tsx` - Added dev mode support
- `src/App.tsx` - Integrated switcher into app
- Admin email lists updated in all relevant files

## Benefits for Development

✅ **Faster Testing**: No login/logout cycles
✅ **Multiple Roles**: Test admin and user flows instantly
✅ **No Database**: No need to create real test accounts
✅ **Clean State**: Easy to reset to guest and start fresh
✅ **QA Friendly**: Perfect for manual testing and demos
✅ **Debug Tool**: Quickly reproduce user-specific issues

## Production Behavior

In production (`npm run build`):
- Component is completely hidden
- No performance impact
- No security concerns
- Dev mode features disabled

## Future Enhancements

Potential additions:
- Admin impersonation for production support (with audit logging)
- Save last selected dev account to localStorage
- Keyboard shortcut to open switcher (e.g., Ctrl+Shift+U)
- More granular permission testing
- Custom user attributes (verified email, subscription tier, etc.)
