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

function getWeekNumber(){
    // Set the start date (2024-09-01) in Vietnam time zone
    const startDate = new Date(Date.UTC(2024, 8, 1)); // Months are 0-based, UTC used for fixed time zones
   
    // Get the current date in Vietnam time zone
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
    
    // Convert milliseconds to weeks
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor(diffInMilliseconds / millisecondsPerWeek) + 1;

    return weekNumber;
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

        let previousSubject = null;  // Track the previous subject
        let previousCell = null;     // Track the previous table cell
        let colSpanCount = 1;        // Counter for how many columns to merge

        day.periods.forEach((period, index) => {
            const cell = document.createElement("td");

            if (period !== "emtry") {
                const sub_str = period.split("=");
                const week = getWeekNumber();
                let can_show = false;
                
                if (sub_str[1].includes("-")) {
                    const week_ranges = sub_str[1].split(",");
                    
                    // Check week ranges
                    week_ranges.forEach(range => {
                        const num_w = range.split("-");
                        const startWeek = parseInt(num_w[0], 10);
                        const endWeek = parseInt(num_w[1], 10);
                        
                        if (week >= startWeek && week <= endWeek) {
                            can_show = true;
                        }
                    });
                } else {
                    const single_weeks = sub_str[1].split(",");
                    
                    // Check individual weeks
                    single_weeks.forEach(index => {
                        if (parseInt(index, 10) === week) {
                            can_show = true;
                        }
                    });
                }

                // If the subject should be shown for the current week
                if (can_show) {
                    const currentSubject = sub_str[0] + "\n"+ sub_str[2];

                    if (previousSubject === currentSubject) {
                        // If the current subject matches the previous, increase colspan
                        colSpanCount++;
                        previousCell.colSpan = colSpanCount;  // Update colspan
                    } else {
                        // If the subject is different, reset colSpanCount and append new cell
                        colSpanCount = 1;
                        previousCell = cell;  // Store the current cell for possible merging
                        previousSubject = currentSubject;  // Store the current subject

                        cell.classList.add("special");
                        cell.innerHTML = `<b>${currentSubject}</b>`;
                        row.appendChild(cell);  // Append the cell to the row
                    }
                } else {
                    cell.textContent = "-";
                    row.appendChild(cell);
                }
            } else {
                // Handle empty periods
                cell.textContent = "-";
                row.appendChild(cell);
            }
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
};
