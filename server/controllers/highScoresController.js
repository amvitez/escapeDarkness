var HighScore = require('../models/highScore');

module.exports.create = function (req, res) {
  var highScore = new HighScore(req.body);
  highScore.save(function (err, result) {
    res.json(result);
  });
}

module.exports.list = function (req, res) {
  HighScore.find().limit(10).sort({round:-1, timestamp: -1}).exec(function (err, results) {
    res.json(results);
  });
}