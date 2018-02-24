
module.exports = function (sequelize, DataTypes) {
    var Genre = sequelize.define("Genre", {
      genreId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      trackGenre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pseudoGenre: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });

    Genre.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Genre.belongsTo(models.Music, { foreignKey:  { allowNull: false } });
    };
    return Genre;
   
};