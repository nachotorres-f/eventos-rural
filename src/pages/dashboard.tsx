'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/compat/router';
import AuthLayout from '@/components/AuthLayout';

const Dashboard = () => {
    const router = useRouter();

    const login = () => {
        if (router) router.push('/login');
    };

    return (
        <AuthLayout>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Bienvenido</h2>
                        <Button
                            variant="danger"
                            onClick={() => {
                                sessionStorage.removeItem('token');
                                login();
                            }}>
                            Cerrar Sesión
                        </Button>
                    </Col>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default Dashboard;
