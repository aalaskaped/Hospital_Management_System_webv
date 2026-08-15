# Hospital Management System - Full Stack Application

## Overview

A complete full-stack Hospital Management System built with:
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Architecture**: RESTful API

This application demonstrates professional full-stack development practices with proper separation of concerns, error handling, and CORS support.

---

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser
- Two terminal windows

### Installation & Running

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
```
Frontend runs on: `http://localhost:8000`

Open browser to: `http://localhost:8000`

---

## System Architecture

```
Browser (Frontend)
    ↓
Fetch API Requests
    ↓
Express.js Backend
    ↓
SQLite Database
```

---

## Backend API Endpoints

Base URL: `http://localhost:5000/api`

### Doctors API
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Add new doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Patients API
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Add new patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments API
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Book appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Bills API
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Generate bill
- `GET /api/bills/compare/:patientA/:patientB` - Compare bills

### Dashboard API
- `GET /api/dashboard` - Get statistics

---

## Project Structure

```
Hospital_Management_System_webv/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── schema.sql
│   ├── db/database.js
│   ├── controllers/
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   └── billController.js
│   ├── routes/
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   ├── appointments.js
│   │   └── bills.js
│   └── database/
│       └── hospital.db (auto-created)
│
├── frontend/
│   ├── index.html
│   ├── doctors.html
│   ├── patients.html
│   ├── appointments.html
│   ├── billing.html
│   ├── script.js
│   └── style.css
│
├── FRONTEND_INTEGRATION_GUIDE.md
├── SETUP_INSTRUCTIONS.md
└── README.md
```

---

## Features

✅ **Doctors Management** - Add, view, search, delete doctors  
✅ **Patients Management** - Add, view, search, delete patients  
✅ **Appointments** - Book, view, delete appointments  
✅ **Billing** - Generate bills, compare between patients  
✅ **Dashboard** - Real-time statistics  
✅ **RESTful API** - Professional API structure  
✅ **Database Persistence** - SQLite storage  
✅ **Error Handling** - Comprehensive error responses  
✅ **CORS Enabled** - Cross-origin requests  
✅ **Async/Await** - Modern JavaScript patterns  

---

## Technologies

- **Express.js** - Web framework
- **SQLite3** - Database
- **Fetch API** - HTTP requests
- **JavaScript ES6+** - Modern JavaScript
- **HTML5/CSS3** - Frontend

---

## Getting Started

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend**
   ```bash
   npm start
   ```
   Should show: "Server running on http://localhost:5000"

3. **Start Frontend**
   ```bash
   cd frontend
   python -m http.server 8000
   ```

4. **Open Browser**
   Navigate to: `http://localhost:8000`

5. **Test Application**
   - Go to Doctors page
   - Add a new doctor
   - Verify in Dashboard and table

---

## API Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* data */ },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Example: Add Doctor

**Frontend (JavaScript):**
```javascript
async function addNewDoctor(event) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Dr. John Smith',
            age: 45,
            specialization: 'Cardiology',
            fees: 500
        })
    });
    const result = await response.json();
    if (result.success) {
        alert('Doctor added!');
        displayDoctors();
    }
}
```

---

## Documentation

- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **FRONTEND_INTEGRATION_GUIDE.md** - Frontend to API integration
- Backend code comments - In-code documentation
- Frontend script.js comments - Function documentation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check if backend is running on port 5000 |
| CORS error | Ensure both servers are running |
| 0 statistics on dashboard | Add data first, then refresh |
| Database errors | Delete hospital.db and restart backend |

---

## Learning Resources

- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [REST API](https://restfulapi.net/)

---

## Next Steps

1. Deploy backend to cloud (Heroku, AWS, etc.)
2. Add user authentication
3. Add input validation
4. Add pagination and filtering
5. Add unit tests
6. Deploy frontend to CDN

---

## Support

For detailed instructions, see:
- SETUP_INSTRUCTIONS.md - Complete setup guide
- FRONTEND_INTEGRATION_GUIDE.md - Integration details

---

**Version:** 1.0.0  
**Status:** Complete Full-Stack Application Ready