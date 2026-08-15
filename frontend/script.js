/* ============================================
   HOSPITAL MANAGEMENT SYSTEM - FRONTEND API INTEGRATION
   This file connects the frontend to the backend API
   ============================================ */

// ============================================
// API CONFIGURATION
// ============================================
// Change this URL based on your backend server location
const API_URL = 'http://localhost:5000/api';

/* ============================================
   HELPER FUNCTIONS
   Common functions used across all pages
   ============================================ */

// Function to show alert messages
function showMessage(message, type) {
    // type can be 'success', 'error', or 'info'
    if (type === 'success') {
        alert('✓ ' + message);
    } else if (type === 'error') {
        alert('✗ ' + message);
    } else {
        alert('ℹ ' + message);
    }
}

// Function to get current date in format YYYY-MM-DD
function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// Function to clear all form fields
function clearForm(formId) {
    let form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Function to validate if a string is empty
function isEmpty(value) {
    if (value === '' || value === null || value === undefined) {
        return true;
    }
    return false;
}

/* ============================================
   DASHBOARD FUNCTIONS
   Functions for the home/dashboard page
   ============================================ */

/**
 * Load dashboard statistics from backend
 * Displays total count of doctors, patients, appointments, and bills
 */
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        const result = await response.json();
        
        if (result.success) {
            const stats = result.data;
            
            // Update dashboard cards with data from backend
            document.getElementById('totalDoctorsCard').textContent = stats.totalDoctors;
            document.getElementById('totalPatientsCard').textContent = stats.totalPatients;
            document.getElementById('totalAppointmentsCard').textContent = stats.totalAppointments;
            document.getElementById('totalBillsCard').textContent = stats.totalBills;
            
            console.log('Dashboard stats loaded:', stats);
        } else {
            console.error('Error loading dashboard stats:', result.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard:', error);
    }
}

/* ============================================
   DOCTOR MANAGEMENT FUNCTIONS
   All functions related to doctor operations
   ============================================ */

/**
 * Display all doctors in the table
 * Gets data from backend instead of local array
 */
async function displayDoctors() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        const doctors = result.data;
        let tableBody = document.getElementById('doctorsTableBody');
        
        if (!tableBody) return; // Not on doctors page
        
        tableBody.innerHTML = ''; // Clear the table first
        
        // If no doctors, show message
        if (doctors.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No doctors found</td></tr>';
            return;
        }
        
        // Loop through all doctors and add them to the table
        doctors.forEach(doctor => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.age}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.fees}</td>
                <td>
                    <button class="btn-delete" onclick="deleteDoctor(${doctor.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying doctors:', error);
        alert('Error loading doctors: ' + error.message);
    }
}

/**
 * Add a new doctor via API
 * Called when "Add Doctor" form is submitted
 */
