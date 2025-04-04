'use client';

import { ReactNode } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Navbar from './Navbar'; // Importar el Navbar
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/compat/router';

interface LayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: LayoutProps) => {
    const { user, error } = useAuth(); // Llamamos al hook de autenticación
    const router = useRouter();

    const login = () => {
        if (router) router.push('/login');
    };

    if (error) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>{error}</h2>
                        <Button
                            variant="danger"
                            onClick={login}>
                            Ir al Login
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!user) {
        // Esto debería manejar el estado en el que no hay un usuario aún
        return <h2>Cargando...</h2>;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default AuthLayout;
