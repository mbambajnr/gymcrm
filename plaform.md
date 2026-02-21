**PRD FOR GYM CRM**

**Product Requirements Document (PRD)**

**Gym CRM & Subscription Management System**

**1. Product Overview**

The **Gym CRM** is a web-based application designed to help gym administrators manage member registrations, subscription plans, payments, and automated communications. The system will track each client’s registration date, calculate subscription expiry dates based on selected plans, automate payment reminders with payment links, and provide real-time dashboards for operational visibility.

**2. Goals & Objectives**

- Centralize management of all registered gym members.
- Automatically calculate and track subscription expiry dates.
- Reduce overdue payments through automated reminders with embedded payment links.
- Automate welcome messages and broadcast announcements.
- Provide clear admin dashboard insights (total members & outstanding payments).

Success Metrics:

- 90%+ on-time renewal rate
- 50% reduction in manual follow-ups
- Real-time visibility of active vs overdue members

**3. Target Users**

- **Admin/Manager** – Manages members, plans, payments, and announcements.
- **Gym Staff** – Registers clients and monitors payment status.
- **Members** – Receive reminders, make payments, receive announcements.

**4. Core Features & Functional Requirements**

**4.1 Member Registration & Management**

- Register new members with: Name, Phone, Email, Registration Date, Selected Plan.
- Automatically assign subscription expiry date based on plan duration.
- Member status categories:
    - Active
    - Due
    - Expired
- Maintain searchable database of all registered users.

**4.2 Subscription Plans**

- Pre-configured plans:
    - Monthly
    - Quarterly
    - Annual
- Admin can configure:
    - Price per plan
    - Discount percentage per plan
- System calculates final payable amount after discount.

**4.3 Subscription Tracking & Expiry Logic**

- Expiry date = Registration Date + Plan Duration.
- System auto-moves member to “Due” list X days before expiry (configurable, e.g., 5 days).
- If unpaid past expiry date → status changes to “Expired”.
- Upon successful payment:
    - Member removed from “Due” list
    - New expiry date generated
    - Subscription cycle resets

**4.4 Payment Integration**

- Generate secure payment links (Paystack).
- Include payment link in reminder notifications.
- On successful payment confirmation:
    - Update status to Active
    - Record transaction
    - Generate receipt
    - Reset subscription cycle

**4.5 Automated Notifications**

**A. Welcome Message**

- Automatically sent upon new member registration.
- Personalized (Name, Plan, Expiry Date).

**B. Renewal Reminder**

- Sent before subscription expiry (configurable).
- Includes:
    - Member Name
    - Plan Type
    - Expiry Date
    - Payment Link

**C. Overdue Reminder**

- Sent daily/weekly after expiry until payment.

**D. Broadcast Announcements**

- Admin can send mass announcements (e.g., holiday hours, new classes).
- Delivered via Email and/or SMS.

**5. Admin Dashboard Requirements**

Dashboard Widgets:

1. **Total Registered Users Widget**
    - Displays total number of members.
    - Optional breakdown: Active, Due, Expired.
2. **Outstanding Clients Widget**
    - Displays number of members with unpaid subscriptions.
    - Clickable to view detailed list.

Additional Dashboard Elements:

- Recent Registrations
- Recent Payments
- Revenue Summary (Optional Phase 2)

**6. Non-Functional Requirements**

- Cloud-based, secure authentication.
- Role-based access control (Admin vs Staff).
- Secure payment processing (PCI-compliant provider).
- Mobile-responsive UI.
- Data backup & audit logs.

**7. Assumptions & Constraints**

- Internet-based application.
- Payment provider API integration required.
- SMS/email provider integration required.

**8. Future Enhancements (Phase 2)**

- Mobile app version.
- Attendance tracking with QR check-in.
- Loyalty rewards program.
- Class scheduling & booking.
- Revenue analytics dashboard.

**Summary**

This Gym CRM system will automate subscription tracking, payment reminders, and communication workflows, ensuring improved revenue collection, reduced manual work, and better member engagement.
