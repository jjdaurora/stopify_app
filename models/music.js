module.exports = function (sequelize, DataTypes) {
    var Music = sequelize.define("Music", {
      trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      spotifyTrackID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      trackName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      trackArtist: {
        type: DataTypes.STRING,
        allowNull: false
      },
      trackGenre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      trackArtwork: {
        type: DataTypes.STRING,
        allowNull: false
      },
      trackPopularity: {
        type: DataTypes.STRING,
        allowNull: false
      }
    
    });
  
      Music.associate = function(models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        Music.hasMany(models.Feedback, { onsDelete: "cascade" });
        Music.hasMany(models.Genre, { onDelete: "cascade"});
      };
    return Music;
};