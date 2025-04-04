import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Schedule from './Schedule';

export interface MenuAttributes {
    id?: number;
    nombre: string;
    schedule?: Schedule[];
}

class Menu extends Model<MenuAttributes> implements MenuAttributes {
    declare id: number;
    declare nombre: string;
    declare schedule: Schedule[];
}

Menu.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'menus',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

Menu.hasMany(Schedule, {
    sourceKey: 'id',
    foreignKey: 'menuId',
    as: 'schedule',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default Menu;
