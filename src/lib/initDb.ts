// lib/initDb.js
import ProductoTerminado from '@/models/ProductoTerminado';
import User from '@/models/User';
import MateriaPrima from '@/models/MateriaPrima';
import Receta from '@/models/Recetas';
import Comanda from '@/models/Comanda';
import Menu from '@/models/Menu';
import Schedule from '@/models/Schedule';

const initDb = async () => {
    try {
        const force = false;
        const alter = false;

        await User.sync({ force, alter });
        await MateriaPrima.sync({ force, alter });
        await ProductoTerminado.sync({ force, alter });
        await Receta.sync({ force, alter });
        await Comanda.sync({ force: true, alter });
        await Menu.sync({ force: true, alter });
        await Schedule.sync({ force: true, alter });
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

export default initDb;
