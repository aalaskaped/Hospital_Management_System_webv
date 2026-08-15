// Appointment Routes
// Defines all endpoints related to appointment management

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * GET /api/appointments
 * Fetch all appointments
 */
router.get('/', appointmentController.getAllAppointments);

/**
 * POST /api/appointments
 * Book a new appointment
 * 
 * Request body example:
 * {
 *   "patientId": 1,
 *   "doctorId": 2,
 *   "date": "2024-12-25"
 * }
 */
router.post('/', appointmentController.bookAppointment);

/**
 * DELETE /api/appointments/:id
 * Delete an appointment by ID
 */
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
