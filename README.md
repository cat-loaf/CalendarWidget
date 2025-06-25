# Calendar Widget

A simple, modern, and customizable JavaScript calendar widget with a month/year selector popup. This widget is designed for easy embedding in web pages and supports both mouse and keyboard navigation. It is fully self-contained, requiring no dependencies, and is styled with a clean, responsive look.

## Features

- **Month/Year Selector Popup:** Quickly jump to any month or year using a popup selector.
- **Today Highlighting:** The current date is visually highlighted.
- **Date Selection:** Click any date to select it; the selected date is highlighted.
- **Customizable Callback:** Run custom code when a date is selected.
- **No Dependencies:** Pure JavaScript and CSS-in-JS.

## Getting Started
1. Download the `calendar-widget.js` file
2. Include the widget in your page
3. Instantiate the widget with an element for the calendar

```html
<div class="calendar"></div>
<script type="module">
  import CalendarWidget from './calendar-widget.js';
  const calElem = document.querySelector('.calendar');
  const calendar = new CalendarWidget(calElem, {
    date: '2024-06-01', // Optional: initial date (string or Date)
    onDateSelect: (date) => {
      alert('Selected: ' + date.toDateString());
    }
  });
</script>
```
---

The `Calendar` widget provides a user interface component for displaying and interacting with dates in a calendar format.

 
This widget can be used in scheduling, booking, or event management applications to provide users with a visual and interactive way to select dates and view associated events.

---
