// Get DOM elements
const scheduleForm = document.getElementById('scheduleForm');
const scheduleList = document.getElementById('scheduleList');
const courseInput = document.getElementById('course');
const instructorInput = document.getElementById('instructor');
const dayInput = document.getElementById('day');
const timeInput = document.getElementById('time');
const roomInput = document.getElementById('room');

// Auto-format time input to HH:MM
timeInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
    if (value.length >= 3) {
        value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Constants
const STORAGE_KEY = 'schedules';
const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// Load schedules from localStorage
function loadSchedules() {
    const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Sort schedules by day and time
    schedules.sort((a, b) => {
        const dayA = DAYS_ORDER.indexOf(a.day);
        const dayB = DAYS_ORDER.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        return a.time.localeCompare(b.time);
    });

    scheduleList.innerHTML = '';
    schedules.forEach((schedule, index) => {
        const timeFormatted = new Date(`1970-01-01T${schedule.time}:00`).toLocaleTimeString('en-GB', { hour12: false });
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${schedule.course}</strong><br>
                Dosen: ${schedule.instructor}<br>
                Hari: ${schedule.day}, Waktu: ${timeFormatted}<br>
                Ruangan: ${schedule.room}
            </div>
            <div>
                <button class="edit-btn" onclick="editSchedule(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteSchedule(${index})">Hapus</button>
            </div>
        `;
        scheduleList.appendChild(li);
    });
}

// Save schedules to localStorage
function saveSchedules(schedules) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

// Function to validate time format HH:MM
function isValidTime(time) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}

// Add or update schedule
scheduleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const timeValue = timeInput.value.trim();
    if (!isValidTime(timeValue)) {
        alert('Waktu harus dalam format 24 jam HH:MM (contoh: 14:30)');
        return;
    }
    const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const newSchedule = {
        course: courseInput.value.trim(),
        instructor: instructorInput.value.trim(),
        day: dayInput.value,
        time: timeValue,
        room: roomInput.value.trim()
    };

    if (scheduleForm.dataset.editingIndex !== undefined) {
        // Update existing
        const index = parseInt(scheduleForm.dataset.editingIndex);
        schedules[index] = newSchedule;
        delete scheduleForm.dataset.editingIndex;
        scheduleForm.querySelector('button').textContent = 'Tambah Jadwal';
    } else {
        // Create new
        schedules.push(newSchedule);
    }

    saveSchedules(schedules);
    loadSchedules();
    scheduleForm.reset();
});

// Edit schedule
function editSchedule(index) {
    const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const schedule = schedules[index];
    courseInput.value = schedule.course;
    instructorInput.value = schedule.instructor;
    dayInput.value = schedule.day;
    timeInput.value = schedule.time;
    roomInput.value = schedule.room;
    scheduleForm.dataset.editingIndex = index;
    scheduleForm.querySelector('button').textContent = 'Perbarui Jadwal';
}

// Delete schedule
function deleteSchedule(index) {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
        const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        schedules.splice(index, 1);
        saveSchedules(schedules);
        loadSchedules();
    }
}

// Load schedules on page load
loadSchedules();
