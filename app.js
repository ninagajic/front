const path = require("path");
const express = require("express");
// const {sequelize} = require("./models");

const app = express();
app.use(express.json());

const cors = require('cors');
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'static')));

app.listen({port:8000}, async() => {
    console.log("Started on port 8000");
    // await sequelize.authenticate();
});
