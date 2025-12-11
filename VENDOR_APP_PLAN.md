# Vendor App UI - Complete Implementation Plan

## Architecture Overview

The vendor app follows the same modular structure as the user module:

- `Frontend/src/modules/vendor/` - Main vendor module
- Pages organized by feature
- Shared components in `components/` folder
- Lazy-loaded routes for performance

## Complete Page List (15 Pages)

### Core Pages

1. **Dashboard** ✅ - Main landing page with stats and quick actions (COMPLETED)
2. **BookingAlert** - Full-screen real-time booking alert with countdown
3. **BookingDetails** - Detailed booking information and actions
4. **BookingTimeline** - Status timeline with all 8 stages
5. **ActiveJobs** - List of all active/running jobs
6. **WorkersList** - Manage all workers
7. **AddEditWorker** - Add or edit worker details
8. **AssignWorker** - Select worker for a job
9. **Earnings** - Earnings dashboard and history
10. **Wallet** - Wallet balance, transactions, withdrawal requests
11. **WithdrawalRequest** - Request withdrawal form
12. **Profile** - Vendor profile and settings
13. **Settings** - App settings
14. **Notifications** - Notification history
15. **Login/Auth** - Vendor authentication (if separate from user)

## Step-by-Step Implementation

### Phase 1: Foundation & Navigation (Steps 1-3) ✅

#### Step 1: Setup Vendor Routes Structure ✅

**File**: `Frontend/src/modules/vendor/routes/index.jsx`

- ✅ Routes file with all 15 pages
- ✅ Lazy loading for all pages
- ✅ Suspense with loading fallback
- ✅ Route structure complete

#### Step 2: Create Bottom Navigation Component ✅

**File**: `Frontend/src/modules/vendor/components/layout/BottomNav.jsx`

- ✅ 5 tabs: Home | Jobs | Workers | Wallet | Profile
- ✅ Icons: Home, Briefcase, Users, Wallet, User
- ✅ Active state indicators
- ✅ Badge for pending jobs count
- ✅ Smooth animations using GSAP
- ✅ Responsive design (mobile-first)

#### Step 3: Create Header Component ✅

**File**: `Frontend/src/modules/vendor/components/layout/Header.jsx`

- ✅ Back button
- ✅ Appzeto logo (when no back button)
- ✅ Notification bell with badge
- ✅ Search option
- ✅ Theme colors integrated

### Phase 2: Booking Alert System (Steps 4-6)

#### Step 4: Booking Alert Page (Full-Screen)

**File**: `Frontend/src/modules/vendor/pages/BookingAlert/index.jsx`

**Features**:

- Full-screen overlay (z-index: 9999)
- Loud alarm sound (even in background) - Web Audio API
- Countdown timer (30-60 seconds)
- Service type display
- Location and distance
- Estimated price
- Time slot
- Large Accept/Reject buttons
- Auto-dismiss if no response

**Components**:

- `AlertCard.jsx` - Main alert card
- `CountdownTimer.jsx` - Timer component
- `ServiceInfo.jsx` - Service details display

**State Management**:

- Alert visibility state
- Timer state
- Accept/reject handlers
- Navigation after action

#### Step 5: Booking Details Page

**File**: `Frontend/src/modules/vendor/pages/BookingDetails/index.jsx`

**Features**:

- User name and contact
- Full address with map (Google Maps embed)
- Service description
- Preferred time slot
- Price breakdown
- Accept/Reject buttons (if pending)
- Assign worker button (if accepted)
- View timeline button
- Call user button

**Components**:

- `UserInfoCard.jsx` - User details
- `AddressCard.jsx` - Address with map
- `ServiceDetailsCard.jsx` - Service info
- `PriceBreakdown.jsx` - Price details
- `ActionButtons.jsx` - Accept/Reject/Assign

#### Step 6: Booking Timeline Page

**File**: `Frontend/src/modules/vendor/pages/BookingTimeline/index.jsx`

**Features**:

- Vertical timeline with 8 stages
- Each stage shows:
  - Status icon (checkmark/pending/current)
  - Status title
  - Timestamp
  - Action button (if applicable)
