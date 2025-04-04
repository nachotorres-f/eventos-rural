import type { NextApiRequest, NextApiResponse } from 'next';
import { seedAdmin } from '@/utils/seedAdmin';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        await seedAdmin();

        res.status(201).json({ message: 'Admin creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
