document.addEventListener("DOMContentLoaded", () => {
  const simulatedParsedEsiResponse = {
    calendar: [
      {
        event_date: "2025-06-20T18:00",
        event_id: "0",
        event_response: "declined",
        importance: "0",
        title: "Fleet Op",
      },
      {
        event_date: "2025-06-12T16:00",
        event_id: "1",
        event_response: "not_responded",
        importance: "1",
        title: "Mining Expedition",
      },
      {
        event_date: "2025-06-18T20:00",
        event_id: "2",
        event_response: "accepted",
        importance: "2",
        title: "Station Meeting",
      },
      {
        event_date: "2025-06-20T18:00",
        event_id: "3",
        event_response: "tentative",
        importance: "3",
        title: "Fleet Op",
      },
    ],
    event: (id) =>
      [
        {
          date: "2025-06-20T18:00",
          duration: 120,
          event_id: 0,
          importance: 0,
          owner_id: 0,
          owner_name: "Bob",
          owner_type: "alliance",
          response: "declined",
          text: "Blah blah blah!",
          title: "Fleet Op",
        },
        {
          date: "2025-06-12T16:00",
          duration: 30,
          event_id: 1,
          importance: 1,
          owner_id: 1,
          owner_name: "Corp",
          owner_type: "corporation",
          response: "not_responded",
          text: "Shoot the rocks!",
          title: "Mining Op",
        },
        {
          date: "2025-06-18T20:00",
          duration: 15,
          event_id: 2,
          importance: 2,
          owner_id: 2,
          owner_name: "Faction",
          owner_type: "faction",
          response: "accepted",
          text: "Meet and greet!",
          title: "Station Meeting",
        },
        {
          date: "2025-06-20T18:00",
          duration: 45,
          event_id: 3,
          importance: 3,
          owner_id: 3,
          owner_name: "Character",
          owner_type: "character",
          response: "tenative",
          text: "Good test!",
          title: "Fleet Op",
        },
      ].filter((e) => e.event_id === id),
    attendees: () => [
      {
        character_id: 0,
        event_response: "declined",
      },
      {
        character_id: 1,
        event_response: "not_responded",
      },
      {
        character_id: 2,
        event_response: "accepted",
      },
      {
        character_id: 3,
        event_response: "tentative",
      },
    ],
  };
  const groupEventsByDate = (events) =>
    events.reduce((acc, { event_date, title, event_response, importance }) => {
      const dateKey = event_date.split("T")[0];
      const time = event_date.split("T")[1];
      const label = `${time} - ${title} (${event_response}, importance ${importance})`;

      acc[dateKey] = acc[dateKey] ? [...acc[dateKey], label] : [label];
      return acc;
    }, {});

  class CorpCalendar extends HTMLElement {
    constructor() {
      super();
      this.months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const calendarTemplate = document
        .getElementById("calendar-template")
        .content.cloneNode(true);
      const eventPanelTemplate = document
        .getElementById("event-panel-template")
        .content.cloneNode(true);
      const eventListTemplate = document
        .getElementById("event-list-template")
        .content.cloneNode(true);

      this.shadow = this.attachShadow({ mode: "open" });

      const container = document.createElement("div");
      container.classList.add("calendar-grid-layout");

      const calendarSection = document.createElement("div");
      calendarSection.classList.add("calendar-fixed-section");
      calendarSection.appendChild(calendarTemplate);

      const eventPanelSection = document.createElement("div");
      eventPanelSection.classList.add("calendar-fixed-section");
      eventPanelSection.appendChild(eventPanelTemplate);

      const fullWidthSection = document.createElement("div");
      fullWidthSection.classList.add("calendar-wide-section");
      fullWidthSection.appendChild(eventListTemplate);

      container.appendChild(calendarSection);
      container.appendChild(eventPanelSection);

      this.shadow.appendChild(container);
      this.shadow.appendChild(fullWidthSection);

      this.queryElements();
      this.bindEvents();

      this.currentDate = new Date();
      this.events = groupEventsByDate(simulatedParsedEsiResponse.calendar);

      this.generateCalendar();
    }

    queryElements() {
      const s = this.shadow;

      this.monthTitle = s.getElementById("month-title");
      this.calendarBody = s.getElementById("calendar-body");
      this.prevBtn = s.querySelector(".prev");
      this.nextBtn = s.querySelector(".next");
      this.eventPanel = s.querySelector(".event-panel");
      this.eventListPanel = this.shadow.querySelector(".calendar-wide-section");
      this.eventPanel.classList.add("slide-panel");
      this.eventListPanel.classList.remove("slide-panel"); // it slides vertically
      this.selectedDateEl = s.getElementById("selectedDate");
      this.eventList = s.getElementById("eventList");
      this.newEventInput = s.getElementById("newEventInput");
      this.addEventButton = s.getElementById("addEventButton");
      this.closeEventPanel = s.getElementById("closeEventPanel");
      this.titleInput = s.getElementById("newEventTitle");
      this.timeInput = s.getElementById("newEventTime");
    }

    bindEvents() {
      this.prevBtn.addEventListener("click", () => this.changeMonth(-1));
      this.nextBtn.addEventListener("click", () => this.changeMonth(1));
      this.closeEventPanel.addEventListener("click", () =>
        this.hideEventPanel()
      );
      this.addEventButton.addEventListener("click", () => this.addEvent());
    }

    generateCalendar() {
      const month = this.currentDate.getMonth();
      const year = this.currentDate.getFullYear();
      const todayStr = new Date().toISOString().split("T")[0];
      this.monthTitle.innerText = `${this.months[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      this.calendarBody.innerHTML = "";
      const rowTemplate = document.getElementById("calendar-row-template");
      const cellTemplate = document.getElementById("calendar-cell-template");

      let dayCount = 0;
      let row = rowTemplate.content
        .cloneNode(true)
        .querySelector(".calendar-row");

      for (let i = firstDay - 1; i >= 0; i--) {
        row.appendChild(
          this.createDayCell(cellTemplate, prevMonthDays - i, "prev-month")
        );
        dayCount++;
      }

      for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        const eventList = this.events[dateStr] || [];
        const eventClass = eventList.length ? "event" : "";
        const todayClass = dateStr === todayStr ? "today" : "";
        const classes = [eventClass, todayClass].filter(Boolean).join(" ");

        const dayCell = this.createDayCell(
          cellTemplate,
          day,
          "current-month",
          classes,
          dateStr,
          eventList
        );
        row.appendChild(dayCell);
        dayCount++;

        if (dayCount % 7 === 0) {
          this.calendarBody.appendChild(row);
          row = rowTemplate.content
            .cloneNode(true)
            .querySelector(".calendar-row");
        }
      }

      let nextDay = 1;
      while (dayCount < 42) {
        row.appendChild(
          this.createDayCell(cellTemplate, nextDay++, "next-month")
        );
        dayCount++;
        if (dayCount % 7 === 0) {
          this.calendarBody.appendChild(row);
          row = rowTemplate.content
            .cloneNode(true)
            .querySelector(".calendar-row");
        }
      }
    }

    createDayCell(
      template,
      day,
      monthClass,
      extraClass = "",
      dateStr = "",
      eventList = []
    ) {
      const dayCell = template.content
        .cloneNode(true)
        .querySelector(".calendar-day");
      dayCell.classList.add(monthClass);
      if (extraClass)
        extraClass.split(" ").forEach((c) => dayCell.classList.add(c));

      const timeEl = dayCell.querySelector("time");
      timeEl.setAttribute("datetime", dateStr);
      dayCell.querySelector(".day-number").textContent = day;

      if (eventList.length) {
        const badge = document.createElement("span");
        badge.className = "badge topcoat-notification animate-pulse";
        badge.setAttribute("data-augmented-ui", "all-hex-alt inlay");
        badge.textContent = eventList.length;
        dayCell.appendChild(badge);
      }

      if (dateStr) {
        dayCell.addEventListener("click", () => {
          this.showEventPanel(dateStr);
        });
      }

      return dayCell;
    }

showEventPanel(date) {
  this.hideEventPanel();

  setTimeout(() => {
    this.selectedDateEl.textContent = date;



    this.eventList.innerHTML = "";

    // Highlight selected day in calendar
    this.shadow.querySelectorAll(".calendar-day").forEach((dayCell) => {
      const time = dayCell.querySelector("time");
      if (time) {
        const match = time.getAttribute("datetime") === date;
        dayCell.classList.toggle("selected", match);
      }
    });

    const rawEvents = simulatedParsedEsiResponse.calendar.filter((e) =>
      e.event_date.startsWith(date)
    );

    rawEvents.forEach(({ event_id }) => {
      const event = simulatedParsedEsiResponse.event(Number(event_id))[0];
      if (!event) return;

      const { title, response, importance } = event;

      const detail = document.createElement("details");

      const summary = document.createElement("summary");
      const updateSummary = (resp) => {
        const formattedResp = resp
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        summary.textContent = `${title} — Response: ${formattedResp}, Importance: ${importance}`;
      };

      updateSummary(response);
      detail.appendChild(summary);

      const form = document.createElement("form");

      ["accepted", "declined", "tentative", "not_responded"].forEach((resp) => {
        const id = `resp-${event_id}-${resp}`;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.style.marginRight = "10px";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `response-${event_id}`;
        radio.value = resp;
        radio.id = id;
        if (resp === response) radio.checked = true;

        radio.addEventListener("change", () => {
          updateSummary(resp);
          const calendarEntry = simulatedParsedEsiResponse.calendar.find(
            (e) => e.event_id === String(event_id)
          );
          if (calendarEntry) calendarEntry.event_response = resp;
          event.response = resp;
        });

        const labelText = resp
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        label.appendChild(radio);
        label.appendChild(document.createTextNode(labelText));
        form.appendChild(label);
      });

      detail.appendChild(form);

      const infoBox = document.createElement("div");
      infoBox.classList.add("event-info");

      const formatLine = (label, value) =>
        `<dt>${label}:</dt><dd>${value}</dd>`;

      infoBox.innerHTML = [
        "<dl>",
        formatLine(
          "Owner",
          `${event.owner_name} (${event.owner_type})`
        ),
        formatLine("Duration", `${event.duration} minutes`),
        formatLine("Description", event.text),
        "</dl>"
      ].join("");

      detail.appendChild(infoBox);

      // List attendees
      const attendeeBox = document.createElement("div");
      attendeeBox.classList.add("event-attendees");
      const attendees = simulatedParsedEsiResponse.attendees();

      attendeeBox.innerHTML = `<strong>Attendees:</strong><ul>` +
        attendees
          .filter((a) => a.event_response === event.response)
          .map((a) => `<li>Character ${a.character_id} (${a.event_response})</li>`)
          .join("") +
        `</ul>`;

      detail.appendChild(attendeeBox);

      this.eventList.appendChild(detail);
    });

    this.eventPanel.classList.add("active");
    this.eventListPanel.classList.add("active");
    this.eventPanel.classList.remove("d-none");
    this.eventListPanel.classList.remove("d-none");
  }, 250);
}


    hideEventPanel() {
      this.eventPanel.classList.remove("active");
      this.eventListPanel.classList.remove("active");
      this.eventPanel.classList.add("d-none");
      this.eventListPanel.classList.add("d-none");
    }

    addEvent() {
      const date = this.selectedDateEl.textContent;
      const title = this.titleInput.value.trim();
      const time = this.timeInput.value;
      const description = this.newEventInput.value.trim();

      if (!title) return;

      const newEvent = `${time ? time + " - " : ""}${title}${
        description ? ": " + description : ""
      }`;
      if (!this.events[date]) this.events[date] = [];
      this.events[date].push(newEvent);

      this.titleInput.value = "";
      this.timeInput.value = "";
      this.newEventInput.value = "";

      this.showEventPanel(date);
      //this.updateEventStyling(date);
    }

    removeEvent(date, index) {
      this.events[date].splice(index, 1);
      if (this.events[date].length === 0) delete this.events[date];
      this.showEventPanel(date);
      //this.updateEventStyling(date);
    }

    updateEventStyling(date) {
      const timeElements = this.shadow.querySelectorAll(
        `.calendar-day time[datetime='${date}']`
      );
      timeElements.forEach((timeEl) => {
        const dayCell = timeEl.closest(".calendar-day");
        const badge = dayCell.querySelector(".badge");

        const count = this.events[date]?.length || 0;
        if (count > 0) {
          dayCell.classList.add("event");
          if (!badge) {
            const newBadge = document.createElement("span");
            newBadge.className = "badge topcoat-notification animate-pulse";
            newBadge.setAttribute("data-augmented-ui", "all-hex-alt inlay");
            newBadge.textContent = count;
            dayCell.appendChild(newBadge);
          } else {
            badge.textContent = count;
          }
        } else {
          dayCell.classList.remove("event");
          if (badge) badge.remove();
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
