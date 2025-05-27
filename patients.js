// Get patients from localStorage
function getPatients() {
    return JSON.parse(localStorage.getItem('registeredPatients')) || [];
}

// DOM Elements
const tableBody = document.getElementById('patientsTableBody');
const labResultsModal = document.getElementById('labResultsModal');
const labResults = document.getElementById('labResults');
const closeModal = document.querySelector('.close-btn');
const userName = document.getElementById('userName');

// Set user name from session storage
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (currentUser) {
    userName.textContent = currentUser.name || 'User';
}

// Handle navigation items
document.querySelectorAll('[data-tab]').forEach(item => {
    item.addEventListener('click', function() {
        const tab = this.getAttribute('data-tab');
        alert(`${tab} functionality will be implemented soon.`);
    });
});

// Handle profile item
document.getElementById('profileItem').addEventListener('click', function() {
    alert('Profile functionality will be implemented soon.');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPatients();
});

// Load patients from localStorage
function loadPatients() {
    const patients = getPatients();
    renderPatients(patients);
}

// Render patients table
function renderPatients(patients) {
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';
    
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.visitNumber}</td>
            <td>${patient.firstName} ${patient.lastName}</td>
            <td>${patient.ageValue} ${patient.ageUnit}</td>
            <td>${patient.gender}</td>
            <td>GH₵${patient.totalCost.toFixed(2)}</td>
            <td>
                <span class="status-badge ${patient.labOrders.length > 0 ? 'completed' : 'pending'}">
                    ${patient.labOrders.length > 0 ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewLabResults('${patient.visitNumber}')" class="view-btn" title="View Lab Results">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editPatient('${patient.visitNumber}')" class="edit-btn" title="Edit Patient">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="printPatient('${patient.visitNumber}')" class="print-btn" title="Print Patient Details">
                        <i class="fas fa-print"></i>
                    </button>
                    <button onclick="deletePatient('${patient.visitNumber}')" class="delete-btn" title="Delete Patient">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View lab results
function viewLabResults(visitNo) {
    const patients = getPatients();
    const patient = patients.find(p => p.visitNumber === visitNo);
    if (patient) {
        // Update patient info
        document.getElementById('resultPatientName').textContent = `${patient.firstName} ${patient.lastName}`;
        document.getElementById('resultVisitNumber').textContent = patient.visitNumber;
        document.getElementById('resultSex').textContent = patient.gender;
        
        // Generate test panels
        const testPanelsContainer = document.getElementById('testPanelsContainer');
        testPanelsContainer.innerHTML = '';

        if (patient.labOrders.length > 0) {
            let totalAnalytes = 0;
            patient.labOrders.forEach(order => {
                const panel = createTestPanel(order);
                testPanelsContainer.appendChild(panel);
                totalAnalytes += getAnalytesCount(order.testName);
            });
            document.getElementById('resultTestCount').textContent = totalAnalytes;
        } else {
            testPanelsContainer.innerHTML = '<p class="no-results">Pending lab results</p>';
            document.getElementById('resultTestCount').textContent = '0';
        }

        labResultsModal.style.display = 'block';
    }
}

// Create test panel element
function createTestPanel(order) {
    const panel = document.createElement('div');
    panel.className = 'test-panel';
    
    const analytes = getTestAnalytes(order.testName);
    const panelHtml = `
        <div class="panel-header">
            <div>
                <input type="checkbox" class="panel-checkbox" data-panel="${order.testName}">
                <span class="panel-title">${order.testName}</span>
            </div>
        </div>
        <table class="panel-table">
            <thead>
                <tr>
                    <th>Analyte</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th>Flag</th>
                </tr>
            </thead>
            <tbody>
                ${analytes.map(analyte => `
                    <tr>
                        <td>${analyte.name}</td>
                        <td>${analyte.result || 'Pending'}</td>
                        <td>${analyte.unit || '-'}</td>
                        <td>${analyte.referenceRange || '-'}</td>
                        <td class="${analyte.flag ? `flag-${analyte.flag.toLowerCase()}` : ''}">${analyte.flag || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    panel.innerHTML = panelHtml;
    return panel;
}

// Get test analytes with sample data
function getTestAnalytes(testName) {
    const analytes = {
        'Lipid Profile': [
            { name: 'Total Cholesterol', result: '180', unit: 'mg/dL', referenceRange: '< 200', flag: '' },
            { name: 'HDL Cholesterol', result: '55', unit: 'mg/dL', referenceRange: '> 40', flag: '' },
            { name: 'LDL Cholesterol', result: '100', unit: 'mg/dL', referenceRange: '< 100', flag: '' },
            { name: 'Triglycerides', result: '150', unit: 'mg/dL', referenceRange: '< 150', flag: '' }
        ],
        'Full Blood Count': [
            { name: 'White Blood Cells', result: '7.5', unit: 'x10^9/L', referenceRange: '4.5-11.0', flag: '' },
            { name: 'Red Blood Cells', result: '4.8', unit: 'x10^12/L', referenceRange: '4.5-5.5', flag: '' },
            { name: 'Hemoglobin', result: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', flag: '' },
            { name: 'Platelets', result: '250', unit: 'x10^9/L', referenceRange: '150-450', flag: '' }
        ],
        'Liver Function Test': [
            { name: 'ALT', result: '25', unit: 'U/L', referenceRange: '7-56', flag: '' },
            { name: 'AST', result: '28', unit: 'U/L', referenceRange: '10-40', flag: '' },
            { name: 'ALP', result: '70', unit: 'U/L', referenceRange: '44-147', flag: '' },
            { name: 'Bilirubin', result: '0.8', unit: 'mg/dL', referenceRange: '0.1-1.2', flag: '' }
        ]
    };
    return analytes[testName] || [{ name: 'Test', result: 'Pending', unit: '-', referenceRange: '-', flag: '' }];
}

// Get number of analytes for a test
function getAnalytesCount(testName) {
    return getTestAnalytes(testName).length;
}

// Select All functionality
document.getElementById('selectAllPanels').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.panel-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

// Print Selected functionality
document.getElementById('printSelected').addEventListener('click', function() {
    const selectedPanels = document.querySelectorAll('.panel-checkbox:checked');
    if (selectedPanels.length === 0) {
        alert('Please select at least one test panel to print.');
        return;
    }

    const printWindow = window.open('', '_blank');
    const patientName = document.getElementById('resultPatientName').textContent;
    const visitNumber = document.getElementById('resultVisitNumber').textContent;
    const sex = document.getElementById('resultSex').textContent;

    printWindow.document.write(`
        <html>
            <head>
                <title>Lab Results - ${patientName}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 20px; }
                    .header { margin-bottom: 20px; }
                    .header p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                    th { background: #f8fafc; }
                    .flag-high { color: #dc2626; }
                    .flag-low { color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Lab Results</h2>
                    <p><strong>Patient Name:</strong> ${patientName}</p>
                    <p><strong>Visit Number:</strong> ${visitNumber}</p>
                    <p><strong>Sex:</strong> ${sex}</p>
                </div>
                ${Array.from(selectedPanels).map(checkbox => {
                    const panel = checkbox.closest('.test-panel');
                    return panel.innerHTML;
                }).join('')}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
});

// Edit patient (placeholder)
function editPatient(visitNo) {
    alert(`Edit functionality for patient ${visitNo} will be implemented soon.`);
}

// Print patient (placeholder)
function printPatient(visitNo) {
    alert(`Print functionality for patient ${visitNo} will be implemented soon.`);
}

// Delete patient
function deletePatient(visitNo) {
    if (confirm('Are you sure you want to delete this patient?')) {
        const patients = getPatients();
        const updatedPatients = patients.filter(p => p.visitNumber !== visitNo);
        localStorage.setItem('registeredPatients', JSON.stringify(updatedPatients));
        loadPatients();
    }
}

// Close modal when clicking the close button or outside the modal
closeModal.addEventListener('click', () => {
    labResultsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === labResultsModal) {
        labResultsModal.style.display = 'none';
    }
});

// Session Timer
function ensureSessionTimerElement() {
    let timer = document.getElementById('sessionTimer');
    if (!timer) {
        console.log('Timer element not found, creating one...');
        timer = document.createElement('div');
        timer.id = 'sessionTimer';
        timer.className = 'session-timer';
        timer.textContent = 'Session: 00:00:00';
        document.body.insertBefore(timer, document.body.firstChild);
    }
    return timer;
}

// Initialize timer
function initializeTimer() {
    console.log('Initializing timer...');
    let startTime;
    const storedStartTime = sessionStorage.getItem('sessionStartTime');
    
    if (storedStartTime) {
        console.log('Found stored start time:', storedStartTime);
        startTime = new Date(storedStartTime);
    } else {
        console.log('No stored start time, creating new one');
        startTime = new Date();
        sessionStorage.setItem('sessionStartTime', startTime.toISOString());
    }

    function updateTimer() {
        const timerElem = ensureSessionTimerElement();
        let currentTime = new Date();
        let timeDiff = currentTime - startTime;
        let hours = Math.floor(timeDiff / (1000 * 60 * 60));
        let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        timerElem.textContent = `Session: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Start the timer
    console.log('Starting timer interval...');
    setInterval(updateTimer, 1000);
    updateTimer(); // Initial update
}

// Initialize timer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTimer);

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Handle logout
document.getElementById('logoutItem').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionStartTime'); // Reset session timer
    window.location.href = 'index.html';
}); 
