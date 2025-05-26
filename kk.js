const availableTests = [
    { name: "Complete Blood Count (CBC)", cost: 45.00 },
    { name: "Lipid Panel", cost: 60.00 },
    { name: "Urinalysis", cost: 30.00 },
    { name: "Thyroid Function Test", cost: 75.00 },
    { name: "Blood Glucose Test", cost: 25.00 }
];

function populateTestNames() {
    const testNamesDatalist = document.getElementById('testNames');
    testNamesDatalist.innerHTML = '';
    availableTests.forEach(test => {
        const option = document.createElement('option');
        option.value = test.name;
        testNamesDatalist.appendChild(option);
    });
}

function calculateTotalLabCost() {
    return labOrders.reduce((total, order) => total + order.cost, 0);
}

function formatAge(ageValue, ageUnit) {
    return `${ageValue} ${ageUnit.charAt(0).toUpperCase() + ageUnit.slice(1)}`;
}

function escapeLatex(str) {
    return str.replace(/([&%$#_{}])/g, '\\$1')
             .replace(/\\/g, '\\textbackslash')
             .replace(/~/g, '\\textasciitilde')
             .replace(/\^/g, '\\textasciicircum');
}

function generateBillLatex(patientData, financialData, totalCost) {
    const age = formatAge(patientData.ageValue, patientData.ageUnit);
    const gender = patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1);
    const date = new Date().toLocaleString('en-GB', { timeZone: 'GMT', hour12: false, hour: '2-digit', minute: '2-digit' });
    const paymentDetails = financialData.paymentMethod === 'momo' ? `Mobile Money (Phone: ${financialData.momoPhone})` :
                          financialData.paymentMethod === 'insurance' ? `Insurance (ID: ${financialData.insuranceId})` :
                          financialData.paymentMethod === 'cheque' ? `Cheque (Number: ${financialData.chequeNumber})` :
                          `Credit Card (Ending: ${financialData.creditCardNumber.slice(-4)})`;
    return `
% Setting up the document class and essential packages
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{fancyhdr}
\\usepackage{lastpage}
\\usepackage{enumitem}

% Configuring page geometry
\\geometry{margin=1in}

% Setting up the header and footer
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{MediCare Hospital}}
\\fancyhead[R]{Bill}
\\fancyfoot[C]{Page \\thepage\\ of \\pageref{LastPage}}

% Removing default page number
\\pagenumbering{gobble}

% Starting the document
\\begin{document}

% Adding a title
\\begin{center}
\\Large\\textbf{Patient Bill} \\\\
\\vspace{0.5em}
\\normalsize Issued on: ${date}
\\end{center}

\\vspace{1em}

% Patient details section
\\section*{Patient Details}
\\begin{itemize}[leftmargin=*]
\\item \\textbf{Name:} ${escapeLatex(patientData.firstName)} ${escapeLatex(patientData.lastName)}
\\item \\textbf{Age:} ${escapeLatex(age)}
\\item \\textbf{Sex:} ${escapeLatex(gender)}
\\end{itemize}

\\vspace{1em}

% Billing summary section
\\section*{Billing Summary}
\\begin{itemize}[leftmargin=*]
\\item \\textbf{Total Lab Cost:} \\$${totalCost.toFixed(2)}
\\item \\textbf{Payment Method:} ${escapeLatex(paymentDetails)}
\\end{itemize}

\\vspace{1em}

% Footer note
\\begin{center}
\\small Thank you for choosing MediCare Hospital. For inquiries, contact us at (123) 456-7890.
\\end{center}

\\end{document}
    `;
}

function generateInvoiceLatex(patientData, financialData, labOrders, totalCost) {
    const age = formatAge(patientData.ageValue, patientData.ageUnit);
    const gender = patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1);
    const date = new Date().toLocaleString('en-GB', { timeZone: 'GMT', hour12: false, hour: '2-digit', minute: '2-digit' });
    const labTestsRows = labOrders.map(order => 
        `${escapeLatex(order.testName)} & ${order.testDate} & \\$${order.cost.toFixed(2)} \\\\`
    ).join('\n');
    const paymentDetails = financialData.paymentMethod === 'momo' ? `Mobile Money (Phone: ${financialData.momoPhone})` :
                          financialData.paymentMethod === 'insurance' ? `Insurance (ID: ${financialData.insuranceId})` :
                          financialData.paymentMethod === 'cheque' ? `Cheque (Number: ${financialData.chequeNumber})` :
                          `Credit Card (Ending: ${financialData.creditCardNumber.slice(-4)})`;
    return `
% Setting up the document class and essential packages
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{fancyhdr}
\\usepackage{lastpage}
\\usepackage{enumitem}
\\usepackage{booktabs}
\\usepackage{array}

% Configuring page geometry
\\geometry{margin=1in}

% Setting up the header and footer
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{MediCare Hospital}}
\\fancyhead[R]{Invoice}
\\fancyfoot[C]{Page \\thepage\\ of \\pageref{LastPage}}

% Removing default page number
\\pagenumbering{gobble}

% Starting the document
\\begin{document}

% Adding a title
\\begin{center}
\\Large\\textbf{Patient Invoice} \\\\
\\vspace{0.5em}
\\normalsize Invoice Date: ${date}
\\end{center}

\\vspace{1em}

% Patient details section
\\section*{Patient Details}
\\begin{itemize}[leftmargin=*]
\\item \\textbf{Name:} ${escapeLatex(patientData.firstName)} ${escapeLatex(patientData.lastName)}
\\item \\textbf{Age:} ${escapeLatex(age)}
\\item \\textbf{Sex:} ${escapeLatex(gender)}
\\end{itemize}

\\vspace{1em}

% Lab tests section
\\section*{Lab Tests}
\\begin{tabular}{>{\\raggedright\\arraybackslash}p{3in} c c}
\\toprule
\\textbf{Test Name} & \\textbf{Test Date} & \\textbf{Cost} \\\\
\\midrule
${labTestsRows}
\\bottomrule
\\end{tabular}

\\vspace{1em}

% Billing summary section
\\section*{Billing Summary}
\\begin{itemize}[leftmargin=*]
\\item \\textbf{Total Lab Cost:} \\$${totalCost.toFixed(2)}
\\item \\textbf{Payment Method:} ${escapeLatex(paymentDetails)}
\\end{itemize}

\\vspace{1em}

% Footer note
\\begin{center}
\\small Thank you for choosing MediCare Hospital. For inquiries, contact us at (123) 456-7890.
\\end{center}

\\end{document}
    `;
}

document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('collapsed');
});

