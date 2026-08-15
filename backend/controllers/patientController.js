// Patient Controller
// Handles all business logic related to patients

const { run, get, all } = require('../db/database');

/**
 * GET /api/patients
 * Fetch all patients from database
 */
async function getAllPatients(req, res) {
    try {
        const patients = await all(
            'SELECT id, name, age, disease, initialBill FROM patients ORDER BY id DESC'
        );
        res.json({
            success: true,
            data: patients,
            message: 'Patients fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
}

/**
 * GET /api/patients/:id
 * Fetch a single patient by ID
 * 
 * @param {number} id - Patient ID from URL parameter
 */
async function getPatientById(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }
        
        const patient = await get(
            'SELECT id, name, age, disease, initialBill FROM patients WHERE id = ?',
            [id]
        );
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            data: patient,
            message: 'Patient fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patient',
            error: error.message
        });
    }
}

/**
 * POST /api/patients
 * Add a new patient to database
 * 
 * Expected request body:
 * {
 *   name: string,
 *   age: number,
 *   disease: string,
 *   initialBill: number
 * }
 */
async function addPatient(req, res) {
    try {
        const { name, age, disease, initialBill } = req.body;
        
        // Validate required fields
        if (!name || !age || !disease || initialBill === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, age, disease, initialBill'
            });
        }
        
        // Validate data types
        if (isNaN(age) || isNaN(initialBill)) {
            return res.status(400).json({
                success: false,
                message: 'Age and initialBill must be numbers'
            });
        }
        
        // Insert new patient into database
        const result = await run(
            'INSERT INTO patients (name, age, disease, initialBill) VALUES (?, ?, ?, ?)',
            [name, age, disease, initialBill]
        );
        
        res.status(201).json({
            success: true,
            data: {
                id: result.id,
                name,
                age,
                disease,
                initialBill
            },
            message: 'Patient added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding patient',
            error: error.message
        });
    }
}

/**
 * DELETE /api/patients/:id
 * Delete a patient by ID
 * 
 * @param {number} id - Patient ID from URL parameter
 */
async function deletePatient(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }
        
        // Check if patient exists
        const patient = await get('SELECT id FROM patients WHERE id = ?', [id]);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        // Delete the patient
        // This will also delete related appointments and bills due to foreign key constraints
        const result = await run(
            'DELETE FROM patients WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Patient deleted successfully',
            deletedId: id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting patient',
            error: error.message
        });
    }
}

// Export controller functions
module.exports = {
    getAllPatients,
    getPatientById,
    addPatient,
    deletePatient
};
