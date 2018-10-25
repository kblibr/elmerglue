
module.exports = function getDatabase(store, reqParams, cb) {
  store.getDatabase(reqParams, (err, database) => {
    if (err) return cb(err)
    cb(null, {Database: database})
  })
}



