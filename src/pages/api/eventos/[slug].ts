import Comanda from '@/models/Comanda';
import Menu from '@/models/Menu';
import Schedule from '@/models/Schedule';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'sequelize';
import sequelize from '../../../models';
import Receta, { RecetaAttributes } from '@/models/Recetas';

interface ScheduleI {
    id: number;
    cantidad: number;
    fechaPreparacion: string;
    createdAt: string;
    updatedAt: string;
    menuId: number;
}

// interface Comida {
//     id: number;
//     cantidad: number;
//     createdAt: string;
//     updatedAt: string;
//     comandaId: number;
//     schedule: ScheduleI[];
// }

const buscarRecetas = async (
    nombreProducto: string,
    cantidad: number,
    ingredientesList: RecetaAttributes[] = []
): Promise<RecetaAttributes[]> => {
    // Buscar ingredientes
    const ingredientesResult = await Receta.findAll({
        where: { nombreProducto },
    });
    const ingredientes = ingredientesResult.map((ingrediente) => {
        ingrediente.dataValues.porcionBruta =
            ingrediente.dataValues.porcionBruta * cantidad;

        return ingrediente.dataValues;
    });

    // Usar for...of en lugar de forEach para poder usar await correctamente
    for (const ingrediente of ingredientes) {
        ingredientesList.push(ingrediente);

        // Si es un PT, buscar sus subingredientes recursivamente
        if (ingrediente.tipo === 'PT') {
            await buscarRecetas(
                ingrediente.descripcion,
                cantidad,
                ingredientesList
            );
        }
    }

    return ingredientesList;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { slug: id } = req.query;

    // Manejar diferentes métodos HTTP
    if (req.method === 'GET') {
        // Lógica para obtener un item específico
        try {
            const comanda = await Comanda.findByPk(Number(id), {
                include: [
                    {
                        model: Menu,
                        as: 'menu',
                        include: [
                            {
                                model: Schedule,
                                as: 'schedule',
                            },
                        ],
                    },
                ],
            });

            if (!comanda) throw new Error('No se encontro la comanda');

            const recetas = [];

            for (const menu of comanda.menu) {
                for (const schedule of menu.schedule) {
                    recetas.push({
                        nombre: menu.nombre,
                        cantidad: schedule.cantidad,
                        fechaPreparacion: schedule.fechaPreparacion,
                        ingredientes: await buscarRecetas(
                            menu.nombre,
                            schedule.cantidad
                        ),
                    });
                }
            }

            console.log('###################');
            console.log(recetas.slice(0, 3));
            console.log('###################');
            console.log(recetas[2]);

            res.status(200).json({ comanda, recetas });
        } catch {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } else if (req.method === 'PUT') {
        // Lógica para actualizar
        const body = req.body;

        const t: Transaction = await sequelize.transaction();

        try {
            for (const comida of body.comanda.menu) {
                const menuId = comida.schedule.find(
                    (schedule: ScheduleI) => schedule.menuId != undefined
                )?.menuId;

                if (!menuId) return;

                for (const schedule of comida.schedule) {
                    if (schedule.id) {
                        await Schedule.update(
                            { cantidad: schedule.cantidad },
                            {
                                where: {
                                    id: schedule.id,
                                },
                                transaction: t,
                            }
                        );
                    } else {
                        await Schedule.create(
                            {
                                cantidad: schedule.cantidad,
                                fechaPreparacion: new Date(
                                    schedule.fechaPreparacion
                                ).toISOString(),
                                menuId: menuId,
                            },
                            {
                                transaction: t,
                            }
                        );
                    }
                }
            }

            await t.commit();

            const comanda = await Comanda.findByPk(Number(body.comanda.id), {
                include: [
                    {
                        model: Menu,
                        as: 'menu',
                        include: [
                            {
                                model: Schedule,
                                as: 'schedule',
                            },
                        ],
                    },
                ],
            });

            const recetas = [];

            if (!comanda) throw new Error('No se encontro la comanda');

            for (const menu of comanda.menu) {
                for (const schedule of menu.schedule) {
                    recetas.push({
                        nombre: menu.nombre,
                        cantidad: schedule.cantidad,
                        fechaPreparacion: schedule.fechaPreparacion,
                        ingredientes: await buscarRecetas(
                            menu.nombre,
                            schedule.cantidad
                        ),
                    });
                }
            }

            res.status(200).json({
                message: `Actualizando elemento ${body.comanda.id}`,
                updatedData: { comanda, recetas },
            });
        } catch (error) {
            await t.rollback();
            res.status(500).json({
                message: 'Error interno del servidor',
                error,
            });
        }
    }
}
