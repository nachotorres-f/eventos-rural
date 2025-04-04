import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export const generateToken = (
    userId: number,
    role: 'admin' | 'user'
): string => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch {
        return null;
    }
};
