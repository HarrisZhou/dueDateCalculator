var express = require('express');
const calculateDueDate = require("../service");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/calculate-due-date/', (req, res, next) => {
  if (!req.body) {
    const msg = 'no message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = 'invalid message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  const { submittedDateTime, turnAroundTime } = req.body.message;
  if (!submittedDateTime || !turnAroundTime) {
    return res.status(400).json({
      error: "Payload must include 'submittedDateTime' and 'turnAroundTime'.",
    });
  }
  if (typeof submittedDateTime !== 'string' || typeof turnAroundTime !== 'number') {
    return res.status(400).json({
      error: "'submittedDateTime' must be a string and 'turnAroundTime' must be a number.",
    });
  }
  try {
    const dueDate = calculateDueDate(submittedDateTime, turnAroundTime)
    res.status(200).json({
      "Due date": dueDate
    })
  } catch (error) {
    console.log("error: ", error)
    next(error);
  }
} )

module.exports = router;
