// Patient Routes
// Defines all endpoints related to patient management

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

/**
 * GET /api/patients
 * Fetch all patients
 */
router.get('/', patientController.getAllPatients);

/**
 * GET /api/patients/:id
 * Fetch a specific patient by ID
 */
router.get('/:id', patientController.getPatientById);

/**
 * POST /api/patients
 * Add a new patient
 * 
 * Request body example:
 * {
 *   "name": "John Doe",
 *   "age": 35,
 *   "disease": "Hypertension",
 *   "initialBill": 1000
 * }
 */
router.post('/', patientController.addPatient);

/**
 * DELETE /api/patients/:id
 * Delete a patient by ID
 */
router.delete('/:id', patientController.deletePatient);

module.exports = router;
