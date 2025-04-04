import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Menu from './Menu';

export interface ComandaAttributes {
    id?: number;
    salon: string;
    tipo: string;
    fecha: string;
    nombre: string;
    horario: string;
    observaciones: string;
    menu?: Menu[];
}

class Comanda extends Model<ComandaAttributes> implements ComandaAttributes {
    declare id: number;
    declare salon: string;
    declare tipo: string;
    declare fecha: string;
    declare nombre: string;
    declare horario: string;
    declare observaciones: string;
    declare menu: Menu[];
}

Comanda.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        salon: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        fecha: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        horario: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        observaciones: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'comandas',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

Comanda.hasMany(Menu, {
    sourceKey: 'id',
    foreignKey: 'comandaId',
    as: 'menu',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default Comanda;
