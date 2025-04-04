import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

export interface UserAttributes {
    id?: number;
    username: string;
    password: string;
    role: 'admin' | 'user';
}

class User extends Model<UserAttributes> implements UserAttributes {
    declare id: number;
    declare username: string;
    declare password: string;
    declare role: 'admin' | 'user';
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
    },
    {
        sequelize,
        tableName: 'users',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

export default User;
