// Check if user is logged in
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'receptionist') {
    window.location.href = 'index.html';
}

// Update user information
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('welcomeName').textContent = currentUser.name;

// Session timer
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

// Handle logout
document.getElementById('logoutItem').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Toggle sidebar
document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('collapsed');
});