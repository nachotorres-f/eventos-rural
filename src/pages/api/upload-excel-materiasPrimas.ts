import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'sequelize';
import { sanitizeString } from '@/lib/sanitizeString';
import { excelToJson } from '@/lib/excelToJson';
import sequelize from '../../models';
import MateriaPrima from '@/models/MateriaPrima';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const t: Transaction = await sequelize.transaction();

    try {
        const datosCompletos = await excelToJson(req, res, 15);

        if (!Array.isArray(datosCompletos)) {
            throw Error('No se pudo leer el excel');
        }

        const nuevosDatos = datosCompletos.map((materiaPrima) => {
            return {
                codigo: materiaPrima.__EMPTY,
                familia: materiaPrima.__EMPTY_1,
                subFamilia: materiaPrima.__EMPTY_2,
                descripcion: sanitizeString(materiaPrima.__EMPTY_3),
                cantidadXCaja: materiaPrima.__EMPTY_4,
                unidadDeMedida: materiaPrima.__EMPTY_5,
                costoValidado: materiaPrima.__EMPTY_6,
                costoCompra: materiaPrima.__EMPTY_7,
                estado: materiaPrima.__EMPTY_8 === 'Activo' ? 1 : 0,
                proveedorUno: sanitizeString(materiaPrima.__EMPTY_9),
                codigoProveedorUno: sanitizeString(materiaPrima.__EMPTY_10),
                proveedorDos: sanitizeString(materiaPrima.__EMPTY_11),
                codigoProveedorDos: sanitizeString(materiaPrima.__EMPTY_12),
                proveedorTres: sanitizeString(materiaPrima.__EMPTY_13),
                codigoProveedorTres: sanitizeString(materiaPrima.__EMPTY_14),
            };
        });

        await MateriaPrima.truncate({ transaction: t });
        await MateriaPrima.bulkCreate(nuevosDatos, { transaction: t });

        t.commit();

        res.status(200).json({ message: 'Archivo procesado con éxito' });
    } catch {
        t.rollback();
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
}

export const config = {
    api: {
        bodyParser: false, // Desactivar el bodyParser para manejar archivos con multer
    },
};
