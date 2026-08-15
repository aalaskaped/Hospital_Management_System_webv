// Hospital Management System Backend Server
// Express.js server with SQLite database integration

const express = require('express');
const cors = require('cors');
const { all } = require('./db/database');

// Import route modules
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const billRoutes = require('./routes/bills');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS - Allows requests from frontend (different domain/port)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================

/**
 * Doctor Management Routes
 * Base URL: /api/doctors
 */
app.use('/api/doctors', doctorRoutes);

/**
 * Patient Management Routes
 * Base URL: /api/patients
 */
app.use('/api/patients', patientRoutes);

/**
 * Appointment Management Routes
 * Base URL: /api/appointments
 */
app.use('/api/appointments', appointmentRoutes);

/**
 * Bill Management Routes
 * Base URL: /api/bills
 */
app.use('/api/bills', billRoutes);

// ============================================
// DASHBOARD STATISTICS ROUTE
// ============================================

/**
 * GET /api/dashboard
 * Get dashboard statistics - total counts of all entities
 * 
 * Response format:
 * {
 *   "success": true,
 *   "data": {
 *     "totalDoctors": 5,
 *     "totalPatients": 12,
 *     "totalAppointments": 8,
 *     "totalBills": 10
 *   },
 *   "message": "Dashboard data fetched successfully"
 * }
 */
app.get('/api/dashboard', async (req, res) => {
    try {
        // Query to get total doctors
        const doctorCount = await all('SELECT COUNT(*) as count FROM doctors');
        const totalDoctors = doctorCount[0]?.count || 0;

        // Query to get total patients
        const patientCount = await all('SELECT COUNT(*) as count FROM patients');
        const totalPatients = patientCount[0]?.count || 0;

        // Query to get total appointments
        const appointmentCount = await all('SELECT COUNT(*) as count FROM appointments');
        const totalAppointments = appointmentCount[0]?.count || 0;

        // Query to get total bills
        const billCount = await all('SELECT COUNT(*) as count FROM bills');
        const totalBills = billCount[0]?.count || 0;

        // Send response
        res.json({
            success: true,
            data: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                totalBills
            },
            message: 'Dashboard data fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
});

// ============================================
// ROOT ENDPOINT
// ============================================

/**
 * GET /
 * Welcome message for API
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Hospital Management System API',
        version: '1.0.0',
        endpoints: {
            doctors: '/api/doctors',
            patients: '/api/patients',
            appointments: '/api/appointments',
            bills: '/api/bills',
            dashboard: '/api/dashboard'
        }
    });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 Not Found handler
 * Handles any requests to undefined routes
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║   Hospital Management System Backend API       ║
║   Server running on http://localhost:${PORT}     ║
║                                                ║
║   Available Endpoints:                         ║
║   - GET  /api/doctors                          ║
║   - POST /api/doctors                          ║
║   - GET  /api/patients                         ║
║   - POST /api/patients                         ║
║   - GET  /api/appointments                     ║
║   - POST /api/appointments                     ║
║   - GET  /api/bills                            ║
║   - POST /api/bills                            ║
║   - GET  /api/dashboard                        ║
║                                                ║
║   Press Ctrl+C to stop the server              ║
╚════════════════════════════════════════════════╝
    `);
});
