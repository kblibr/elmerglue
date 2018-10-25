
module.exports = function getPartition(store, params, cb) {

  store.getPartition(params, function(err, partition) {
    if (err) return cb(err)
    cb(null, {Partition: partition})
  })
}



