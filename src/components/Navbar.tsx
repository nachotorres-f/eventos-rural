// components/DashboardNavbar.tsx
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';

const DashboardNavbar = () => {
    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg">
            <Container>
                <Navbar.Brand href="#">Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />{' '}
                {/* Botón de hamburguesa */}
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link
                            as={Link}
                            href="/importar-excel">
                            Importar Excel
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            href="/eventos">
                            Eventos
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            href="/semana">
                            Semana
                        </Nav.Link>
                        {/* Si necesitas más opciones puedes usar NavDropdown */}
                        <NavDropdown
                            title="Opciones"
                            id="navbar-nav-dropdown">
                            <NavDropdown.Item
                                as={Link}
                                href="/dashboard/ajustes">
                                Ajustes
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                as={Link}
                                href="/dashboard/ayuda">
                                Ayuda
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default DashboardNavbar;