let startTime = Date.now();
const sessionTimer = document.getElementById('sessionTimer');

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    sessionTimer.textContent = `Session: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
setInterval(updateTimer, 1000);
updateTimer();

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        tabContents.forEach(content => content.classList.remove('active'));
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');

        if (tabId === 'financialInfo') {
            const totalCost = calculateTotalLabCost();
            document.getElementById('billingAmount').value = `$${totalCost.toFixed(2)}`;
        }
    });
});

const patientForm = document.getElementById('patientForm');
const financialForm = document.getElementById('financialForm');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const logoutModal = document.getElementById('logoutModal');
const logoutYes = document.getElementById('logoutYes');
const logoutNo = document.getElementById('logoutNo');
const registrationSummaryModal = document.getElementById('registrationSummaryModal');
const summaryDetails = document.getElementById('summaryDetails');
const printBillBtn = document.getElementById('printBill');
const printInvoiceBtn = document.getElementById('printInvoice');
const editSummary = document.getElementById('editSummary');
const closeSummary = document.getElementById('closeSummary');
const momoPromptModal = document.getElementById('momoPromptModal');
const momoSend = document.getElementById('momoSend');
const momoCancel = document.getElementById('momoCancel');

let currentPatient = { firstName: '', lastName: '' };
let labOrders = [];
let patientData, financialData, totalCost;

function validatePatientForm() {
    const errors = {};
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const ageValue = parseInt(document.getElementById('ageValue').value);
    const gender = document.getElementById('gender').value;

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!ageValue || ageValue <= 0) errors.age = 'Age must be greater than 0';
    if (!gender) errors.gender = 'Gender is required';

    Object.keys(errors).forEach(key => document.getElementById(`${key}Error`).textContent = errors[key] || '');
    if (Object.keys(errors).length === 0) {
        currentPatient.firstName = firstName;
        currentPatient.lastName = lastName;
    }
    return Object.keys(errors).length === 0;
}

function validateLabOrderForm() {
    const errors = {};
    const testName = document.getElementById('modalTestName').value.trim();
    const testDate = document.getElementById('modalTestDate').value;
    const priority = document.getElementById('modalPriority').value;
    const sampleType = document.getElementById('modalSampleType').value;

    if (!testName) errors.modalTestName = 'Test name is required';
    else if (!availableTests.some(test => test.name === testName)) {
        errors.modalTestName = 'Please select a valid test from the list';
    }
    if (!testDate) errors.modalTestDate = 'Test date is required';
    if (!priority) errors.modalPriority = 'Priority is required';
    if (!sampleType) errors.modalSampleType = 'Sample type is required';

    Object.keys(errors).forEach(key => document.getElementById(`${key}Error`).textContent = errors[key] || '');
    return Object.keys(errors).length === 0;
}

function validateMoMo(phone) {
    const phoneRegex = /^\+?\d{10,12}$/;
    return phoneRegex.test(phone) ? '' : 'Invalid phone number (10-12 digits required)';
}

function validateInsuranceId(id) {
    const idRegex = /^[A-Za-z0-9]{10}$/;
    return idRegex.test(id) ? '' : 'Insurance ID must be a 10-character alphanumeric string';
}

function validateChequeNumber(number) {
    const numberRegex = /^\d{6}$/;
    return numberRegex.test(number) ? '' : 'Cheque number must be a 6-digit number';
}

function validateCreditCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) {
        return 'Credit card number must be 16 digits';
    }
    // Luhn Algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0 ? '' : 'Invalid credit card number';
}

function validateFinancialForm() {
    const errors = {};
    const paymentMethod = document.getElementById('paymentMethod').value;
    const receiptNumber = document.getElementById('receiptNumber').value.trim();
    const momoPhone = document.getElementById('momoPhone').value.trim();
    const insuranceId = document.getElementById('insuranceId').value.trim();
    const chequeNumber = document.getElementById('chequeNumber').value.trim();
    const creditCardNumber = document.getElementById('creditCardNumber').value.trim();

    if (!paymentMethod) {
        errors.paymentMethod = 'Payment method is required';
    } else if (!['cash', 'momo', 'insurance', 'cheque', 'creditCard'].includes(paymentMethod)) {
        errors.paymentMethod = 'Invalid payment method';
    }

    if (paymentMethod === 'cash') {
        if (!receiptNumber) {
            errors.receiptNumber = 'Receipt number is required';
        } else {
            const receiptError = validateReceiptNumber(receiptNumber);
            if (receiptError) errors.receiptNumber = receiptError;
        }
    }

    if (paymentMethod === 'momo' && !momoPhone) {
        errors.momoPhone = 'MoMo phone number is required';
    } else if (paymentMethod === 'momo') {
        const momoError = validateMoMo(momoPhone);
        if (momoError) errors.momoPhone = momoError;
    }

    if (paymentMethod === 'insurance' && !insuranceId) {
        errors.insuranceId = 'Insurance ID is required';
    } else if (paymentMethod === 'insurance') {
        const insuranceError = validateInsuranceId(insuranceId);
        if (insuranceError) errors.insuranceId = insuranceError;
    }

    if (paymentMethod === 'cheque' && !chequeNumber) {
        errors.chequeNumber = 'Cheque number is required';
    } else if (paymentMethod === 'cheque') {
        const chequeError = validateChequeNumber(chequeNumber);
        if (chequeError) errors.chequeNumber = chequeError;
    }

    if (paymentMethod === 'creditCard' && !creditCardNumber) {
        errors.creditCardNumber = 'Credit card number is required';
    } else if (paymentMethod === 'creditCard') {
        const cardError = validateCreditCardNumber(creditCardNumber);
        if (cardError) errors.creditCardNumber = cardError;
    }

    Object.keys(errors).forEach(key => document.getElementById(`${key}Error`).textContent = errors[key] || '');
    return Object.keys(errors).length === 0;
}

const labOrdersTableBody = document.querySelector('#labOrdersTable tbody');
const totalOrdersSpan = document.getElementById('totalOrders');
const pendingOrdersSpan = document.getElementById('pendingOrders');
const completedOrdersSpan = document.getElementById('completedOrders');
const labOrdersTitle = document.getElementById('labOrdersTitle');
const labOrderModal = document.getElementById('labOrderModal');
const closeLabOrderModal = document.getElementById('closeLabOrderModal');
const clearLabOrderForm = document.getElementById('clearLabOrderForm');
const saveOrderButton = document.getElementById('saveOrderButton');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteYes = document.getElementById('deleteYes');
const deleteNo = document.getElementById('deleteNo');
const modalTestName = document.getElementById('modalTestName');
const modalCostDisplay = document.getElementById('modalCostDisplay');
const paymentMethodSelect = document.getElementById('paymentMethod');
const momoDetails = document.getElementById('momoDetails');
const insuranceDetails = document.getElementById('insuranceDetails');
const chequeDetails = document.getElementById('chequeDetails');
const creditCardDetails = document.getElementById('creditCardDetails');

let editingIndex = -1;

populateTestNames();

modalTestName.addEventListener('input', () => {
    const selectedTest = availableTests.find(test => test.name === modalTestName.value);
    if (selectedTest) {
        modalCostDisplay.value = `$${selectedTest.cost.toFixed(2)}`;
    } else {
        modalCostDisplay.value = '';
    }
});

paymentMethodSelect.addEventListener('change', () => {
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    cashDetails.classList.remove('active');
    document.getElementById('momoPhoneError').textContent = '';
    document.getElementById('insuranceIdError').textContent = '';
    document.getElementById('chequeNumberError').textContent = '';
    document.getElementById('creditCardNumberError').textContent = '';
    document.getElementById('receiptNumberError').textContent = '';

    const method = paymentMethodSelect.value;
    if (method === 'cash') cashDetails.classList.add('active');
    else if (method === 'momo') momoDetails.classList.add('active');
    else if (method === 'insurance') insuranceDetails.classList.add('active');
    else if (method === 'cheque') chequeDetails.classList.add('active');
    else if (method === 'creditCard') creditCardDetails.classList.add('active');
});

let currentSort = { column: null, direction: 'asc' };
let filteredOrders = [];

function updateLabOrdersTable() {
    labOrdersTableBody.innerHTML = '';
    if (labOrders.length === 0) {
        labOrdersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders available</td></tr>';
    } else {
        // Apply filters
        const searchTerm = document.getElementById('labSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;

        filteredOrders = labOrders.filter(order => {
            const matchesSearch = order.testName.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        // Apply sorting
        if (currentSort.column) {
            filteredOrders.sort((a, b) => {
                let valueA = a[currentSort.column];
                let valueB = b[currentSort.column];
                
                if (currentSort.column === 'cost') {
                    valueA = parseFloat(valueA);
                    valueB = parseFloat(valueB);
                }
                
                if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        filteredOrders.forEach((order, index) => {
            const row = document.createElement('tr');
            const statusClass = order.status === 'Pending' ? 'status-pending' : 'status-completed';
            const priorityClass = order.priority === 'urgent' ? 'priority-urgent' : 'priority-normal';
            
            row.innerHTML = `
                <td data-label="Test Name">${order.testName}</td>
                <td data-label="Test Date">${order.testDate}</td>
                <td data-label="Status">
                    <select class="status-select ${statusClass}" data-index="${index}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td data-label="Priority">
                    <span class="priority-indicator ${priorityClass}">${order.priority}</span>
                </td>
                <td data-label="Sample Type">${order.sampleType}</td>
                <td data-label="Cost of Test">$${order.cost.toFixed(2)}</td>
                <td data-label="Actions" class="actions">
                    <button class="action-btn small view-order" data-index="${index}">View</button>
                    <button class="action-btn small edit-order" data-index="${index}">Edit</button>
                    <button class="action-btn small delete delete-order" data-index="${index}">Delete</button>
                </td>
            `;
            labOrdersTableBody.appendChild(row);
        });

        // Add event listeners for status changes
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const newStatus = e.target.value;
                labOrders[index].status = newStatus;
                labOrders[index].lastUpdated = new Date().toLocaleString();
                e.target.className = `status-select ${newStatus === 'Pending' ? 'status-pending' : 'status-completed'}`;
                updateLabOrdersTable();
            });
        });

        // Add event listeners for view button
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const order = labOrders[index];
                document.getElementById('quickViewTestName').textContent = order.testName;
                document.getElementById('quickViewTestDate').textContent = order.testDate;
                document.getElementById('quickViewPriority').textContent = order.priority;
                document.getElementById('quickViewSampleType').textContent = order.sampleType;
                document.getElementById('quickViewCost').textContent = `$${order.cost.toFixed(2)}`;
                document.getElementById('quickViewStatus').textContent = order.status;
                document.getElementById('quickViewLastUpdated').textContent = order.lastUpdated || 'Not updated';
                document.getElementById('quickViewNotes').value = order.notes || '';
                document.getElementById('quickViewModal').style.display = 'flex';
            });
        });
    }

    const total = labOrders.length;
    const pending = labOrders.filter(order => order.status === 'Pending').length;
    const completed = labOrders.filter(order => order.status === 'Completed').length;
    totalOrdersSpan.textContent = `Total Orders: ${total}`;
    pendingOrdersSpan.textContent = `Pending: ${pending}`;
    completedOrdersSpan.textContent = `Completed: ${completed}`;
}

// Add event listeners for sorting
document.querySelectorAll('.sort-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-sort');
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        updateLabOrdersTable();
    });
});

// Add event listeners for filters
document.getElementById('labSearch').addEventListener('input', updateLabOrdersTable);
document.getElementById('statusFilter').addEventListener('change', updateLabOrdersTable);
document.getElementById('priorityFilter').addEventListener('change', updateLabOrdersTable);

document.getElementById('addNewOrder').addEventListener('click', () => {
    editingIndex = -1;
    document.getElementById('modalTestName').value = '';
    document.getElementById('modalTestDate').value = '';
    document.getElementById('modalPriority').value = 'normal';
    document.getElementById('modalSampleType').value = 'blood';
    document.getElementById('modalCostDisplay').value = '';
    document.getElementById('modalInstructions').value = '';
    Object.keys({ modalTestNameError: 1, modalTestDateError: 1, modalPriorityError: 1, modalSampleTypeError: 1, modalInstructionsError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    document.getElementById('labOrderModalTitle').textContent = 'Add New Lab Order';
    labOrderModal.style.display = 'flex';
});

closeLabOrderModal.addEventListener('click', () => {
    labOrderModal.style.display = 'none';
    document.getElementById('modalTestName').value = '';
    document.getElementById('modalTestDate').value = '';
    document.getElementById('modalPriority').value = 'normal';
    document.getElementById('modalSampleType').value = 'blood';
    document.getElementById('modalCostDisplay').value = '';
    document.getElementById('modalInstructions').value = '';
    Object.keys({ modalTestNameError: 1, modalTestDateError: 1, modalPriorityError: 1, modalSampleTypeError: 1, modalInstructionsError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
});

clearLabOrderForm.addEventListener('click', () => {
    document.getElementById('modalTestName').value = '';
    document.getElementById('modalTestDate').value = '';
    document.getElementById('modalPriority').value = 'normal';
    document.getElementById('modalSampleType').value = 'blood';
    document.getElementById('modalCostDisplay').value = '';
    document.getElementById('modalInstructions').value = '';
    Object.keys({ modalTestNameError: 1, modalTestDateError: 1, modalPriorityError: 1, modalSampleTypeError: 1, modalInstructionsError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
});

saveOrderButton.addEventListener('click', () => {
    if (validateLabOrderForm()) {
        const selectedTest = availableTests.find(test => test.name === document.getElementById('modalTestName').value);
        const order = {
            testName: document.getElementById('modalTestName').value.trim(),
            testDate: document.getElementById('modalTestDate').value,
            priority: document.getElementById('modalPriority').value,
            sampleType: document.getElementById('modalSampleType').value,
            cost: selectedTest.cost,
            instructions: document.getElementById('modalInstructions').value.trim(),
            status: 'Pending',
            notes: '',
            lastUpdated: new Date().toLocaleString()
        };
        if (editingIndex === -1) {
            labOrders.push(order);
        } else {
            labOrders[editingIndex] = order;
            editingIndex = -1;
        }
        updateLabOrdersTable();
        labOrderModal.style.display = 'none';
        document.getElementById('modalTestName').value = '';
        document.getElementById('modalTestDate').value = '';
        document.getElementById('modalPriority').value = 'normal';
        document.getElementById('modalSampleType').value = 'blood';
        document.getElementById('modalCostDisplay').value = '';
        document.getElementById('modalInstructions').value = '';
        Object.keys({ modalTestNameError: 1, modalTestDateError: 1, modalPriorityError: 1, modalSampleTypeError: 1, modalInstructionsError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    }
});

deleteYes.addEventListener('click', () => {
    labOrders.splice(editingIndex, 1);
    updateLabOrdersTable();
    deleteConfirmModal.style.display = 'none';
});

deleteNo.addEventListener('click', () => {
    deleteConfirmModal.style.display = 'none';
});

document.getElementById('savePatient').addEventListener('click', () => {
    if (validatePatientForm()) {
        labOrdersTitle.textContent = `Lab Orders Dashboard for ${currentPatient.firstName} ${currentPatient.lastName}`;
        document.getElementById('labs').classList.add('active');
        document.getElementById('patientInfo').classList.remove('active');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="labs"]').classList.add('active');
    }
});

document.getElementById('saveLab').addEventListener('click', () => {
    const totalCost = calculateTotalLabCost();
    document.getElementById('billingAmount').value = `$${totalCost.toFixed(2)}`;
    document.getElementById('financialInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="financialInfo"]').classList.add('active');
});

document.getElementById('saveFinancial').addEventListener('click', () => {
    if (validateFinancialForm()) {
        const patientData = {
            ...Object.fromEntries(new FormData(patientForm)),
            visitNumber: generateVisitNumber(),
            sampleId: generateSampleId(),
            labOrders: [...labOrders],
            financialData: Object.fromEntries(new FormData(financialForm)),
            registrationDate: new Date().toLocaleString()
        };
        registeredPatients.push(patientData);
        alert('Patient data saved as draft successfully!');
    }
});

momoSend.addEventListener('click', () => {
    momoPromptModal.style.display = 'none';
    alert('MoMo payment request sent successfully! (Simulated)');
    financialForm.dispatchEvent(new Event('submit'));
});

momoCancel.addEventListener('click', () => {
    momoPromptModal.style.display = 'none';
});

financialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateFinancialForm()) {
        confirmMessage.textContent = `Are you sure you want to register ${currentPatient.firstName} ${currentPatient.lastName} with billing?`;
        confirmModal.style.display = 'flex';
    }
});

confirmYes.addEventListener('click', () => {
    patientData = Object.fromEntries(new FormData(patientForm));
    financialData = Object.fromEntries(new FormData(financialForm));
    totalCost = calculateTotalLabCost();
    const age = formatAge(patientData.ageValue, patientData.ageUnit);
    const gender = patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1);
    const paymentDetails = financialData.paymentMethod === 'cash' ? `Cash (Receipt: ${financialData.receiptNumber})` :
                          financialData.paymentMethod === 'momo' ? `Mobile Money (Phone: ${financialData.momoPhone})` :
                          financialData.paymentMethod === 'insurance' ? `Insurance (ID: ${financialData.insuranceId})` :
                          financialData.paymentMethod === 'cheque' ? `Cheque (Number: ${financialData.chequeNumber})` :
                          `Credit Card (Ending: ${financialData.creditCardNumber.slice(-4)})`;

    summaryDetails.innerHTML = `
        <p><span>Visit Number:</span> ${generateVisitNumber()}</p>
        <p><span>Sample ID:</span> ${generateSampleId()}</p>
        <p><span>Name:</span> ${patientData.firstName} ${patientData.lastName}</p>
        <p><span>Age:</span> ${age}</p>
        <p><span>Sex:</span> ${gender}</p>
        <p><span>Total Lab Cost:</span> $${totalCost.toFixed(2)}</p>
        <p><span>Payment Method:</span> ${paymentDetails}</p>
    `;
    confirmModal.style.display = 'none';
    registrationSummaryModal.style.display = 'flex';
});

confirmNo.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});

printBillBtn.addEventListener('click', () => {
    const latexContent = generateBillLatex(patientData, financialData, totalCost);
    console.log('Bill LaTeX generated:', latexContent);
    
    // Complete the registration
    const finalPatientData = {
        ...patientData,
        visitNumber: generateVisitNumber(),
        sampleId: generateSampleId(),
        labOrders: [...labOrders],
        financialData: financialData,
        registrationDate: new Date().toLocaleString(),
        billGenerated: true
    };
    registeredPatients.push(finalPatientData);
    
    // Show success message
    const successMessage = `
        Patient Registration Completed Successfully!
        
        Visit Number: ${finalPatientData.visitNumber}
        Sample ID: ${finalPatientData.sampleId}
        Name: ${finalPatientData.firstName} ${finalPatientData.lastName}
        
        Bill has been generated. You can find the LaTeX content in the console.
    `;
    alert(successMessage);
    
    // Close the modal and reset forms
    registrationSummaryModal.style.display = 'none';
    patientForm.reset();
    labOrders = [];
    updateLabOrdersTable();
    financialForm.reset();
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    cashDetails.classList.remove('active');
    Object.keys({ firstNameError: 1, lastNameError: 1, ageError: 1, genderError: 1, phoneNumberError: 1, emailError: 1, residentialAddressError: 1, emergencyContactNameError: 1, emergencyContactPhoneError: 1, diagnosisError: 1, paymentMethodError: 1, momoPhoneError: 1, insuranceIdError: 1, chequeNumberError: 1, creditCardNumberError: 1, receiptNumberError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    document.getElementById('patientInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    document.getElementById('financialInfo').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="patientInfo"]').classList.add('active');
});

printInvoiceBtn.addEventListener('click', () => {
    const latexContent = generateInvoiceLatex(patientData, financialData, labOrders, totalCost);
    console.log('Invoice LaTeX generated:', latexContent);
    
    // Complete the registration
    const finalPatientData = {
        ...patientData,
        visitNumber: generateVisitNumber(),
        sampleId: generateSampleId(),
        labOrders: [...labOrders],
        financialData: financialData,
        registrationDate: new Date().toLocaleString(),
        invoiceGenerated: true
    };
    registeredPatients.push(finalPatientData);
    
    // Show success message
    const successMessage = `
        Patient Registration Completed Successfully!
        
        Visit Number: ${finalPatientData.visitNumber}
        Sample ID: ${finalPatientData.sampleId}
        Name: ${finalPatientData.firstName} ${finalPatientData.lastName}
        
        Invoice has been generated. You can find the LaTeX content in the console.
    `;
    alert(successMessage);
    
    // Close the modal and reset forms
    registrationSummaryModal.style.display = 'none';
    patientForm.reset();
    labOrders = [];
    updateLabOrdersTable();
    financialForm.reset();
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    cashDetails.classList.remove('active');
    Object.keys({ firstNameError: 1, lastNameError: 1, ageError: 1, genderError: 1, phoneNumberError: 1, emailError: 1, residentialAddressError: 1, emergencyContactNameError: 1, emergencyContactPhoneError: 1, diagnosisError: 1, paymentMethodError: 1, momoPhoneError: 1, insuranceIdError: 1, chequeNumberError: 1, creditCardNumberError: 1, receiptNumberError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    document.getElementById('patientInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    document.getElementById('financialInfo').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="patientInfo"]').classList.add('active');
});

editSummary.addEventListener('click', () => {
    registrationSummaryModal.style.display = 'none';
    document.getElementById('patientInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    document.getElementById('financialInfo').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="patientInfo"]').classList.add('active');
});

closeSummary.addEventListener('click', () => {
    registrationSummaryModal.style.display = 'none';
    patientForm.reset();
    labOrders = [];
    updateLabOrdersTable();
    financialForm.reset();
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    Object.keys({ firstNameError: 1, lastNameError: 1, ageError: 1, genderError: 1, phoneNumberError: 1, emailError: 1, residentialAddressError: 1, emergencyContactNameError: 1, emergencyContactPhoneError: 1, diagnosisError: 1, paymentMethodError: 1, momoPhoneError: 1, insuranceIdError: 1, chequeNumberError: 1, creditCardNumberError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    document.getElementById('patientInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    document.getElementById('financialInfo').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="patientInfo"]').classList.add('active');
});

document.getElementById('logoutItem').addEventListener('click', () => {
    logoutModal.style.display = 'flex';
});

logoutYes.addEventListener('click', () => {
    startTime = Date.now();
    updateTimer();
    logoutModal.style.display = 'none';
    patientForm.reset();
    labOrders = [];
    updateLabOrdersTable();
    financialForm.reset();
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    Object.keys({ firstNameError: 1, lastNameError: 1, ageError: 1, genderError: 1, phoneNumberError: 1, emailError: 1, residentialAddressError: 1, emergencyContactNameError: 1, emergencyContactPhoneError: 1, diagnosisError: 1, paymentMethodError: 1, momoPhoneError: 1, insuranceIdError: 1, chequeNumberError: 1, creditCardNumberError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    document.getElementById('patientInfo').classList.add('active');
    document.getElementById('labs').classList.remove('active');
    document.getElementById('financialInfo').classList.remove('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="patientInfo"]').classList.add('active');
});

logoutNo.addEventListener('click', () => {
    logoutModal.style.display = 'none';
});

document.getElementById('clearPatient').addEventListener('click', () => patientForm.reset());

document.getElementById('clearFinancial').addEventListener('click', () => {
    financialForm.reset();
    momoDetails.classList.remove('active');
    insuranceDetails.classList.remove('active');
    chequeDetails.classList.remove('active');
    creditCardDetails.classList.remove('active');
    Object.keys({ paymentMethodError: 1, momoPhoneError: 1, insuranceIdError: 1, chequeNumberError: 1, creditCardNumberError: 1 }).forEach(key => document.getElementById(`${key}`).textContent = '');
    const totalCost = calculateTotalLabCost();
    document.getElementById('billingAmount').value = `$${totalCost.toFixed(2)}`;
});

let currentVisitNumber = 0;
let currentSampleId = 0;
let registeredPatients = [];

function generateVisitNumber() {
    currentVisitNumber++;
    return `V${String(currentVisitNumber).padStart(6, '0')}`;
}

function generateSampleId() {
    currentSampleId++;
    const year = new Date().getFullYear().toString().slice(-2);
    return `${String(currentSampleId).padStart(4, '0')}/${year}`;
}

function validateReceiptNumber(number) {
    // Allow any non-empty receipt number from the receipt book
    return number.trim() !== '' ? '' : 'Receipt number is required';
}

document.getElementById('submitFinancial').addEventListener('click', () => {
    if (validateFinancialForm()) {
        const paymentMethod = document.getElementById('paymentMethod').value;
        if (paymentMethod === 'momo') {
            const momoPhone = document.getElementById('momoPhone').value.trim();
            document.getElementById('momoPromptMessage').textContent = `Send a payment request of $${calculateTotalLabCost().toFixed(2)} to ${momoPhone}?`;
            momoPromptModal.style.display = 'flex';
        } else {
            const patientData = {
                ...Object.fromEntries(new FormData(patientForm)),
                visitNumber: generateVisitNumber(),
                sampleId: generateSampleId(),
                labOrders: [...labOrders],
                financialData: Object.fromEntries(new FormData(financialForm)),
                registrationDate: new Date().toLocaleString()
            };
            registeredPatients.push(patientData);
            confirmMessage.textContent = `Are you sure you want to register ${patientData.firstName} ${patientData.lastName} with billing?`;
            confirmModal.style.display = 'flex';
        }
    }
});

// ... existing code ...
// Add event listeners for registered patients tab
document.getElementById('patientSearch').addEventListener('input', () => {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const filteredPatients = registeredPatients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchTerm) ||
        patient.lastName.toLowerCase().includes(searchTerm) ||
        patient.visitNumber.toLowerCase().includes(searchTerm) ||
        patient.sampleId.toLowerCase().includes(searchTerm) ||
        patient.registrationDate.toLowerCase().includes(searchTerm) ||
        patient.financialData.paymentMethod.toLowerCase().includes(searchTerm) ||
        patient.financialData.momoPhone.toLowerCase().includes(searchTerm) ||
        patient.financialData.insuranceId.toLowerCase().includes(searchTerm) ||
        patient.financialData.chequeNumber.toLowerCase().includes(searchTerm) ||
        patient.financialData.creditCardNumber.toLowerCase().includes(searchTerm)
    );
    updateRegisteredPatientsTable(filteredPatients);
});

document.getElementById('dateFilter').addEventListener('change', () => {
    const dateFilter = document.getElementById('dateFilter').value;
    const dateRangePicker = document.getElementById('dateRangePicker');
    dateRangePicker.style.display = dateFilter === 'custom' ? 'block' : 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('paymentMethodFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('genderFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('ageGroupFilter').addEventListener('change', updateRegisteredPatientsTable);

document.getElementById('applyDateRange').addEventListener('click', () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    if (startDate && endDate && startDate <= endDate) {
        updateRegisteredPatientsTable();
    } else {
        alert('Please select valid date range');
    }
});

document.getElementById('cancelDateRange').addEventListener('click', () => {
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('dateRangePicker').style.display = 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('exportToCSV').addEventListener('click', () => {
    const filteredPatients = getFilteredPatients();
    const csvContent = generateCSV(filteredPatients);
    downloadCSV(csvContent, 'registered_patients.csv');
});

function generateCSV(patients) {
    const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
    const rows = patients.map(patient => [
        patient.visitNumber,
        patient.sampleId,
        `${patient.firstName} ${patient.lastName}`,
        `${patient.ageValue} ${patient.ageUnit}`,
        patient.gender,
        patient.registrationDate,
        patient.financialData.paymentMethod,
        `$${calculateTotalLabCost(patient.labOrders).toFixed(2)}`
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function calculateAverageAge(patients) {
    if (patients.length === 0) return 0;
    
    const totalAge = patients.reduce((sum, patient) => {
        const age = parseInt(patient.ageValue);
        if (isNaN(age)) return sum;
        
        // Convert all ages to years for consistent calculation
        switch (patient.ageUnit) {
            case 'years':
                return sum + age;
            case 'months':
                return sum + (age / 12);
            case 'weeks':
                return sum + (age / 52);
            case 'days':
                return sum + (age / 365);
            default:
                return sum;
        }
    }, 0);
    
    return totalAge / patients.length;
}

function calculateAgeDistribution(patients) {
    return patients.reduce((dist, patient) => {
        const age = parseInt(patient.ageValue);
        if (isNaN(age)) return dist;
        
        // Convert age to years for consistent grouping
        let ageInYears;
        switch (patient.ageUnit) {
            case 'years':
                ageInYears = age;
                break;
            case 'months':
                ageInYears = age / 12;
                break;
            case 'weeks':
                ageInYears = age / 52;
                break;
            case 'days':
                ageInYears = age / 365;
                break;
            default:
                return dist;
        }
        
        let group;
        if (ageInYears <= 12) group = 'child';
        else if (ageInYears <= 19) group = 'teen';
        else if (ageInYears <= 59) group = 'adult';
        else group = 'senior';
        
        dist[group] = (dist[group] || 0) + 1;
        return dist;
    }, {});
}

// Add error handling for chart initialization
function initializeCharts() {
    try {
        const chartElements = [
            document.getElementById('genderDistribution'),
            document.getElementById('paymentMethodsDistribution'),
            document.getElementById('ageDistribution')
        ];
        
        // Check if all chart elements exist
        if (chartElements.some(element => !element)) {
            console.error('One or more chart elements not found');
            return false;
        }
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js library not loaded');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing charts:', error);
        return false;
    }
}

// Update the statistics function with error handling
function updateStatistics() {
    try {
        if (!initializeCharts()) {
            console.error('Failed to initialize charts');
            return;
        }

        const patients = getFilteredPatients();
        if (!patients || patients.length === 0) {
            // Update UI to show no data
            document.getElementById('totalPatientsCount').textContent = '0';
            document.getElementById('totalRevenue').textContent = '$0.00';
            document.getElementById('averageAge').textContent = '0';
            return;
        }

        const totalPatients = patients.length;
        const totalRevenue = patients.reduce((sum, patient) => {
            const cost = calculateTotalLabCost(patient.labOrders);
            return sum + (isNaN(cost) ? 0 : cost);
        }, 0);
        
        const averageAge = calculateAverageAge(patients);
        const genderDistribution = calculateGenderDistribution(patients);
        const paymentMethodsDistribution = calculatePaymentMethodsDistribution(patients);
        const ageDistribution = calculateAgeDistribution(patients);

        // Update UI elements
        document.getElementById('totalPatientsCount').textContent = totalPatients;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('averageAge').textContent = averageAge.toFixed(1);

        // Update charts
        updateGenderChart(genderDistribution);
        updatePaymentMethodsChart(paymentMethodsDistribution);
        updateAgeDistributionChart(ageDistribution);
    } catch (error) {
        console.error('Error updating statistics:', error);
        // Show error message to user
        alert('Error updating statistics. Please try again.');
    }
}

// Add loading state for export operations
function showExportLoading() {
    const exportBtn = document.getElementById('exportBtn');
    const originalText = exportBtn.textContent;
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    return () => {
        exportBtn.disabled = false;
        exportBtn.textContent = originalText;
    };
}

// Update export functions with loading state
async function exportToCSV(patients) {
    const resetButton = showExportLoading();
    try {
        const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
        const rows = patients.map(patient => [
            patient.visitNumber,
            patient.sampleId,
            `${patient.firstName} ${patient.lastName}`,
            `${patient.ageValue} ${patient.ageUnit}`,
            patient.gender,
            patient.registrationDate,
            patient.financialData.paymentMethod,
            `$${calculateTotalLabCost(patient.labOrders).toFixed(2)}`
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        downloadFile(csvContent, 'registered_patients.csv', 'text/csv');
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        alert('Error exporting to CSV. Please try again.');
    } finally {
        resetButton();
    }
}

// ... existing code ...
// Add event listeners for registered patients tab
document.getElementById('patientSearch').addEventListener('input', () => {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const filteredPatients = registeredPatients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchTerm) ||
        patient.lastName.toLowerCase().includes(searchTerm) ||
        patient.visitNumber.toLowerCase().includes(searchTerm) ||
        patient.sampleId.toLowerCase().includes(searchTerm) ||
        patient.registrationDate.toLowerCase().includes(searchTerm) ||
        patient.financialData.paymentMethod.toLowerCase().includes(searchTerm) ||
        patient.financialData.momoPhone.toLowerCase().includes(searchTerm) ||
        patient.financialData.insuranceId.toLowerCase().includes(searchTerm) ||
        patient.financialData.chequeNumber.toLowerCase().includes(searchTerm) ||
        patient.financialData.creditCardNumber.toLowerCase().includes(searchTerm)
    );
    updateRegisteredPatientsTable(filteredPatients);
});

document.getElementById('dateFilter').addEventListener('change', () => {
    const dateFilter = document.getElementById('dateFilter').value;
    const dateRangePicker = document.getElementById('dateRangePicker');
    dateRangePicker.style.display = dateFilter === 'custom' ? 'block' : 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('paymentMethodFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('genderFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('ageGroupFilter').addEventListener('change', updateRegisteredPatientsTable);

document.getElementById('applyDateRange').addEventListener('click', () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    if (startDate && endDate && startDate <= endDate) {
        updateRegisteredPatientsTable();
    } else {
        alert('Please select valid date range');
    }
});

document.getElementById('cancelDateRange').addEventListener('click', () => {
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('dateRangePicker').style.display = 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('exportToCSV').addEventListener('click', () => {
    const filteredPatients = getFilteredPatients();
    const csvContent = generateCSV(filteredPatients);
    downloadCSV(csvContent, 'registered_patients.csv');
});

function generateCSV(patients) {
    const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
    const rows = patients.map(patient => [
        patient.visitNumber,
        patient.sampleId,
        `${patient.firstName} ${patient.lastName}`,
        `${patient.ageValue} ${patient.ageUnit}`,
        patient.gender,
        patient.registrationDate,
        patient.financialData.paymentMethod,
        `$${calculateTotalLabCost(patient.labOrders).toFixed(2)}`
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function getFilteredPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const paymentMethod = document.getElementById('paymentMethodFilter').value;
    const gender = document.getElementById('genderFilter').value;
    const ageGroup = document.getElementById('ageGroupFilter').value;

    return registeredPatients.filter(patient => {
        const matchesSearch = 
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.visitNumber.toLowerCase().includes(searchTerm) ||
            patient.sampleId.toLowerCase().includes(searchTerm);

        const matchesPaymentMethod = paymentMethod === 'all' || patient.financialData.paymentMethod === paymentMethod;
        const matchesGender = gender === 'all' || patient.gender === gender;

        const age = parseInt(patient.ageValue);
        const ageInYears = patient.ageUnit === 'years' ? age : age / 12;
        const matchesAgeGroup = ageGroup === 'all' || (
            (ageGroup === 'child' && ageInYears <= 12) ||
            (ageGroup === 'teen' && ageInYears > 12 && ageInYears <= 19) ||
            (ageGroup === 'adult' && ageInYears > 19 && ageInYears <= 59) ||
            (ageGroup === 'senior' && ageInYears > 59)
        );

        const registrationDate = new Date(patient.registrationDate);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(startOfMonth.setMonth(startOfMonth.getMonth() + 1));
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        let matchesDate = true;
        if (dateFilter === 'custom') {
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            matchesDate = registrationDate >= startDate && registrationDate <= endDate;
        } else if (dateFilter === 'today') {
            matchesDate = registrationDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
            matchesDate = registrationDate >= startOfWeek && registrationDate <= endOfWeek;
        } else if (dateFilter === 'month') {
            matchesDate = registrationDate >= startOfMonth && registrationDate <= endOfMonth;
        } else if (dateFilter === 'year') {
            matchesDate = registrationDate >= startOfYear && registrationDate <= endOfYear;
        }

        return matchesSearch && matchesPaymentMethod && matchesGender && matchesAgeGroup && matchesDate;
    });
}

function updateRegisteredPatientsTable() {
    const filteredPatients = getFilteredPatients();
    const registeredPatientsTableBody = document.querySelector('#registeredPatientsTable tbody');
    registeredPatientsTableBody.innerHTML = '';
    
    filteredPatients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <td data-label="Visit Number">${patient.visitNumber}</td>
            <td data-label="Sample ID">${patient.sampleId}</td>
            <td data-label="Name">${patient.firstName} ${patient.lastName}</td>
            <td data-label="Age">${patient.ageValue} ${patient.ageUnit}</td>
            <td data-label="Gender">${patient.gender}</td>
            <td data-label="Registration Date">${patient.registrationDate}</td>
            <td data-label="Payment Method">${patient.financialData.paymentMethod}</td>
            <td data-label="Total Cost">$${calculateTotalLabCost(patient.labOrders).toFixed(2)}</td>
            <td data-label="Actions" class="actions">
                <button class="action-btn small view-patient" data-index="${index}">View</button>
                <button class="action-btn small edit-patient" data-index="${index}">Edit</button>
                <button class="action-btn small delete-patient" data-index="${index}">Delete</button>
            </td>
        `;
        registeredPatientsTableBody.appendChild(row);
    });

    // Update statistics if the panel is visible
    if (document.getElementById('statisticsPanel').style.display === 'block') {
        updateStatistics();
    }
}

