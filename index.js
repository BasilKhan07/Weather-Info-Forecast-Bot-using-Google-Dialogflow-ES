const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const moment = require("moment");
const ngrok = require("ngrok");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

const OPENWEATHERMAP_API_KEY = "bc9a94a8df10d265337e308c5e3f0e84";

app.post("/webhook", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function getCurrentWeather(agent) {
    const city = agent.parameters["geo-city"];

    return axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${OPENWEATHERMAP_API_KEY}&units=metric`
      )
      .then((weatherResponse) => {
        const weather = weatherResponse.data;
        const responseMessage = `The current weather for ${city} is ${weather.weather[0].description} with a temperature of ${weather.main.temp}°C.`;
        agent.add(responseMessage);
      })
      .catch((error) => {
        console.error(error);
        agent.add(
          `I couldn't retrieve the weather information for ${city}. Please try again later.`
        );
      });
  }

  async function getWeatherForecast(agent) {
    const city = agent.parameters["geo-city"];
    let startDate = agent.parameters["date"];

    if (!startDate) {
      startDate = moment().format("YYYY-MM-DD");
    }

    const endDate = moment(startDate).add(7, "days").format("YYYY-MM-DD");

    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
      );

      if (geoResponse.data.length === 0) {
        agent.add(`No location found for city: ${city}`);
        return;
      }

      const location = geoResponse.data[0];
      const latitude = location.lat;
      const longitude = location.lon;

      let responseMessage = `The forecasted weather from ${formattedStartDate} to ${formattedEndDate} for ${city} is:\n`;

      for (
        let date = moment(formattedStartDate);
        date.isBefore(formattedEndDate);
        date.add(1, "days")
      ) {
        const dateString = date.format("YYYY-MM-DD");
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${latitude}&lon=${longitude}&date=${dateString}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`, { timeout: 6000 }
        );
        const daySummary = weatherResponse.data;

        responseMessage += `${dateString}: \nTemperature: (${daySummary.temperature.min}°C - ${daySummary.temperature.max}°C), Cloud Cover: ${daySummary.cloud_cover.afternoon}%, Humidity: ${daySummary.humidity.afternoon}%.\n`;
      }

      agent.add(responseMessage);
    } catch (error) {
      console.error(error);
      agent.add(
        `I couldn't retrieve the weather forecast for ${city}. Please try again later.`
      );
    }
  }

  let intentMap = new Map();
  intentMap.set("GetCurrentWeather", getCurrentWeather);
  intentMap.set("GetForecastWeather", getWeatherForecast);

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  ngrok
    .connect(PORT)
    .then((ngrokUrl) => {
      console.log(`Ngrok tunnel in: ${ngrokUrl}`);
    })
    .catch((error) => {
      console.log(`Coundn't connect ngrok: ${error}`);
    });
});
