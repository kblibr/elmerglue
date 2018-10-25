exports.types = {
  DatabaseName: {
    type: 'String',
    notNull: true,
    regex: '[a-zA-Z0-9_.-]+',
    lengthGreaterThanOrEqual: 1,
    lengthLessThanOrEqual: 128,
  },
  TableName: {
    type: 'String',
    notNull: true,
    regex: '[a-zA-Z0-9_.-]+',
    lengthGreaterThanOrEqual: 1,
    lengthLessThanOrEqual: 128,
  },
  PartitionInput: {
    type: 'Structure',
    children: {
      Values: {
        type: 'List',
        children: {
          type: 'String',
          regex: '[a-zA-Z0-9_.-]+',
          lengthGreaterThanOrEqual: 1,
          lengthLessThanOrEqual: 128,
        },
      },
      LastAccessTime: {
        type: 'Timestamp',
      },
      StorageDescriptor: {
        type: 'Structure',
        children: {
          Location: {
            type: 'String',
            regex: '[a-zA-Z0-9_.-]+',
            lengthGreaterThanOrEqual: 1,
            lengthLessThanOrEqual: 128,
          },
        },
      },
      Parameters: {
        type: 'Map',
        children: {
          type: 'String',
        },
      },
      LastAnalyzedTime: {
        type: 'Timestamp',
      },
    },
  },
}
