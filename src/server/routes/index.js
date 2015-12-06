var express = require('express');
var router = express.Router();
var highScoresController = require('../controllers/highScoresController');

router.get('/', function(req, res, next) {
    res.render('index.html', {title: 'Escape Lvl 1 Rnd 1'});
});

router.get('/api/highScores', highScoresController.list);

router.get('/api/highScores/scoreToBeat', highScoresController.scoreToBeat);

router.post('/api/highScores', highScoresController.create);

module.exports = router;
