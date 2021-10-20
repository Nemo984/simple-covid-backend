const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var host = req.headers.host;
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", true);

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/timelines", require("./routes/timelines.js"));

app.get("/", (req, res) => {
    res.send("res");
});

PORT = process.env.PORT || 5000;

module.exports = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
