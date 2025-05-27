// Initialize variables
let patients = [];
let currentSort = { column: null, direction: 'asc' };

// DOM Elements
const patientSearch = document.getElementById('patientSearch');
const dateFilter = document.getElementById('dateFilter');
const paymentMethodFilter = document.getElementById('paymentMethodFilter');
const genderFilter = document.getElementById('genderFilter');
const ageGroupFilter = document.getElementById('ageGroupFilter');
const dateRangePicker = document.getElementById('dateRangePicker');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const statisticsPanel = document.getElementById('statisticsPanel');
const registeredPatientsTable = document.getElementById('registeredPatientsTable');

// Load patients from localStorage
function loadPatients() {
    const storedPatients = localStorage.getItem('registeredPatients');
    if (storedPatients) {
        patients = JSON.parse(storedPatients);
        updatePatientsTable();
        updateStatistics();
    }
}

// Update patients table
function updatePatientsTable(filteredPatients = patients) {
    const tbody = registeredPatientsTable.querySelector('tbody');
    tbody.innerHTML = '';

    filteredPatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.visitNumber}</td>
            <td>${patient.sampleId}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${formatDate(patient.registrationDate)}</td>
            <td>${patient.paymentMethod}</td>
            <td>GH₵${patient.totalCost.toFixed(2)}</td>
            <td>
                <button class="action-btn view-btn" data-id="${patient.id}">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => showPatientDetails(btn.dataset.id));
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GH', options);
}

// Filter patients
function filterPatients() {
    let filtered = [...patients];

    // Search filter
    const searchTerm = patientSearch.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.visitNumber.toLowerCase().includes(searchTerm) ||
            patient.sampleId.toLowerCase().includes(searchTerm)
        );
    }

    // Date filter
    const dateFilterValue = dateFilter.value;
    if (dateFilterValue !== 'all') {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        
        filtered = filtered.filter(patient => {
            const patientDate = new Date(patient.registrationDate);
            switch (dateFilterValue) {
                case 'today':
                    return patientDate >= startOfDay;
                case 'week':
                    const weekAgo = new Date(startOfDay);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return patientDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(startOfDay);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return patientDate >= monthAgo;
                case 'year':
                    const yearAgo = new Date(startOfDay);
                    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                    return patientDate >= yearAgo;
                case 'custom':
                    if (startDate.value && endDate.value) {
                        const start = new Date(startDate.value);
                        const end = new Date(endDate.value);
                        end.setHours(23, 59, 59, 999);
                        return patientDate >= start && patientDate <= end;
                    }
                    return true;
                default:
                    return true;
            }
        });
    }

    // Payment method filter
    const paymentMethod = paymentMethodFilter.value;
    if (paymentMethod !== 'all') {
        filtered = filtered.filter(patient => patient.paymentMethod === paymentMethod);
    }

    // Gender filter
    const gender = genderFilter.value;
    if (gender !== 'all') {
        filtered = filtered.filter(patient => patient.gender === gender);
    }

    // Age group filter
    const ageGroup = ageGroupFilter.value;
    if (ageGroup !== 'all') {
        filtered = filtered.filter(patient => {
            const age = parseInt(patient.age);
            switch (ageGroup) {
                case 'child': return age <= 12;
                case 'teen': return age > 12 && age <= 19;
                case 'adult': return age > 19 && age <= 59;
                case 'senior': return age >= 60;
                default: return true;
            }
        });
    }

    updatePatientsTable(filtered);
}

// Sort patients
function sortPatients(column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    patients.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (column === 'registrationDate') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        } else if (column === 'totalCost') {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
        }

        if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    updatePatientsTable();
}

