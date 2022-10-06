const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

/*
 * Receive a Array of Vehicles.
 * Return a Array with Vechicles Models.
 */
async function getVehiclesModels(vehicles) {
    let vehiclesModels = [];
        
    await Promise.all(vehicles.map( async (e) =>{
        let response = await axios.get(e);  
        vehiclesModels.push(response.data.model)
    })); 
    
    return vehiclesModels;
}

app.get('/api/metric/:id', async (req, res) => {

    let response = await axios.get('https://swapi.dev/api/people');
    
    let metricId = response.data.results.filter((e, index) => index < req.params.id);
    
    let responseAll = { "charts": [] };
    metricId.map((e) => {
        responseAll.charts.push({ "label": e.name, "values": e.vehicles });
    });

    await Promise.all(responseAll.charts.map( async (e) => {
        e.values = await getVehiclesModels(e.values);
    }));

   

    res.status(200).send(responseAll);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})