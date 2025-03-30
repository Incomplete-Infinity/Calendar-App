document.addEventListener('DOMContentLoaded', () => {
  class CorpCalendar extends HTMLElement {
    constructor() {
      super();
      this.months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const calendarTemplate = document
        .getElementById('calendar-template')
        .content.cloneNode(true);
      const eventPanelTemplate = document
        .getElementById('event-panel-template')
        .content.cloneNode(true);
      const eventListTemplate = document
        .getElementById('event-list-template')
        .content.cloneNode(true);

      this.shadow = this.attachShadow({ mode: 'open' });

      const container = document.createElement('div');
      container.classList.add('calendar-grid-layout');

      const calendarSection = document.createElement('div');
      calendarSection.classList.add('calendar-fixed-section');
      calendarSection.appendChild(calendarTemplate);

      const eventPanelSection = document.createElement('div');
      eventPanelSection.classList.add('calendar-fixed-section');
      eventPanelSection.appendChild(eventPanelTemplate);

      const fullWidthSection = document.createElement('div');
      fullWidthSection.classList.add('calendar-wide-section');
      fullWidthSection.appendChild(eventListTemplate);

      container.appendChild(calendarSection);
      container.appendChild(eventPanelSection);

      this.shadow.appendChild(container);
      this.shadow.appendChild(fullWidthSection);

      this.queryElements();
      this.bindEvents();

      this.currentDate = new Date();
      this.events = {
        '2025-03-05': ['Fleet Op - 18:00 UTC'],
        '2025-03-12': ['Mining Expedition - 16:00 UTC'],
        '2025-03-18': ['Station Meeting - 20:00 UTC'],
      };

      this.generateCalendar();
    }

    queryElements() {
      const s = this.shadow;

      this.monthTitle = s.getElementById('month-title');
      this.calendarBody = s.getElementById('calendar-body');
      this.prevBtn = s.querySelector('.prev');
      this.nextBtn = s.querySelector('.next');
      this.eventPanel = s.querySelector('.event-panel');
      this.eventListPanel = this.shadow.querySelector('.calendar-wide-section');
      this.eventPanel.classList.add('slide-panel');
      this.eventListPanel.classList.remove('slide-panel'); // it slides vertically
      this.selectedDateEl = s.getElementById('selectedDate');
      this.eventList = s.getElementById('eventList');
      this.newEventInput = s.getElementById('newEventInput');
      this.addEventButton = s.getElementById('addEventButton');
      this.closeEventPanel = s.getElementById('closeEventPanel');
      this.titleInput = s.getElementById('newEventTitle');
      this.timeInput = s.getElementById('newEventTime');
    }

    bindEvents() {
      this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
      this.nextBtn.addEventListener('click', () => this.changeMonth(1));
      this.closeEventPanel.addEventListener('click', () =>
        this.hideEventPanel()
      );
      this.addEventButton.addEventListener('click', () => this.addEvent());
    }

    generateCalendar() {
      const month = this.currentDate.getMonth();
      const year = this.currentDate.getFullYear();
      const todayStr = new Date().toISOString().split('T')[0];
      this.monthTitle.innerText = `${this.months[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      this.calendarBody.innerHTML = '';
      const rowTemplate = document.getElementById('calendar-row-template');
      const cellTemplate = document.getElementById('calendar-cell-template');

      let dayCount = 0;
      let row = rowTemplate.content
        .cloneNode(true)
        .querySelector('.calendar-row');

      for (let i = firstDay - 1; i >= 0; i--) {
        row.appendChild(
          this.createDayCell(cellTemplate, prevMonthDays - i, 'prev-month')
        );
        dayCount++;
      }

      for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`;
        const eventList = this.events[dateStr] || [];
        const eventClass = eventList.length ? 'event' : '';
        const todayClass = dateStr === todayStr ? 'today' : '';
        const classes = [eventClass, todayClass].filter(Boolean).join(' ');

        const dayCell = this.createDayCell(
          cellTemplate,
          day,
          'current-month',
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
            .querySelector('.calendar-row');
        }
      }

      let nextDay = 1;
      while (dayCount < 42) {
        row.appendChild(
          this.createDayCell(cellTemplate, nextDay++, 'next-month')
        );
        dayCount++;
        if (dayCount % 7 === 0) {
          this.calendarBody.appendChild(row);
          row = rowTemplate.content
            .cloneNode(true)
            .querySelector('.calendar-row');
        }
      }
    }

    createDayCell(
      template,
      day,
      monthClass,
      extraClass = '',
      dateStr = '',
      eventList = []
    ) {
      const dayCell = template.content
        .cloneNode(true)
        .querySelector('.calendar-day');
      dayCell.classList.add(monthClass);
      if (extraClass)
        extraClass.split(' ').forEach((c) => dayCell.classList.add(c));

      const timeEl = dayCell.querySelector('time');
      timeEl.setAttribute('datetime', dateStr);
      dayCell.querySelector(".day-number").textContent = day;


      if (eventList.length) {
        const badge = document.createElement('span');
        badge.className = 'badge topcoat-notification animate-pulse text-secondary rounded-circle';
        badge.textContent = eventList.length;
        dayCell.appendChild(badge);
      }

      if (dateStr) {
        dayCell.addEventListener('click', () => {
          this.showEventPanel(dateStr);
        });
      }

      return dayCell;
    }

    showEventPanel(date) {
      // Animate out
      this.eventPanel.classList.remove('active');
      this.eventListPanel.classList.remove('active');

      setTimeout(() => {
        this.selectedDateEl.textContent = date;
        this.eventList.innerHTML = '';

        const events = this.events[date] || [];
        events.forEach((event, index) => {
          const li = document
            .getElementById('event-list-item-template')
            .content.cloneNode(true);
          li.querySelector('.event-text').textContent = event;
          li.querySelector('.remove-event').addEventListener('click', () =>
            this.removeEvent(date, index)
          );
          this.eventList.appendChild(li);
        });

        // Animate in
        this.eventPanel.classList.add('active');
        this.eventListPanel.classList.add('active');
      }, 250); // Duration matches transition
    }

    hideEventPanel() {
        this.eventPanel.classList.remove('active');
        this.eventListPanel.classList.remove('active');
        
    }

    addEvent() {
      const date = this.selectedDateEl.textContent;
      const title = this.titleInput.value.trim();
      const time = this.timeInput.value;
      const description = this.newEventInput.value.trim();

      if (!title) return;

      const newEvent = `${time ? time + ' - ' : ''}${title}${
        description ? ': ' + description : ''
      }`;
      if (!this.events[date]) this.events[date] = [];
      this.events[date].push(newEvent);

      this.titleInput.value = '';
      this.timeInput.value = '';
      this.newEventInput.value = '';

      this.showEventPanel(date);
      this.updateEventStyling(date);
    }

    removeEvent(date, index) {
      this.events[date].splice(index, 1);
      if (this.events[date].length === 0) delete this.events[date];
      this.showEventPanel(date);
      this.updateEventStyling(date);
    }

    updateEventStyling(date) {
      const timeElements = this.shadow.querySelectorAll(
        `.calendar-day time[datetime='${date}']`
      );
      timeElements.forEach((timeEl) => {
        const dayCell = timeEl.closest('.calendar-day');
        const badge = dayCell.querySelector('.badge');

        const count = this.events[date]?.length || 0;
        if (count > 0) {
          dayCell.classList.add('event');
          if (!badge) {
            const newBadge = document.createElement('span');
            newBadge.className =
              'badge topcoat-notification animate-pulse';
              newBadge.setAttribute('data-augmented-ui', 'all-hex border')
            newBadge.textContent = count;
            dayCell.appendChild(newBadge);
          } else {
            badge.textContent = count;
          }
        } else {
          dayCell.classList.remove('event');
          if (badge) badge.remove();
        }
      });
    }

    changeMonth(direction) {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
      this.generateCalendar();
    }
  }

  customElements.define('corp-calendar', CorpCalendar);
});
