const router = require("express").Router();
const TimelineController = require("../controllers/TimelineController.js");

router.get("/", TimelineController.getTimelines);
router.get("/:id", TimelineController.getTimeline);
router.post("/", TimelineController.createTimeline);
router.put("/:id", TimelineController.updateTimeline);
router.delete("/:id", TimelineController.deleteTimeline);

module.exports = router;
