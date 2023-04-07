module.exports = (sequelize, dataTypes) => {
    let alias = 'Partida';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        jugadorUnoId: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        jugadorDosId: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        fechaId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        draft: {
            type: dataTypes.STRING,
            allowNull: false
        },
        horario: {
            type: dataTypes.DATE,
            allowNull: false
        },
        categoriaId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        ganador: {
            type: dataTypes.INTEGER,
            allowNull: true
        }
    };
    let config = {
        tableName: 'partidas',
        timestamps: false,
    }
    const Partida = sequelize.define(alias, cols, config);

    Partida.associate = function(models){
        Partida.belongsTo(models.Categoria, {
            as: "categoria",
            foreignKey:"categoriaId",
            timestamps:false
        });

        Partida.belongsTo(models.Fecha, {
            as: "fecha",
            foreignKey:"fechaId",
            timestamps:false
        });

        Partida.belongsTo(models.Jugador, {
            as: "jugadorUno",
            foreignKey:"jugadorUnoId",
            timestamps:false
        })

        Partida.belongsTo(models.Jugador, {
            as: "jugadorDos",
            foreignKey:"jugadorDosId",
            timestamps:false
        })
    }

    return Partida;
}