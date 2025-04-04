import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'sequelize';
//import { sanitizeString } from '@/lib/sanitizeString';
import { excelToJson } from '@/lib/excelToJson';
import sequelize from '../../models';
import Comanda from '@/models/Comanda';
import Menu from '@/models/Menu';
import { sanitizeString } from '@/lib/sanitizeString';
import Schedule from '@/models/Schedule';

interface Comida {
    nombre: string;
    cantidad: number;
}

interface MenuI {
    comandaId: number;
    nombre: string;
}

interface ScheduleI {
    cantidad: number;
    fechaPreparacion: string;
    menuId: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const t: Transaction = await sequelize.transaction();

    try {
        const datosCompletos = await excelToJson(req, res, 15, true);

        if (!Array.isArray(datosCompletos)) {
            throw Error('No se pudo leer el excel');
        }

        //salon
        //tipo
        //fecha
        //nombreDos
        //horario
        //observaciones

        const datosMenu = [];

        for (let i = 0; i < 5; i++) {
            const obj = datosCompletos[i];
            datosMenu.push(obj[Object.keys(obj)[0] as keyof typeof obj]);
        }

        const menu: Comida[] = [];
        const observaciones: string[] = [];
        let isObservaciones = false;

        datosCompletos.forEach((dato, index) => {
            if (index < 5) return;

            if (index === 5) {
                const value = dato[Object.keys(dato)[0] as keyof typeof dato];
                if (value === 'Observaciones: ') {
                    isObservaciones = true;
                }
                return;
            }

            if (isObservaciones) {
                const mayor = dato[Object.keys(dato)[0] as keyof typeof dato];
                const menor = dato[Object.keys(dato)[1] as keyof typeof dato];

                if (mayor === 'M' && menor === 'm') {
                    isObservaciones = false;
                    return;
                }

                const observacion =
                    dato[Object.keys(dato)[0] as keyof typeof dato];
                observaciones.push(observacion);
            }

            const tipo = dato[Object.keys(dato)[1] as keyof typeof dato];

            const tiposOmitir = [
                'Bebidas sin alcohol',
                'Vajilla y Manteleria',
                'Barra',
                'Vinos',
                'Cervezas',
                'Barra de Tragos Mayores',
                'Barra de Tragos Menores',
                'Bebida del cliente',
                'Barra Adulto',
                'Vino y Champagne',
            ];

            if (
                typeof dato.__EMPTY === 'string' &&
                typeof dato.__EMPTY_4 === 'number' &&
                typeof tipo === 'string' &&
                !tiposOmitir.some((tipoOmitir) => tipo === tipoOmitir)
            ) {
                menu.push({
                    nombre: sanitizeString(dato.__EMPTY),
                    cantidad: dato.__EMPTY_4,
                });
            }
        });

        const comanda = await Comanda.create(
            {
                salon: datosMenu[0],
                tipo: datosMenu[1],
                fecha: datosMenu[2],
                nombre: datosMenu[3],
                horario: datosMenu[4],
                observaciones: observaciones.join(' ').trim(),
            },
            { transaction: t }
        );

        const datosNuevos: MenuI[] = menu.map((comida): MenuI => {
            //@ts-expect-error - No hace falta correcion
            if (!comanda.dataValues.id) return;

            return {
                comandaId: comanda.dataValues.id,
                nombre: comida.nombre,
            };
        });

        const bulk = await Menu.bulkCreate(datosNuevos, { transaction: t });

        const datosNuevosSchedule = bulk.map((menuItem): ScheduleI => {
            const comida = menu.find(
                (comida) => comida.nombre === menuItem.dataValues.nombre
            );

            //@ts-expect-error - No hace falta correcion
            if (!comida?.cantidad || !menuItem.dataValues.id) return;

            return {
                cantidad: comida?.cantidad,
                fechaPreparacion: comanda.fecha,
                menuId: menuItem.dataValues.id,
            };
        });

        await Schedule.bulkCreate(datosNuevosSchedule, { transaction: t });

        t.commit();

        res.status(200).json({ message: 'Archivo procesado con éxito' });
    } catch (err) {
        console.log(err);
        t.rollback();
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
}

export const config = {
    api: {
        bodyParser: false, // Desactivar el bodyParser para manejar archivos con multer
    },
};
