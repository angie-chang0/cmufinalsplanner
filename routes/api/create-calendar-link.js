const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.send("this is api route");
});

function convertFormat(time, period) {
    const [hour, minute] = time.split(':');
    let formattedHour = parseInt(hour);
    if (period === 'pm') {
        formattedHour += 12;
    }
    if (formattedHour < 10) {
        return `T0${formattedHour}${minute}00`
    }
    return `T${formattedHour}${minute}00`;
}

router.post('/create-calendar-link', async (req, res) => {
    const { title, location, date, time } = req.body;
    let dateString = date.split(' ')[1] + " " + date.split(' ')[2] + " " + date.split(' ')[3];
    const fullString = new Date(dateString + " 03:24:00");
    let month = fullString.getMonth() + 1;
    let day = fullString.getDate();
    let year = fullString.getFullYear();
    let startTime = convertFormat(time.slice(0, 5), time.slice(5, 7));
    let endTime = convertFormat(time.slice(8, 13), time.slice(13, 15));
    const googleCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&details=Good+luck+on+your+final!&text=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}&dates=${year}${month}${day}${startTime}/${year}${month}${day}${endTime}`;
    res.json({ calendarLink: googleCalLink });
});

  module.exports = router;