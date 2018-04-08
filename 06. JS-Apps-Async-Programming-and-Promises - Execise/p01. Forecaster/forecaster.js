function attachEvents() {
    let btnGetWeather = $('#submit');
    btnGetWeather.on('click', getWeather)

    let condSymbolObj = {
        'Sunny': '&#x2600',
        'Partly sunny': '&#x26C5',
        'Overcast': '&#x2601',
        'Rain': '&#x2614',
        'Degrees': '&#176'
    };

    function getWeather() {
        if($('#forecast').css('display', 'none')){
            $('#forecast').toggle();
        }

        $.ajax({
            method: 'GET',
            url: 'https://judgetests.firebaseio.com/locations.json'
        }).then(getForecasts)
            .catch(function (err) {
                console.log('Error')
            })
    }

    function getForecasts(res) {
        let locationName = $('#location').val();
        let locationCode;
        console.log(res)
        console.log(locationName);
        // console.log(res.name)
        for (let location of res) {
            if (locationName === location.name) {
                locationCode = location.code;
                console.log(locationCode)
                loadCurrentConditions(locationCode);
                load3DaysForeCast(locationCode);

            }
        }
    }

    function loadCurrentConditions(locationCode) {
        let currentDiv = $('#current')
        $('.condition').remove();

        $.ajax({
            method: 'GET',
            url: `https://judgetests.firebaseio.com/forecast/today/${locationCode}.json`
        }).then(function (res) {
            console.log('current res: ' + JSON.stringify(res));
            let locationName = res.name;
            let forecastLowTemp = res.forecast.low;
            let forecastHighTemp = res.forecast.high;
            let condition = res.forecast.condition;

            let spanCondSymbol = $($('<span class="condition symbol">').html(`${condSymbolObj[condition]}`));
            let spanCondition = $('<span class="condition">');
            let spanName = $('<span class="forecast-data">').text(locationName);
            let spanTemp = $('<span class="forecast-data">').html(`${forecastLowTemp}${condSymbolObj['Degrees']}/${forecastHighTemp}${condSymbolObj['Degrees']}`);
            let spanForecats = $('<span class="forecast-data">').text(condition);

            spanCondition.append(spanName);
            spanCondition.append(spanTemp);
            spanCondition.append(spanForecats);

            currentDiv.append(spanCondSymbol);
            currentDiv.append(spanCondition);
        }).catch(function (err) {
            $('#forecast').text('Error')
        })

    }

    function load3DaysForeCast(locationCode) {
        let upcomingDiv = $('#upcoming');
        $('.upcoming').remove();

        $.ajax({
            method: 'GET',
            url: `https://judgetests.firebaseio.com/forecast/upcoming/${locationCode}.json`
        }).then(function (res) {
            console.log('3Day res: ' + JSON.stringify(res));
            let locationName = res.name;
            for (let currentDay of res.forecast) {
                let forecastLowTemp = currentDay.low;
                let forecastHighTemp = currentDay.high;
                let condition = currentDay.condition;



                let spanUpcoming = $('<span class="condition">');
                let spanCondSymbol = $($('<span class="symbol">').html(`${condSymbolObj[condition]}`));
                let spanTemp = $('<span class="forecast-data">').html(`${forecastLowTemp}${condSymbolObj['Degrees']}/${forecastHighTemp}${condSymbolObj['Degrees']}`);
                let spanForecats = $('<span class="forecast-data">').text(condition);

                spanUpcoming.append(spanCondSymbol);
                spanUpcoming.append(spanTemp);
                spanUpcoming.append(spanForecats);

                upcomingDiv.append(spanUpcoming);
            }
        }).catch(function (err) {
            $('#forecast').text('Error')
        })
    }
}