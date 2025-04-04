import multer from 'multer';
import XLSX from 'xlsx';
import { promisify } from 'util';
import { NextApiRequest, NextApiResponse } from 'next';

// Configurar multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

const runMiddleware = promisify(upload.single('file'));

type dataExcel = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
};

export const excelToJson = async (
    req: NextApiRequest,
    res: NextApiResponse,
    totalPropiedades: number,
    comanda: boolean = false
): Promise<dataExcel[] | void> => {
    // Ejecutar middleware para manejar el archivo
    // @ts-expect-error - Simulamos req Next al req de Express
    await runMiddleware(req, res);

    // Verificar si se subió un archivo
    // @ts-expect-error - Si existe el file
    if (!req.file) {
        return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    // Leer el archivo desde el buffer
    // @ts-expect-error - Si existe el file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    // Tomar la primera hoja del Excel
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const data: dataExcel[] = XLSX.utils.sheet_to_json(sheet);

    if (!comanda) {
        // Elimino el encabezado
        data.shift();

        // Generamos la lista de propiedades esperadas
        const propiedadesRequeridas = Array.from(
            { length: totalPropiedades },
            (_, i) => (i === 0 ? '__EMPTY' : `__EMPTY_${i}`)
        );

        // Normalizamos los datos para que tengan todas las propiedades
        const datosCompletos = data.map((item) => {
            const objetoBase = Object.fromEntries(
                propiedadesRequeridas.map((prop) => [prop, item[prop] ?? ''])
            );

            if (item['Maestro de Recetas'] !== undefined) {
                objetoBase['Maestro de Recetas'] = item['Maestro de Recetas'];
            }

            return objetoBase;
        });
        return datosCompletos;
    }

    return data;
};
