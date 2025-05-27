document.addEventListener('DOMContentLoaded', () => {
    const availableTests = [
        { name: "Full Blood Count", cost: 120.00 },
        { name: "Blood Glucose", cost: 50.00 },
        { name: "Lipid Profile", cost: 150.00 },
        { name: "Liver Function Test", cost: 180.00 },
        { name: "Kidney Function Test", cost: 180.00 },
        { name: "Thyroid Test", cost: 250.00 },
        { name: "Urinalysis", cost: 80.00 },
        { name: "Stool Analysis", cost: 90.00 },
        { name: "Malaria Test", cost: 30.00 },
        { name: "HIV Test", cost: 80.00 },
        { name: "Hepatitis B Test", cost: 120.00 },
        { name: "Hepatitis C Test", cost: 120.00 },
        { names: "Syphilis Test", cost: 80.00 },
        { names: "Pregnancy Test", cost: 30.00 },
        { name: "Blood Group", cost: 50.00 },
        { name: "Hemoglobin", cost: 40.00 },
        { name: "ESR", cost: 40.00 },
        { name: "CRP", cost: 90.00 },
        { name: "PSA", cost: 150.00 },
        { name: "CA 125", cost: 250.00 },
        { name: "CA 19-9", cost: 250.00 },
        { name: "CEA", cost: 250.00 },
        { name: "AFP", cost: 250.00 },
        { name: "HCG", cost: 120.00 },
        { name: "Progesterone", cost: 180.00 },
        { name: "Estradiol", cost: 180.00 },
        { name: "Testosterone", cost: 180.00 },
        { name: "Cortisol", cost: 180.00 },
        { name: "Insulin", cost: 250.00 },
        { name: "Vitamin D", cost: 300.00 },
        { name: "Vitamin B12", cost: 250.00 },
        { name: "Folate", cost: 250.00 },
        { name: "Iron Studies", cost: 180.00 },
        { name: "Coagulation Profile", cost: 250.00 },
        { name: "D-Dimer", cost: 180.00 },
        { name: "Troponin", cost: 250.00 },
        { name: "BNP", cost: 300.00 },
        { name: "HbA1c", cost: 150.00 },
        { name: "Microalbumin", cost: 180.00 },
        { name: "Culture and Sensitivity", cost: 300.00 },
        { name: "Semen Analysis", cost: 250.00 },
        { name: "Pap Smear", cost: 180.00 },
        { name: "Sputum Analysis", cost: 120.00 },
        { name: "CSF Analysis", cost: 250.00 },
        { name: "Bone Marrow Aspiration", cost: 400.00 },
        { name: "Histopathology", cost: 350.00 },
        { name: "Cytology", cost: 300.00 }
    ];

    function populateTestNames() {
        const testNamesDatalist = document.getElementById('testNames');
        testNamesDatalist.innerHTML = '';
        availableTests.forEach(test => {
            const option = document.createElement('option');
            option.value = test.name;
            option.setAttribute('data-cost', test.cost);
            testNamesDatalist.appendChild(option);
        });
    }

    function calculateTotalLabCost(orders = labOrders) {
        return orders.reduce((total, order) => total + order.cost, 0);
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

    // Initialize variables
    let labOrders = [];
    let currentPatient = { firstName: '', lastName: '' };
    let patientData, financialData, totalCost;
    let editingIndex = -1;
    let currentVisitNumber = 0;
    let currentSampleId = 0;
    let registeredPatients = [];

    // DOM elements
    const labOrdersTableBody = document.querySelector('#labOrdersTable tbody');
    const totalOrdersSpan = document.getElementById('totalOrders');
    const labOrdersTitle = document.getElementById('labOrdersTitle');
    const labOrderModal = document.getElementById('labOrderModal');
    const modalTestName = document.getElementById('modalTestName');
    const modalCostDisplay = document.getElementById('modalCostDisplay');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const momoDetails = document.getElementById('momoDetails');
    const insuranceDetails = document.getElementById('insuranceDetails');
    const chequeDetails = document.getElementById('chequeDetails');
    const creditCardDetails = document.getElementById('creditCardDetails');
    const cashDetails = document.getElementById('cashDetails');
    const patientForm = document.getElementById('patientForm');
    const financialForm = document.getElementById('financialForm');
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const registrationSummaryModal = document.getElementById('registrationSummaryModal');
    const summaryDetails = document.getElementById('summaryDetails');
    const momoPromptModal = document.getElementById('momoPromptModal');

    // Validate forms
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
        const requestingPhysician = document.getElementById('modalRequestingPhysician').value.trim();
        const requestingDepartment = document.getElementById('modalRequestingDepartment').value;
        const priority = document.getElementById('modalPriority').value;
        const sampleType = document.getElementById('modalSampleType').value;

        if (!testName) {
            errors.modalTestName = 'Test name is required';
        } else if (!availableTests.some(test => test.name === testName)) {
            errors.modalTestName = 'Please select a valid test from the list';
        }

        if (!requestingPhysician) {
            errors.modalRequestingPhysician = 'Requesting physician is required';
        }

        if (!requestingDepartment) {
            errors.modalRequestingDepartment = 'Requesting department is required';
        }

        if (!priority) {
            errors.modalPriority = 'Priority is required';
        }

        if (!sampleType) {
            errors.modalSampleType = 'Sample type is required';
        }

        if (testName && editingIndex === -1) {
            const isDuplicate = labOrders.some(order => order.testName === testName);
            if (isDuplicate) {
                errors.modalTestName = 'This test is already ordered';
            }
        }

        document.getElementById('modalTestNameError').textContent = '';
        document.getElementById('modalRequestingPhysicianError').textContent = '';
        document.getElementById('modalRequestingDepartmentError').textContent = '';
        document.getElementById('modalPriorityError').textContent = '';
        document.getElementById('modalSampleTypeError').textContent = '';
        document.getElementById('modalInstructionsError').textContent = '';

        Object.keys(errors).forEach(key => {
            const errorElement = document.getElementById(`${key}Error`);
            if (errorElement) {
                errorElement.textContent = errors[key];
            }
        });

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

    function validateReceiptNumber(number) {
        return number.trim() !== '' ? '' : 'Receipt number is required';
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

    // Utility functions
    function generateVisitNumber() {
        // Get the last used visit number from localStorage
        const lastVisitNumber = parseInt(localStorage.getItem('lastVisitNumber')) || 0;
        const newVisitNumber = lastVisitNumber + 1;
        
        // Save the new visit number to localStorage
        localStorage.setItem('lastVisitNumber', newVisitNumber);
        
        // Return the formatted visit number
        return `V${String(newVisitNumber).padStart(5, '0')}`;
    }

    function generateSampleId() {
        currentSampleId++;
        const year = new Date().getFullYear().toString().slice(-2);
        return `${String(currentSampleId).padStart(4, '0')}/${year}`;
    }

    // Initialize UI
    populateTestNames();

    // Session timer
    let startTime;
    const storedStartTime = sessionStorage.getItem('sessionStartTime');

    if (storedStartTime) {
        startTime = new Date(storedStartTime);
    } else {
        startTime = new Date();
        sessionStorage.setItem('sessionStartTime', startTime.toISOString());
    }

    const sessionTimer = document.getElementById('sessionTimer');

    function updateTimer() {
        const elapsed = new Date() - startTime;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        sessionTimer.textContent = `Session: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function initializeTabSwitching() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.remove('active'));
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');

                if (tabId === 'financialInfo') {
                    const totalCost = calculateTotalLabCost();
                    document.getElementById('billingAmount').value = `GH₵${totalCost.toFixed(2)}`;
                }
            });
        });
    }

    initializeTabSwitching();

    // Sidebar toggle
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });

    // Add new order
    document.getElementById('addNewOrder').addEventListener('click', () => {
        editingIndex = -1;
        document.getElementById('modalTestName').value = '';
        document.getElementById('modalRequestingPhysician').value = '';
        document.getElementById('modalRequestingDepartment').value = '';
        document.getElementById('modalPriority').value = 'normal';
        document.getElementById('modalSampleType').value = 'blood';
        document.getElementById('modalCostDisplay').value = '';
        document.getElementById('modalInstructions').value = '';
        Object.keys({ 
            modalTestNameError: 1, 
            modalRequestingPhysicianError: 1, 
            modalRequestingDepartmentError: 1, 
            modalPriorityError: 1, 
            modalSampleTypeError: 1, 
            modalInstructionsError: 1 
        }).forEach(key => document.getElementById(`${key}`).textContent = '');
        document.getElementById('labOrderModalTitle').textContent = 'Add New Lab Order';
        labOrderModal.style.display = 'flex';
    });

    // Test name cost display
    modalTestName.addEventListener('input', () => {
        const selectedTest = availableTests.find(test => test.name === modalTestName.value);
        if (selectedTest) {
            modalCostDisplay.value = `GH₵${selectedTest.cost.toFixed(2)}`;
        } else {
            modalCostDisplay.value = '';
        }
    });

    // Payment method toggle
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

    // Lab orders table
    let currentSort = { column: null, direction: 'asc' };
    let filteredOrders = [];

    function updateLabOrdersTable() {
        labOrdersTableBody.innerHTML = '';
        if (labOrders.length === 0) {
            labOrdersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders available</td></tr>';
        } else {
            const searchTerm = document.getElementById('labSearch').value.toLowerCase();
            const priorityFilter = document.getElementById('priorityFilter').value;

            filteredOrders = labOrders.filter(order => {
                const matchesSearch = order.testName.toLowerCase().includes(searchTerm) ||
                                    order.requestingPhysician.toLowerCase().includes(searchTerm) ||
                                    order.requestingDepartment.toLowerCase().includes(searchTerm);
                const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
                return matchesSearch && matchesPriority;
            });

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
                const priorityClass = order.priority === 'urgent' ? 'priority-urgent' : 'priority-normal';
                
                row.innerHTML = `
                    <td data-label="Test Name">${order.testName}</td>
                    <td data-label="Requesting Physician">${order.requestingPhysician}</td>
                    <td data-label="Department">${order.requestingDepartment}</td>
                    <td data-label="Priority">
                        <span class="priority-indicator ${priorityClass}">${order.priority}</span>
                    </td>
                    <td data-label="Sample Type">${order.sampleType}</td>
                    <td data-label="Cost of Test">GH₵${order.cost.toFixed(2)}</td>
                    <td data-label="Actions" class="actions">
                        <button class="action-btn small view-order" data-index="${index}">View</button>
                        <button class="action-btn small edit-order" data-index="${index}">Edit</button>
                        <button class="action-btn small delete delete-order" data-index="${index}">Delete</button>
                    </td>
                `;
                labOrdersTableBody.appendChild(row);
            });

            document.querySelectorAll('.view-order').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    const order = labOrders[index];
                    document.getElementById('quickViewTestName').textContent = order.testName;
                    document.getElementById('quickViewRequestingPhysician').textContent = order.requestingPhysician;
                    document.getElementById('quickViewRequestingDepartment').textContent = order.requestingDepartment;
                    document.getElementById('quickViewPriority').textContent = order.priority;
                    document.getElementById('quickViewSampleType').textContent = order.sampleType;
                    document.getElementById('quickViewCost').textContent = `GH₵${order.cost.toFixed(2)}`;
                    document.getElementById('quickViewNotes').value = order.notes || '';
                    document.getElementById('quickViewModal').style.display = 'flex';
                });
            });

            document.querySelectorAll('.edit-order').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    const order = labOrders[index];
                    editingIndex = index;
                    document.getElementById('modalTestName').value = order.testName;
                    document.getElementById('modalRequestingPhysician').value = order.requestingPhysician;
                    document.getElementById('modalRequestingDepartment').value = order.requestingDepartment;
                    document.getElementById('modalPriority').value = order.priority;
                    document.getElementById('modalSampleType').value = order.sampleType;
                    document.getElementById('modalCostDisplay').value = `GH₵${order.cost.toFixed(2)}`;
                    document.getElementById('modalInstructions').value = order.instructions || '';
                    document.getElementById('labOrderModalTitle').textContent = 'Edit Lab Order';
                    labOrderModal.style.display = 'flex';
                });
            });

            document.querySelectorAll('.delete-order').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    editingIndex = index;
                    document.getElementById('deleteConfirmModal').style.display = 'flex';
                });
            });
        }

        const total = labOrders.length;
        totalOrdersSpan.textContent = `Total Orders: ${total}`;
    }

    // Sorting and filtering
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

    document.getElementById('labSearch').addEventListener('input', updateLabOrdersTable);
    document.getElementById('priorityFilter').addEventListener('change', updateLabOrdersTable);

    // Save order
    const saveOrderButton = document.getElementById('saveOrderButton');
    if (!saveOrderButton) {
        console.error('Save Order button not found in the DOM');
    } else {
        function handleSaveOrder() {
            console.log('Save Order button clicked');
            
            if (validateLabOrderForm()) {
                const selectedTest = availableTests.find(test => test.name === document.getElementById('modalTestName').value);
                if (!selectedTest) {
                    console.error('Invalid test selected');
                    document.getElementById('modalTestNameError').textContent = 'Please select a valid test';
                    return;
                }

                const order = {
                    testName: document.getElementById('modalTestName').value.trim(),
                    requestingPhysician: document.getElementById('modalRequestingPhysician').value.trim(),
                    requestingDepartment: document.getElementById('modalRequestingDepartment').value,
                    priority: document.getElementById('modalPriority').value,
                    sampleType: document.getElementById('modalSampleType').value,
                    cost: selectedTest.cost,
                    instructions: document.getElementById('modalInstructions').value.trim(),
                    status: 'Pending',
                    notes: '',
                    lastUpdated: new Date().toLocaleString(),
                    testDate: new Date().toLocaleDateString()
                };

                if (editingIndex === -1) {
                    labOrders.push(order);
                    console.log('New order added:', order);
                } else {
                    labOrders[editingIndex] = order;
                    console.log('Order updated at index', editingIndex, ':', order);
                    editingIndex = -1;
                }

                updateLabOrdersTable();
                labOrderModal.style.display = 'none';

                document.getElementById('modalTestName').value = '';
                document.getElementById('modalRequestingPhysician').value = '';
                document.getElementById('modalRequestingDepartment').value = '';
                document.getElementById('modalPriority').value = 'normal';
                document.getElementById('modalSampleType').value = 'blood';
                document.getElementById('modalCostDisplay').value = '';
                document.getElementById('modalInstructions').value = '';

                document.getElementById('modalTestNameError').textContent = '';
                document.getElementById('modalRequestingPhysicianError').textContent = '';
                document.getElementById('modalRequestingDepartmentError').textContent = '';
                document.getElementById('modalPriorityError').textContent = '';
                document.getElementById('modalSampleTypeError').textContent = '';
                document.getElementById('modalInstructionsError').textContent = '';
            } else {
                console.log('Validation failed');
            }
        }

        saveOrderButton.addEventListener('click', handleSaveOrder);
    }

    // Modal controls
    document.getElementById('closeLabOrderModal').addEventListener('click', () => {
        labOrderModal.style.display = 'none';
        document.getElementById('modalTestName').value = '';
        document.getElementById('modalRequestingPhysician').value = '';
        document.getElementById('modalRequestingDepartment').value = '';
        document.getElementById('modalPriority').value = 'normal';
        document.getElementById('modalSampleType').value = 'blood';
        document.getElementById('modalCostDisplay').value = '';
        document.getElementById('modalInstructions').value = '';
        Object.keys({ 
            modalTestNameError: 1, 
            modalRequestingPhysicianError: 1, 
            modalRequestingDepartmentError: 1, 
            modalPriorityError: 1, 
            modalSampleTypeError: 1, 
            modalInstructionsError: 1 
        }).forEach(key => document.getElementById(`${key}`).textContent = '');
    });

    document.getElementById('clearLabOrderForm').addEventListener('click', () => {
        document.getElementById('modalTestName').value = '';
        document.getElementById('modalRequestingPhysician').value = '';
        document.getElementById('modalRequestingDepartment').value = '';
        document.getElementById('modalPriority').value = 'normal';
        document.getElementById('modalSampleType').value = 'blood';
        document.getElementById('modalCostDisplay').value = '';
        document.getElementById('modalInstructions').value = '';
        Object.keys({ 
            modalTestNameError: 1, 
            modalRequestingPhysicianError: 1, 
            modalRequestingDepartmentError: 1, 
            modalPriorityError: 1, 
            modalSampleTypeError: 1, 
            modalInstructionsError: 1 
        }).forEach(key => document.getElementById(`${key}`).textContent = '');
    });

    document.getElementById('deleteYes').addEventListener('click', () => {
        labOrders.splice(editingIndex, 1);
        updateLabOrdersTable();
        document.getElementById('deleteConfirmModal').style.display = 'none';
    });

    document.getElementById('deleteNo').addEventListener('click', () => {
        document.getElementById('deleteConfirmModal').style.display = 'none';
    });

    // Patient form
    document.getElementById('savePatient').addEventListener('click', () => {
        if (validatePatientForm()) {
            currentPatient = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim()
            };
            labOrdersTitle.textContent = `Lab Orders Dashboard for ${currentPatient.firstName} ${currentPatient.lastName}`;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="labs"]').classList.add('active');
            document.getElementById('labs').classList.add('active');
            document.getElementById('patientInfo').classList.remove('active');
        }
    });

    document.getElementById('clearPatient').addEventListener('click', () => patientForm.reset());

    // Lab form
    document.getElementById('saveLab').addEventListener('click', () => {
        const totalCost = calculateTotalLabCost();
        document.getElementById('billingAmount').value = `GH₵${totalCost.toFixed(2)}`;
        document.getElementById('financialInfo').classList.add('active');
        document.getElementById('labs').classList.remove('active');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="financialInfo"]').classList.add('active');
    });

    // Financial form
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

    document.getElementById('submitFinancial').addEventListener('click', () => {
        if (validateFinancialForm()) {
            const paymentMethod = document.getElementById('paymentMethod').value;
            if (paymentMethod === 'momo') {
                const momoPhone = document.getElementById('momoPhone').value.trim();
                document.getElementById('momoPromptMessage').textContent = `Send a payment request of GH₵${calculateTotalLabCost().toFixed(2)} to ${momoPhone}?`;
                momoPromptModal.style.display = 'flex';
            } else {
                patientData = {
                    ...Object.fromEntries(new FormData(patientForm)),
                    visitNumber: generateVisitNumber(),
                    sampleId: generateSampleId(),
                    registrationDate: new Date().toLocaleString()
                };
                financialData = Object.fromEntries(new FormData(financialForm));
                totalCost = calculateTotalLabCost();
                confirmMessage.textContent = `Register patient ${patientData.firstName} ${patientData.lastName} with a total cost of GH₵${totalCost.toFixed(2)}?`;
                confirmModal.style.display = 'flex';
            }
        }
    });

    document.getElementById('confirmYes').addEventListener('click', () => {
        const patientRecord = {
            ...patientData,
            labOrders: [...labOrders],
            financialData,
            totalCost,
            registrationDate: new Date().toLocaleString()
        };
        registeredPatients.push(patientRecord);
        
        // Save to localStorage
        const existingPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
        existingPatients.push(patientRecord);
        localStorage.setItem('registeredPatients', JSON.stringify(existingPatients));
        
        confirmModal.style.display = 'none';

        summaryDetails.innerHTML = `
            <p><strong>Name:</strong> ${patientData.firstName} ${patientData.lastName}</p>
            <p><strong>Age:</strong> ${formatAge(patientData.ageValue, patientData.ageUnit)}</p>
            <p><strong>Gender:</strong> ${patientData.gender}</p>
            <p><strong>Lab Orders:</strong> ${labOrders.map(order => order.testName).join(', ') || 'None'}</p>
            <p><strong>Total Cost:</strong> GH₵${totalCost.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${financialData.paymentMethod}</p>
        `;
        registrationSummaryModal.style.display = 'flex';

        patientForm.reset();
        financialForm.reset();
        labOrders = [];
        updateLabOrdersTable();
        document.getElementById('billingAmount').value = '';
        currentPatient = { firstName: '', lastName: '' };
        labOrdersTitle.textContent = 'Lab Orders Dashboard';
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });

    document.getElementById('momoSend').addEventListener('click', () => {
        momoPromptModal.style.display = 'none';
        patientData = {
            ...Object.fromEntries(new FormData(patientForm)),
            visitNumber: generateVisitNumber(),
            sampleId: generateSampleId(),
            registrationDate: new Date().toLocaleString()
        };
        financialData = Object.fromEntries(new FormData(financialForm));
        totalCost = calculateTotalLabCost();
        const patientRecord = {
            ...patientData,
            labOrders: [...labOrders],
            financialData,
            totalCost,
            registrationDate: new Date().toLocaleString()
        };
        registeredPatients.push(patientRecord);
        
        // Save to localStorage
        const existingPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
        existingPatients.push(patientRecord);
        localStorage.setItem('registeredPatients', JSON.stringify(existingPatients));

        summaryDetails.innerHTML = `
            <p><strong>Name:</strong> ${patientData.firstName} ${patientData.lastName}</p>
            <p><strong>Age:</strong> ${formatAge(patientData.ageValue, patientData.ageUnit)}</p>
            <p><strong>Gender:</strong> ${patientData.gender}</p>
            <p><strong>Lab Orders:</strong> ${labOrders.map(order => order.testName).join(', ') || 'None'}</p>
            <p><strong>Total Cost:</strong> GH₵${totalCost.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${financialData.paymentMethod} (Phone: ${financialData.momoPhone})</p>
        `;
        registrationSummaryModal.style.display = 'flex';

        patientForm.reset();
        financialForm.reset();
        labOrders = [];
        updateLabOrdersTable();
        document.getElementById('billingAmount').value = '';
        currentPatient = { firstName: '', lastName: '' };
        labOrdersTitle.textContent = 'Lab Orders Dashboard';
    });

    document.getElementById('momoCancel').addEventListener('click', () => {
        momoPromptModal.style.display = 'none';
    });

    // Summary modal
    document.getElementById('printBill').addEventListener('click', function() {
        // Simulate printing (replace with actual printing logic)
        window.print();
        
        // Show notification modal
        const notificationModal = document.getElementById('notificationModal');
        notificationModal.style.display = 'block';
        
        // Close notification modal when OK is clicked
        document.getElementById('notificationClose').addEventListener('click', function() {
            notificationModal.style.display = 'none';
        });
        
        // Close notification modal when clicking outside
        window.onclick = function(event) {
            if (event.target === notificationModal) {
                notificationModal.style.display = 'none';
            }
        };
    });

    document.getElementById('printInvoice').addEventListener('click', () => {
        console.log(generateInvoiceLatex(patientData, financialData, labOrders, totalCost));
    });

    document.getElementById('editSummary').addEventListener('click', () => {
        registrationSummaryModal.style.display = 'none';
        document.getElementById('patientInfo').classList.add('active');
        document.getElementById('labs').classList.remove('active');
        document.getElementById('financialInfo').classList.remove('active');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="patientInfo"]').classList.add('active');
    });

    document.getElementById('closeSummary').addEventListener('click', () => {
        registrationSummaryModal.style.display = 'none';
    });

    // Quick view modal
    document.getElementById('saveQuickView').addEventListener('click', () => {
        const index = parseInt(document.querySelector('.view-order').getAttribute('data-index'));
        labOrders[index].notes = document.getElementById('quickViewNotes').value;
        labOrders[index].lastUpdated = new Date().toLocaleString();
        document.getElementById('quickViewModal').style.display = 'none';
    });

    document.getElementById('closeQuickView').addEventListener('click', () => {
        document.getElementById('quickViewModal').style.display = 'none';
    });

    document.getElementById('closeQuickViewBtn').addEventListener('click', () => {
        document.getElementById('quickViewModal').style.display = 'none';
    });

    // Registered patients table
    const registeredPatientsTableBody = document.querySelector('#registeredPatientsTable tbody');

    function updateRegisteredPatientsTable() {
        registeredPatientsTableBody.innerHTML = '';
        if (registeredPatients.length === 0) {
            registeredPatientsTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No patients registered</td></tr>';
            return;
        }

        const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
        const dateFilter = document.getElementById('dateFilter').value;
        const paymentMethodFilter = document.getElementById('paymentMethodFilter').value;
        const genderFilter = document.getElementById('genderFilter').value;
        const ageGroupFilter = document.getElementById('ageGroupFilter').value;

        let filteredPatients = registeredPatients.filter(patient => {
            const name = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            const matchesSearch = name.includes(searchTerm) || patient.visitNumber.toLowerCase().includes(searchTerm) || patient.sampleId.toLowerCase().includes(searchTerm);
            const matchesPayment = paymentMethodFilter === 'all' || patient.financialData.paymentMethod === paymentMethodFilter;
            const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;

            let matchesAge = true;
            if (ageGroupFilter !== 'all') {
                const age = parseInt(patient.ageValue);
                if (patient.ageUnit === 'months') age /= 12;
                else if (patient.ageUnit === 'weeks') age /= 52;
                else if (patient.ageUnit === 'days') age /= 365;
                if (ageGroupFilter === 'child') matchesAge = age <= 12;
                else if (ageGroupFilter === 'teen') matchesAge = age > 12 && age <= 19;
                else if (ageGroupFilter === 'adult') matchesAge = age > 19 && age <= 59;
                else if (ageGroupFilter === 'senior') matchesAge = age > 59;
            }

            let matchesDate = true;
            if (dateFilter !== 'all') {
                const regDate = new Date(patient.registrationDate);
                const now = new Date();
                if (dateFilter === 'today') {
                    matchesDate = regDate.toDateString() === now.toDateString();
                } else if (dateFilter === 'week') {
                    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
                    matchesDate = regDate >= oneWeekAgo;
                } else if (dateFilter === 'month') {
                    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    matchesDate = regDate >= oneMonthAgo;
                } else if (dateFilter === 'year') {
                    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
                    matchesDate = regDate >= oneYearAgo;
                } else if (dateFilter === 'custom') {
                    const startDate = document.getElementById('startDate').value ? new Date(document.getElementById('startDate').value) : null;
                    const endDate = document.getElementById('endDate').value ? new Date(document.getElementById('endDate').value) : null;
                    if (startDate && endDate) {
                        matchesDate = regDate >= startDate && regDate <= endDate;
                    }
                }
            }

            return matchesSearch && matchesPayment && matchesGender && matchesAge;
        });

        filteredPatients.forEach((patient, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Visit Number">${patient.visitNumber}</td>
                <td data-label="Sample ID">${patient.sampleId}</td>
                <td data-label="Name">${patient.firstName} ${patient.lastName}</td>
                <td data-label="Age">${formatAge(patient.ageValue, patient.ageUnit)}</td>
                <td data-label="Gender">${patient.gender}</td>
                <td data-label="Registration Date">${patient.registrationDate}</td>
                <td data-label="Payment Method">${patient.financialData.paymentMethod}</td>
                <td data-label="Total Cost">GH₵${patient.totalCost.toFixed(2)}</td>
                <td data-label="Actions" class="actions">
                    <button class="action-btn small view-patient" data-index="${index}">View</button>
                </td>
            `;
            registeredPatientsTableBody.appendChild(row);
        });

        document.querySelectorAll('.view-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const patient = registeredPatients[index];
                document.getElementById('patientDetailsPersonal').innerHTML = `
                    <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
                    <p><strong>Age:</strong> ${formatAge(patient.ageValue, patient.ageUnit)}</p>
                    <p><strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Phone:</strong> ${patient.phoneNumber || 'N/A'}</p>
                    <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                    <p><strong>Address:</strong> ${patient.residentialAddress || 'N/A'}</p>
                    <p><strong>Emergency Contact:</strong> ${patient.emergencyContactName || 'N/A'} (${patient.emergencyContactPhone || 'N/A'})</p>
                    <p><strong>Diagnosis:</strong> ${patient.diagnosis || 'N/A'}</p>
                `;
                document.getElementById('patientDetailsLabOrders').innerHTML = patient.labOrders.length > 0 ? 
                    patient.labOrders.map(order => `
                        <p><strong>${order.testName}:</strong> ${order.priority}, ${order.sampleType}, GH₵${order.cost.toFixed(2)}</p>
                    `).join('') : '<p>No lab orders</p>';
                document.getElementById('patientDetailsFinancial').innerHTML = `
                    <p><strong>Payment Method:</strong> ${patient.financialData.paymentMethod}</p>
                    <p><strong>Total Cost:</strong> GH₵${patient.totalCost.toFixed(2)}</p>
                    ${patient.financialData.receiptNumber ? `<p><strong>Receipt Number:</strong> ${patient.financialData.receiptNumber}</p>` : ''}
                    ${patient.financialData.momoPhone ? `<p><strong>MoMo Phone:</strong> ${patient.financialData.momoPhone}</p>` : ''}
                    ${patient.financialData.insuranceId ? `<p><strong>Insurance ID:</strong> ${patient.financialData.insuranceId}</p>` : ''}
                    ${patient.financialData.chequeNumber ? `<p><strong>Cheque Number:</strong> ${patient.financialData.chequeNumber}</p>` : ''}
                    ${patient.financialData.creditCardNumber ? `<p><strong>Credit Card:</strong> **** **** **** ${patient.financialData.creditCardNumber.slice(-4)}</p>` : ''}
                `;
                document.getElementById('patientDetailsModal').style.display = 'flex';
            });
        });

        document.getElementById('totalPatientsCount').textContent = filteredPatients.length;
        document.getElementById('totalRevenue').textContent = `GH₵${filteredPatients.reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}`;
        const averageAge = filteredPatients.reduce((sum, p) => {
            let age = parseInt(p.ageValue);
            if (p.ageUnit === 'months') age /= 12;
            else if (p.ageUnit === 'weeks') age /= 52;
            else if (p.ageUnit === 'days') age /= 365;
            return sum + age;
        }, 0) / filteredPatients.length || 0;
        document.getElementById('averageAge').textContent = averageAge.toFixed(1);
    }

    // Filters
    document.getElementById('patientSearch').addEventListener('input', updateRegisteredPatientsTable);
    document.getElementById('paymentMethodFilter').addEventListener('change', updateRegisteredPatientsTable);
    document.getElementById('genderFilter').addEventListener('change', updateRegisteredPatientsTable);
    document.getElementById('ageGroupFilter').addEventListener('change', updateRegisteredPatientsTable);

    document.getElementById('dateFilter').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('dateRangePicker').style.display = 'block';
        } else {
            document.getElementById('dateRangePicker').style.display = 'none';
            updateRegisteredPatientsTable();
        }
    });

    document.getElementById('applyDateRange').addEventListener('click', () => {
        updateRegisteredPatientsTable();
        document.getElementById('dateRangePicker').style.display = 'none';
    });

    document.getElementById('cancelDateRange').addEventListener('click', () => {
        document.getElementById('dateRangePicker').style.display = 'none';
        document.getElementById('dateFilter').value = 'all';
        updateRegisteredPatientsTable();
    });

    // Statistics
    document.getElementById('showStatistics').addEventListener('click', () => {
        document.getElementById('statisticsPanel').style.display = document.getElementById('statisticsPanel').style.display === 'block' ? 'none' : 'block';
    });

    // Export to CSV
    document.getElementById('exportToCSV').addEventListener('click', () => {
        const headers = ['Visit Number', 'Sample ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Payment Method', 'Total Cost'];
        const csvRows = [headers];
        registeredPatients.forEach(patient => {
            csvRows.push([
                patient.visitNumber,
                patient.sampleId,
                `"${patient.firstName} ${patient.lastName}"`,
                formatAge(patient.ageValue, patient.ageUnit),
                patient.gender,
                patient.registrationDate,
                patient.financialData.paymentMethod,
                patient.totalCost.toFixed(2)
            ]);
        });
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registered_patients.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Patient details modal
    document.getElementById('closePatientDetails').addEventListener('click', () => {
        document.getElementById('patientDetailsModal').style.display = 'none';
    });

    document.getElementById('closePatientDetailsBtn').addEventListener('click', () => {
        document.getElementById('patientDetailsModal').style.display = 'none';
    });

    document.getElementById('printPatientBill').addEventListener('click', () => {
        const index = parseInt(document.querySelector('.view-patient').getAttribute('data-index'));
        const patient = registeredPatients[index];
        console.log(generateBillLatex(patient, patient.financialData, patient.totalCost));
    });

    document.getElementById('printPatientInvoice').addEventListener('click', () => {
        const index = parseInt(document.querySelector('.view-patient').getAttribute('data-index'));
        const patient = registeredPatients[index];
        console.log(generateInvoiceLatex(patient, patient.financialData, patient.labOrders, patient.totalCost));
    });

    // Logout
    document.getElementById('logoutItem').addEventListener('click', () => {
        document.getElementById('logoutModal').style.display = 'block';
    });

    document.getElementById('logoutYes').addEventListener('click', () => {
        alert('Logged out');
        document.getElementById('logoutModal').style.display = 'none';
    });

    document.getElementById('logoutNo').addEventListener('click', () => {
        document.getElementById('logoutModal').style.display = 'none';
    });
});
