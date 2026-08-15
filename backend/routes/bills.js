// Bill Routes
// Defines all endpoints related to bill management

const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

/**
 * GET /api/bills
 * Fetch all bills
 */
router.get('/', billController.getAllBills);

/**
 * POST /api/bills
 * Generate a new bill
 * 
 * Request body example:
 * {
 *   "patientId": 1,
 *   "doctorId": 2,
 *   "medicineCost": 300,
 *   "consultationFee": 500
 * }
 */
router.post('/', billController.generateBill);

/**
 * DELETE /api/bills/:id
 * Delete a bill by ID
 */
router.delete('/:id', billController.deleteBill);

/**
 * GET /api/bills/compare/:patientA/:patientB
 * Compare bills between two patients
 */
router.get('/compare/:patientA/:patientB', billController.compareBills);

module.exports = router;
