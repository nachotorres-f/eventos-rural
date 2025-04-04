import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

type unidadesMedida = 'UN' | 'LT' | 'KG' | 'PQ' | 'PO' | 'MT' | 'M3';

export interface RecetaAttributes {
    id?: number;
    codigo: string;
    nombreProducto: string;
    proceso: string;
    tipo: string;
    subCodigo: string;
    descripcion: string;
    unidadMedida: unidadesMedida;
    porcionBruta: number;
    porcionNeta: number;
    MO: number;
    dueno: string;
}

class Receta extends Model<RecetaAttributes> implements RecetaAttributes {
    declare id: number;
    declare codigo: string;
    declare nombreProducto: string;
    declare proceso: string;
    declare tipo: string;
    declare subCodigo: string;
    declare descripcion: string;
    declare unidadMedida: unidadesMedida;
    declare porcionBruta: number;
    declare porcionNeta: number;
    declare MO: number;
    declare dueno: string;
}

Receta.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        nombreProducto: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        proceso: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        subCodigo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        unidadMedida: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        porcionBruta: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        porcionNeta: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        MO: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        dueno: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'recetas',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

export default Receta;
