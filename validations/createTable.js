exports.types = {
  DatabaseName: {
    type: 'String',
    notNull: false,
  },
  TableInput: {
    type: 'Structure',
    children: {
      Name: {
        type: 'String',
        notNull: false,
      },
      Description : {
        type: 'String',
        notNull: false,
      },
    },
  },
}
