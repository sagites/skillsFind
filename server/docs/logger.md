# 📄 Logger Documentation

## Overview
The logger middleware provides **request logging** and **error logging** for the application.
It uses **Winston** to log details to both the console and log files, helping with debugging, audits, and production monitoring.

---

## ✨ Features
- Logs all incoming requests (method, URL, status, duration, user, account type).
- Logs all API errors to a separate `error.log` file.
- Maintains separate files for request logs (`app.log`) and error logs (`error.log`).
- Includes timestamps for all log entries.
- Supports console logging for development.
- Automatically rotates log files (max 5MB per file, 5 files retained).

---

## 📂 File Structure
```
/middleware
  └── logger.js
/logs
  ├── app.log
  └── error.log
/docs
  └── logger.md
```

---

## ⚙️ Installation
Install the required dependency:
```bash
npm install winston
```

---

## 🛠 Setup

### 1️⃣ Import and Use the Logger Middleware
In `server.js`:
```javascript
const { requestLogger, errorLogger } = require("./middleware/logger");

// Request logging middleware (must come before routes)
app.use(requestLogger);

// Your routes go here...
app.use("/api/vendors", vendorRoutes);
app.use("/api/users", userRoutes);

// Error logging middleware (must come after routes)
app.use(errorLogger);
```

---

## 📜 Request Logger
The `requestLogger` middleware logs details of every incoming request.

### Example Log (`app.log`)
```
[2025-07-30T16:50:12.345Z] INFO: GET /api/vendors/123 | Status: 200 | User: 64d8c9b2f7e12345e0c | AccountType: vendor | Duration: 15ms
```

### Captured Details
- HTTP Method (e.g. GET, POST)
- URL (e.g. `/api/vendors/123`)
- Status Code (e.g. 200)
- User ID (if authenticated, otherwise "Guest")
- Account Type (`user`, `vendor`, or `N/A`)
- Duration (in milliseconds)

---

## ❌ Error Logger
The `errorLogger` middleware logs all application errors to `error.log`.

### Example Log (`error.log`)
```
[2025-07-30T16:51:32.123Z] ERROR: POST /api/vendors/123/reviews | User: 64d8c9b2f7e12345e0c | AccountType: user | Message: Vendor not found
```

### Captured Details
- HTTP Method & URL
- User ID
- Account Type
- Error message

---

## 🚨 Error Handling
The `errorLogger` middleware must be placed **after all routes** to ensure it captures route-level errors.

```javascript
app.use(errorLogger);
```

---

## 🗂 Log File Locations
| Log Type         | File Path         |
|-----------------|-------------------|
| Request Logs    | `/logs/app.log`   |
| Error Logs      | `/logs/error.log` |

---

## 🏭 Production Notes
- Ensure the `/logs` folder exists on the server.
- Logs rotate automatically after **5MB**, with up to 5 files retained.
- Combine this with a process manager (e.g. PM2) for log aggregation in production.

---

## 🔧 Future Enhancements
- Add **uncaught exception logging** and **unhandled promise rejection logging**.
- Integrate with external monitoring tools (e.g. Datadog, LogDNA, or Elastic Stack).
- Include request correlation IDs for better debugging in distributed systems.
