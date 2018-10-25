exports.types = {
  DatabaseInput: {
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
