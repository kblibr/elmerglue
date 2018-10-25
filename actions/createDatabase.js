
module.exports = function createDatabase(store, reqParams, cb) {
  store.createDatabase(reqParams, function(err, database) {
    if (err) return cb(err)
    cb(null, {output: database})
  })
}



