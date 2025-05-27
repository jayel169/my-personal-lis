// Check if user is logged in
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'receptionist') {
    window.location.href = 'index.html';
}

// Update user information
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('welcomeName').textContent = currentUser.name;

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

// Handle navigation
document.getElementById('homeItem').addEventListener('click', function() {
    window.location.href = 'home.html';
});

document.querySelector('[data-tab="patientInfo"]').addEventListener('click', function() {
    window.location.href = 'kk.html';
});

document.getElementById('newRegistration').addEventListener('click', function() {
    window.location.href = 'kk.html';
});

// Add Registered Patients navigation
document.querySelector('a[href="patients.html"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'patients.html';
});

// Handle logout
document.getElementById('logoutItem').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionStartTime'); // Reset session timer
    window.location.href = 'index.html';
});

// Toggle sidebar
document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('collapsed');
});