document.getElementById('printPatientBill').addEventListener('click', () => {
    const patientIndex = document.querySelector('#registeredPatientsTable tbody tr.active').getAttribute('data-index');
    const patient = registeredPatients[patientIndex];
    const latexContent = generateBillLatex(patient, patient.financialData, calculateTotalLabCost(patient.labOrders));
    console.log('Bill LaTeX generated:', latexContent);
    // Implement printing logic
});

document.getElementById('printPatientInvoice').addEventListener('click', () => {
    const patientIndex = document.querySelector('#registeredPatientsTable tbody tr.active').getAttribute('data-index');
    const patient = registeredPatients[patientIndex];
    const latexContent = generateInvoiceLatex(patient, patient.financialData, patient.labOrders, calculateTotalLabCost(patient.labOrders));
    console.log('Invoice LaTeX generated:', latexContent);
    // Implement printing logic
});

document.querySelectorAll('.view-patient').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const patient = registeredPatients[index];
        document.getElementById('patientDetailsPersonal').innerHTML = `
            <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
            <p><strong>Age:</strong> ${formatAge(patient.ageValue, patient.ageUnit)}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Phone Number:</strong> ${patient.phoneNumber}</p>
            <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>Residential Address:</strong> ${patient.residentialAddress}</p>
            <p><strong>Emergency Contact:</strong> ${patient.emergencyContactName} (${patient.emergencyContactPhone})</p>
            <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
        `;
        document.getElementById('patientDetailsLabOrders').innerHTML = patient.labOrders.map(order => `
            <div class="quick-view-section">
                <h4>${order.testName}</h4>
                <p><strong>Test Date:</strong> ${order.testDate}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Priority:</strong> ${order.priority}</p>
                <p><strong>Sample Type:</strong> ${order.sampleType}</p>
                <p><strong>Cost:</strong> $${order.cost.toFixed(2)}</p>
                <p><strong>Instructions:</strong> ${order.instructions}</p>
            </div>
        `).join('');
        document.getElementById('patientDetailsFinancial').innerHTML = `
            <p><strong>Billing Amount:</strong> $${patient.financialData.billingAmount}</p>
            <p><strong>Payment Method:</strong> ${patient.financialData.paymentMethod}</p>
            <p><strong>Receipt Number:</strong> ${patient.financialData.receiptNumber}</p>
            ${patient.financialData.paymentMethod === 'momo' ? `
                <p><strong>MoMo Phone:</strong> ${patient.financialData.momoPhone}</p>
            ` : ''}
            ${patient.financialData.paymentMethod === 'insurance' ? `
                <p><strong>Insurance ID:</strong> ${patient.financialData.insuranceId}</p>
            ` : ''}
            ${patient.financialData.paymentMethod === 'cheque' ? `
                <p><strong>Cheque Number:</strong> ${patient.financialData.chequeNumber}</p>
            ` : ''}
            ${patient.financialData.paymentMethod === 'creditCard' ? `
                <p><strong>Credit Card Number:</strong> ${patient.financialData.creditCardNumber}</p>
            ` : ''}
        `;
        document.getElementById('patientDetailsModal').style.display = 'flex';
    });
});

