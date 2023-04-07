module.exports = (sequelize, dataTypes) => {
    let alias = 'Fecha';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        numero: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    };
    let config = {
        tableName: 'fechas',
        timestamps: false,
    }
    const Fecha = sequelize.define(alias, cols, config);

    Fecha.associate = function(models){
        Fecha.hasMany(models.Partida, {
            as: "partidas",
            foreignKey:"fechaId",
            timestamps:false
        });

        Fecha.belongsToMany(models.Grupo, {
            as: "grupos",
            foreignKey:"fechaId",
            otherKey: "grupoId",
            through: "fechas_grupos"
        })
    }

    return Fecha;
}