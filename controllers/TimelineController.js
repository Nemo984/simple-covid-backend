const { v4: uuidv4 } = require("uuid");

const pool = require("../db.js");

const getTimelines = async (req, res) => {
    const { lat, lon, radius } = req.query;
    const pastDays = req.query["past-days"];
    console.log(pastDays);
    let dateFrom;
    if (pastDays && pastDays > 0 && pastDays <= 365) {
        dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - pastDays);
        dateFrom = dateFrom.toISOString().slice(0, 10);
    }
    console.log(dateFrom);
    try {
        let response;
        if (lat && lon && radius && pastDays) {
            response = await pool.query(
                "SELECT date,address,latitude,longitude from timelines WHERE acos(sin(radians($1)) * sin(radians(latitude)) + cos(radians($1)) * cos(radians(latitude)) * cos( radians($2) - radians(longitude))) * 6371 <= $3 AND date >= $4::date",
                [lat, lon, radius, dateFrom]
            );
        } else if (lat && lon && radius) {
            response = await pool.query(
                "SELECT date,address,latitude,longitude from timelines WHERE acos(sin(radians($1)) * sin(radians(latitude)) + cos(radians($1)) * cos(radians(latitude)) * cos( radians($2) - radians(longitude))) * 6371 <= $3",
                [lat, lon, radius]
            );
        } else {
            response = await pool.query(
                "SELECT date,address,latitude,longitude from timelines ORDER BY date DESC"
            );
        }
        res.status(200).send(response["rows"]);
    } catch (err) {
        res.status(500).send(err);
    }
};

//get individual timeline
const getTimeline = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT id,TO_CHAR(date, 'DD/MM/YYYY') as date,address FROM timelines WHERE user_id = $1 ORDER BY date DESC",
            [id]
        );
        res.status(200).send(rows);
    } catch (err) {
        res.status(400).send(err);
    }
};

const createTimeline = async (req, res) => {
    //uid,date,address,latitude,longitude
    const { uid, date, address, latitude, longitude } = req.body;
    const uuid = uuidv4();
    try {
        const { rows } = await pool.query(
            "INSERT INTO timelines (id,user_id,date,address,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,user_id AS uid,TO_CHAR(date, 'DD/MM/YYYY') as date,address,latitude,longitude",
            [uuid, uid, date, address, latitude, longitude]
        );
        res.status(201).send(rows[0]);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updateTimeline = async (req, res) => {
    const { id } = req.params;
    const { date, address, latitude, longitude } = req.body;
    try {
        const { rows } = await pool.query(
            "UPDATE timelines SET date = $2, address = $3, latitude = $4, longitude = $5 WHERE id = $1 RETURNING id,date,address,latitude,longitude",
            [id, date, address, latitude, longitude]
        );
        res.status(200).send(rows[0]);
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteTimeline = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM timelines WHERE id = $1", [id]);
        res.status(204).send("Deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    getTimelines,
    getTimeline,
    createTimeline,
    deleteTimeline,
    updateTimeline,
};