document.querySelectorAll('.edit-patient').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const patient = registeredPatients[index];
        document.getElementById('firstName').value = patient.firstName;
        document.getElementById('lastName').value = patient.lastName;
        document.getElementById('ageValue').value = patient.ageValue;
        document.getElementById('ageUnit').value = patient.ageUnit;
        document.getElementById('gender').value = patient.gender;
        document.getElementById('phoneNumber').value = patient.phoneNumber;
        document.getElementById('email').value = patient.email;
        document.getElementById('residentialAddress').value = patient.residentialAddress;
        document.getElementById('emergencyContactName').value = patient.emergencyContactName;
        document.getElementById('emergencyContactPhone').value = patient.emergencyContactPhone;
        document.getElementById('diagnosis').value = patient.diagnosis;
        editingIndex = index;
        document.getElementById('patientForm').classList.add('active');
    });
});

document.querySelectorAll('.delete-patient').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const patient = registeredPatients[index];
        confirmMessage.textContent = `Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`;
        confirmModal.style.display = 'flex';
    });
});

document.getElementById('closePatientDetailsBtn').addEventListener('click', () => {
    document.getElementById('patientDetailsModal').style.display = 'none';
    document.getElementById('patientForm').classList.remove('active');
});

confirmYes.addEventListener('click', () => {
    const index = document.querySelector('#registeredPatientsTable tbody tr.active').getAttribute('data-index');
    registeredPatients.splice(index, 1);
    updateRegisteredPatientsTable(registeredPatients);
    confirmModal.style.display = 'none';
});

