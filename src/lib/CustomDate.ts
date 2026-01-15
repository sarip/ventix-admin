import moment from "moment/moment";

function convertUnixToDate(unix, format = "DD-MM-YYYY") {
    return moment(unix * 1000).format(format)
}

function convertTo12HourFormat(time24) {
    let [hour, minute] = time24.split(":").map(Number);
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Ubah 0 atau 12 ke format 12 jam
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}


function getCurrentDateTime() {
    const now = new Date();

    const formatted =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    return formatted;
}


export  {convertUnixToDate, convertTo12HourFormat, getCurrentDateTime}