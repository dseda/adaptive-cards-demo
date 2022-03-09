import weatherTemplate from "./weatherTemplate.json" assert { type: "json" };
const API_KEY = config.MY_API_TOKEN;
// Create a new instance of AdaptiveCard Templating
let template = new ACData.Template(weatherTemplate);
//Create a new instance of Adaptive Card
let adaptiveCard = new AdaptiveCards.AdaptiveCard();

adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
  fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
});
window.addEventListener("load", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-bar");
  form.addEventListener("submit", searchCity);

  function searchCity(e) {
    e.preventDefault();
    // Base url for the request to OpenWeatherMap API
    const base = `https://api.openweathermap.org/data/2.5/weather?q=
      ${input.value}&appid=${API_KEY}&units=metric`;

    // Fetch API response
    fetch(base)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // access the data required
        const temp = Math.floor(data.main.temp);
        const temp_min = Math.floor(data.main.temp_min);
        const temp_max = Math.ceil(data.main.temp_max);
        const place = data.name;
        const country = data.sys.country;
        let { description, icon, main } = data.weather[0];

        //Capitalize each first letter of the description text
        let arr = description.split(" ");
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        description = arr.join(" ");

        const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        var cardPayload = template.expand({
          $root: {
            name: `${place}`,
            country: `${country}`,
            imgUrl: `${imgURL}`,
            temperature: `${temp}`,
            highest: `${temp_max}`,
            lowest: `${temp_min}`,
            desc: `${description}`,
            desc_short: `${main}`,
          },
        });

        adaptiveCard.parse(cardPayload);

        //Render the card
        document
          .getElementById("weather-card")
          .replaceChildren(adaptiveCard.render());
      })
      .catch((error) => {
        console.error("There has been a problem with your operation:", error);
      });
  }
});
