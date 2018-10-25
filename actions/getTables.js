
module.exports = function getTables(store, params, cb) {

  store.getTables(params, function(err, tables) {
    if (err) return cb(err)
    cb(null, {TableList: tables})
  })
}



