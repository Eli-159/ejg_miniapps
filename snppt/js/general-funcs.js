function getStringDate(format, inputDate) {
    // Loads the date object into a variable.
    const date = (typeof inputDate == 'object' ? inputDate : new Date());
    // Extracts the year, month and day from the date object.
    const year = date.getFullYear();
    const month = (date.getMonth()+1 <= 9 ? '0'+(date.getMonth()+1).toString() : (date.getMonth()+1).toString());
    const day = (date.getDate() <= 0 ? '0'+date.getDate().toString() : date.getDate().toString());
    // Tests for a series of inputed formats and returns the requested format.
    if (format == '/dmy') {
        // Format '/dmy' returns 'dd/mm/yyyy'.
        return day + '/' + month + '/' + year;
    } else if (format == '/ymd') {
        // Format '/ymd' returns 'yyyy/mm/dd'.
        return year + '/' + month + '/' + day;
    } else if (format == '-dmy') {
        // Format '-dmy' returns 'dd-mm-yyyy'.
        return day + '-' + month + '-' + year;
    } else if (format == '-ymd') {
        // Format '-ymd' returns 'yyyy-mm-dd'.
        return year + '-' + month + '-' + day;
    } else if (format == '.dmy') {
        // Format '.dmy' returns 'dd.mm.yyyy'.
        return day + '.' + month + '.' + year;
    } else if (format == '.ymd') {
        // Format '.ymd' returns 'yyyy.mm.dd'.
        return year + '.' + month + '.' + day;
    } else if (format == 'dmy') {
        // Format 'dmy' returns 'ddmmyyyy'.
        return day + month + year;
    } else {
        // Format 'ymd' or anything else returns 'yyyymmdd'.
        return year + month + day;
    }
}

// Waits for the document to load.
document.addEventListener('DOMContentLoaded', () => {
    // Waits for 50ms.
    setTimeout(() => {
        // Gets all elements with the 'stop-page-load-transition' class and removes it, meaning the transitions can be applied.
        const noTransClass = document.getElementsByClassName('stop-page-load-transition');
        while (noTransClass.length > 0) {
            noTransClass[0].classList.remove('stop-page-load-transition');
        };
    }, 50);
});