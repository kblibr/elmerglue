
module.exports = function createTable(store, reqParams, cb) {
  store.createTable(reqParams, function(err, table) {
    if (err) return cb(err)
    cb(null, {output: table})
  })
}



