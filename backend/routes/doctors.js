// Doctor Routes
// Defines all endpoints related to doctor management

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

/**
 * GET /api/doctors
 * Fetch all doctors
 */
router.get('/', doctorController.getAllDoctors);

/**
 * GET /api/doctors/:id
 * Fetch a specific doctor by ID
 */
router.get('/:id', doctorController.getDoctorById);

/**
 * POST /api/doctors
 * Add a new doctor
 * 
 * Request body example:
 * {
 *   "name": "Dr. Smith",
 *   "age": 45,
 *   "specialization": "Cardiology",
 *   "fees": 500
 * }
 */
router.post('/', doctorController.addDoctor);

/**
 * DELETE /api/doctors/:id
 * Delete a doctor by ID
 */
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
