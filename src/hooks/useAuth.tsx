import { useState, useEffect } from 'react';
import { useRouter } from 'next/compat/router';

interface User {
    username: string;
    role: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            // Si no hay token, redirige al login
            if (router) router.push('/login');
            return;
        }

        // Verificar el token con una solicitud GET al backend
        fetch('/api/protectedRoute', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Enviamos el token en el header
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Token inválido o expirado');
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.user); // Aquí asignamos el usuario validado
            })
            .catch((error) => {
                setError(error.message);
                sessionStorage.removeItem('token'); // Eliminamos el token si es inválido
                if (router) router.push('/login'); // Redirige al login
            });
    }, [router]);

    return { user, error };
};

export default useAuth;
