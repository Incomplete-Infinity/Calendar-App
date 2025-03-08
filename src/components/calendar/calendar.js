document.addEventListener("DOMContentLoaded", () => {
    class CorpCalendar extends HTMLElement {
        constructor() {
            super();
            const template = document.getElementById("calendar-template").content.cloneNode(true);
            const shadow = this.attachShadow({ mode: "open" });

            // Append the template to the shadow DOM
            shadow.appendChild(template);

            // Include external styles manually
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", "styles.css");
            shadow.appendChild(link);

            this.monthTitle = shadow.getElementById("month-title");
            this.calendarBody = shadow.querySelector("#calendar-body");
            this.prevBtn = shadow.querySelector(".prev");
            this.nextBtn = shadow.querySelector(".next");

            this.eventPanel = shadow.getElementById("eventPanel");
            this.selectedDateEl = shadow.getElementById("selectedDate");
            this.eventList = shadow.getElementById("eventList");
            this.newEventInput = shadow.getElementById("newEventInput");
            this.addEventButton = shadow.getElementById("addEventButton");
            this.closeEventPanel = shadow.getElementById("closeEventPanel");

            this.currentDate = new Date();
            this.events = {
                "2025-03-05": ["Fleet Op - 18:00 UTC"],
                "2025-03-12": ["Mining Expedition - 16:00 UTC"],
                "2025-03-18": ["Station Meeting - 20:00 UTC"],
            };

            this.prevBtn.addEventListener("click", () => this.changeMonth(-1));
            this.nextBtn.addEventListener("click", () => this.changeMonth(1));
            this.closeEventPanel.addEventListener("click", () => this.hideEventPanel());
            this.addEventButton.addEventListener("click", () => this.addEvent());

            this.generateCalendar();
        }

        generateCalendar() {
            const month = this.currentDate.getMonth();
            const year = this.currentDate.getFullYear();
            const firstDay = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const prevMonthDays = new Date(year, month, 0).getDate(); // Last day of previous month
            const nextMonthDays = 42 - (firstDay + totalDays); // Extra days from next month
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            this.monthTitle.textContent = `${monthNames[month]} ${year}`;
            this.calendarBody.innerHTML = ""; // Clear previous content

            let row = document.createElement("tr");
            let dayCount = 0;

            // Fill previous month's days
            for (let i = firstDay - 1; i >= 0; i--) {
                row.appendChild(this.createDayCell(prevMonthDays - i, "prev-month"));
                dayCount++;
            }

            // Fill current month's days
            for (let day = 1; day <= totalDays; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const eventList = this.events[dateStr] || [];
                const eventClass = eventList.length ? "event" : "";

                const dayCell = this.createDayCell(day, "current-month", eventClass);
                dayCell.dataset.date = dateStr;
                dayCell.addEventListener("click", () => this.showEventPanel(dateStr));
                row.appendChild(dayCell);

                dayCount++;
                if (dayCount % 7 === 0) {
                    this.calendarBody.appendChild(row);
                    row = document.createElement("tr");
                }
            }

            // Fill next month's days
            let nextDay = 1;
            while (dayCount < 42) {
                row.appendChild(this.createDayCell(nextDay++, "next-month"));
                dayCount++;

                if (dayCount % 7 === 0) {
                    this.calendarBody.appendChild(row);
                    row = document.createElement("tr");
                }
            }
        }

        createDayCell(day, monthClass, eventClass = "") {
            const dayCell = document.createElement("td");
            dayCell.classList.add("calendar-day", monthClass);
            if (eventClass) dayCell.classList.add(eventClass);
            dayCell.textContent = day;
            return dayCell;
        }

        showEventPanel(date) {
            this.selectedDateEl.textContent = date;
            this.eventList.innerHTML = "";

            const events = this.events[date] || [];
            events.forEach((event, index) => {
                const li = document.createElement("li");
                li.textContent = event;

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "❌";
                removeBtn.addEventListener("click", () => this.removeEvent(date, index));

                li.appendChild(removeBtn);
                this.eventList.appendChild(li);
            });

            this.eventPanel.style.display = "block";
        }

        hideEventPanel() {
            this.eventPanel.style.display = "none";
        }

        addEvent() {
            const date = this.selectedDateEl.textContent;
            const newEvent = this.newEventInput.value.trim();
            if (!newEvent) return;

            if (!this.events[date]) {
                this.events[date] = [];
            }

            this.events[date].push(newEvent);
            this.newEventInput.value = "";
            this.showEventPanel(date);
            this.updateEventStyling(date);
        }

        removeEvent(date, index) {
            this.events[date].splice(index, 1);
            if (this.events[date].length === 0) {
                delete this.events[date];
            }
            this.showEventPanel(date);
            this.updateEventStyling(date);
        }

        updateEventStyling(date) {
            const dayCells = this.shadowRoot.querySelectorAll(`.calendar-day[data-date='${date}']`);
            dayCells.forEach(dayCell => {
                if (this.events[date] && this.events[date].length > 0) {
                    dayCell.classList.add("event");
                } else {
                    dayCell.classList.remove("event");
                }
            });
        }

        changeMonth(direction) {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
            this.generateCalendar();
        }
    }

    customElements.define("corp-calendar", CorpCalendar);
});