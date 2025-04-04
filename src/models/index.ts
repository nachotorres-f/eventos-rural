import { Sequelize } from 'sequelize';

// Conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
        host: process.env.DB_HOST!,
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
        },
        define: {
            charset: 'utf8mb4',
        },
        logging: false, // Oculta logs de SQL en la consola
    }
);

export default sequelize;
