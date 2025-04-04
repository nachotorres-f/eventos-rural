import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

export interface ScheduleAttributes {
    id?: number;
    cantidad: number;
    fechaPreparacion: string;
    menuId?: number;
}

class Schedule extends Model<ScheduleAttributes> implements ScheduleAttributes {
    declare id: number;
    declare cantidad: number;
    declare fechaPreparacion: string;
}

Schedule.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        fechaPreparacion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'schedules',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

export default Schedule;
