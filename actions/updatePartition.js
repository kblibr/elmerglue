
module.exports = function updatePartition(store, data, cb) {

  store.updatePartition(data, function(err, partition) {
    if (err) return cb(err)
    cb(null, {output: partition})
  })
}



