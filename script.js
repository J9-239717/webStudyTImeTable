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

    data.forEach(item => {
        const startTime = item.formatted_time.start_time;
        const endTime = item.formatted_time.end_time;
        const daysWeeks = item.formatted_time.days_weeks;

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
        let timeIndex = timeIntervals.indexOf(startTime);
        let dayIndex = getDayIndex(daysWeeks);

        if (timeIndex !== -1 && dayIndex !== -1) {
            classBlock.style.gridRow = timeIndex + 2; // +2 to account for header rows
            classBlock.style.gridColumn = dayIndex + 2; // +2 to account for time and day columns
        }

        container.appendChild(classBlock);
    });
}

// Helper function to get the day index from "days_weeks"
function getDayIndex(daysWeeks) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (let i = 0; i < days.length; i++) {
        if (daysWeeks.toLowerCase().includes(days[i])) {
            return i;
        }
    }
    return -1;
}
