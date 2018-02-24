module.exports = function(sequelize, DataTypes) {
  var Feedback = sequelize.define("Feedback", {
    track: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    feedback: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

    Feedback.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Feedback.belongsTo(models.User, { foreignKey: { allowNull: false }});
      Feedback.belongsTo(models.Music, { foreignKey: { allowNull: false }
            });

    };
    
  return Feedback;
};
