// Appointment Controller
// Handles all business logic related to appointments

const { run, get, all } = require('../db/database');

/**
 * GET /api/appointments
 * Fetch all appointments from database
 */
async function getAllAppointments(req, res) {
    try {
        const appointments = await all(
            `SELECT 
                a.id, 
                a.patientId, 
                a.doctorId, 
                a.date,
                p.name as patientName,
                d.name as doctorName,
                d.specialization as doctorSpecialization
            FROM appointments a
            JOIN patients p ON a.patientId = p.id
            JOIN doctors d ON a.doctorId = d.id
            ORDER BY a.id DESC`
        );
        res.json({
            success: true,
            data: appointments,
            message: 'Appointments fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
}

/**
 * POST /api/appointments
 * Book a new appointment
 * 
 * Expected request body:
 * {
 *   patientId: number,
 *   doctorId: number,
 *   date: string (YYYY-MM-DD format)
 * }
 */
async function bookAppointment(req, res) {
    try {
        const { patientId, doctorId, date } = req.body;
        
        // Validate required fields
        if (!patientId || !doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: patientId, doctorId, date'
            });
        }
        
        // Validate data types
        if (isNaN(patientId) || isNaN(doctorId)) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID and Doctor ID must be numbers'
            });
        }
        
        // Check if patient exists
        const patient = await get('SELECT id FROM patients WHERE id = ?', [patientId]);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        // Check if doctor exists
        const doctor = await get('SELECT id FROM doctors WHERE id = ?', [doctorId]);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        // Insert new appointment into database
        const result = await run(
            'INSERT INTO appointments (patientId, doctorId, date) VALUES (?, ?, ?)',
            [patientId, doctorId, date]
        );
        
        res.status(201).json({
            success: true,
            data: {
                id: result.id,
                patientId,
                doctorId,
                date
            },
            message: 'Appointment booked successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error booking appointment',
            error: error.message
        });
    }
}

/**
 * DELETE /api/appointments/:id
 * Delete an appointment by ID
 * 
 * @param {number} id - Appointment ID from URL parameter
 */
async function deleteAppointment(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid appointment ID'
            });
        }
        
        // Check if appointment exists
        const appointment = await get('SELECT id FROM appointments WHERE id = ?', [id]);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Delete the appointment
        const result = await run(
            'DELETE FROM appointments WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Appointment deleted successfully',
            deletedId: id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: error.message
        });
    }
}

// Export controller functions
module.exports = {
    getAllAppointments,
    bookAppointment,
    deleteAppointment
};
