# 🩺 Intelligent Healthcare Appointment System (IHAS)

An intelligent, full-stack healthcare queue & appointment management platform built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). **IHAS** streamlines patient consultation scheduling, minimizes no-show rates via predictive ML heuristics, provides live token queue management for doctors, and offers comprehensive administrative controls for hospital operations.

---

## 📌 ABSTRACT

The **Intelligent Healthcare Appointment System (IHAS)** is designed to bridge the gap between healthcare providers and patients by digitizing queue management and medical consultation scheduling. Traditional appointment systems suffer from long waiting room delays, unpredictable doctor schedules, and lost revenue due to patient no-shows. 

IHAS solves these issues by featuring:
- **Smart Queue & Token Management**: Live real-time token tracking with emergency priority toggling and automatic 15-minute consultation window timeout checks.
- **Predictive No-Show Scoring**: Dynamic risk score calculation based on patient visit history, cancellation frequency, and temporal factors (e.g., weekend/early morning slots).
- **Multi-Role Access Control**: Tailored dashboards for Patients, Doctors, and Administrators with JWT authentication and bcrypt security.
- **Automated Email Reminders & Prescriptions**: Integrated Nodemailer background cron tasks sending day-before and hourly appointment alerts alongside electronic prescription creation.

---

## 👥 MODULES (USERS)

The system supports three distinct user roles with specific access levels and functionality:

1. **Patient (User)**: Registered individuals seeking consultation services. They can view available doctors, book tokenized appointment slots, track live doctor queue status, view past consultation history, download prescriptions, and manage their profile.
2. **Doctor**: Verified healthcare specialists. They manage daily availability, view scheduled patients, operate the live queue dashboard (calling tokens, setting consultation status, toggling critical/emergency priorities, pausing/resuming queues), and write electronic prescriptions.
3. **Admin (Hospital Administrator)**: System overseers who manage platform users, approve/reject doctor registrations, add doctors directly, adjust global system theme & hospital settings, export appointment records, and view system statistics/reports.

---

## ⚙️ LIST OF FUNCTIONS BY USER MODULE

Below is the complete, comprehensive list of backend and frontend functions organized separately by User Module.

### 1. 🧑‍🤝‍🧑 PATIENT MODULE FUNCTIONS

| Function Name | Location / Endpoint | Description |
| :--- | :--- | :--- |
| `registerUser()` | `POST /api/auth/register` | Registers a new patient account with encrypted password storage (`status: active`). |
| `loginUser()` | `POST /api/auth/login` | Authenticates patient credentials and generates a 30-day JWT token. |
| `forgotPassword()` | `POST /api/auth/forgotpassword` | Generates a 10-minute password reset token and emails a reset URL to the patient. |
| `resetPassword()` | `PUT /api/auth/resetpassword/:token` | Resets the patient's password using the verified reset token. |
| `getUserProfile()` | `GET /api/auth/profile` | Fetches the logged-in patient's personal profile information. |
| `updateUserProfile()` | `PUT /api/auth/profile` | Updates profile fields (name, email, address, password) after verifying the current password. |
| `getDoctors()` | `GET /api/doctors` | Retrieves all active doctors with specialization, fees, today's availability, and current queue state. |
| `getDoctorById()` | `GET /api/doctors/:id` | Fetches detailed profile information for a specific doctor. |
| `bookAppointment()` | `POST /api/appointments` | Checks doctor slot availability, calculates no-show risk score, assigns sequential token numbers, and logs a pending appointment. |
| `verifyPayment()` | `POST /api/appointments/verify-payment` | Confirms payment intent verification, updating appointment status to `Confirmed` and payment to `Paid`. |
| `getMyAppointments()` | `GET /api/appointments/my` | Fetches all scheduled, completed, or cancelled appointments for the logged-in patient. |
| `updateAppointmentStatus()` | `PUT /api/appointments/:id/status` | Allows patients to cancel appointments (enforcing a strict 5-hour advance cancellation rule). |
| `getQueue()` | `GET /api/queue/:doctorId` | Provides live read-only access to doctor's queue status and token call progress. |
| `getPrescription()` | `GET /api/prescriptions/:appointmentId` | Fetches electronic prescriptions written by doctors for a given appointment. |
| `getPatientHistory()` | `GET /api/doctors/patients/:patientId/history` | Allows patients to view their complete consultation & prescription history. |

---

### 2. 👨‍⚕️ DOCTOR MODULE FUNCTIONS

