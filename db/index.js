let levelup = require('levelup')
let memdown = require('memdown')
let sublevel = require('level-sublevel')
let lock = require('lock')

exports.create = create
exports.clientError = clientError
exports.serverError = serverError

function create(options) {
  options = options || {}
  var db = levelup(options.path ? require('leveldown')(options.path) : memdown()),
    sublevelDb = sublevel(db),
    metaDb = sublevelDb.sublevel('meta', {valueEncoding: 'json'}),
    glueDB = []

  metaDb.lock = lock.Lock()

  // XXX: Is there a better way to get this?
  metaDb.awsAccountId = (process.env.AWS_ACCOUNT_ID || '0000-0000-0000').replace(/[^\d]/g, '')
  metaDb.awsRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1'

  function getGlueDB(name) {
    if (!glueDB[name]) {
      glueDB[name] = sublevelDb.sublevel('glue-' + name, {valueEncoding: 'json'})
      glueDB[name].lock = lock.Lock()
    }
    return glueDB[name]
  }

  function deleteGlueDB(name, cb) {
    let streamDb = getGlueDB(name)
    delete glueDB[name]
    lazyStream(streamDb.createKeyStream(), cb).join(function (keys) {
      streamDb.batch(keys.map(function (key) {
        return {type: 'del', key: key}
      }), cb)
    })
  }

  function initDatabase(name) {
    if (!glueDB[name]) {
      glueDB[name] = sublevelDb.sublevel('glueDatabase-' + name, {valueEncoding: 'json'})
      glueDB[name].lock = lock.Lock()
    }
  }

  function createPartition(req, cb) {
    let obj = req.PartitionInput
    initDatabase(req.DatabaseName)
    glueDB[req.DatabaseName].put('partition!' + req.TableName + '!' + obj.Values.join('#'), obj, cb)
  }

  function getPartition(req, cb) {
    initDatabase(req.DatabaseName)
    glueDB[req.DatabaseName].get('partition!' + req.TableName + '!' + req.PartitionValues.join('#'), (err, obj) => {
      cb(null, obj)
    })
  }

  function getPartitions(req, cb) {
    let retVal = []
    initDatabase(req.DatabaseName)
    let stream = glueDB[req.DatabaseName].createReadStream()
    stream.on('data', (data) => {
      if (data.key.indexOf('partition') == 0 && data.key.indexOf(req.TableName) > 1) {
        retVal.push(data.value)
      }
    })
    stream.on('end', () => {
      cb(null, retVal)
    })
  }

  function createDatabase(params, cb) {
    initDatabase(params.DatabaseInput.Name)
    glueDB[params.DatabaseInput.Name].put('database', params.DatabaseInput, cb)
  }

  function getDatabase(reqParam, cb) {
    initDatabase(reqParam.Name)
    glueDB[reqParam.Name].get('database', (err, obj) => {
      cb(null, obj)
    })
  }

  function getDatabases(store, cb) {
    let retVal = []
    let stream = db.createReadStream()
    stream.on('data', (data) => {
      if (("" + data.key).split('!')[2] == 'database') {
        retVal.push(JSON.parse(data.value))
      }
    })
    stream.on('end', () => {
      cb(null, retVal)
    })
  }

  function createTable(params, cb) {

    initDatabase(params.DatabaseName)
    glueDB[params.DatabaseName].put('table!' + params.TableInput.Name, params.TableInput, cb)
  }

  function getTable(params, cb) {
    initDatabase(params.DatabaseName)
    glueDB[params.DatabaseName].get('table!' + params.Name, (err, obj) => {
      cb(null, obj)
    })
  }

  function getTables(params, cb) {
    initDatabase(params.DatabaseName)
    let retVal = []
    let stream = glueDB[params.DatabaseName].createReadStream()
    stream.on('data', (data) => {
      if (data.key.indexOf('table') == 0) {
        retVal.push(data.value)
      }
    })
    stream.on('end', () => {
      cb(null, retVal)
    })
  }

  return {
    db: db,
    createDatabase: createDatabase,
    createPartition: createPartition,
    updatePartition: createPartition,
    getPartition: getPartition,
    getTable: getTable,
    getDatabases: getDatabases,
    getDatabase: getDatabase,
    getTables: getTables,
    createTable: createTable,
    getPartitions: getPartitions,
  }
}

function clientError(type, msg, statusCode) {
  if (statusCode == null) statusCode = 400
  var err = new Error(msg || type)
  err.statusCode = statusCode
  err.body = {__type: type}
  if (msg != null) err.body.message = msg
  return err
}

function serverError(type, msg, statusCode) {
  return clientError(type || 'InternalFailure', msg, statusCode || 500)
}
