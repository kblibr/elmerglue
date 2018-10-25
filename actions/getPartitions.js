
module.exports = function getPartitions(store, params, cb) {

  store.getPartitions(params, function(err, partitions) {
    if (err) return cb(err)
    cb(null, {Partitions: partitions, NextToken: ''})
  })
}



