// Fetch timetable data and course data from the JSON file
let courseData = null; // Global variable to store the course data

async function fetchTimetableDataAndCourseData() {
    try {
        const response1 = await fetch('timetableData.json');
        const timetableData = await response1.json();

        const response2 = await fetch('courses_structure.json');
        courseData = await response2.json(); // Storing parsed course data

        generateTimetable(timetableData);
        calculateWeekNumber();

        // Optionally log the course data for debugging
        console.log(courseData);
    } catch (error) {
        console.error("Error fetching timetable data:", error);
    }
}

function searchSub_in(org) {
    const query = org.toLowerCase();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query === '') {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    let results = [];

    // Iterate through each category in the course data
    for (const category in courseData) {
        courseData[category].forEach(course => {
            // Check if 'course' and 'course.name' exist to avoid errors
            console.log(course);
            if (course && course.toLowerCase().includes(query)) {
                results.push(course);
            }
        });
    }

    // Display results as cards
    if (results.length > 0 && query.length >= 3) {
        results.forEach(course => {
            const str = course.split("+");
            const card = document.createElement('div');
            card.classList.add('card');

            const header = document.createElement('p');
            header.classList.add('header-s');
            header.textContent = str[0]; // Assuming 'course' object has 'id'

            const body = document.createElement('p');
            body.classList.add('body-s');
            body.textContent = str[1]; // Assuming 'course' object has 'name'

            card.appendChild(header);
            card.appendChild(body);
            resultsContainer.appendChild(card);
        });
    } else if(query.length > 0 && query.length < 4){
        resultsContainer.innerHTML = '<p>Please Enter Full ID</p>';
    }else{
        resultsContainer.innerHTML = '<p>No courses found.</p>';
    }
}

function searchSub() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (query === '') {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    let results = [];

    // Iterate through each category in the course data
    for (const category in courseData) {
        courseData[category].forEach(course => {
            // Check if 'course' and 'course.name' exist to avoid errors
            console.log(course);
            if (course && course.toLowerCase().includes(query)) {
                results.push(course);
            }
        });
    }

    // Display results as cards
    if (results.length > 0 && query.length >= 3) {
        results.forEach(course => {
            const str = course.split("+");
            const card = document.createElement('div');
            card.classList.add('card');

            const header = document.createElement('p');
            header.classList.add('header-s');
            header.textContent = str[0]; // Assuming 'course' object has 'id'

            const body = document.createElement('p');
            body.classList.add('body-s');
            body.textContent = str[1]; // Assuming 'course' object has 'name'

            card.appendChild(header);
            card.appendChild(body);
            resultsContainer.appendChild(card);
        });
    } else if(query.length > 0 && query.length < 4){
        resultsContainer.innerHTML = '<p>Please Enter Full ID</p>';
    }else{
        resultsContainer.innerHTML = '<p>No courses found.</p>';
    }
}


// Add event listener to trigger search on input change
document.getElementById('search-input').addEventListener('input', searchSub);

// Define getWeekNumber function to calculate the current week number
function getWeekNumber() {
    const startDate = new Date(Date.UTC(2024, 8, 1)); // Academic year start date, for example
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
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
                    single_weeks.forEach(index => {
                        if (parseInt(index, 10) === week) {
                            can_show = true;
                        }
                    });
                }

                if (can_show) {
                    const currentSubject = sub_str[0] + "\n" + sub_str[2] + "\n" + sub_str[3];

                    if (previousSubject === currentSubject) {
                        colSpanCount++;
                        previousCell.colSpan = colSpanCount;  // Update colspan
                    } else {
                        colSpanCount = 1;
                        previousCell = cell;  // Store the current cell for possible merging
                        previousSubject = currentSubject;  // Store the current subject

                        cell.classList.add("special");
                        cell.innerHTML = `<b">${currentSubject}</b>`;
                        cell.addEventListener("click", () => searchSub_in(sub_str[0])); // Make cell clickable
                        row.appendChild(cell);  // Append the cell to the row
                    }
                } else {
                    cell.textContent = "-";
                    row.appendChild(cell);
                }
            } else {
                cell.textContent = "-";
                row.appendChild(cell);
            }
        });

        table.appendChild(row);
    });
}

function calculateWeekNumber() {
    const startDate = new Date(Date.UTC(2024, 8, 1));
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor(diffInMilliseconds / millisecondsPerWeek) + 1;

    const options = { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' };
    const currentDateString = currentDate.toLocaleDateString('en-CA', options);

    document.getElementById('current-date').textContent = currentDateString;
    document.getElementById('week-number').textContent = weekNumber;
}

// Call calculateWeekNumber when the window loads
window.onload = function() {
    fetchTimetableDataAndCourseData();
};
