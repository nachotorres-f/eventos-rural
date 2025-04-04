import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'sequelize';
import { sanitizeString } from '@/lib/sanitizeString';
import { excelToJson } from '@/lib/excelToJson';
import sequelize from '../../models';
import Recetas from '@/models/Recetas';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const t: Transaction = await sequelize.transaction();

    try {
        const datosCompletos = await excelToJson(req, res, 10);

        if (!Array.isArray(datosCompletos)) {
            throw Error('No se pudo leer el excel');
        }

        const nuevosDatos = datosCompletos.map((receta) => {
            return {
                codigo: receta['Maestro de Recetas'],
                nombreProducto: sanitizeString(receta.__EMPTY),
                proceso: receta.__EMPTY_1,
                tipo: receta.__EMPTY_2,
                subCodigo: receta.__EMPTY_3,
                descripcion: sanitizeString(receta.__EMPTY_4),
                unidadMedida: receta.__EMPTY_5,
                porcionBruta: receta.__EMPTY_6,
                porcionNeta: receta.__EMPTY_7,
                MO: receta.__EMPTY_8,
                dueno: sanitizeString(receta.__EMPTY_9),
            };
        });

        await Recetas.truncate({ transaction: t });

        await Recetas.bulkCreate(nuevosDatos, { transaction: t });

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
