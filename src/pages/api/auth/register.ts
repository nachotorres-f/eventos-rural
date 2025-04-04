import type { NextApiRequest, NextApiResponse } from 'next';
import User, { UserAttributes } from '@/models/User';
import { hashPassword } from '@/utils/bcrypt';
import { verifyToken } from '@/utils/jwt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { username, password, role }: UserAttributes = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del header

        // Verificar que el usuario esté autenticado y sea admin
        const decoded = token ? verifyToken(token) : null;
        if (
            !decoded ||
            (typeof decoded !== 'string' && decoded.role !== 'admin')
        ) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        // Validaciones básicas
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Faltan datos obligatorios' });
        }

        // Encriptar contraseña
        const hashedPassword = await hashPassword(password);

        // Crear usuario (por defecto será "user" si no se especifica otro rol)
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({
            message: 'Usuario creado',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
