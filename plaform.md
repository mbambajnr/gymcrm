---

# 📘 Product Requirements Document (PRD)

## Product Name: GymFlow CRM (Working Title)

---

# 1. 🧭 Product Overview

## 1.1 Purpose

GymFlow CRM is a web-based Customer Relationship Management (CRM) system designed to help gym owners and managers:

- Manage member registrations
- Track subscription cycles
- Automate payment reminders
- Integrate seamless payments (Paystack)
- Monitor revenue and performance metrics
- Send announcements and personalized messages

The system ensures automated billing cycles and real-time visibility into gym operations.

---

# 2. 🎯 Objectives

1. Digitize and automate member subscription tracking.
2. Reduce missed payments through automated reminders.
3. Increase payment speed using Paystack payment links.
4. Provide gym owners with financial and operational analytics.
5. Enable structured role-based access (Owner → Manager).

---

# 3. 👥 User Roles & Permissions

## 3.1 Admin (Gym Owner)

- Create & manage Managers
- View total revenue (monthly + historical)
- View:
    - Active clients
    - Suspended clients
- View revenue comparison bar chart
- Access detailed analytics page
- Assign Manager roles
- Send announcements

## 3.2 Manager

- Register new members
- View active members
- Track subscriptions nearing expiry
- Send reminders
- View current month revenue
- View detailed revenue history (click-through)
- Send welcome messages
- Send schedule updates

## 3.3 Gym Member (System Role)

- Receive:
    - Welcome messages
    - Subscription reminders
    - Payment links
    - Announcements
- Complete payments via Paystack

---

# 4. 🧩 Core Features & Functional Requirements

---

## 4.1 Member Management Module

### Functional Requirements:

- Add new member:
    - Full Name
    - Email
    - Phone Number
    - Registration Date (auto timestamp)
    - Subscription Plan
    - Payment Status
- Automatically calculate:
    - Subscription expiry date
- Member statuses:
    - Active
    - Due Soon
    - Suspended (Expired / Unpaid)

### System Logic:

- On registration:
    - Store registration date
    - Assign plan duration
    - Calculate expiry date
- If payment expires:
    - Move user to “Due List”
    - Mark as Suspended if overdue

---

## 4.2 Subscription Plans

### Available Plans:

- Monthly
- Quarterly
- Annual

### Additional Requirements:

- Configurable pricing
- Discount percentage field (e.g., 10% for annual plan)
- Admin can modify plan prices

---

## 4.3 Payment Integration (Paystack)

### Requirements:

- Generate unique Paystack payment link per member
- Include:
    - Member ID
    - Plan type
    - Amount
- On successful payment:
    - Receive Paystack webhook
    - Automatically:
        - Remove user from Due List
        - Update status to Active
        - Reset subscription cycle
        - Log revenue
        - Update expiry date

### Payment Flow:

1. System detects subscription nearing expiry.
2. Reminder email/SMS sent with Paystack link.
3. Member pays.
4. Webhook confirms success.
5. System updates member record.

---

## 4.4 Automated Reminders

### Reminder Triggers:

- 7 days before expiry
- 3 days before expiry
- 1 day before expiry
- On expiry date

### Channels:

- Email (required)
- SMS (optional enhancement)

### Content:

- Personalized greeting
- Subscription expiry date
- Payment link
- Gym contact info

---

## 4.5 Messaging System

### Automated Messages:

- Welcome message upon registration
- Subscription reminders
- Payment confirmation message

### Manual Broadcast:

- Schedule changes
- Announcements
- Promotions

---

# 5. 📊 Dashboard Requirements

---

## 5.1 Manager Dashboard

### Display Sections:

1. **Active Clients Count**
2. **Clients Nearing Expiry List**
    - Name
    - Expiry Date
    - Plan Type
    - Status
3. **Total Revenue (Current Month)**
    - Clickable → Revenue History Page

### Revenue History Page:

- Table view:
    - Month
    - Total Revenue
- Filter by date
- Export (CSV optional enhancement)

---

## 5.2 Admin (Owner) Dashboard

### Must Display:

1. Total Revenue (Current Month)
2. Active Clients
3. Suspended Clients
4. Revenue Bar Chart (Past 6–12 Months)

### Chart Interaction:

- Clicking chart → Detailed Analytics Page

### Detailed Analytics Page:

- Revenue breakdown by:
    - Plan type
    - Payment method
- Growth percentage month-over-month

---

# 6. 👨‍💼 Manager Assignment Flow

### Admin Actions:

- Fill Manager Details:
    - Full Name
    - Email
    - Phone
- Assign Role: Manager

### After Creation:

- System:
    - Generates temporary password
    - Sends email with:
        - Login URL
        - Username
        - Temporary password
        - Password reset link

---

# 7. 📈 Revenue Tracking Logic

Revenue should:

- Log each successful Paystack payment
- Categorize by:
    - Plan type
    - Date
- Automatically aggregate:
    - Current month revenue
    - Historical revenue

---

# 8. 🗂 Data Model Overview

## Entities:

### Member

- id
- full_name
- email
- phone
- registration_date
- subscription_plan
- expiry_date
- status

### Payment

- id
- member_id
- amount
- plan_type
- payment_date
- payment_reference
- status

### SubscriptionPlan

- id
- name (Monthly, Quarterly, Annual)
- duration_days
- price
- discount_percentage

### User (Admin/Manager)

- id
- name
- email
- role
- password_hash

---

# 9. 🔐 Non-Functional Requirements

- Secure authentication (JWT/session-based)
- Role-based access control
- HTTPS required
- Paystack webhook verification
- Scalable database design
- Backup and logging enabled

---

# 10. 🧪 Edge Cases

- Payment succeeds but webhook fails → retry mechanism
- Member pays twice → prevent duplicate extension
- Manager deleted → reassign members
- Subscription changed mid-cycle → prorated handling (future enhancement)

---

# 11. 🛠 Recommended Tech Stack (Suggested)

Since you're building systems and working toward scalable tech ventures:

- Backend: Django / FastAPI / Node.js
- Frontend: React / Next.js
- Database: PostgreSQL
- Payment: Paystack
- Email: SendGrid / Mailgun
- Hosting: AWS / DigitalOcean

---

# 12. 🚀 Future Enhancements

- SMS integration
- WhatsApp reminders
- Attendance tracking
- Trainer assignment module
- Mobile app version
- Multi-branch support
- AI churn prediction

---

# 13. 🏁 Success Metrics

- Reduction in expired unpaid subscriptions
- Increase in on-time payments
- Revenue growth month-over-month
- Reduced manual tracking time

---