document.addEventListener("DOMContentLoaded", () => customElements.define(
    "EveCorpCalendar",
    class extends HTMLElement {
        constructor() {
            super();
            const template = document.getElementById(
                "EveCorpCalendar",
            ).content;
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.cloneNode(true));
        }
    },
));
/**
 * 
document.querySelectorAll('.event').forEach(day => {
    day.addEventListener('mouseover', function () {
        let popup = document.getElementById('eventPopup');
        popup.style.display = 'block';
        popup.textContent = this.dataset.event;
        popup.style.left = `${this.getBoundingClientRect().left}px`;
        popup.style.top = `${this.getBoundingClientRect().top - 30}px`;
    });

    day.addEventListener('mouseout', function () {
        document.getElementById('eventPopup').style.display = 'none';
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const monthTitle = document.getElementById("month-title");
    const calendarGrid = document.querySelector(".calendar-grid");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Month Names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function generateCalendar(month, year) {
        // Clear previous content
        calendarGrid.innerHTML = `
            <div class="day-label">Sun</div>
            <div class="day-label">Mon</div>
            <div class="day-label">Tue</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Thu</div>
            <div class="day-label">Fri</div>
            <div class="day-label">Sat</div>
        `;

        // Get first day of the month
        let firstDay = new Date(year, month, 1).getDay();
        let totalDays = new Date(year, month + 1, 0).getDate();

        // Fill empty slots for first week
        for (let i = 0; i < firstDay; i++) {
            calendarGrid.innerHTML += `<div class="calendar-day empty"></div>`;
        }

        // Add actual days
        for (let day = 1; day <= totalDays; day++) {
            calendarGrid.innerHTML += `<div class="calendar-day" data-day="${day}">${day}</div>`;
        }

        // Update the header
        monthTitle.textContent = `${monthNames[month]} ${year}`;
    }

    // Change months
    prevBtn.addEventListener("click", () => {
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
        generateCalendar(currentMonth, currentYear);
    });

    nextBtn.addEventListener("click", () => {
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
        generateCalendar(currentMonth, currentYear);
    });

    // Initialize Calendar
    generateCalendar(currentMonth, currentYear);
});
const events = {
    "2025-03-05": "Fleet Op - 18:00 UTC",
    "2025-03-12": "Mining Expedition - 16:00 UTC",
    "2025-03-18": "Station Meeting - 20:00 UTC"
};

function showEventPopup(date) {
    // Remove existing popups
    const existingPopup = document.querySelector(".event-popup");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.classList.add("event-popup");

    if (events[date]) {
        popup.textContent = `📅 ${date}: ${events[date]}`;
    } else {
        popup.textContent = `No events on ${date}`;
    }

    document.body.appendChild(popup);

    // Position near the mouse cursor
    popup.style.top = `${event.clientY + 10}px`;
    popup.style.left = `${event.clientX + 10}px`;

    // Remove popup after 3 seconds
    setTimeout(() => popup.remove(), 3000);
}


// Attach event listener after calendar loads
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("calendar-day")) {
        const selectedDay = event.target.dataset.day;
        const selectedDate = `2025-03-${selectedDay.padStart(2, "0")}`;
        showEventPopup(selectedDate);
    }
});

*/