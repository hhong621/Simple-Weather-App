/**
 * Simple Weather App
 * 
 * Enhancements
 * - Fix exposed API key
 * - Day/night using sunrise/sunset
 * - Remove city
 * - Local storage
 */

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "3b6e62ab14258234640fdfb3956b096f";

form.addEventListener("submit", e => {
    e.preventDefault();
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    const inputVal = input.value;

    // has there been a successful AJAX request?
    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            if (inputVal.includes(",")) {
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        // city is already in array
        if (filteredArray.length > 0) {
            msg.textContent = "City already added OR Country code needed";
            form.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            console.log(response);
            const { main, name, sys, weather, timezone } = response;
            const icon = `/icons/${
                weather[0]["icon"]
            }.svg`;

            const li = document.createElement("li");
            li.classList.add("city");

            const localTime = new Date().getTime();
            const localOffset = new Date().getTimezoneOffset();
            const utc = localTime + localOffset * 60 * 1000;
            const searchTime = utc + timezone * 1000;
            const searchHours = new Date(searchTime).getHours();
            console.log(searchTime);
            console.log(searchHours);
            console.log(sys.sunrise * 1000); // why doesn't this work
            console.log(sys.sunset * 1000);
            if (searchHours > 5 && searchHours < 19) {
                console.log("day");
                li.classList.add("day");
            } else {
                console.log("night");
                li.classList.add("night")
            }

            const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                    <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                    <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);
        },
        error: function(xhr, status, error) {
            console.error(status, error);
            msg.textContent = "Please search for a valid city";
        }
    });

    msg.textContent = "";
    form.reset();
});