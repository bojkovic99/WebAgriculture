const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();

const router = require("./route");
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/app', router);





const port1 = 3000;
app.listen(port1, () => {
    console.log("Server je startovan na portu " + port1 + " !");
});




