

const express = require('express');
const routes = express.Router();
const ping = require("ping");
const axios = require("axios");
const geoip = require("geoip-lite");
const ServerTest = require("./models/test_models");

// Function to Get IP & Region Automatically
async function getIPAndRegion(req) {
    try {
        let clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          
        // Remove extra formatting if any (useful in some cases)
        clientIP = clientIP.split(",")[0].trim();
        // First Try: Offline Lookup using `geoip-lite`
        // "39.41.235.12"
        const geo = geoip.lookup(clientIP);
        
        if (geo && (geo.city || geo.country)) {
            const city = geo.city || "Unknown City";
            const country = geo.country || "Unknown Country";
            return { ip: clientIP, region: `${city}, ${country}` };
        }

        // Second Try: Online Lookup using `ip-api.com`
        const response = await axios.get(`http://ip-api.com/json/${clientIP}`);
        const { query: ip, country, regionName } = response.data;
        return { ip, region: `${regionName}, ${country}` };
    } catch (error) {
        // console.log("GeoIP Lookup Error:", error);
        return { ip: "Unknown", region: "Unknown" };
    }
}


routes.post('/test_latency' , async(req ,res) => {
     try {
      const start = Date.now(); 
    const { ip, region } = await getIPAndRegion(req);
        if (!ip || ip === "Unknown"){
            res.status(400).json({ error: "Could not determine IP" });
        }  
       
           // HTTP Request for Latency Measurement
         await axios.get(`http://69.62.125.138/client/test`);  // Timeout added
        
        const latency = Date.now() - start; // Calculate latency
         

        const newTest = new ServerTest({ ip, region, latency });
        await newTest.save();

        res.status(200).json(newTest);
    } catch (error) {
        // console.error("Latency Test Error:", error);
        res.status(500).json({ error: error.message });
    }

});


module.exports = routes;
