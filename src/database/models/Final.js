module.exports = (sequelize, dataTypes) => {
    let alias = 'Final';
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
        etapaId: {
            type: dataTypes.INTEGER,
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
        tableName: 'partidasFinales',
        timestamps: false,
    }
    const Final = sequelize.define(alias, cols, config);

    Final.associate = function(models){
        Final.belongsTo(models.Categoria, {
            as: "categoria",
            foreignKey:"categoriaId",
            timestamps:false
        });

        Final.belongsTo(models.Jugador, {
            as: "jugadorUno",
            foreignKey:"jugadorUnoId",
            timestamps:false
        })

        Final.belongsTo(models.Jugador, {
            as: "jugadorDos",
            foreignKey:"jugadorDosId",
            timestamps:false
        })
    }

    return Final;
}