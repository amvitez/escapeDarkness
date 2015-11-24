var express = require('express');
var router = express.Router();
var HighScore = require('../models/highScore');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.html', {title: 'Escape Lvl 1 Rnd 1'});
});

router.post('/api/newHighScore', function(req, res, next){
	var level = req.body.level;
	var round = req.body.round;
	var player = req.body.player;

	HighScore.create({
    player: req.body.player,
    round: req.body.round, 
    level: req.body.level }, function(err){
      if(err) console.log(err);
    });
    return res.send(200);
});

module.exports = router;
