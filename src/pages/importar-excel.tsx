import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import AuthLayout from '@/components/AuthLayout';
import { useState } from 'react';
//import * as XLSX from 'xlsx';

type ExcelFiles = {
    [key: string]: File | null;
};

type Textos = {
    [key: string]: string;
};

const ImportarExcel = () => {
    const [excelFiles, setExcelFiles] = useState<ExcelFiles>({
        materiasPrimas: null,
        productosTerminados: null,
        recetas: null,
        comanda: null,
    });

    const textos: Textos = {
        materiasPrimas: 'Materias Primas',
        productosTerminados: 'Productos Terminados',
        recetas: 'Recetas',
        comanda: 'Comanda',
    };

    const handleFileChange =
        (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setExcelFiles((prevState) => ({ ...prevState, [type]: file }));
            }
        };

    const handleUpload = async (type: string) => {
        const file = excelFiles[type];
        if (!file) {
            alert(`Por favor, selecciona un archivo para ${textos[type]}`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/upload-excel-${type}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert(`${textos[type]} cargado exitosamente`);
            } else {
                alert(`Error al cargar ${textos[type]}`);
            }
        } catch {
            alert(`Error en la carga de ${textos[type]}: `);
        }
    };
    return (
        <AuthLayout>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Importar Excel</h2>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            {/* Materias Primas */}
                            <Form.Group
                                controlId="formFileMateriasPrimas"
                                className="mb-3">
                                <Form.Label>
                                    Selecciona el archivo de Materias Primas
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange(
                                        'materiasPrimas'
                                    )}
                                />
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleUpload('materiasPrimas')
                                    }>
                                    Subir Materias Primas
                                </Button>
                            </Form.Group>

                            {/* Productos Terminados */}
                            <Form.Group
                                controlId="formFileProductosTerminados"
                                className="mb-3">
                                <Form.Label>
                                    Selecciona el archivo de Productos
                                    Terminados
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange(
                                        'productosTerminados'
                                    )}
                                />
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleUpload('productosTerminados')
                                    }>
                                    Subir Productos Terminados
                                </Button>
                            </Form.Group>

                            {/* Recetas */}
                            <Form.Group
                                controlId="formFileRecetas"
                                className="mb-3">
                                <Form.Label>
                                    Selecciona el archivo de Recetas
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange('recetas')}
                                />
                                <Button
                                    variant="primary"
                                    onClick={() => handleUpload('recetas')}>
                                    Subir Recetas
                                </Button>
                            </Form.Group>

                            {/* Comanda */}
                            <Form.Group
                                controlId="formFileComanda"
                                className="mb-3">
                                <Form.Label>
                                    Selecciona el archivo de Comanda
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange('comanda')}
                                />
                                <Button
                                    variant="primary"
                                    onClick={() => handleUpload('comanda')}>
                                    Subir Comanda
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </AuthLayout>
    );
};

export default ImportarExcel;
