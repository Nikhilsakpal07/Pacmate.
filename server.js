const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 4000;

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming JSON requests
app.use(express.json());

// AccuWeather API Key
const apiKey = 's5ltvvMe3Vx7j4b1rtohNxpdUmotmRPB';
const baseUrl = 'http://dataservice.accuweather.com';

// Function to fetch the location key from AccuWeather API
const getLocationKey = async (location) => {
    try {
        const response = await axios.get(`${baseUrl}/locations/v1/cities/search`, {
            params: {
                q: location,
                apikey: apiKey
            }
        });
        if (response.data.length > 0) {
            return response.data[0].Key;
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error fetching location key:', error.message);
        throw error;
    }
};

// Function to fetch current weather data using the location key
const getWeatherData = async (locationKey) => {
    try {
        const response = await axios.get(`${baseUrl}/currentconditions/v1/${locationKey}`, {
            params: { apikey: apiKey }
        });
        if (response.data.length > 0) {
            return response.data[0];
        } else {
            throw new Error('Weather data not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error;
    }
};

// Function to generate packing suggestions based on weather and activity
const getPackingSuggestions = (weather, activity) => {
    const suggestions = [];
    const temp = weather.Temperature.Metric.Value;

    // Weather-based suggestions
    if (temp < 10) {
        suggestions.push('Warm clothes');
    } else if (temp >= 10 && temp <= 25) {
        suggestions.push('Moderate clothing');
    } else {
        suggestions.push('Light clothing');
    }

    if (weather.HasPrecipitation) {
        suggestions.push('Raincoat or umbrella');
    }

    // Activity-based suggestions
   if (activity.toLowerCase() === 'hiking') {
    suggestions.push('Hiking boots', 'Backpack', 'Water bottle');
} else if (activity.toLowerCase() === 'beach') {
    suggestions.push('Swimwear', 'Sunscreen', 'Beach towel');
} else if (activity.toLowerCase() === 'camping') {
    suggestions.push('Tent', 'Sleeping bag', 'Flashlight');
} else if (activity.toLowerCase() === 'cycling') {
    suggestions.push('Helmet', 'Cycling gloves', 'Water bottle');
} else if (activity.toLowerCase() === 'skiing') {
    suggestions.push('Ski jacket', 'Goggles', 'Ski poles');
} else if (activity.toLowerCase() === 'fishing') {
    suggestions.push('Fishing rod', 'Tackle box', 'Waders');
} else if (activity.toLowerCase() === 'yoga') {
    suggestions.push('Yoga mat', 'Comfortable clothing', 'Water bottle');
} else if (activity.toLowerCase() === 'photography') {
    suggestions.push('Camera', 'Tripod', 'Extra batteries');
} else if (activity.toLowerCase() === 'kayaking') {
    suggestions.push('Life jacket', 'Waterproof bag', 'Paddle');
} else if (activity.toLowerCase() === 'birdwatching') {
    suggestions.push('Binoculars', 'Notebook', 'Field guide');
} else if (activity.toLowerCase() === 'rock climbing') {
    suggestions.push('Climbing shoes', 'Harness', 'Chalk bag');
} else if (activity.toLowerCase() === 'painting') {
    suggestions.push('Canvas', 'Paints', 'Brushes');
} else if (activity.toLowerCase() === 'snowboarding') {
    suggestions.push('Snowboard', 'Helmet', 'Snow goggles');
} else if (activity.toLowerCase() === 'gardening') {
    suggestions.push('Gloves', 'Trowel', 'Seeds');
} else if (activity.toLowerCase() === 'road trip') {
    suggestions.push('Snacks', 'Road map', 'First aid kit');
} else if (activity.toLowerCase() === 'boating') {
    suggestions.push('Life jacket', 'Boat shoes', 'Sunscreen');
} else if (activity.toLowerCase() === 'running') {
    suggestions.push('Running shoes', 'Sportswear', 'Water bottle');
} else if (activity.toLowerCase() === 'scuba diving') {
    suggestions.push('Wetsuit', 'Diving mask', 'Fins');
} else if (activity.toLowerCase() === 'surfing') {
    suggestions.push('Surfboard', 'Wetsuit', 'Wax');
} else if (activity.toLowerCase() === 'picnic') {
    suggestions.push('Picnic basket', 'Blanket', 'Cooler');
} else if (activity.toLowerCase() === 'mountaineering') {
    suggestions.push('Climbing gear', 'Insulated jacket', 'Ice axe');
} else if (activity.toLowerCase() === 'rafting') {
    suggestions.push('Life jacket', 'Dry bag', 'Paddle');
} else if (activity.toLowerCase() === 'ziplining') {
    suggestions.push('Comfortable clothes', 'Closed-toe shoes', 'Gloves');
} else if (activity.toLowerCase() === 'city tour') {
    suggestions.push('Comfortable walking shoes', 'Guidebook', 'Camera');
} else if (activity.toLowerCase() === 'museum visit') {
    suggestions.push('Notebook', 'Pen', 'Comfortable shoes');
} else if (activity.toLowerCase() === 'concert') {
    suggestions.push('Tickets', 'Earplugs', 'Portable charger');
} else if (activity.toLowerCase() === 'stargazing') {
    suggestions.push('Telescope', 'Blanket', 'Star map');
} else if (activity.toLowerCase() === 'skating') {
    suggestions.push('Skates', 'Helmet', 'Knee pads');
} else if (activity.toLowerCase() === 'horse riding') {
    suggestions.push('Helmet', 'Riding boots', 'Gloves');
} else if (activity.toLowerCase() === 'golfing') {
    suggestions.push('Golf clubs', 'Gloves', 'Golf balls');
} else if (activity.toLowerCase() === 'tennis') {
    suggestions.push('Racket', 'Tennis balls', 'Sports shoes');
} else if (activity.toLowerCase() === 'archery') {
    suggestions.push('Bow', 'Arrows', 'Target');
} else if (activity.toLowerCase() === 'zoo visit') {
    suggestions.push('Binoculars', 'Camera', 'Water bottle');
} else if (activity.toLowerCase() === 'amusement park') {
    suggestions.push('Comfortable clothes', 'Sunscreen', 'Backpack');
} else if (activity.toLowerCase() === 'snowshoeing') {
    suggestions.push('Snowshoes', 'Warm clothing', 'Walking poles');
} else if (activity.toLowerCase() === 'biking') {
    suggestions.push('Bike', 'Helmet', 'Repair kit');
}


    return suggestions;
};

// API endpoint for generating packing suggestions
app.post('/getPackingSuggestions', async (req, res) => {
    const { location, activity } = req.body;
    if (!location || !activity) {
        return res.status(400).json({ error: 'Both location and activity are required.' });
    }

    try {
        const locationKey = await getLocationKey(location);
        const weatherData = await getWeatherData(locationKey);
        const suggestions = getPackingSuggestions(weatherData, activity);
        res.json({ location, weather: weatherData, suggestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
