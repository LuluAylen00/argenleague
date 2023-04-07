module.exports = (sequelize, dataTypes) => {
    let alias = 'Jugador';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        nick: {
            type: dataTypes.STRING,
            allowNull: false
        },
        elo: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        semilla: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        categoriaId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        grupoId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
    };
    let config = {
        tableName: 'jugadores',
        timestamps: false,
    }
    const Jugador = sequelize.define(alias, cols, config);
    Jugador.associate = function(models){
        Jugador.belongsTo(models.Categoria, {
            as: "categoria",
            foreignKey:"categoriaId",
            timestamps:false
        });

        Jugador.belongsTo(models.Grupo, {
            as: "grupo",
            foreignKey:"grupoId",
            timestamps:false
        });

        Jugador.hasMany(models.Partida, {
            as: "partidasUno",
            foreignKey:"jugadorUnoId",
            timestamps:false
        })

        Jugador.hasMany(models.Partida, {
            as: "partidasDos",
            foreignKey:"jugadorDosId",
            timestamps:false
        })
    }

    return Jugador;
}