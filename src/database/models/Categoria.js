module.exports = (sequelize, dataTypes) => {
    let alias = 'Categoria';
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
        tableName: 'categorias',
        timestamps: false,
    }
    const Categoria = sequelize.define(alias, cols, config);

    Categoria.associate = function(models){
        Categoria.hasMany(models.Jugador, {
            as: "jugadores",
            foreignKey:"categoriaId",
            timestamps:false
        });
    }

    return Categoria;
}