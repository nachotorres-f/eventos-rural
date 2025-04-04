import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

type unidadesMedida = 'UN' | 'LT' | 'KG' | 'PQ' | 'PO' | 'MT' | 'M3' | null;

export interface ProductoTerminadoAttributes {
    id?: number;
    codigo: string;
    familia: string;
    descripcion: string;
    rack: number;
    gusto: number;
    vidaUtil: number;
    costoMP: number;
    costoMO: number;
    costoTotal: number;
    estado: number;
    tipo: string;
    dueno: string;
    pesoNeto: number;
    unidadMedida: unidadesMedida;
}

class ProductoTerminado
    extends Model<ProductoTerminadoAttributes>
    implements ProductoTerminadoAttributes
{
    declare id: number;
    declare codigo: string;
    declare familia: string;
    declare descripcion: string;
    declare rack: number;
    declare gusto: number;
    declare vidaUtil: number;
    declare costoMP: number;
    declare costoMO: number;
    declare costoTotal: number;
    declare estado: number;
    declare tipo: string;
    declare dueno: string;
    declare pesoNeto: number;
    declare unidadMedida: unidadesMedida;
}

ProductoTerminado.init(
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
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        rack: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gusto: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vidaUtil: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        costoMP: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        costoMO: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        costoTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        dueno: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        pesoNeto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        unidadMedida: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: 'productos_terminados',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    }
);

export default ProductoTerminado;
