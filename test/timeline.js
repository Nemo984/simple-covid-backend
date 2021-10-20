const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");

chai.should();

chai.use(chaiHttp);
describe("Timelines API", () => {
    /**
     * POST ROUTE
     */
    let id, uid;
    describe("POST /api/timelines", () => {
        it("Should Post a new timeline", (done) => {
            const timeline = {
                uid: "34ra9-af-a3-adfa3",
                date: "2021-04-20",
                address: "Long island",
                latitude: 13.894115850169836,
                longitude: 100.55988371338093,
            };
            chai.request(server)
                .post("/api/timelines")
                .send(timeline)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("id");
                    id = res.body.id;
                    res.body.should.have.property("uid").eq(timeline.uid);
                    uid = res.body.uid;
                    res.body.should.have.property("date");
                    res.body.should.have
                        .property("address")
                        .eq(timeline.address);
                    res.body.should.have
                        .property("latitude")
                        .eq(timeline.latitude);
                    res.body.should.have
                        .property("longitude")
                        .eq(timeline.longitude);
                    done();
                });
        });
    });

    /**
     * GET ROUTE
     */
    describe("GET /api/timelines", () => {
        it("Should GET all the timelines", (done) => {
            chai.request(server)
                .get("/api/timelines")
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    /**
     * GET (by id) ROUTE
     */
    describe("GET /api/timelines/:id", () => {
        it("Should GET all timelines of user id", (done) => {
            chai.request(server)
                .get("/api/timelines/" + uid)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    /**
     * PUT ROUTE
     */
    describe("PUT /api/timelines/:id", () => {
        it("Should PUT a timeline", (done) => {
            const timeline = {
                date: "2021-04-21",
                address: "Short isladfnd",
                latitude: 13.894115850169844,
                longitude: 100.55988371338093,
            };
            chai.request(server)
                .put("/api/timelines/" + id)
                .send(timeline)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("date");
                    res.body.should.have
                        .property("address")
                        .eq(timeline.address);
                    res.body.should.have
                        .property("latitude")
                        .eq(timeline.latitude);
                    res.body.should.have
                        .property("longitude")
                        .eq(timeline.longitude);
                    done();
                });
        });
    });

    /**
     * DELETE ROUTE
     */
    describe("DELETE /api/timelines/:id", () => {
        it("Should DELETE Timeline by id", (done) => {
            chai.request(server)
                .delete("/api/timelines/" + id)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
