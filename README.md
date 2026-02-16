# Intelligent Healthcare Appointment System

An advanced web-based platform designed to streamline the healthcare appointment process, managing interactions between patients, doctors, and administrators.

## User Functions

### Patients
-   **Registration & Authentication**: Secure sign-up and login.
-   **Doctor Discovery**: Browse and search for doctors by specialization.
-   **Appointment Booking**: Schedule appointments with real-time availability.
-   **Prescription Access**: View and download prescriptions.

### Doctors
-   **Profile Management**: Update improved profile details.
-   **Appointment Management**: View and manage daily appointments.
-   **Prescription Management**: Create and issue digital prescriptions.
-   **Queue Management**: Real-time control of patient queues.

### Administrators
-   **User Management**: Oversee patient and doctor accounts.
-   **System Monitoring**: View system statistics and generate reports.
-   **Data Export**: Export appointment data for analysis.

## Application Flow

1.  **User Onboarding**: Users register and selecting their role (Patient/Doctor).
2.  **Booking**: Patients search for doctors and book available slots.
3.  **Consultation**: Doctors manage queues and conduct appointments.
4.  **Post-Consultation**: Doctors issue prescriptions; patients access them.
5.  **Administration**: Admins monitor system health and manage user data.

## Installation Steps

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Local or Atlas)

### 1. Server Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and configure your environment variables (PORT, MONGO_URI, JWT_SECRET, etc.).
4.  Start the server:
    ```bash
    npm start
    ```

### 2. Client Setup
1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the client application:
    ```bash
    npm run dev
    ```

The application should now be running, typically with the client on `http://localhost:5173` (or similar) and the server on `http://localhost:5000`.
