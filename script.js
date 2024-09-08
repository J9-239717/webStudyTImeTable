document.addEventListener('DOMContentLoaded', function() {
    // Mapping days of the week to grid columns (for a 7-day schedule)
    const dayToColumn = {
        'Monday': 2,
        'Tuesday': 3,
        'Wednesday': 4,
        'Thursday': 5,
        'Friday': 6,
        'Saturday': 7,
        'Sunday': 8
    };

    // Mapping time slots to grid rows (assuming a 24-hour timetable with 15-minute slots)
    // Adjust these numbers to your specific grid system if needed.
    const timeToRow = {
        '0645': 2,  // Start at row 2 for 06:45
        '0825': 3,
        '1015': 4,
        '1230': 5,
        '1505': 6,
        '1530': 7,
        '1300': 7, // Special case for 13:00
        '1410': 8,
        '1630': 9,
        '1730': 10,
        // Add more times if needed
    };

    const scheduleContainer = document.getElementById('schedule-container');

    // Fetch the JSON data from the schedule.json file
    fetch('plan_jerry.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(classData => {
                // Create a new class block for each class
                const classBlock = document.createElement('div');
                classBlock.classList.add('class-block');
                classBlock.innerHTML = `
                    ${classData.class_name}<br>
                    Room: ${classData.room}<br>
                    Class ID: ${classData.class_id}
                    <div class="time-slot">${formatTime(classData.formatted_time.start_time)} - ${formatTime(classData.formatted_time.end_time)}</div>
                `;

                // Calculate the grid-column based on the day of the week
                const column = dayToColumn[classData.formatted_time.day_weeks];
                
                // Calculate the grid-row based on start and end times
                const rowStart = timeToRow[classData.formatted_time.start_time];
                const rowEnd = calculateRowEnd(classData.formatted_time.start_time, classData.formatted_time.end_time, timeToRow);

                // Set CSS grid position
                classBlock.style.gridColumn = column;
                classBlock.style.gridRow = `${rowStart} / ${rowEnd}`;

                // Append to container
                scheduleContainer.appendChild(classBlock);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Helper function to format time (e.g., '1505' => '15:05')
    function formatTime(time) {
        return time.slice(0, 2) + ':' + time.slice(2);
    }

    // Helper function to calculate row end based on start and end time
    function calculateRowEnd(startTime, endTime, timeToRow) {
        const startRow = timeToRow[startTime];
        const endRow = timeToRow[endTime];
        
        // If we don't have an exact match for the end time, increment by 1 row
        return endRow || (startRow + 1);
    }
});
