var mongoose = require('mongoose');

module.exports = mongoose.model('HighScore', {
	player: String,
	level: Number,
	round: Number,
	timestamp: {type: Date, default: Date.now}
});