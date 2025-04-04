import { Container, Row, Col } from 'react-bootstrap';
import AuthLayout from '@/components/AuthLayout';
//import DashboardNavbar from '@/components/DashboardNavbar';

const Semana = () => {
    return (
        <AuthLayout>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Semana</h2>
                    </Col>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default Semana;
