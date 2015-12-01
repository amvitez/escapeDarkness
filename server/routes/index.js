var express = require('express');
var router = express.Router();
// var HighScore = require('../models/highScore');
// var LegendItem = require('../models/legendItem');
// var mongoose = require('mongoose');
var highScoresController = require('../controllers/highScoresController');
var legendController = require('../controllers/legendController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.html', {title: 'Escape Lvl 1 Rnd 1'});
});

router.get('/api/highScores', highScoresController.list);

router.get('/api/highScores/scoreToBeat', highScoresController.scoreToBeat);

router.post('/api/highScores', highScoresController.create);

router.get('/api/legend', legendController.list);

module.exports = router;