// Update statistics
function updateStatistics() {
    const totalPatients = patients.length;
    const totalRevenue = patients.reduce((sum, patient) => sum + patient.totalCost, 0);
    const averageAge = patients.reduce((sum, patient) => sum + parseInt(patient.age), 0) / totalPatients || 0;

    // Gender distribution
    const genderCounts = patients.reduce((acc, patient) => {
        acc[patient.gender] = (acc[patient.gender] || 0) + 1;
        return acc;
    }, {});

    // Payment method distribution
    const paymentCounts = patients.reduce((acc, patient) => {
        acc[patient.paymentMethod] = (acc[patient.paymentMethod] || 0) + 1;
        return acc;
    }, {});

    // Age distribution
    const ageGroups = {
        child: 0,
        teen: 0,
        adult: 0,
        senior: 0
    };

    patients.forEach(patient => {
        const age = parseInt(patient.age);
        if (age <= 12) ageGroups.child++;
        else if (age <= 19) ageGroups.teen++;
        else if (age <= 59) ageGroups.adult++;
        else ageGroups.senior++;
    });

    // Update statistics display
    document.getElementById('totalPatientsCount').textContent = totalPatients;
    document.getElementById('totalRevenue').textContent = `GH₵${totalRevenue.toFixed(2)}`;
    document.getElementById('averageAge').textContent = averageAge.toFixed(1);

    // Update distribution displays
    document.getElementById('genderDistribution').innerHTML = Object.entries(genderCounts)
        .map(([gender, count]) => `<p>${gender}: ${count}</p>`)
        .join('');

    document.getElementById('paymentMethodsDistribution').innerHTML = Object.entries(paymentCounts)
        .map(([method, count]) => `<p>${method}: ${count}</p>`)
        .join('');

    document.getElementById('ageDistribution').innerHTML = Object.entries(ageGroups)
        .map(([group, count]) => `<p>${group}: ${count}</p>`)
        .join('');
}

// Show patient details
function showPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Update patient details modal
    document.getElementById('patientDetailsPersonal').innerHTML = `
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Age:</strong> ${patient.age}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Visit Number:</strong> ${patient.visitNumber}</p>
        <p><strong>Sample ID:</strong> ${patient.sampleId}</p>
        <p><strong>Registration Date:</strong> ${formatDate(patient.registrationDate)}</p>
    `;

    document.getElementById('patientDetailsLabOrders').innerHTML = patient.labOrders
        .map(order => `
            <div class="lab-order-item">
                <p><strong>Test:</strong> ${order.testName}</p>
                <p><strong>Cost:</strong> GH₵${order.cost.toFixed(2)}</p>
            </div>
        `)
        .join('');

    document.getElementById('patientDetailsFinancial').innerHTML = `
        <p><strong>Payment Method:</strong> ${patient.paymentMethod}</p>
        <p><strong>Total Cost:</strong> GH₵${patient.totalCost.toFixed(2)}</p>
    `;

    // Show modal
    document.getElementById('patientDetailsModal').style.display = 'block';
}

// Export to CSV
function exportToCSV() {
    const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
    const csvContent = [
        headers.join(','),
        ...patients.map(patient => [
            patient.visitNumber,
            patient.sampleId,
            patient.name,
            patient.age,
            patient.gender,
            formatDate(patient.registrationDate),
            patient.paymentMethod,
            patient.totalCost
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registered_patients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load and display patients
    loadPatients();

    // Search functionality
    const searchInput = document.querySelector('.search-input input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const patients = document.querySelectorAll('.patient-item');
            
            patients.forEach(patient => {
                const patientName = patient.querySelector('.patient-name').textContent.toLowerCase();
                const patientId = patient.querySelector('.patient-id').textContent.toLowerCase();
                
                if (patientName.includes(searchTerm) || patientId.includes(searchTerm)) {
                    patient.style.display = 'flex';
                } else {
                    patient.style.display = 'none';
                }
            });
        });
    }

    // Export to CSV functionality
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }

    // Show statistics functionality
    const statsBtn = document.querySelector('.stats-btn');
    if (statsBtn) {
        statsBtn.addEventListener('click', showStatistics);
    }
});

function loadPatients() {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patientsList = document.querySelector('.patients-list');
    
    if (patientsList) {
        patientsList.innerHTML = '';
        
        if (patients.length === 0) {
            patientsList.innerHTML = '<p class="no-patients">No patients registered yet.</p>';
            return;
        }
        
        patients.forEach(patient => {
            const patientElement = createPatientElement(patient);
            patientsList.appendChild(patientElement);
        });
    }
}

