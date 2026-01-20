// Get DOM elements
const scheduleForm = document.getElementById('scheduleForm');
const scheduleList = document.getElementById('scheduleList');
const courseInput = document.getElementById('course');
const instructorInput = document.getElementById('instructor');
const dayInput = document.getElementById('day');
const timeInput = document.getElementById('time');
const roomInput = document.getElementById('room');

// Load schedules from localStorage
function loadSchedules() {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    scheduleList.innerHTML = '';
    schedules.forEach((schedule, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${schedule.course} - ${schedule.instructor} - ${schedule.day} - ${schedule.time} - ${schedule.room}</span>
            <div>
                <button class="edit-btn" onclick="editSchedule(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteSchedule(${index})">Delete</button>
            </div>
        `;
        scheduleList.appendChild(li);
    });
}

// Save schedules to localStorage
function saveSchedules(schedules) {
    localStorage.setItem('schedules', JSON.stringify(schedules));
}

// Add or update schedule
scheduleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const newSchedule = {
        course: courseInput.value,
        instructor: instructorInput.value,
        day: dayInput.value,
        time: timeInput.value,
        room: roomInput.value
    };

    if (scheduleForm.dataset.editingIndex !== undefined) {
        // Update existing
        const index = parseInt(scheduleForm.dataset.editingIndex);
        schedules[index] = newSchedule;
        delete scheduleForm.dataset.editingIndex;
        scheduleForm.querySelector('button').textContent = 'Add Schedule';
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
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const schedule = schedules[index];
    courseInput.value = schedule.course;
    instructorInput.value = schedule.instructor;
    dayInput.value = schedule.day;
    timeInput.value = schedule.time;
    roomInput.value = schedule.room;
    scheduleForm.dataset.editingIndex = index;
    scheduleForm.querySelector('button').textContent = 'Update Schedule';
}

// Delete schedule
function deleteSchedule(index) {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    schedules.splice(index, 1);
    saveSchedules(schedules);
    loadSchedules();
}

// Load schedules on page load
loadSchedules();