- Current stage highlighted
- Completed stages with checkmarks
- Interactive buttons for each actionable stage

**8 Stages**:

1. Booking Requested - Auto (when alert received)
2. Booking Accepted - Action: Accept button
3. Assigned (Self/Worker) - Action: Assign button
4. Visited Site - Action: "Start Journey" → Maps
5. Work Done - Action: "Mark Work Done" + image upload
6. Worker Payment Done - Action: "Confirm Worker Paid" (if worker assigned)
7. Settlement Pending - Shows final penalty/reward payment by admin 
8. Completed - Final state (read-only)

**Components**:

- `TimelineItem.jsx` - Individual timeline step
- `StatusBadge.jsx` - Status indicator
- `ActionButton.jsx` - Action buttons per stage
- `ImageUpload.jsx` - For work completion images

### Phase 3: Active Jobs & Management (Steps 7-9)

#### Step 7: Active Jobs Page

**File**: `Frontend/src/modules/vendor/pages/ActiveJobs/index.jsx`

**Features**:

- List of all active jobs (not just vendor's)
- Filter by status: All | Assigned | In Progress | Completed
- Search by service/user name
- Each job card shows:
  - Service type
  - Assigned worker (or "Self")
  - Status badge
  - Location
  - Time remaining/elapsed
  - Quick actions: View Details | Call Worker | Track
- Pull to refresh
- Empty state when no jobs

**Components**:

- `JobCard.jsx` - Individual job card
- `JobFilters.jsx` - Filter buttons
- `JobStatusBadge.jsx` - Status indicator
- `EmptyState.jsx` - No jobs message

#### Step 8: Dashboard Page ✅

**File**: `Frontend/src/modules/vendor/pages/Dashboard/index.jsx`

**Features**:

- ✅ Stats cards (Today's earnings, Active jobs, Pending alerts, Workers online)
- ✅ Profile card with photo
- ✅ Quick actions (Active Jobs, Manage Workers, Wallet)
- ✅ Pending booking alerts section
- ✅ Performance metrics
- ✅ Recent active jobs list
- ✅ Modern design with theme colors
- ✅ Compact layout

### Phase 4: Worker Management (Steps 10-13)

#### Step 9: Workers List Page

**File**: `Frontend/src/modules/vendor/pages/WorkersList/index.jsx`

**Features**:

- List of all workers
- Each worker card shows:
  - Name
  - Phone number
  - Skills (tags)
  - Availability status (Online/Offline)
  - Current assigned job (if any)
  - Performance metrics (jobs completed, rating)
- Add Worker button (floating action)
- Edit/Remove actions per worker
- Filter by availability
- Search workers

**Components**:

- `WorkerCard.jsx` - Worker information card
- `SkillTag.jsx` - Skill badge
- `AvailabilityBadge.jsx` - Online/Offline indicator
- `AddWorkerButton.jsx` - FAB for adding

#### Step 10: Add/Edit Worker Page

**File**: `Frontend/src/modules/vendor/pages/AddEditWorker/index.jsx`

**Features**:

- Form fields:
  - Worker name (required)
  - Mobile number (required, validation)
  - Skill selection (multi-select checkboxes)
  - Service area (location picker)
  - Working hours (time picker)
  - Profile photo (optional, image upload)
- Save/Cancel buttons
- Form validation
- Success/error messages

**Components**:

- `WorkerForm.jsx` - Main form component
- `SkillSelector.jsx` - Multi-select skills
- `ServiceAreaPicker.jsx` - Location selector
- `WorkingHoursPicker.jsx` - Time range selector

#### Step 11: Assign Worker Page

**File**: `Frontend/src/modules/vendor/pages/AssignWorker/index.jsx`

**Features**:

- Booking details summary
- Available workers list (filtered by skills + availability)
- "I'll do this myself" option
- Worker selection (radio buttons)
- Confirm assignment button
- Shows worker's current job (if any)

**Components**:

- `BookingSummary.jsx` - Booking info
- `WorkerSelector.jsx` - Worker list with selection
- `SelfAssignmentOption.jsx` - Self-assign option

### Phase 5: Earnings & Wallet (Steps 12-14)

#### Step 12: Earnings Page

**File**: `Frontend/src/modules/vendor/pages/Earnings/index.jsx`

**Features**:

- Earnings overview:
  - Today's earnings
  - This week
  - This month
  - Total earnings
- Earnings breakdown:
  - By service type
  - By worker (if assigned)
- Commission deducted display
- Pending settlement amount
- Paid amount
- Earnings chart (optional, line/bar chart)
- Earnings history list (date, service, amount, status)

**Components**:

- `EarningsOverview.jsx` - Summary cards
- `EarningsChart.jsx` - Chart visualization
- `EarningsHistory.jsx` - Transaction list
- `CommissionBreakdown.jsx` - Commission details

#### Step 13: Wallet Page

**File**: `Frontend/src/modules/vendor/pages/Wallet/index.jsx`

**Features**:

- Current balance display
- Pending amount (not withdrawable)
- Available balance (withdrawable)
- Transaction history:
  - Date
  - Type (Earning, Withdrawal, Commission)
  - Amount
  - Status
- Request withdrawal button
- Filter transactions by type
- Search transactions

**Components**:

- `BalanceCard.jsx` - Balance display
- `TransactionList.jsx` - Transaction history
- `TransactionItem.jsx` - Individual transaction
- `WithdrawalButton.jsx` - Request withdrawal CTA

#### Step 14: Withdrawal Request Page

**File**: `Frontend/src/modules/vendor/pages/WithdrawalRequest/index.jsx`

**Features**:

- Available balance display
- Amount input (with max validation)
- Bank account details display (if saved)
- Add/Edit bank account option
- Request withdrawal button
- Withdrawal history
- Status tracking (Pending, Processing, Completed, Failed)

**Components**:

- `WithdrawalForm.jsx` - Amount input form
- `BankAccountCard.jsx` - Bank details display
- `WithdrawalHistory.jsx` - Past withdrawals

### Phase 6: Profile & Settings (Steps 15-17)

#### Step 15: Profile Page

**File**: `Frontend/src/modules/vendor/pages/Profile/index.jsx`

**Features**:

- Vendor information:
  - Name
  - Business name
  - Phone number
  - Email
  - Address
  - Profile photo
- Edit profile button
- Business documents (if any)
- Service areas
- Ratings and reviews summary
- Statistics (total jobs, completion rate)

**Components**:

- `ProfileHeader.jsx` - Profile info display
- `BusinessInfoCard.jsx` - Business details
- `StatsSection.jsx` - Performance stats
- `EditProfileButton.jsx` - Edit CTA

#### Step 16: Settings Page

**File**: `Frontend/src/modules/vendor/pages/Settings/index.jsx`

**Features**:

- Notification settings (toggle)
- Sound alerts (toggle)
- Language selection
- About app
- Logout button
- Delete account (danger zone)

**Components**:

- `SettingsSection.jsx` - Settings group
- `ToggleSwitch.jsx` - Toggle component
- `LanguageSelector.jsx` - Language picker

#### Step 17: Notifications Page

**File**: `Frontend/src/modules/vendor/pages/Notifications/index.jsx`

**Features**:

- List of all notifications
- Filter by type: All | Alerts | Jobs | Payments
- Mark as read/unread
- Clear all
- Notification types:
  - Booking alerts
  - Job updates
  - Payment notifications
  - Worker assignments

**Components**:

- `NotificationList.jsx` - Notifications list
- `NotificationItem.jsx` - Individual notification
- `NotificationFilters.jsx` - Filter buttons

### Phase 7: Shared Components (Steps 18-20)

#### Step 18: Common Components

**Files**: `Frontend/src/modules/vendor/components/common/`

Create reusable components:

- `StatusBadge.jsx` - Status indicator (Requested, Accepted, etc.)
- `PriceDisplay.jsx` - Price formatting
- `MapEmbed.jsx` - Google Maps embed
- `ImageUploader.jsx` - Image upload component
- `LoadingSpinner.jsx` - Loading indicator
- `EmptyState.jsx` - Empty state message
- `ErrorBoundary.jsx` - Error handling
- `ConfirmDialog.jsx` - Confirmation modal

#### Step 19: Booking Components

**Files**: `Frontend/src/modules/vendor/components/bookings/`

- `BookingCard.jsx` - Booking card for lists
- `BookingStatusIndicator.jsx` - Status display
- `ServiceTypeBadge.jsx` - Service type indicator
- `TimeSlotDisplay.jsx` - Time slot display

#### Step 20: Integration Points (Backend Ready)

**Files**: `Frontend/src/modules/vendor/services/`

Create service files for API calls (structure only, no implementation):

- `bookingService.js` - Booking APIs
- `workerService.js` - Worker management APIs
- `earningsService.js` - Earnings APIs
- `walletService.js` - Wallet APIs
- `notificationService.js` - Notification APIs
- `authService.js` - Authentication APIs

## Design Guidelines

### Color Scheme

- Primary: Use `vendorTheme` from `colors.js`
- Status colors:
  - Pending: Yellow/Orange
  - Active: Blue
  - Completed: Green
  - Rejected: Red

### Typography

- Follow user app typography
- Clear hierarchy for status information
- Readable font sizes for mobile

### Animations

- Smooth page transitions
- Loading states for all async operations
- Success/error feedback animations
- GSAP for complex animations (like user app)

### Mobile-First

- All pages optimized for mobile
- Touch-friendly buttons (min 44px)
- Swipe gestures where appropriate
- Responsive layouts

## Data Structure (For UI Development)

### Booking Object Structure

```javascript
{
  id: string,
  serviceType: string,
  user: { name, phone, address },
  location: { lat, lng, address },
  price: number,
  timeSlot: { date, time },
  status: 'REQUESTED' | 'ACCEPTED' | 'ASSIGNED' | 'VISITED' | 'WORK_DONE' | 'WORKER_PAID' | 'SETTLEMENT_PENDING' | 'COMPLETED',
  assignedTo: 'SELF' | { workerId, workerName },
  timeline: [{ stage, timestamp, action }],
  images: [string],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Worker Object Structure

```javascript
{
  id: string,
  name: string,
  phone: string,
  skills: [string],
  serviceArea: string,
  workingHours: { start, end },
  availability: 'ONLINE' | 'OFFLINE',
  currentJob: bookingId | null,
  stats: { jobsCompleted, rating, complaints }
}
```

### Wallet Object Structure

```javascript
{
  balance: number,
  pending: number,
  available: number,
  transactions: [{
    id, type, amount, status, date, description
  }]
}
```

## Implementation Order Priority

1. **Critical Path**: Steps 4-6 (Booking Alert, Booking Details, Timeline)
2. **Core Features**: Steps 7-11 (Jobs, Workers Management)
3. **Financial**: Steps 12-14 (Earnings, Wallet)
4. **Supporting**: Steps 15-17 (Profile, Settings)
5. **Polish**: Steps 18-20 (Components, Integration)

## Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works smoothly
- [ ] Booking alert appears and functions
- [ ] Timeline shows correct status progression
- [ ] Worker assignment works
- [ ] Wallet calculations are correct
- [ ] Responsive on all screen sizes
- [ ] Loading states work
- [ ] Error states handled
- [ ] Empty states displayed

## Notes for Backend Integration

- All API endpoints should be prefixed: `/api/vendor/`
- Use React Query or similar for data fetching
- Implement optimistic updates for better UX
- Add retry logic for failed requests
- Cache frequently accessed data
- Use WebSocket for real-time booking alerts

## Current Status

✅ **Completed:**
- Routes structure
- Bottom Navigation
- Header Component
- Dashboard Page (with profile card, stats, quick actions, performance metrics, recent jobs)

🔄 **In Progress:**
- None

⏳ **Pending:**
- Booking Alert Page
- Booking Details Page
- Booking Timeline Page
- Active Jobs Page
- Workers List Page
- Add/Edit Worker Page
- Assign Worker Page
- Earnings Page
- Wallet Page
- Withdrawal Request Page
- Profile Page
- Settings Page
- Notifications Page
- Common Components
- Booking Components
- Service Files