confirmNo.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});

// Add new event listeners and functions for enhanced registered patients view
document.getElementById('showStatistics').addEventListener('click', () => {
    const panel = document.getElementById('statisticsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') {
        updateStatistics();
    }
});

document.getElementById('dateFilter').addEventListener('change', () => {
    const dateFilter = document.getElementById('dateFilter').value;
    const dateRangePicker = document.getElementById('dateRangePicker');
    dateRangePicker.style.display = dateFilter === 'custom' ? 'block' : 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('paymentMethodFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('genderFilter').addEventListener('change', updateRegisteredPatientsTable);
document.getElementById('ageGroupFilter').addEventListener('change', updateRegisteredPatientsTable);

document.getElementById('applyDateRange').addEventListener('click', () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    if (startDate && endDate && startDate <= endDate) {
        updateRegisteredPatientsTable();
    } else {
        alert('Please select valid date range');
    }
});

document.getElementById('cancelDateRange').addEventListener('click', () => {
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('dateRangePicker').style.display = 'none';
    updateRegisteredPatientsTable();
});

document.getElementById('exportToCSV').addEventListener('click', () => {
    const filteredPatients = getFilteredPatients();
    const csvContent = generateCSV(filteredPatients);
    downloadCSV(csvContent, 'registered_patients.csv');
});

function generateCSV(patients) {
    const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
    const rows = patients.map(patient => [
        patient.visitNumber,
        patient.sampleId,
        `${patient.firstName} ${patient.lastName}`,
        `${patient.ageValue} ${patient.ageUnit}`,
        patient.gender,
        patient.registrationDate,
        patient.financialData.paymentMethod,
        `$${calculateTotalLabCost(patient.labOrders).toFixed(2)}`
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function updateStatistics() {
    const patients = getFilteredPatients();
    const totalPatients = patients.length;
    const totalRevenue = patients.reduce((sum, patient) => sum + calculateTotalLabCost(patient.labOrders), 0);
    const averageAge = calculateAverageAge(patients);
    const genderDistribution = calculateGenderDistribution(patients);
    const paymentMethodsDistribution = calculatePaymentMethodsDistribution(patients);
    const ageDistribution = calculateAgeDistribution(patients);

    document.getElementById('totalPatientsCount').textContent = totalPatients;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('averageAge').textContent = averageAge.toFixed(1);

    // Update charts (you would need to implement these functions)
    updateGenderChart(genderDistribution);
    updatePaymentMethodsChart(paymentMethodsDistribution);
    updateAgeDistributionChart(ageDistribution);
}

function calculateAverageAge(patients) {
    const totalAge = patients.reduce((sum, patient) => {
        const age = parseInt(patient.ageValue);
        return sum + (patient.ageUnit === 'years' ? age : age / 12);
    }, 0);
    return totalAge / patients.length;
}

function calculateGenderDistribution(patients) {
    return patients.reduce((dist, patient) => {
        dist[patient.gender] = (dist[patient.gender] || 0) + 1;
        return dist;
    }, {});
}

function calculatePaymentMethodsDistribution(patients) {
    return patients.reduce((dist, patient) => {
        const method = patient.financialData.paymentMethod;
        dist[method] = (dist[method] || 0) + 1;
        return dist;
    }, {});
}

function calculateAgeDistribution(patients) {
    return patients.reduce((dist, patient) => {
        const age = parseInt(patient.ageValue);
        const ageInYears = patient.ageUnit === 'years' ? age : age / 12;
        let group;
        if (ageInYears <= 12) group = 'child';
        else if (ageInYears <= 19) group = 'teen';
        else if (ageInYears <= 59) group = 'adult';
        else group = 'senior';
        dist[group] = (dist[group] || 0) + 1;
        return dist;
    }, {});
}

function getFilteredPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const paymentMethod = document.getElementById('paymentMethodFilter').value;
    const gender = document.getElementById('genderFilter').value;
    const ageGroup = document.getElementById('ageGroupFilter').value;

    return registeredPatients.filter(patient => {
        const matchesSearch = 
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.visitNumber.toLowerCase().includes(searchTerm) ||
            patient.sampleId.toLowerCase().includes(searchTerm);

        const matchesPaymentMethod = paymentMethod === 'all' || patient.financialData.paymentMethod === paymentMethod;
        const matchesGender = gender === 'all' || patient.gender === gender;

        const age = parseInt(patient.ageValue);
        const ageInYears = patient.ageUnit === 'years' ? age : age / 12;
        const matchesAgeGroup = ageGroup === 'all' || (
            (ageGroup === 'child' && ageInYears <= 12) ||
            (ageGroup === 'teen' && ageInYears > 12 && ageInYears <= 19) ||
            (ageGroup === 'adult' && ageInYears > 19 && ageInYears <= 59) ||
            (ageGroup === 'senior' && ageInYears > 59)
        );

        const registrationDate = new Date(patient.registrationDate);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(startOfMonth.setMonth(startOfMonth.getMonth() + 1));
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        let matchesDate = true;
        if (dateFilter === 'custom') {
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            matchesDate = registrationDate >= startDate && registrationDate <= endDate;
        } else if (dateFilter === 'today') {
            matchesDate = registrationDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
            matchesDate = registrationDate >= startOfWeek && registrationDate <= endOfWeek;
        } else if (dateFilter === 'month') {
            matchesDate = registrationDate >= startOfMonth && registrationDate <= endOfMonth;
        } else if (dateFilter === 'year') {
            matchesDate = registrationDate >= startOfYear && registrationDate <= endOfYear;
        }

        return matchesSearch && matchesPaymentMethod && matchesGender && matchesAgeGroup && matchesDate;
    });
}

function updateRegisteredPatientsTable() {
    const filteredPatients = getFilteredPatients();
    const registeredPatientsTableBody = document.querySelector('#registeredPatientsTable tbody');
    registeredPatientsTableBody.innerHTML = '';
    
    filteredPatients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <td data-label="Visit Number">${patient.visitNumber}</td>
            <td data-label="Sample ID">${patient.sampleId}</td>
            <td data-label="Name">${patient.firstName} ${patient.lastName}</td>
            <td data-label="Age">${patient.ageValue} ${patient.ageUnit}</td>
            <td data-label="Gender">${patient.gender}</td>
            <td data-label="Registration Date">${patient.registrationDate}</td>
            <td data-label="Payment Method">${patient.financialData.paymentMethod}</td>
            <td data-label="Total Cost">$${calculateTotalLabCost(patient.labOrders).toFixed(2)}</td>
            <td data-label="Actions" class="actions">
                <button class="action-btn small view-patient" data-index="${index}">View</button>
                <button class="action-btn small edit-patient" data-index="${index}">Edit</button>
                <button class="action-btn small delete-patient" data-index="${index}">Delete</button>
            </td>
        `;
        registeredPatientsTableBody.appendChild(row);
    });

    // Update statistics if the panel is visible
    if (document.getElementById('statisticsPanel').style.display === 'block') {
        updateStatistics();
    }
}

// ... existing code ...
function updateGenderChart(distribution) {
    const ctx = document.getElementById('genderDistribution').getContext('2d');
    if (window.genderChart) {
        window.genderChart.destroy();
    }
    
    const data = {
        labels: Object.keys(distribution),
        datasets: [{
            data: Object.values(distribution),
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981']
        }]
    };
    
    window.genderChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updatePaymentMethodsChart(distribution) {
    const ctx = document.getElementById('paymentMethodsDistribution').getContext('2d');
    if (window.paymentMethodsChart) {
        window.paymentMethodsChart.destroy();
    }
    
    const data = {
        labels: Object.keys(distribution).map(method => {
            switch (method) {
                case 'cash': return 'Cash';
                case 'momo': return 'Mobile Money';
                case 'insurance': return 'Insurance';
                case 'cheque': return 'Cheque';
                case 'creditCard': return 'Credit Card';
                default: return method;
            }
        }),
        datasets: [{
            data: Object.values(distribution),
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
        }]
    };
    
    window.paymentMethodsChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateAgeDistributionChart(distribution) {
    const ctx = document.getElementById('ageDistribution').getContext('2d');
    if (window.ageDistributionChart) {
        window.ageDistributionChart.destroy();
    }
    
    const data = {
        labels: Object.keys(distribution).map(group => {
            switch (group) {
                case 'child': return 'Child (0-12)';
                case 'teen': return 'Teen (13-19)';
                case 'adult': return 'Adult (20-59)';
                case 'senior': return 'Senior (60+)';
                default: return group;
            }
        }),
        datasets: [{
            data: Object.values(distribution),
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
        }]
    };
    
    window.ageDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Fix event listener issues
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();
    
    // Add event listeners for export buttons
    const exportButtons = document.querySelectorAll('[data-export]');
    exportButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const format = button.getAttribute('data-export');
            const patients = getFilteredPatients();
            
            try {
                switch (format) {
                    case 'csv':
                        await exportToCSV(patients);
                        break;
                    case 'excel':
                        await exportToExcel(patients);
                        break;
                    case 'pdf':
                        await exportToPDF(patients);
                        break;
                    case 'json':
                        await exportToJSON(patients);
                        break;
                }
            } catch (error) {
                console.error(`Error exporting to ${format}:`, error);
                alert(`Error exporting to ${format.toUpperCase()}. Please try again.`);
            }
        });
    });
    
    // Add event listeners for filters
    const filterInputs = document.querySelectorAll('[data-filter]');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateRegisteredPatientsTable();
            if (document.getElementById('statisticsPanel').style.display === 'block') {
                updateStatistics();
            }
        });
    });
    
    // Add event listener for statistics toggle
    document.getElementById('showStatistics').addEventListener('click', () => {
        const panel = document.getElementById('statisticsPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') {
            updateStatistics();
        }
    });
});

// ... existing code ...

document.getElementById('homeItem').addEventListener('click', function() {
    window.location.href = 'home.html';
});