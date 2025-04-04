import type { NextApiRequest, NextApiResponse } from 'next';
import initDb from '@/lib/initDb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        await initDb();

        res.status(201).json({ message: 'Tablas creadas' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
