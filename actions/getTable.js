
module.exports = function getTable(store, data, cb) {

  store.getTable(data, function(err, table) {
    if (err) return cb(err)
    cb(null, {Table: table})
  })
}



