import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs'; // Para encriptar y verificar la contraseña
import jwt from 'jsonwebtoken'; // Para generar un token JWT
import User from '@/models/User'; // Modelo de usuario

const SECRET_KEY = 'tu_clave_secreta'; // Reemplazá con una clave secreta más segura

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Faltan datos de usuario o contraseña' });
        }

        try {
            // Buscar al usuario en la base de datos
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Generar un token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' } // El token expira en 1 hora
            );

            // Retornar el token
            return res.status(200).json({ token });
        } catch {
            return res
                .status(500)
                .json({ error: 'Error al autenticar al usuario' });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}
