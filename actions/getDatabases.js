
module.exports = function getDatabases(store, data, cb) {

  store.getDatabases(data, function(err, databases) {
    if (err) return cb(err)
    cb(null, {DatabaseList: databases})
  })
}



