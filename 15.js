import express from "express";
import axios from "axios";

const app = express();

app.get("/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).send({ error: "City required" });

    const api1 = `https://api.weatherapi.com/v1/current.json?key=DEMO&q=${city}`;
    const api2 = `https://api.open-meteo.com/v1/forecast?latitude=52.5&longitude=13.4&current_weather=true`;

    let responses = [];

    try {
        const r1 = await axios.get(api1);
        responses.push(r1.data.current.temp_c);
    } catch (e) {
        console.log("API 1 failed");
    }

    try {
        const r2 = await axios.get(api2);
        responses.push(r2.data.current_weather.temperature);
    } catch (e) {
        console.log("API 2 failed");
    }

    if (responses.length === 0)
        return res.status(500).send({ error: "All APIs failed" });

    // Calculate average
    const avgTemp =
        responses.reduce((a, b) => a + b, 0) / responses.length;

    return res.send({
        city,
        sources: responses.length,
        avgTemp,
    });
});

app.listen(4000, () => console.log("Weather aggregator running on 4000"));
