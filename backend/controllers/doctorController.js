// Doctor Controller
// Handles all business logic related to doctors

const { run, get, all } = require('../db/database');

/**
 * GET /api/doctors
 * Fetch all doctors from database
 */
async function getAllDoctors(req, res) {
    try {
        const doctors = await all(
            'SELECT id, name, age, specialization, fees FROM doctors ORDER BY id DESC'
        );
        res.json({
            success: true,
            data: doctors,
            message: 'Doctors fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
}

/**
 * GET /api/doctors/:id
 * Fetch a single doctor by ID
 * 
 * @param {number} id - Doctor ID from URL parameter
 */
async function getDoctorById(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }
        
        const doctor = await get(
            'SELECT id, name, age, specialization, fees FROM doctors WHERE id = ?',
            [id]
        );
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.json({
            success: true,
            data: doctor,
            message: 'Doctor fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor',
            error: error.message
        });
    }
}

/**
 * POST /api/doctors
 * Add a new doctor to database
 * 
 * Expected request body:
 * {
 *   name: string,
 *   age: number,
 *   specialization: string,
 *   fees: number
 * }
 */
async function addDoctor(req, res) {
    try {
        const { name, age, specialization, fees } = req.body;
        
        // Validate required fields
        if (!name || !age || !specialization || !fees) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, age, specialization, fees'
            });
        }
        
        // Validate data types
        if (isNaN(age) || isNaN(fees)) {
            return res.status(400).json({
                success: false,
                message: 'Age and fees must be numbers'
            });
        }
        
        // Insert new doctor into database
        const result = await run(
            'INSERT INTO doctors (name, age, specialization, fees) VALUES (?, ?, ?, ?)',
            [name, age, specialization, fees]
        );
        
        res.status(201).json({
            success: true,
            data: {
                id: result.id,
                name,
                age,
                specialization,
                fees
            },
            message: 'Doctor added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding doctor',
            error: error.message
        });
    }
}

/**
 * DELETE /api/doctors/:id
 * Delete a doctor by ID
 * 
 * @param {number} id - Doctor ID from URL parameter
 */
async function deleteDoctor(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }
        
        // Check if doctor exists
        const doctor = await get('SELECT id FROM doctors WHERE id = ?', [id]);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        // Delete the doctor
        // This will also delete related appointments and bills due to foreign key constraints
        const result = await run(
            'DELETE FROM doctors WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Doctor deleted successfully',
            deletedId: id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting doctor',
            error: error.message
        });
    }
}

// Export controller functions
module.exports = {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    deleteDoctor
};
