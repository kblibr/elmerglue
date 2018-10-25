
module.exports = function createPartition(store, data, cb) {

  store.createPartition(data, function(err, partition) {
    if (err) return cb(err)
    cb(null, {output: partition})
  })
}