async function addNewDoctor(event) {
    event.preventDefault(); // Stop form from refreshing the page
    
    try {
        // Get values from form
        const doctorName = document.getElementById('doctorName').value;
        const doctorAge = document.getElementById('doctorAge').value;
        const doctorSpec = document.getElementById('doctorSpecialization').value;
        const doctorFees = document.getElementById('doctorFees').value;
        
        // Validate inputs
        if (isEmpty(doctorName) || isEmpty(doctorAge) || isEmpty(doctorSpec) || isEmpty(doctorFees)) {
            alert('Please fill all fields');
            return;
        }
        
        // Send POST request to backend API
        const response = await fetch(`${API_URL}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: doctorName,
                age: parseInt(doctorAge),
                specialization: doctorSpec,
                fees: parseInt(doctorFees)
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Doctor added successfully!', 'success');
            clearForm('addDoctorForm');
            displayDoctors(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error adding doctor:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Delete a doctor via API
 * @param {number} doctorId - ID of doctor to delete
 */
async function deleteDoctor(doctorId) {
    // Ask user for confirmation
    const confirmDelete = confirm('Are you sure you want to delete this doctor?');
    
    if (!confirmDelete) return;
    
    try {
        // Send DELETE request to backend API
        const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Doctor deleted successfully!', 'success');
            displayDoctors(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting doctor:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Search for a doctor by ID or name
 * Filters results on frontend
 */
async function searchDoctor() {
    try {
        const searchTerm = document.getElementById('searchDoctorId').value.toLowerCase();
        
        if (isEmpty(searchTerm)) {
            alert('Please enter search term');
            return;
        }
        
        // Fetch all doctors and filter locally
        const response = await fetch(`${API_URL}/doctors`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        // Search in name and specialization
        const doctor = result.data.find(d => 
            d.id.toString() === searchTerm || 
            d.name.toLowerCase().includes(searchTerm) ||
            d.specialization.toLowerCase().includes(searchTerm)
        );
        
        const resultDiv = document.getElementById('searchDoctorResult');
        resultDiv.innerHTML = ''; // Clear previous results
        
        if (doctor) {
            resultDiv.innerHTML = `
                <div class="search-result-box">
                    <p><strong>Doctor ID:</strong> ${doctor.id}</p>
                    <p><strong>Name:</strong> ${doctor.name}</p>
                    <p><strong>Age:</strong> ${doctor.age}</p>
                    <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                    <p><strong>Consultation Fees:</strong> ₹${doctor.fees}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = '<p>No doctor found matching your search</p>';
        }
    } catch (error) {
        console.error('Error searching doctor:', error);
        alert('Error: ' + error.message);
    }
}

/* ============================================
   PATIENT MANAGEMENT FUNCTIONS
   All functions related to patient operations
   ============================================ */

/**
 * Display all patients in the table
 * Gets data from backend API instead of local array
 */
async function displayPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        const patients = result.data;
        let tableBody = document.getElementById('patientsTableBody');
        
        if (!tableBody) return; // Not on patients page
        
        tableBody.innerHTML = ''; // Clear the table first
        
        // If no patients, show message
        if (patients.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No patients found</td></tr>';
            return;
        }
        
        // Loop through all patients and add them to the table
        patients.forEach(patient => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.disease}</td>
                <td>${patient.initialBill}</td>
                <td>
                    <button class="btn-delete" onclick="deletePatient(${patient.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying patients:', error);
        alert('Error loading patients: ' + error.message);
    }
}

/**
 * Add a new patient via API
 * Called when "Add Patient" form is submitted
 */
