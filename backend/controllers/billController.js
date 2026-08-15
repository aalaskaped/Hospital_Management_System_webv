// Bill Controller
// Handles all business logic related to bills

const { run, get, all } = require('../db/database');

/**
 * GET /api/bills
 * Fetch all bills from database
 */
async function getAllBills(req, res) {
    try {
        const bills = await all(
            `SELECT 
                b.id, 
                b.patientId, 
                b.doctorId, 
                b.medicineCost, 
                b.consultationFee, 
                b.total,
                p.name as patientName,
                d.name as doctorName
            FROM bills b
            JOIN patients p ON b.patientId = p.id
            JOIN doctors d ON b.doctorId = d.id
            ORDER BY b.id DESC`
        );
        res.json({
            success: true,
            data: bills,
            message: 'Bills fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bills',
            error: error.message
        });
    }
}

/**
 * POST /api/bills
 * Generate a new bill
 * 
 * Expected request body:
 * {
 *   patientId: number,
 *   doctorId: number,
 *   medicineCost: number,
 *   consultationFee: number
 * }
 */
async function generateBill(req, res) {
    try {
        const { patientId, doctorId, medicineCost, consultationFee } = req.body;
        
        // Validate required fields
        if (!patientId || !doctorId || medicineCost === undefined || consultationFee === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: patientId, doctorId, medicineCost, consultationFee'
            });
        }
        
        // Validate data types
        if (isNaN(patientId) || isNaN(doctorId) || isNaN(medicineCost) || isNaN(consultationFee)) {
            return res.status(400).json({
                success: false,
                message: 'All numeric fields must be numbers'
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
        
        // Calculate total bill
        const total = medicineCost + consultationFee;
        
        // Insert new bill into database
        const result = await run(
            'INSERT INTO bills (patientId, doctorId, medicineCost, consultationFee, total) VALUES (?, ?, ?, ?, ?)',
            [patientId, doctorId, medicineCost, consultationFee, total]
        );
        
        res.status(201).json({
            success: true,
            data: {
                id: result.id,
                patientId,
                doctorId,
                medicineCost,
                consultationFee,
                total
            },
            message: 'Bill generated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating bill',
            error: error.message
        });
    }
}

/**
 * GET /api/bills/compare/:patientA/:patientB
 * Compare bills between two patients
 * Returns total bills for each patient
 * 
 * @param {number} patientA - First patient ID
 * @param {number} patientB - Second patient ID
 */
async function compareBills(req, res) {
    try {
        const { patientA, patientB } = req.params;
        
        // Validate ID parameters
        if (!patientA || !patientB || isNaN(patientA) || isNaN(patientB)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient IDs'
            });
        }
        
        // Check if both patients exist
        const patientAExists = await get('SELECT id, name FROM patients WHERE id = ?', [patientA]);
        const patientBExists = await get('SELECT id, name FROM patients WHERE id = ?', [patientB]);
        
        if (!patientAExists || !patientBExists) {
            return res.status(404).json({
                success: false,
                message: 'One or both patients not found'
            });
        }
        
        // Get all bills for patient A
        const billsA = await all(
            'SELECT id, medicineCost, consultationFee, total FROM bills WHERE patientId = ?',
            [patientA]
        );
        
        // Get all bills for patient B
        const billsB = await all(
            'SELECT id, medicineCost, consultationFee, total FROM bills WHERE patientId = ?',
            [patientB]
        );
        
        // Calculate totals
        const totalA = billsA.reduce((sum, bill) => sum + bill.total, 0);
        const totalB = billsB.reduce((sum, bill) => sum + bill.total, 0);
        
        res.json({
            success: true,
            data: {
                patientA: {
                    id: patientAExists.id,
                    name: patientAExists.name,
                    billCount: billsA.length,
                    totalBill: totalA,
                    bills: billsA
                },
                patientB: {
                    id: patientBExists.id,
                    name: patientBExists.name,
                    billCount: billsB.length,
                    totalBill: totalB,
                    bills: billsB
                }
            },
            message: 'Bills compared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error comparing bills',
            error: error.message
        });
    }
}

async function deleteBill(req, res) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid bill ID'
            });
        }

        const bill = await get('SELECT id FROM bills WHERE id = ?', [id]);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }

        await run('DELETE FROM bills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Bill deleted successfully',
            deletedId: id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting bill',
            error: error.message
        });
    }
}

// Export controller functions
module.exports = {
    getAllBills,
    generateBill,
    compareBills,
    deleteBill
};
