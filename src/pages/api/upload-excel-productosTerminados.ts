import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'sequelize';
import { sanitizeString } from '@/lib/sanitizeString';
import { excelToJson } from '@/lib/excelToJson';
import sequelize from '../../models';
import ProductoTerminado from '@/models/ProductoTerminado';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const t: Transaction = await sequelize.transaction();

    try {
        const datosCompletos = await excelToJson(req, res, 14);

        if (!Array.isArray(datosCompletos)) {
            throw Error('No se pudo leer el excel');
        }

        const nuevosDatos = datosCompletos.map((productoTerminado) => {
            return {
                codigo: productoTerminado.__EMPTY,
                familia: productoTerminado.__EMPTY_1,
                descripcion: sanitizeString(productoTerminado.__EMPTY_2),
                rack: productoTerminado.__EMPTY_3,
                gusto: productoTerminado.__EMPTY_4,
                vidaUtil: productoTerminado.__EMPTY_5,
                costoMP: productoTerminado.__EMPTY_6,
                costoMO: productoTerminado.__EMPTY_7,
                costoTotal: productoTerminado.__EMPTY_8,
                estado: productoTerminado.__EMPTY_9 === 'ACTIVO' ? 1 : 0,
                tipo: productoTerminado.__EMPTY_10,
                dueno: productoTerminado.__EMPTY_11,
                pesoNeto: productoTerminado.__EMPTY_12,
                unidadMedida:
                    productoTerminado.__EMPTY_13 === ''
                        ? null
                        : productoTerminado.__EMPTY_13,
            };
        });

        await ProductoTerminado.truncate({ transaction: t });
        await ProductoTerminado.bulkCreate(nuevosDatos, { transaction: t });

        res.status(200).json({ message: 'Archivo procesado con éxito' });
    } catch {
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
}

export const config = {
    api: {
        bodyParser: false, // Desactivar el bodyParser para manejar archivos con multer
    },
};