async function addNewPatient(event) {
    event.preventDefault(); // Stop form from refreshing the page
    
    try {
        // Get values from form
        const patientName = document.getElementById('patientName').value;
        const patientAge = document.getElementById('patientAge').value;
        const patientDisease = document.getElementById('patientDisease').value;
        const patientBill = document.getElementById('patientInitialBill').value;
        
        // Validate inputs
        if (isEmpty(patientName) || isEmpty(patientAge) || isEmpty(patientDisease) || isEmpty(patientBill)) {
            alert('Please fill all fields');
            return;
        }
        
        // Send POST request to backend API
        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: patientName,
                age: parseInt(patientAge),
                disease: patientDisease,
                initialBill: parseInt(patientBill)
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Patient added successfully!', 'success');
            clearForm('addPatientForm');
            displayPatients(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error adding patient:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Delete a patient via API
 * @param {number} patientId - ID of patient to delete
 */
async function deletePatient(patientId) {
    // Ask user for confirmation
    const confirmDelete = confirm('Are you sure you want to delete this patient?');
    
    if (!confirmDelete) return;
    
    try {
        // Send DELETE request to backend API
        const response = await fetch(`${API_URL}/patients/${patientId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Patient deleted successfully!', 'success');
            displayPatients(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Search for a patient by ID or name
 * Filters results on frontend
 */
async function searchPatient() {
    try {
        const searchTerm = document.getElementById('searchPatientId').value.toLowerCase();
        
        if (isEmpty(searchTerm)) {
            alert('Please enter search term');
            return;
        }
        
        // Fetch all patients and filter locally
        const response = await fetch(`${API_URL}/patients`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        // Search in ID and name
        const patient = result.data.find(p => 
            p.id.toString() === searchTerm || 
            p.name.toLowerCase().includes(searchTerm)
        );
        
        const resultDiv = document.getElementById('searchPatientResult');
        resultDiv.innerHTML = ''; // Clear previous results
        
        if (patient) {
            resultDiv.innerHTML = `
                <div class="search-result-box">
                    <p><strong>Patient ID:</strong> ${patient.id}</p>
                    <p><strong>Name:</strong> ${patient.name}</p>
                    <p><strong>Age:</strong> ${patient.age}</p>
                    <p><strong>Disease:</strong> ${patient.disease}</p>
                    <p><strong>Initial Bill:</strong> ₹${patient.initialBill}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = '<p>No patient found matching your search</p>';
        }
    } catch (error) {
        console.error('Error searching patient:', error);
        alert('Error: ' + error.message);
    }
}

/* ============================================
   APPOINTMENT MANAGEMENT FUNCTIONS
   All functions related to appointment operations
   ============================================ */

/**
 * Display all appointments in the table
 * Gets data from backend API
 */
async function displayAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        const appointments = result.data;
        let tableBody = document.getElementById('appointmentsTableBody');
        
        if (!tableBody) return; // Not on appointments page
        
        tableBody.innerHTML = ''; // Clear the table first
        
        // If no appointments, show message
        if (appointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No appointments found</td></tr>';
            return;
        }
        
        // Loop through all appointments and add them to the table
        appointments.forEach(appointment => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.date}</td>
                <td>
                    <button class="btn-delete" onclick="deleteAppointment(${appointment.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying appointments:', error);
        alert('Error loading appointments: ' + error.message);
    }
}

/**
 * Book a new appointment via API
 * Called when "Book Appointment" form is submitted
 */
async function bookAppointment(event) {
    event.preventDefault(); // Stop form from refreshing the page
    
    try {
        // Get values from form
        const patientId = document.getElementById('appointmentPatientId').value;
        const doctorId = document.getElementById('appointmentDoctorId').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        
        // Validate inputs
        if (isEmpty(patientId) || isEmpty(doctorId) || isEmpty(appointmentDate)) {
            alert('Please fill all fields');
            return;
        }
        
        // Send POST request to backend API
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                date: appointmentDate
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Appointment booked successfully!', 'success');
            clearForm('bookAppointmentForm');
            displayAppointments(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Delete an appointment via API
 * @param {number} appointmentId - ID of appointment to delete
 */
async function deleteAppointment(appointmentId) {
    // Ask user for confirmation
    const confirmDelete = confirm('Are you sure you want to delete this appointment?');
    
    if (!confirmDelete) return;
    
    try {
        // Send DELETE request to backend API
        const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Appointment deleted successfully!', 'success');
            displayAppointments(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/* ============================================
   BILLING MANAGEMENT FUNCTIONS
   All functions related to billing operations
   ============================================ */

/**
 * Display all bills in the table
 * Gets data from backend API
 */
async function displayBills() {
    try {
        const response = await fetch(`${API_URL}/bills`);
        const result = await response.json();
        
        if (!result.success) {
            alert('Error: ' + result.message);
            return;
        }
        
        const bills = result.data;
        let tableBody = document.getElementById('billsTableBody');
        
        if (!tableBody) return; // Not on billing page
        
        tableBody.innerHTML = ''; // Clear the table first
        
        // If no bills, show message
        if (bills.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No bills found</td></tr>';
            return;
        }
        
        // Loop through all bills and add them to the table
        bills.forEach(bill => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.id}</td>
                <td>${bill.patientName}</td>
                <td>${bill.doctorName}</td>
                <td>₹${bill.medicineCost}</td>
                <td>₹${bill.consultationFee}</td>
                <td><strong>₹${bill.total}</strong></td>
                <td>
                    <button class="btn-delete" onclick="deleteBill(${bill.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying bills:', error);
        alert('Error loading bills: ' + error.message);
    }
}

/**
 * Generate a new bill via API
 * Called when "Generate Bill" form is submitted
 */
async function generateBill(event) {
    event.preventDefault(); // Stop form from refreshing the page
    
    try {
        // Get values from form
        const patientId = document.getElementById('billPatientId').value;
        const doctorId = document.getElementById('billDoctorId').value;
        const medicineCost = document.getElementById('billMedicineCost').value;
        const consultationFee = document.getElementById('billConsultationFee').value;
        
        // Validate inputs
        if (isEmpty(patientId) || isEmpty(doctorId) || isEmpty(medicineCost) || isEmpty(consultationFee)) {
            alert('Please fill all fields');
            return;
        }
        
        // Send POST request to backend API
        const response = await fetch(`${API_URL}/bills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                medicineCost: parseInt(medicineCost),
                consultationFee: parseInt(consultationFee)
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const bill = result.data;
            showMessage(`Bill generated! Total: ₹${bill.total}`, 'success');
            clearForm('generateBillForm');
            displayBills(); // Refresh the table
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error generating bill:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Delete a bill (if supported by backend)
 * @param {number} billId - ID of bill to delete
 */
async function deleteBill(billId) {
    // Ask user for confirmation
    const confirmDelete = confirm('Are you sure you want to delete this bill?');
    
    if (!confirmDelete) return;
    
    try {
        // Send DELETE request to backend API
        const response = await fetch(`${API_URL}/bills/${billId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Bill deleted successfully!', 'success');
            displayBills(); // Refresh the table
        } else {
            // If delete not supported, show error
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Note: Bill deletion may not be supported in this system');
    }
}

/**
 * Compare bills between two patients
 * Shows total bills for each patient
 */
async function compareBills() {
    try {
        const patientA = document.getElementById('comparePatientA').value;
        const patientB = document.getElementById('comparePatientB').value;
        
        if (isEmpty(patientA) || isEmpty(patientB)) {
            alert('Please select both patients');
            return;
        }
        
        if (patientA === patientB) {
            alert('Please select two different patients');
            return;
        }
        
        // Send GET request to backend API
        const response = await fetch(`${API_URL}/bills/compare/${patientA}/${patientB}`);
        const result = await response.json();
        
        if (result.success) {
            const comparisonDiv = document.getElementById('comparisonResult');
            const dataA = result.data.patientA;
            const dataB = result.data.patientB;
            
            comparisonDiv.innerHTML = `
                <div class="comparison-box">
                    <div class="comparison-item">
                        <h4>${dataA.name}</h4>
                        <p>Total Bills: ₹${dataA.totalBill}</p>
                        <p>Number of Bills: ${dataA.billCount}</p>
                    </div>
                    <div class="comparison-item">
                        <h4>${dataB.name}</h4>
                        <p>Total Bills: ₹${dataB.totalBill}</p>
                        <p>Number of Bills: ${dataB.billCount}</p>
                    </div>
                </div>
            `;
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error comparing bills:', error);
        alert('Error: ' + error.message);
    }
}

/* ============================================
   PAGE LOAD INITIALIZATION
   Initialize data when page loads
   ============================================ */

// When the page loads, fetch data from backend
window.addEventListener('load', function() {
    console.log('Page loaded, initializing data from API...');
    
    // Load dashboard stats if on home page
    if (document.getElementById('totalDoctorsCard')) {
        loadDashboardStats();
    }
    
    // Load doctors if on doctors page
    if (document.getElementById('doctorsTableBody')) {
        displayDoctors();
    }
    
    // Load patients if on patients page
    if (document.getElementById('patientsTableBody')) {
        displayPatients();
    }
    
    // Load appointments if on appointments page
    if (document.getElementById('appointmentsTableBody')) {
        displayAppointments();
    }
    
    // Load bills if on billing page
    if (document.getElementById('billsTableBody')) {
        displayBills();
    }
});