function createPatientElement(patient) {
    const div = document.createElement('div');
    div.className = 'patient-item';
    
    div.innerHTML = `
        <div class="patient-info">
            <h3 class="patient-name">${patient.name}</h3>
            <p class="patient-id">ID: ${patient.id}</p>
            <p class="patient-age">Age: ${patient.age}</p>
            <p class="patient-gender">Gender: ${patient.gender}</p>
        </div>
        <div class="patient-actions">
            <button class="view-btn" onclick="viewPatient('${patient.id}')">View</button>
            <button class="edit-btn" onclick="editPatient('${patient.id}')">Edit</button>
            <button class="delete-btn" onclick="deletePatient('${patient.id}')">Delete</button>
        </div>
    `;
    
    return div;
}

function viewPatient(id) {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patient = patients.find(p => p.id === id);
    
    if (patient) {
        // Implement view patient details functionality
        alert(`Viewing patient: ${patient.name}`);
    }
}

function editPatient(id) {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patient = patients.find(p => p.id === id);
    
    if (patient) {
        // Implement edit patient functionality
        alert(`Editing patient: ${patient.name}`);
    }
}

function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const updatedPatients = patients.filter(p => p.id !== id);
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        loadPatients();
    }
}

function showStatistics() {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    if (patients.length === 0) {
        alert('No patients to show statistics for.');
        return;
    }
    
    const totalPatients = patients.length;
    const genderStats = patients.reduce((acc, patient) => {
        acc[patient.gender] = (acc[patient.gender] || 0) + 1;
        return acc;
    }, {});
    
    const ageGroups = {
        '0-18': 0,
        '19-30': 0,
        '31-50': 0,
        '51+': 0
    };
    
    patients.forEach(patient => {
        const age = parseInt(patient.age);
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else ageGroups['51+']++;
    });
    
    const statsMessage = `
        Total Patients: ${totalPatients}
        
        Gender Distribution:
        Male: ${genderStats.Male || 0}
        Female: ${genderStats.Female || 0}
        
        Age Distribution:
        0-18: ${ageGroups['0-18']}
        19-30: ${ageGroups['19-30']}
        31-50: ${ageGroups['31-50']}
        51+: ${ageGroups['51+']}
    `;
    
    alert(statsMessage);
}

// Filters
dateFilter.addEventListener('change', () => {
    dateRangePicker.style.display = dateFilter.value === 'custom' ? 'block' : 'none';
    filterPatients();
});

paymentMethodFilter.addEventListener('change', filterPatients);
genderFilter.addEventListener('change', filterPatients);
ageGroupFilter.addEventListener('change', filterPatients);

// Date range
document.getElementById('applyDateRange').addEventListener('click', filterPatients);
document.getElementById('cancelDateRange').addEventListener('click', () => {
    dateRangePicker.style.display = 'none';
    dateFilter.value = 'all';
    filterPatients();
});

// Sort
document.querySelectorAll('.sort-icon').forEach(icon => {
    icon.addEventListener('click', () => sortPatients(icon.dataset.sort));
});

// Statistics
document.getElementById('showStatistics').addEventListener('click', () => {
    statisticsPanel.style.display = statisticsPanel.style.display === 'none' ? 'block' : 'none';
});

// Export
document.getElementById('exportToCSV').addEventListener('click', exportToCSV);

// Modal close buttons
document.getElementById('closePatientDetails').addEventListener('click', () => {
    document.getElementById('patientDetailsModal').style.display = 'none';
});

document.getElementById('closePatientDetailsBtn').addEventListener('click', () => {
    document.getElementById('patientDetailsModal').style.display = 'none';
});

// Print buttons
document.getElementById('printPatientBill').addEventListener('click', () => {
    // Implement bill printing
});

document.getElementById('printPatientInvoice').addEventListener('click', () => {
    // Implement invoice printing
});

// Session and user management
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
    return;
}

// Display user name
const userNameElement = document.getElementById('userName');
if (userNameElement) {
    userNameElement.textContent = currentUser.name;
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
}
