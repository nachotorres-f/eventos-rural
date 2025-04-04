import Comanda from '@/models/Comanda';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const comandas = await Comanda.findAll();

        res.status(201).json(comandas);
    } catch {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
