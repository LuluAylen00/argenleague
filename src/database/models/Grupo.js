module.exports = (sequelize, dataTypes) => {
    let alias = 'Grupo';
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
        tableName: 'grupos',
        timestamps: false,
    }
    const Grupo = sequelize.define(alias, cols, config);

    Grupo.associate = function(models){
        Grupo.hasMany(models.Jugador, {
            as: "jugadores",
            foreignKey:"grupoId",
            timestamps:false
        });

        // Grupo.belongsToMany(models.Fecha, {
        //     as: "fechas",
        //     foreignKey:"grupoId",
        //     otherKey: "fechaId",
        //     through: "fechas_grupos"
        // })
    }

    return Grupo;
}