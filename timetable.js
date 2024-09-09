// Fetch timetable data from the JSON file
async function fetchTimetableData() {
    try {
        const response = await fetch('timetableData.json');
        const timetableData = await response.json();
        generateTimetable(timetableData);
        calculateWeekNumber();
    } catch (error) {
        console.error("Error fetching timetable data:", error);
    }
}

// Function to generate the timetable and insert it into the table
function generateTimetable(timetableData) {
    const table = document.querySelector("table");

    timetableData.days.forEach(day => {
        const row = document.createElement("tr");
        const dayCell = document.createElement("td");
        dayCell.classList.add("highlight");
        dayCell.innerHTML = `<b>${day.name}</b>`;
        row.appendChild(dayCell);

        day.periods.forEach(period => {
            const cell = document.createElement("td");
            const sub_str = period.split("=");
            if (sub_str[0] !== "emtry") {
                cell.classList.add("special");
                cell.innerHTML = `<b>${sub_str[0]}</b>`;
            } else {
                cell.textContent = period;
            }

            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}

function calculateWeekNumber() {
    // Set the start date (2024-09-01) in Vietnam time zone
    const startDate = new Date(Date.UTC(2024, 8, 1)); // Months are 0-based, UTC used for fixed time zones
    
    // Get the current date in Vietnam time zone
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
    
    // Convert milliseconds to weeks
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor(diffInMilliseconds / millisecondsPerWeek) + 1;

    // Display the current date and week number
    const options = { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' };
    const currentDateString = currentDate.toLocaleDateString('en-CA', options); // Format as YYYY-MM-DD
    
    document.getElementById('current-date').textContent = currentDateString;
    document.getElementById('week-number').textContent = weekNumber;
}

// Call calculateWeekNumber when the window loads
window.onload = function() {
    fetchTimetableData();
    calculateWeekNumber();
};