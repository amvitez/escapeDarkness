var mongoose = require('mongoose');

module.exports = mongoose.model('LegendItem', {
	image: String,
	name: String,
	description: String
});