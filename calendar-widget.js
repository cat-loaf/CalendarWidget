// CalendarWidget.js
/**
 * CalendarWidget with month/year selector popup
 */
// Inject CSS-in-JS styles for CalendarWidget
(function() {
    const style = document.createElement('style');
    style.textContent = `
    .calendar-widget {
        font-family: Arial, sans-serif;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 280px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        padding: 16px;
        box-sizing: border-box;
    }
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        position: relative;
    }
    .calendar-header button {
        background: #f0f0f0;
        border: none;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .calendar-header button:hover {
        background: #e0e0e0;
    }
    .calendar-header .calendar-monthyear {
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 4px;
        transition: background 0.2s;
        user-select: none;
    }
    .calendar-header .calendar-monthyear:hover {
        background: #f5f5f5;
    }
    .calendar-monthyear-popup {
        position: absolute;
        left: 50%;
        top: 110%;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        z-index: 10;
        padding: 12px;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: fadeIn 0.15s;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
    }
    .calendar-monthyear-popup select {
        width: 100%;
        font-size: 15px;
        padding: 4px 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-bottom: 8px;
    }
    .calendar-monthyear-popup .popup-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }
    .calendar-monthyear-popup button {
        padding: 4px 12px;
        border-radius: 4px;
        border: none;
        background: #1976d2;
        color: #fff;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }
    .calendar-monthyear-popup button.cancel {
        background: #f0f0f0;
        color: #222;
    }
    .calendar-days-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 4px;
    }
    .calendar-day-name {
        text-align: center;
        font-size: 13px;
        color: #888;
        padding: 4px 0;
        font-weight: 500;
    }
    .calendar-dates-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }
    .calendar-date {
        text-align: center;
        padding: 8px 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: background 0.2s, color 0.2s;
        background: none;
        color: #222;
        user-select: none;
    }
    .calendar-date.today {
        background: #e3f2fd;
        color: #1976d2;
        font-weight: bold;
    }
    .calendar-date.selected {
        background: #1976d2;
        color: #fff;
        font-weight: bold;
    }
    .calendar-date.empty {
        background: none;
        cursor: default;
        pointer-events: none;
    }
    `;
    document.head.appendChild(style);
})();

class CalendarWidget {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.date = options.date ? new Date(options.date) : new Date();
        this.onDateSelect = options.onDateSelect || function () {};
        this.dateSelected = null;
        this.showMonthYearPopup = false;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        const calendar = document.createElement('div');
        calendar.className = 'calendar-widget';

        // Header
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11.5 14L7 9L11.5 4" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        prevBtn.onclick = () => this.changeMonth(-1);

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.5 4L11 9L6.5 14" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        nextBtn.onclick = () => this.changeMonth(1);

        const monthYear = document.createElement('span');
        monthYear.className = 'calendar-monthyear';
        monthYear.textContent = this.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthYear.onclick = (e) => {
            e.stopPropagation();
            this.showMonthYearPopup = !this.showMonthYearPopup;
            this.render();
        };

        header.appendChild(prevBtn);
        header.appendChild(monthYear);
        header.appendChild(nextBtn);

        // Month/Year selector popup
        if (this.showMonthYearPopup) {
            const popup = document.createElement('div');
            popup.className = 'calendar-monthyear-popup';

            // Month select
            const monthSelect = document.createElement('select');
            for (let m = 0; m < 12; m++) {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = new Date(2000, m, 1).toLocaleString('default', { month: 'long' });
                if (m === this.date.getMonth()) opt.selected = true;
                monthSelect.appendChild(opt);
            }

            // Year select (range: current year - 100 to current year + 20)
            const yearSelect = document.createElement('select');
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 100;
            const endYear = currentYear + 20;
            for (let y = endYear; y >= startYear; y--) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                if (y === this.date.getFullYear()) opt.selected = true;
                yearSelect.appendChild(opt);
            }

            popup.appendChild(monthSelect);
            popup.appendChild(yearSelect);

            // Actions
            const actions = document.createElement('div');
            actions.className = 'popup-actions';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'cancel';
            cancelBtn.onclick = (e) => {
                e.stopPropagation();
                this.showMonthYearPopup = false;
                this.render();
            };

            const okBtn = document.createElement('button');
            okBtn.textContent = 'OK';
            okBtn.onclick = (e) => {
                e.stopPropagation();
                const newMonth = parseInt(monthSelect.value, 10);
                const newYear = parseInt(yearSelect.value, 10);
                this.date.setFullYear(newYear);
                this.date.setMonth(newMonth);
                this.showMonthYearPopup = false;
                this.render();
            };

            actions.appendChild(cancelBtn);
            actions.appendChild(okBtn);
            popup.appendChild(actions);

            // Dismiss popup on outside click
            setTimeout(() => {
                const onDocClick = (ev) => {
                    if (!popup.contains(ev.target) && !monthYear.contains(ev.target)) {
                        this.showMonthYearPopup = false;
                        this.render();
                        document.removeEventListener('mousedown', onDocClick);
                    }
                };
                document.addEventListener('mousedown', onDocClick);
            }, 0);

            header.appendChild(popup);
        }

        // Days of week
        const daysRow = document.createElement('div');
        daysRow.className = 'calendar-days-row';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day-name';
            dayEl.textContent = day;
            daysRow.appendChild(dayEl);
        });

        // Dates
        const datesGrid = document.createElement('div');
        datesGrid.className = 'calendar-dates-grid';

        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fill empty slots before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            datesGrid.appendChild(emptyCell);
        }

        // Fill days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = d;
            if (
                d === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            ) {
                dateCell.classList.add('today');
            }
            if (
                this.dateSelected &&
                d === this.dateSelected.getDate() &&
                month === this.dateSelected.getMonth() &&
                year === this.dateSelected.getFullYear()
            ) {
                dateCell.classList.add('selected');
            }
            dateCell.onclick = () => this.selectDate(d);
            datesGrid.appendChild(dateCell);
        }

        calendar.appendChild(header);
        calendar.appendChild(daysRow);
        calendar.appendChild(datesGrid);
        this.container.appendChild(calendar);
    }

    changeMonth(delta) {
        this.date.setMonth(this.date.getMonth() + delta);
        this.showMonthYearPopup = false;
        this.render();
    }

    selectDate(day) {
        const selectedDate = new Date(this.date.getFullYear(), this.date.getMonth(), day);
        this.dateSelected = selectedDate;
        this.onDateSelect(selectedDate);
        this.render();
    }
}

// Export for module usage
window.CalendarWidget = CalendarWidget;
export default CalendarWidget;