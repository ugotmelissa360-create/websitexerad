document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startTimer');
    const pauseButton = document.getElementById('pauseTimer');
    const resetButton = document.getElementById('resetTimer');
    const timerDisplay = document.getElementById('timer-display');



// 2. Define timer states

let countdownInterval = null;

let secondsLeft = 25 * 60; // 25 minutes converted to seconds (1500s)



// 3. Helper function to format and update the time on screen

function updateTimerUI() {

    const minutes = Math.floor(secondsLeft / 60);

    const seconds = secondsLeft % 60;

   

    // padStart ensures numbers look like "05" instead of "5"

    const formattedMinutes = String(minutes).padStart(2, '0');

    const formattedSeconds = String(seconds).padStart(2, '0');

   

    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

}



// 4. Action function: Start

function startTimer() {

    // Prevent creating multiple intervals if 'Start' is clicked repeatedly

    if (countdownInterval !== null) return;



    countdownInterval = setInterval(() => {

        if (secondsLeft > 0) {

            secondsLeft--;

            updateTimerUI();

        } else {

            // Timer hits 00:00

            clearInterval(countdownInterval);

            countdownInterval = null;

            alert("Time is up! Great work.");

        }

    }, 1000); // Runs every 1 second (1000 milliseconds)

}



// 5. Action function: Pause

function pauseTimer() {

    clearInterval(countdownInterval);

    countdownInterval = null; // Resets interval status so it can restart cleanly

}



// 6. Action function: Reset

function resetTimer() {

    pauseTimer(); // Always clear any active countdown first

    secondsLeft = 25 * 60; // Set back to exactly 25 minutes

    updateTimerUI();

}



// 7. Attach event listeners to your buttons

    if (startButton) startButton.addEventListener('click', startTimer);
    if (pauseButton) pauseButton.addEventListener('click', pauseTimer);
    if (resetButton) resetButton.addEventListener('click', resetTimer);

    updateTimerUI();

    /* --- Session & Dashboard data handling --- */
    function getCurrentUser() {
        const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        return raw ? JSON.parse(raw) : null;
    }

    const currentUser = getCurrentUser();
    const welcomeNameEl = document.getElementById('welcomeName');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    if (welcomeNameEl) welcomeNameEl.textContent = currentUser.firstName || currentUser.username || 'Friend';

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    function loadTasksForDashboard() {
        const perKey = `scholarsync_tasks_db_${currentUser.username}`;
        const tasks = JSON.parse(localStorage.getItem(perKey)) || JSON.parse(localStorage.getItem('scholarsync_tasks_db')) || [];
        const taskListEl = document.getElementById('task-list');
        if (!taskListEl) return;
        if (!tasks || tasks.length === 0) {
            taskListEl.classList.add('empty-state');
            taskListEl.innerHTML = `<p>There is no task for today</p>`;
            return;
        }
        taskListEl.classList.remove('empty-state');
        const listHtml = tasks.slice(0, 3).map(t => `<div class="dash-item">${t.name || t.title || 'Untitled'}</div>`).join('');
        taskListEl.innerHTML = listHtml;
    }

    function loadNotesForDashboard() {
        const perKey = `notes_${currentUser.username}`;
        const notes = JSON.parse(localStorage.getItem(perKey)) || JSON.parse(localStorage.getItem('notes')) || [];
        const notesEl = document.getElementById('notes-container');
        if (!notesEl) return;
        if (!notes || notes.length === 0) {
            notesEl.classList.add('empty-state');
            notesEl.innerHTML = `<p>There is no notes</p>`;
            return;
        }
        notesEl.classList.remove('empty-state');
        const listHtml = notes.slice(0,3).map(n => `<div class="dash-item"><strong>${n.title || 'Untitled'}</strong><div class="dash-note-preview">${(n.content||'').substring(0,60)}</div></div>`).join('');
        notesEl.innerHTML = listHtml;
    }

    loadTasksForDashboard();
    loadNotesForDashboard();
});