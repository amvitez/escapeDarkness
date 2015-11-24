var LegendItem = require('../models/legendItem');

// module.exports.create = function (req, res) {
//   var legendItem = new LegendItem(req.body);
//   legendItem.save(function (err, result) {
//     res.json(result);
//   });
// }

module.exports.list = function (req, res) {
  LegendItem.find().exec(function (err, results) {
    res.json(results);
  });
}