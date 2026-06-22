/* ============================================
   DUMMY DATA ARRAYS
   These arrays store all the data for the system
   ============================================ */

// Array to store all doctors
let doctorsArray = [
    {
        id: 'D001',
        name: 'Dr. Rajesh Kumar',
        age: 45,
        specialization: 'Cardiologist',
        fees: 500
    },
    {
        id: 'D002',
        name: 'Dr. Priya Singh',
        age: 38,
        specialization: 'Pediatrician',
        fees: 400
    },
    {
        id: 'D003',
        name: 'Dr. Amit Patel',
        age: 42,
        specialization: 'Orthopedic',
        fees: 450
    }
];

// Array to store all patients
let patientsArray = [
    {
        id: 'P001',
        name: 'Rohan Singh',
        age: 35,
        disease: 'Fever',
        initialBill: 1000
    },
    {
        id: 'P002',
        name: 'Zara Khan',
        age: 28,
        disease: 'Cough',
        initialBill: 800
    },
    {
        id: 'P003',
        name: 'Arjun Verma',
        age: 50,
        disease: 'Heart Problem',
        initialBill: 5000
    }
];

// Array to store all appointments
let appointmentsArray = [
    {
        id: 'A001',
        patientId: 'P001',
        doctorId: 'D001',
        date: '2024-07-15'
    },
    {
        id: 'A002',
        patientId: 'P002',
        doctorId: 'D002',
        date: '2024-07-16'
    }
];

// Array to store all bills
let billsArray = [
    {
        id: 'B001',
        patientId: 'P001',
        doctorId: 'D001',
        medicineCost: 300,
        consultationFee: 500,
        total: 800
    },
    {
        id: 'B002',
        patientId: 'P002',
        doctorId: 'D002',
        medicineCost: 200,
        consultationFee: 400,
        total: 600
    }
];

/* ============================================
   HELPER FUNCTIONS
   Common functions used across all pages
   ============================================ */

// Function to show alert messages (not used here but good to have)
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

// Function to check if an ID already exists
function doesIdExist(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return true;
        }
    }
    return false;
}

// Function to find an object by ID in an array
function findById(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return array[i];
        }
    }
    return null;
}

// Function to get the index of an object by ID
function getIndexById(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
    return -1;
}
