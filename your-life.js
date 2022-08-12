(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const day = parseInt(urlParams.get('day'))
    const month = parseInt(urlParams.get('month')) - 1
    const year = parseInt(urlParams.get('year'))

    localStorage.setItem("DOB", JSON.stringify({month: month, year: year, day: day}));

    itemCount = calculateElapsedTime();
    var yearEl = document.getElementById('year'), monthEl = document.getElementById('month'),
        dayEl = document.getElementById('day'), unitboxEl = document.getElementById('unitbox'),
        unitText = document.querySelector('.unitbox-label').textContent.toLowerCase(),
        items = document.querySelectorAll('.chart li'), itemCount, COLOR = 'red', KEY = {UP: 38, DOWN: 40};
    unitboxEl.addEventListener('change', _handleUnitChange);
    yearEl.addEventListener('input', _handleDateChange);
    yearEl.addEventListener('keydown', _handleUpdown);
    yearEl.addEventListener('blur', _unhideValidationStyles);
    monthEl.addEventListener('change', _handleDateChange);
    monthEl.addEventListener('keydown', _handleUpdown);
    dayEl.addEventListener('input', _handleDateChange);
    dayEl.addEventListener('blur', _unhideValidationStyles);
    dayEl.addEventListener('keydown', _handleUpdown);
    monthEl.selectedIndex = -1;
    _loadStoredValueOfDOB();

    function _handleUnitChange(e) {
        window.location = '' + e.currentTarget.value + '.html';
    }

    function _handleDateChange(e) {
        localStorage.setItem("DOB", JSON.stringify({month: monthEl.value, year: yearEl.value, day: dayEl.value}));
        if (_dateIsValid()) {
            itemCount = calculateElapsedTime();
            _repaintItems(itemCount);
        } else {
            _repaintItems(0);
        }
    }

    function _handleUpdown(e) {
        var newNum;
        thisKey = e.keyCode || e.which;
        if (e.target.checkValidity()) {
            if (thisKey === KEY.UP) {
                newNum = parseInt(e.target.value, 10);
                e.target.value = newNum += 1;
                _handleDateChange();
            } else if (thisKey === KEY.DOWN) {
                newNum = parseInt(e.target.value, 10);
                e.target.value = newNum -= 1;
                _handleDateChange();
            }
        }
    }

    function _unhideValidationStyles(e) {
        e.target.classList.add('touched');
    }

    function calculateElapsedTime() {
        var currentDate = new Date(), dateOfBirth = _getDateOfBirth(),
            diff = currentDate.getTime() - dateOfBirth.getTime(), elapsedTime;
        switch (unitText) {
            case 'weeks':
                var elapsedYears = (new Date(diff).getUTCFullYear() - 1970);
                var isThisYearsBirthdayPassed = (currentDate.getTime() > new Date(currentDate.getUTCFullYear(), monthEl.value, dayEl.value).getTime());
                var birthdayYearOffset = isThisYearsBirthdayPassed ? 0 : 1;
                var dateOfLastBirthday = new Date(currentDate.getUTCFullYear() - birthdayYearOffset, monthEl.value, dayEl.value);
                var elapsedDaysSinceLastBirthday = Math.floor((currentDate.getTime() - dateOfLastBirthday.getTime()) / (1000 * 60 * 60 * 24));
                var elapsedWeeks = (elapsedYears * 52) + Math.floor(elapsedDaysSinceLastBirthday / 7);
                elapsedTime = elapsedWeeks;
                break;
            case 'months':
                elapsedTime = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
                break;
            case 'years':
                elapsedTime = (new Date(diff).getUTCFullYear() - 1970);
                break;
        }
        return elapsedTime;
    }

    function _dateIsValid() {
        return monthEl.checkValidity() && dayEl.checkValidity() && yearEl.checkValidity();
    }

    function _getDateOfBirth() {

        return new Date(year, month, day);
    }

    function _repaintItems(number) {
        for (var i = 0; i < items.length; i++) {
            if (i < number) {
                items[i].style.backgroundColor = COLOR;
            } else {
                items[i].style.backgroundColor = '';
            }
        }
    }

    function _loadStoredValueOfDOB() {
        var DOB = JSON.parse(localStorage.getItem('DOB'));
        if (!DOB) {
            return;
        }
        if (DOB.month >= 0 && DOB.month < 12) {
            monthEl.value = DOB.month
        }
        if (DOB.year) {
            yearEl.value = DOB.year
        }
        if (DOB.day > 0 && DOB.day < 32) {
            dayEl.value = DOB.day
        }
        _handleDateChange();
    }
})();
