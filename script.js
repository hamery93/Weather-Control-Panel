// var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];


$(document).ready(function () {




    $("#userSearch").on("click", function () {

        var cityName = $("#userInput").val();

        $("#userInput").val("");

        searchWeather(cityName);



    })




    $(".history").on("click", "li", function () {



    })

    function makeRow(text) {

    }

    function searchWeather(cityName) {

        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
            cityName + "&appid=a474538ef7da914bc793b0a7b8480af5&units=imperial";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var dateInfo = response.dt;
            console.log(dateInfo);
            var currentDate = moment.unix(dateInfo).format("L");
            console.log("current date:  " + currentDate);

            //Local storage here, use prior assisgment 
            $("#today").empty()

            var card = $("<div>").addClass("card")
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " mph")
            var temp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + "  F")
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + " %")
            var date = $("<p>").addClass("card-text").text("Current Date: " + currentDate)
            var cardBody = $("<div>").addClass("card-body")
            // var icon ---------this is just weather icon

            cardBody.append(date, temp, wind, humidity) //put icon here when you  get it
            card.append(cardBody)
            $("#today").append(card)
            getForecast(cityName);


            var lon = response.coord.lon;
            var lat = response.coord.lat;

            // SEND OVER TO uvIndex()
            uvIndex(lon, lat);


        });


    }

    function uvIndex(lon, lat) {

        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=a474538ef7da914bc793b0a7b8480af5&lat=";
        var mid = "&lon=";
        var searchUV = queryURL + lat + mid + lon;

        $.ajax({
            url: searchUV,
            method: "GET"
        }).then(function (response) {
            var uvFinal = response.value;
            console.log(uvFinal);

            $("#today").append("UV Index:  ");
            var uvButton = $("<button>").text(uvFinal);
            $("#today").append(uvButton);

            if (uvFinal < 3) {

                uvButton.attr("class", "Green");
            } else if (uvFinal < 6) {

                uvButton.attr("class", "Yellow");
            } else if (uvFinal < 8) {

                uvButton.attr("class", "Orange");
            } else if (uvFinal < 11) {

                uvButton.attr("class", "Red");
            } else {

                uvButton.attr("class", "Purple");
            }





        });
    }




    function getForecast(cityName) {

        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" +
            cityName + "&appid=a474538ef7da914bc793b0a7b8480af5&units=imperial";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
            
            $("#forecast").html("<h3 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            


            for (var i = 0; i < response.list.length; i++) {

                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var col = $("<div>").addClass("col-md-2")
                    var card = $("<div>").addClass("card bg-primary text-white")
                    var body = $("<div>").addClass("card-body p-2")
                    var icon = response.list[i].weather[0].icon;
                    var showIcon = $("<img src=http://openweathermap.org/img/wn/" + icon + ".png />")


                    // var title come back to this
                    var temp = $("<p>").addClass("card-text").text("Temp   " + response.list[i].main.temp + "  F");
                    var humid = $("<p>").addClass("card-text").text("Humidity   " + response.list[i].main.humidity + "  %");
                    var dateOne = $("<p>").addClass("card-text").text( moment.unix(response.list[i].dt).utc().format("L"))

                    col.append(card.append(body.append(dateOne, temp, humid, showIcon))) //put icon and title in here too
                    $("#forecast .row").append(col)
                }

            }

        })
    }
})