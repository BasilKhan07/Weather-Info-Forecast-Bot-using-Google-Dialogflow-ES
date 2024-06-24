# DFES Weather Bot - README

## Project Overview

This project involves creating a Weather Info & Forecast Bot using Google Dialogflow ES. The bot is designed to provide users with current and forecasted global weather information for specific cities. The forecast can extend up to 8 days from the current date. The bot interacts with users through a conversational flow, retrieves weather data via a REST API, and displays the information within the Dialogflow chat interface.

## Features

- **Current Weather Information**: Get current weather details for a specified city.
- **Weather Forecast**: Obtain weather forecasts for up to the next 8 days for a specified city.

## Objectives

1. **Dialogflow ES Setup and Configuration**:
   - Build the conversational flow as illustrated in the provided sequence diagram.
   - Configure a fulfillment webhook using a hosted service (e.g., ngrok).

2. **REST API Development**:
   - Create a REST API to handle webhook requests from the Dialogflow bot.
   - Extract city and date from the webhook request.
     - Fetch the current date/time from the chat session if no date is provided.
     - Calculate the forecast period (up to 8 days from the start date).
   - Use the OpenWeatherMap API to fetch weather data.
   - Return the weather information to the bot for display.

## Architecture

![Architecture Diagram](images/Architecture.png)

### Conversational Flow

![Architecture Diagram](images/conversational.png)

The bot will follow a defined sequence of interactions to understand the user's request and provide the relevant weather information.

### System Components
- **Dialogflow ES**: Manages the conversational interface.
- **Webhook Service**: Processes requests from Dialogflow, fetches weather data, and returns responses.
- **OpenWeatherMap API**: Provides current and forecasted weather data.

## Setup Instructions

### Prerequisites
- Google Dialogflow ES account
- Ngrok account for webhook URL hosting
- OpenWeatherMap API key
- Backend development environment (Node.js, Python, etc.)

### Steps

1. **Dialogflow Agent Setup**:
   - Create a new Dialogflow ES agent.
   - Define intents and entities as per the conversational flow diagram.
   - Configure the webhook in Dialogflow to point to your hosted webhook URL (e.g., ngrok).

2. **Webhook Service Setup**:
   - Develop the REST API using your preferred backend language/framework.
   - Ensure the API can handle webhook requests from Dialogflow.
   - Integrate the OpenWeatherMap API to fetch weather data based on the user's input.

3. **Testing**:
   - Test the Dialogflow bot interactions to ensure it can handle various weather-related queries.
   - Verify the API responses and ensure correct data is displayed in the Dialogflow chat interface.

## Resources

- [Dialogflow ES](https://dialogflow.cloud.google.com/#/login)
- [Ngrok](https://ngrok.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)
