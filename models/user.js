module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // userImage: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // }
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });

     User.associate = function(models) {
       // Associating Author with Posts
       // When an Author is deleted, also delete any associated Posts
       User.hasMany(models.Feedback, { onDelete: "cascade" });
     };
return User;
    };