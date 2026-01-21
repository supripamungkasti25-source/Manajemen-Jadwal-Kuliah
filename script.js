// Get DOM elements
const scheduleForm = document.getElementById('scheduleForm');
const scheduleList = document.getElementById('scheduleList');
const courseInput = document.getElementById('course');
const instructorInput = document.getElementById('instructor');
const dayInput = document.getElementById('day');
const timeInput = document.getElementById('time');
const roomInput = document.getElementById('room');

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
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${schedule.course}</strong><br>
                Dosen: ${schedule.instructor}<br>
                Hari: ${schedule.day}, Waktu: ${schedule.time}<br>
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

// Add or update schedule
scheduleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const newSchedule = {
        course: courseInput.value.trim(),
        instructor: instructorInput.value.trim(),
        day: dayInput.value,
        time: timeInput.value,
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
