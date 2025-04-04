import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

type unidadesMedida = 'UN' | 'LT' | 'KG' | 'PQ' | 'PO' | 'MT' | 'M3';

export interface MateriaPrimaAttributes {
    id?: number;
    codigo: string;
    familia: string;
    subFamilia: string;
    descripcion: string;
    cantidadXCaja: number;
    unidadDeMedida: unidadesMedida;
    costoValidado: number;
    costoCompra: number;
    estado: number;
    proveedorUno: string;
    codigoProveedorUno: string;
    proveedorDos: string;
    codigoProveedorDos: string;
    proveedorTres: string;
    codigoProveedorTres: string;
}

class MateriaPrima
    extends Model<MateriaPrimaAttributes>
    implements MateriaPrimaAttributes
{
    declare id: number;
    declare codigo: string;
    declare familia: string;
    declare subFamilia: string;
    declare descripcion: string;
    declare cantidadXCaja: number;
    declare unidadDeMedida: unidadesMedida;
    declare costoValidado: number;
    declare costoCompra: number;
    declare estado: number;
    declare proveedorUno: string;
    declare codigoProveedorUno: string;
    declare proveedorDos: string;
    declare codigoProveedorDos: string;
    declare proveedorTres: string;
    declare codigoProveedorTres: string;
}

MateriaPrima.init(
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
        familia: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        subFamilia: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        cantidadXCaja: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        unidadDeMedida: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        costoValidado: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        costoCompra: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        proveedorUno: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        codigoProveedorUno: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        proveedorDos: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        codigoProveedorDos: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        proveedorTres: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        codigoProveedorTres: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'materias_prima',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

export default MateriaPrima;
