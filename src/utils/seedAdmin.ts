import User from '../models/User';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10); // Cambiá la contraseña
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
            });

            console.log('✅ Usuario admin creado.');
        } else {
            console.log('🔹 Ya existe un usuario admin.');
        }
    } catch (error) {
        console.error('❌ Error al crear el admin:', error);
    }
};
