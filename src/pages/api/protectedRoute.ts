import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tu_clave_secreta';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header

        if (!token) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY); // Verificar el token
            res.status(200).json({
                message: 'Acceso permitido',
                user: decoded,
            });
        } catch {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}