| Function Name | Location / Endpoint | Description |
| :--- | :--- | :--- |
| `registerUser()` (Doctor) | `POST /api/auth/register` | Registers a new doctor account with `status: pending` (requires Admin approval). |
| `getDoctorProfile()` | `GET /api/doctors/profile` | Fetches current doctor's professional profile (specialization, bio, experience, consultation fees). |
| `updateDoctorProfile()` | `POST /api/doctors/profile` | Creates or updates professional details and day-by-day availability schedules. |
| `getMyAppointments()` | `GET /api/appointments/my` | Retrieves all appointments booked specifically for this doctor. |
| `updateAppointmentStatus()` | `PUT /api/appointments/:id/status` | Updates appointment statuses (`Confirmed`, `Completed`, `Cancelled`, `Rejected`). |
| `getQueue()` | `GET /api/queue/:doctorId` | Retrieves today's active patient queue sorted by priority (`Critical` before `Normal`) and token number. Auto-marks stale consultations (>15 mins) as `Skipped`. |
| `updateQueueStatus()` | `PUT /api/queue/status` | Progresses token status (`In-Consultation`, `Completed`, `Skipped`) and updates doctor's last called token. |
| `togglePriority()` | `PUT /api/queue/priority` | Toggles patient appointment priority between `Normal` and `Critical` for emergency preference. |
| `updateQueueControl()` | `PUT /api/queue/control` | Pauses or resumes the live patient token queue. |
| `getDoctorPatients()` | `GET /api/doctors/patients` | Aggregates unique patients treated by the doctor along with their last visit dates. |
| `getPatientHistory()` | `GET /api/doctors/patients/:patientId/history` | Retrieves a patient's historical visits and prescriptions under this doctor. |
| `createPrescription()` | `POST /api/prescriptions` | Issues an electronic prescription containing prescribed medicines, dosages, and clinical notes. |
| `getPrescription()` | `GET /api/prescriptions/:appointmentId` | Reads or updates existing prescription records for a session. |

---

### 3. 🛠️ ADMIN MODULE FUNCTIONS

| Function Name | Location / Endpoint | Description |
| :--- | :--- | :--- |
| `getAllUsers()` | `GET /api/admin/users` | Retrieves a list of all registered users (Patients, Doctors, Admins) sorted by creation date. |
| `updateUserStatus()` | `PUT /api/admin/users/:id/status` | Approves or rejects doctor registration requests (`active`, `pending`, `rejected`). |
| `deleteUser()` | `DELETE /api/admin/users/:id` | Permanently deletes a user account and any linked doctor profiles. |
| `getSystemStats()` | `GET /api/admin/stats` | Fetches high-level metrics (total patients, active doctors, total appointments booked). |
| `addDoctor()` | `POST /api/admin/doctors` | Allows admin to directly create an active doctor user and professional profile simultaneously. |
| `updateDoctorProfileAdmin()`| `PUT /api/admin/doctors/:id/profile` | Edits doctor specialization, bio, experience, fees, and schedule on behalf of a doctor. |
| `getDoctorPatients()` | `GET /api/admin/doctors/:id/patients` | Views all unique patients assigned to or treated by a specific doctor. |
| `getReports()` | `GET /api/admin/reports` | Generates detailed tabular reports of all patients and detailed doctor profiles. |
| `getAllAppointments()` | `GET /api/appointments/admin/all` | Lists all system-wide appointments with patient & doctor population. |
| `getExportAppointments()` | `GET /api/admin/export-appointments` | Filters and exports appointment records by doctor or patient ID. |
| `getSettings()` | `GET /api/admin/settings` | Reads global application settings (hospital name, contact info, theme, reminder hours). |
| `updateSettings()` | `PUT /api/admin/settings` | Updates hospital metadata, UI color theme, and email reminder hour limits. |

---

### 4. 🧠 INTERNAL UTILITY & SYSTEM FUNCTIONS

| Function Name | Location | Description |
| :--- | :--- | :--- |
| `calculateNoShowRisk()` | `server/utils/predictionService.js` | Evaluates patient historical no-shows/cancellations, day of week, and time slot to produce a 0-100 risk score. |
| `sendBookingReceipt()` | `server/utils/emailService.js` | Sends an HTML appointment confirmation receipt with token details via Nodemailer. |
| `sendReminder()` | `server/utils/emailService.js` | Sends an automated email reminder a configurable number of hours before appointment time. |
| `sendDayBeforeReminder()` | `server/utils/emailService.js` | Sends an upcoming appointment notice 24 hours prior to the date. |
| `sendPasswordReset()` | `server/utils/emailService.js` | Sends an email containing a secure password reset link. |
| `startReminderJob()` | `server/cron/reminderCron.js` | Background cron scheduler (`node-cron`) running every 10 minutes to process automated email reminders. |
| `seedAdmin()` | `server/scripts/seedAdmin.js` | Automatically seeds a default Administrator account if none exists upon server boot. |

---

## 💻 ENVIRONMENT SETUP & INSTALLATION GUIDE

This section guides developers and users through running the project locally.

### 📋 Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### 🔧 1. Backend Setup (`/server`)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or inspect the `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ihas_db
   JWT_SECRET=your_jwt_secret_key_here
   SMTP_SERVICE=gmail
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   FROM_NAME=IHAS Support
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000` and automatically seed the default admin account.*

---

### 🎨 2. Frontend Setup (`/client`)

1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or inspect the `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Launch the Vite client application:
   ```bash
   npm run dev
   ```
   *The client application will run locally at `http://localhost:5173`.*

---

## 🔑 DEFAULT ADMIN CREDENTIALS

During initial startup, `seedAdmin()` creates an admin account automatically:
- **Email**: `admin@ihas.com`
- **Password**: `admin123`
- **Role**: `admin`

---

## 🛠️ TECH STACK SUMMARY

- **Frontend**: React 19, Vite, TailwindCSS v4, Lucide Icons, Axios, React Router v7, React Hot Toast, Framer Motion
- **Backend**: Node.js, Express.js (v5), Mongoose (v9), MongoDB
- **Security & Authentication**: JWT (JSON Web Tokens), Bcrypt.js, Crypto
- **Background Tasks**: Node-Cron (Automated email reminders)
- **Mailing Service**: Nodemailer (SMTP Service)
