document.addEventListener('DOMContentLoaded', function() {
    // Fetch JSON file and render timetable
    fetch('plan_jerry.json')
        .then(response => response.json())
        .then(data => {
            renderTimetable(data);
        })
        .catch(error => console.error('Error loading JSON:', error));
});

// Function to render the timetable
function renderTimetable(data) {
    const container = document.getElementById('schedule-container');
    const timeIntervals = ["0645", "0920", "1015", "1145", "1300", "1455", "1730"]; // Time slots
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    data.forEach(item => {
        const startTime = item.formatted_time.start_time;
        const endTime = item.formatted_time.end_time;
        const dayWeeks = item.formatted_time.day_weeks;  // Assuming day_weeks contains the day in lowercase

        // Create class block element
        const classBlock = document.createElement('div');
        classBlock.classList.add('class-block');

        // Add class info
        classBlock.innerHTML = `
            <div class="class-info">
                <strong>${item.class_name}</strong><br>
                Room: ${item.room} <br>
                Class ID: ${item.class_id}
            </div>
            <div class="time-slot">${startTime} - ${endTime}</div>
        `;

        // Dynamically position the class block according to the day and time
        let timeIndex = getTimeIndex(startTime, timeIntervals);
        let dayIndex = getDayIndex(dayWeeks, daysOfWeek);

        if (timeIndex !== -1 && dayIndex !== -1) {
            classBlock.style.gridRow = timeIndex + 2; // +2 to account for header rows
            classBlock.style.gridColumn = dayIndex + 2; // +2 to account for time and day columns
        }

        container.appendChild(classBlock);
    });
}

// Helper function to get the day index from "day_weeks"
function getDayIndex(dayWeeks, daysOfWeek) {
    for (let i = 0; i < daysOfWeek.length; i++) {
        if (dayWeeks.toLowerCase().includes(daysOfWeek[i])) {
            return i;
        }
    }
    return -1; // Return -1 if no matching day is found
}

// Helper function to get the time index based on start time
function getTimeIndex(startTime, timeIntervals) {
    return timeIntervals.indexOf(startTime); // Return the index of the time in the time intervals
}
