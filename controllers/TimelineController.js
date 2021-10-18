const { v4: uuidv4 } = require("uuid");

const pool = require("../db.js");

const getTimelines = async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    try {
        if (latitude && longitude && radius) {
            const { rows } = await pool.query(
                "SELECT * from timelines WHERE acos(sin(radians($1)) * sin(radians(latitude)) + cos(radians($1)) * cos(radians(latitude)) * cos( radians($2)- radians(longitude))) * 6371 <= $3;",
                [latitude, longitude, radius]
            );
            res.status(200).send(rows);
        } else {
            const { rows } = await pool.query(
                "SELECT * from timelines ORDER BY date DESC"
            );
            res.status(200).send(rows);
        }
    } catch (err) {
        res.status(500).send("Server error");
    }
};

//get individual timeline
const getTimeline = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT id,date,address FROM timelines WHERE user_id = $1 ORDER BY date DESC",
            [id]
        );
        res.status(200).send(rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const createTimeline = async (req, res) => {
    //uid,date,address,latitude,longitude
    const { uid, date, address, latitude, longitude } = req.body;
    const uuid = uuidv4();
    try {
        const { rows } = await pool.query(
            "INSERT INTO timelines (id,user_id,date,address,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id AS uid,date,address,latitude,longitude",
            [uuid, uid, date, address, latitude, longitude]
        );
        res.status(201).send(rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const updateTimeline = async (req, res) => {
    const { id } = req.params;
    const { date, address, latitude, longitude } = req.body;
    console.log(req.body, id);
    try {
        const { rows } = await pool.query(
            "UPDATE timelines SET date = $2 address = $3 latitude = $4 longitude = $5 WHERE id = $1 RETURNING user_id AS uid,date,address,latitude,longitude",
            [id, date, address, latitude, longitude]
        );
        res.status(200).send(rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const deleteTimeline = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM timelines WHERE id = $1", [id]);
        res.status(200).send(`Timeline ${id} deleted`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = {
    getTimelines,
    getTimeline,
    createTimeline,
    deleteTimeline,
    updateTimeline,
};
