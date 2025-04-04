import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Container,
    Card,
    Badge,
    Row,
    Col,
    Accordion,
} from 'react-bootstrap';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

// Necesitamos agregar esta declaración para TypeScript
declare module 'jspdf' {
    interface jsPDF {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable: (options: any) => jsPDF;
    }
}

interface Comida {
    id: number;
    nombre: string;
    schedule: {
        id?: number;
        cantidad: number;
        fechaPreparacion: string;
    }[];
}

interface Menu {
    tipo: string;
    fecha: string;
    horario: string;
    observaciones: string;
    nombre: string;
    menu: Comida[];
}

interface Recipe {
    nombre: string;
    cantidad: number;
    fechaPreparacion: string;
    ingredientes: Ingrediente[];
}

interface Ingrediente {
    id: number;
    codigo: string;
    nombreProducto: string;
    proceso: string;
    tipo: string;
    subCodigo: string;
    descripcion: string;
    unidadMedida: string;
    porcionBruta: number;
    porcionNeta: number;
    MO: number;
    dueno: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IngredienteAgrupado {
    pt: Ingrediente | null;
    ingredientes: Ingrediente[];
}

// Obtener las fechas de la semana dado un día de referencia (por ejemplo, lunes)
const getWeekDates = (startDate: Date): Date[] => {
    const weekDates: Date[] = [];
    const dayOfWeek = startDate.getDay(); // Obtiene el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)

    // Ajustamos la fecha para que el lunes sea el primer día de la semana
    startDate.setDate(startDate.getDate() - dayOfWeek + 1);

    // Agregamos las fechas de la semana (Lunes a Domingo)
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        weekDates.push(date); // Formato dd/mm/yyyy
    }

    return weekDates;
};

const formatearFecha = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
    }).format(date);
};

const WeeklySchedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [comanda, setComanda] = useState<Menu | null>(null);
    const [isEditable, setIsEditable] = useState(false); // Estado de edición
    const [editedComanda, setEditedComanda] = useState<Menu | null>(null); // Estado para cambios
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

    const router = useRouter();
    const { slug: id } = router.query;

    useEffect(() => {
        fetch(`/api/eventos/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setComanda(data.comanda);
                const recetas = data.recetas
                    ? data.recetas.filter((receta: Recipe) => receta.cantidad)
                    : data.recetas;
                setRecipes(recetas);
                setEditedComanda(data.comanda); // Inicializa el estado de edición con la comanda actual
                console.log(data);
            });
    }, [id]);

    const weekDates = getWeekDates(currentDate);

    const changeWeek = (direction: 'next' | 'prev') => {
        const newDate = new Date(currentDate);
        if (direction === 'next') {
            newDate.setDate(currentDate.getDate() + 7);
        } else {
            newDate.setDate(currentDate.getDate() - 7);
        }
        setCurrentDate(newDate);
    };

    // Maneja los cambios en las celdas editables
    const handleEditChange = (
        comidaId: number,
        date: Date,
        newQuantity: number
    ) => {
        setEditedComanda((prevComanda) => {
            if (!prevComanda) return null;

            const updatedMenu = prevComanda.menu.map((comida) => {
                if (comida.id === comidaId) {
                    const updatedComida = { ...comida };

                    const existSchedule = updatedComida.schedule.some(
                        ({ fechaPreparacion }) => {
                            const fecha = new Date(fechaPreparacion);
                            fecha.setHours(0, 0, 0, 0);

                            return fecha.getTime() === date.getTime();
                        }
                    );

                    if (existSchedule) {
                        // Lo buscamos y actualizamos
                        updatedComida.schedule.map((horario) => {
                            const fecha = new Date(horario.fechaPreparacion);
                            fecha.setHours(0, 0, 0, 0);

                            if (fecha.getTime() === date.getTime())
                                horario.cantidad = newQuantity;

                            return horario;
                        });
                    } else {
                        // Lo agrego
                        updatedComida.schedule.push({
                            fechaPreparacion: date.toString(),
                            cantidad: newQuantity,
                        });
                    }

                    return updatedComida;
                }
                return comida;
            });

            return { ...prevComanda, menu: updatedMenu };
        });

        // COPIAR LA FUNCION DE ARRIBA
        setComanda((prevComanda) => {
            if (!prevComanda) return null;

            const updatedMenu = prevComanda.menu.map((comida) => {
                if (comida.id === comidaId) {
                    const updatedComida = { ...comida };

                    const existSchedule = updatedComida.schedule.some(
                        ({ fechaPreparacion }) => {
                            const fecha = new Date(fechaPreparacion);
                            fecha.setHours(0, 0, 0, 0);

                            return fecha.getTime() === date.getTime();
                        }
                    );

                    if (existSchedule) {
                        // Lo buscamos y actualizamos
                        updatedComida.schedule.map((horario) => {
                            const fecha = new Date(horario.fechaPreparacion);
                            fecha.setHours(0, 0, 0, 0);

                            if (fecha.getTime() === date.getTime())
                                horario.cantidad = newQuantity;

                            return horario;
                        });
                    } else {
                        // Lo agrego
                        updatedComida.schedule.push({
                            fechaPreparacion: date.toString(),
                            cantidad: newQuantity,
                        });
                    }

                    return updatedComida;
                }
                return comida;
            });

            return { ...prevComanda, menu: updatedMenu };
        });
    };

    // Guardar cambios en el servidor
    const saveChanges = () => {
        if (editedComanda) {
            console.log(editedComanda);
            setIsEditable(false); // Deshabilitamos el modo de edición
            fetch(`/api/eventos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comanda: editedComanda }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setComanda(data.updatedData.comanda); // Actualizamos la comanda original con los cambios guardados
                    setRecipes(
                        data.updatedData.recetas.filter(
                            (receta: Recipe) => receta.cantidad
                        )
                    );
                    setIsEditable(false); // Deshabilitamos el modo de edición
                })
                .catch((error) => {
                    console.error('Error al guardar cambios:', error);
                });
        }
    };

    const toggleExpand = (index: number): void => {
        setExpandedRecipe(expandedRecipe === index ? null : index);
    };

    // Function to format date strings consistently
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch {
            // Return original if parsing fails
            return dateString;
        }
    };

    // Función para agrupar ingredientes por PT
    const agruparPorPT = (
        ingredientes: Ingrediente[]
    ): Record<string, IngredienteAgrupado> => {
        const grupos: Record<string, IngredienteAgrupado> = {};

        // Primero encontramos todos los PT
        const pts = ingredientes.filter((ing) => ing.tipo === 'PT');

        // Inicializamos grupos para ingredientes directos (no pertenecen a PT)
        grupos['direct'] = {
            pt: null,
            ingredientes: [],
        };

        // Inicializamos grupos para cada PT
        pts.forEach((pt) => {
            grupos[pt.subCodigo] = {
                pt: pt,
                ingredientes: [],
            };
        });

        // Asignamos ingredientes a sus grupos
        ingredientes.forEach((ing) => {
            if (ing.tipo === 'PT') {
                return; // Los PT ya los procesamos arriba
            }

            // Buscamos si este ingrediente pertenece a algún PT
            const ptParent = pts.find((pt) => pt.subCodigo === ing.codigo);

            if (ptParent) {
                // Si pertenece a un PT, lo agregamos a ese grupo
                grupos[ptParent.subCodigo].ingredientes.push(ing);
            } else {
                // Si no pertenece a ningún PT, va al grupo directo
                grupos['direct'].ingredientes.push(ing);
            }
        });

        return grupos;
    };

    const generarPDF = (recipe: Recipe) => {
        // Creamos el documento PDF
        const doc = new jsPDF();
        const gruposIngredientes = agruparPorPT(recipe.ingredientes);

        // Configuración de cabecera
        doc.setFontSize(20);
        doc.text(recipe.nombre, 14, 22);

        doc.setFontSize(12);
        doc.text(`Cantidad: ${recipe.cantidad} unidades`, 14, 32);
        doc.text(
            `Fecha de Preparación: ${formatDate(recipe.fechaPreparacion)}`,
            14,
            40
        );
        doc.text(`Total Ingredientes: ${recipe.ingredientes.length}`, 14, 48);

        let yPosition = 60;

        // Agregamos los ingredientes directos
        if (gruposIngredientes['direct'].ingredientes.length > 0) {
            doc.setFontSize(14);
            doc.text('Ingredientes Directos', 14, yPosition);
            yPosition += 10;

            // Crear tabla de ingredientes directos
            const directHeaders = [
                ['Código', 'Descripción', 'Unidad', 'Porción Bruta', 'Tipo'],
            ];
            const directData = gruposIngredientes['direct'].ingredientes.map(
                (ing) => [
                    ing.subCodigo,
                    ing.descripcion,
                    ing.unidadMedida,
                    ing.porcionBruta.toString(),
                    ing.tipo,
                ]
            );

            doc.autoTable({
                startY: yPosition,
                head: directHeaders,
                body: directData,
                theme: 'striped',
                headStyles: { fillColor: [66, 139, 202] },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            yPosition = (doc as any).lastAutoTable.finalY + 15;
        }

        // Agregamos los ingredientes agrupados por PT
        Object.entries(gruposIngredientes)
            .filter(([key]) => key !== 'direct' && gruposIngredientes[key].pt)
            .forEach(([, grupo]) => {
                if (!grupo.pt) return;

                // Si no hay suficiente espacio en la página, crear una nueva
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(14);
                doc.text(
                    `${grupo.pt.descripcion} (${grupo.pt.subCodigo}) - PT`,
                    14,
                    yPosition
                );
                doc.setFontSize(12);
                doc.text(
                    `Porción: ${grupo.pt.porcionBruta} ${grupo.pt.unidadMedida}`,
                    14,
                    yPosition + 8
                );
                yPosition += 15;

                // Crear tabla de ingredientes del PT
                const ptHeaders = [
                    [
                        'Código',
                        'Descripción',
                        'Unidad',
                        'Porción Bruta',
                        'Tipo',
                    ],
                ];
                const ptData = grupo.ingredientes.map((ing) => [
                    ing.subCodigo,
                    ing.descripcion,
                    ing.unidadMedida,
                    ing.porcionBruta.toString(),
                    ing.tipo,
                ]);

                doc.autoTable({
                    startY: yPosition,
                    head: ptHeaders,
                    body: ptData,
                    theme: 'grid',
                    headStyles: { fillColor: [120, 120, 120] },
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                yPosition = (doc as any).lastAutoTable.finalY + 15;
            });

        // Guardar el PDF
        doc.save(`Receta_${recipe.nombre.replace(/\s+/g, '_')}.pdf`);
    };

    // Función para exportar una receta individual al PDF
    const exportarRecetaAPDF = (
        doc: jsPDF,
        recipe: Recipe,
        startY: number
    ): number => {
        const gruposIngredientes = agruparPorPT(recipe.ingredientes);
        let yPosition = startY;

        // Título de la receta
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(recipe.nombre, 14, yPosition);

        // Detalles de la receta
        doc.setFontSize(11);
        doc.text(
            `Cantidad: ${recipe.cantidad} unidades | Fecha: ${formatDate(
                recipe.fechaPreparacion
            )}`,
            14,
            yPosition + 8
        );
        yPosition += 15;

        // Agregar línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition, 196, yPosition);
        yPosition += 5;

        // Ingredientes directos
        if (gruposIngredientes['direct'].ingredientes.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(66, 139, 202);
            doc.text('Ingredientes Directos', 14, yPosition);
            yPosition += 5;

            const directHeaders = [
                ['Código', 'Descripción', 'Unidad', 'Porción Bruta', 'Tipo'],
            ];
            const directData = gruposIngredientes['direct'].ingredientes.map(
                (ing) => [
                    ing.subCodigo,
                    ing.descripcion,
                    ing.unidadMedida,
                    ing.porcionBruta.toString(),
                    ing.tipo,
                ]
            );

            doc.autoTable({
                startY: yPosition,
                head: directHeaders,
                body: directData,
                theme: 'striped',
                headStyles: { fillColor: [66, 139, 202] },
                margin: { left: 14, right: 14 },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            yPosition = (doc as any).lastAutoTable.finalY + 10;
        }

        // Ingredientes agrupados por PT
        Object.entries(gruposIngredientes)
            .filter(([key]) => key !== 'direct' && gruposIngredientes[key].pt)
            .forEach(([, grupo]) => {
                if (!grupo.pt) return;

                // Verificar si necesitamos una nueva página
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(102, 102, 102);
                doc.text(
                    `${grupo.pt.descripcion} (${grupo.pt.subCodigo}) - PT`,
                    14,
                    yPosition
                );
                doc.setFontSize(10);
                doc.text(
                    `Porción: ${grupo.pt.porcionBruta} ${grupo.pt.unidadMedida}`,
                    14,
                    yPosition + 6
                );
                yPosition += 10;

                const ptHeaders = [
                    [
                        'Código',
                        'Descripción',
                        'Unidad',
                        'Porción Bruta',
                        'Tipo',
                    ],
                ];
                const ptData = grupo.ingredientes.map((ing) => [
                    ing.subCodigo,
                    ing.descripcion,
                    ing.unidadMedida,
                    ing.porcionBruta.toString(),
                    ing.tipo,
                ]);

                doc.autoTable({
                    startY: yPosition,
                    head: ptHeaders,
                    body: ptData,
                    theme: 'grid',
                    headStyles: { fillColor: [120, 120, 120] },
                    margin: { left: 14, right: 14 },
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                yPosition = (doc as any).lastAutoTable.finalY + 10;
            });

        return yPosition;
    };

    // Función para generar el PDF con todas las recetas
    const generarPDFCompleto = () => {
        if (recipes === null) return;

        // Creamos el documento PDF
        const doc = new jsPDF();
        let yPosition = 20;
        console.log(typeof doc.autoTable);

        // Título del documento
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Lista de Recetas', 14, yPosition);

        // Fecha de generación
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125);
        doc.text(
            `Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
            14,
            yPosition + 8
        );

        yPosition += 15;

        // Exportar cada receta
        recipes.forEach((recipe, index) => {
            // Si no es la primera receta y queda poco espacio, añadir nueva página
            if (index > 0 && yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }

            yPosition = exportarRecetaAPDF(doc, recipe, yPosition);

            // Agregar espacio entre recetas
            yPosition += 15;

            // Agregar separador entre recetas (excepto la última)
            if (index < recipes.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.line(14, yPosition - 10, 196, yPosition - 10);
            }
        });

        // Guardar el PDF
        doc.save(`ListaDeRecetas_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    return (
        <AuthLayout>
            <Container className="mt-4">
                <h2 className="text-center mb-4">Nombre: {comanda?.nombre}</h2>
                <h3 className="text-center mb-4">Evento: {comanda?.tipo}</h3>
                <h3 className="text-center mb-4">Fecha: {comanda?.fecha}</h3>
                <h3 className="text-center mb-4">
                    Horario: {comanda?.horario}
                </h3>

                <p className="fw-bold">Observaciones:</p>
                <p>{comanda?.observaciones}</p>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <Button
                            onClick={() => changeWeek('prev')}
                            variant="primary">
                            Semana Anterior
                        </Button>
                        <Button
                            onClick={() => changeWeek('next')}
                            variant="primary"
                            className="ml-2 mx-3">
                            Semana Siguiente
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => setIsEditable(!isEditable)}
                            variant="warning"
                            className="ml-2">
                            {isEditable ? 'Cancelar Edición' : 'Editar'}
                        </Button>
                        {isEditable && (
                            <Button
                                onClick={saveChanges}
                                variant="success"
                                className="ml-2 mx-3">
                                Guardar Cambios
                            </Button>
                        )}
                    </div>
                </div>

                <Table
                    striped
                    bordered
                    hover>
                    <thead className="table-dark">
                        <tr>
                            <th>COMIDA</th>
                            {weekDates.map((date, index) => (
                                <th key={index}>{formatearFecha(date)}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {comanda?.menu.map((comida: Comida) => (
                            <tr key={comida.id}>
                                <td>{comida.nombre}</td>
                                {weekDates.map((date, index) => {
                                    date.setHours(0, 0, 0, 0);

                                    const isMatchingDate = comida.schedule.some(
                                        (horario) => {
                                            const fechaFormateada = new Date(
                                                horario.fechaPreparacion
                                            );
                                            fechaFormateada.setHours(
                                                0,
                                                0,
                                                0,
                                                0
                                            );
                                            return (
                                                date.getTime() ===
                                                fechaFormateada.getTime()
                                            );
                                        }
                                    );
                                    const currentQuantity = isMatchingDate
                                        ? comida.schedule.find((horario) => {
                                              const fecha = new Date(
                                                  horario.fechaPreparacion
                                              );

                                              fecha.setHours(0, 0, 0, 0);

                                              return (
                                                  fecha.getTime() ===
                                                  date.getTime()
                                              );
                                          })?.cantidad
                                        : 0;

                                    return (
                                        <td key={index}>
                                            {isEditable ? (
                                                <input
                                                    type="number"
                                                    value={currentQuantity}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            comida.id,
                                                            date,
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    style={{
                                                        width: '50%',
                                                        minWidth: 'content',
                                                    }}
                                                />
                                            ) : currentQuantity &&
                                              currentQuantity > 0 ? (
                                                currentQuantity
                                            ) : (
                                                ' - '
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Container className="mt-4">
                <h2 className="mb-4">Recetas</h2>

                <Button
                    variant="danger"
                    onClick={generarPDFCompleto}
                    className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-file-earmark-pdf-fill"></i> Exportar
                    todas las recetas a PDF
                </Button>

                {recipes?.map((recipe, index) => {
                    // Agrupamos ingredientes por PT para esta receta
                    const gruposIngredientes = agruparPorPT(
                        recipe.ingredientes
                    );

                    return (
                        <Card
                            key={index}
                            className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                <h4>{recipe.nombre}</h4>
                                <Badge
                                    bg="primary"
                                    pill>
                                    {recipe.cantidad} unidades
                                </Badge>
                            </Card.Header>

                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <p>
                                            <strong>
                                                Fecha de Preparación:
                                            </strong>{' '}
                                            {formatDate(
                                                recipe.fechaPreparacion
                                            )}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p>
                                            <strong>Ingredientes:</strong>{' '}
                                            {recipe.ingredientes.length}
                                        </p>
                                    </Col>
                                </Row>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => toggleExpand(index)}
                                    className="mb-3">
                                    {expandedRecipe === index
                                        ? 'Ocultar ingredientes'
                                        : 'Mostrar ingredientes'}
                                </Button>

                                {expandedRecipe === index && (
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                Lista de Ingredientes
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {/* Ingredientes directos */}
                                                {gruposIngredientes['direct']
                                                    .ingredientes.length >
                                                    0 && (
                                                    <Table
                                                        striped
                                                        bordered
                                                        hover
                                                        responsive
                                                        className="mb-4">
                                                        <thead>
                                                            <tr>
                                                                <th>Código</th>
                                                                <th>
                                                                    Descripción
                                                                </th>
                                                                <th>Unidad</th>
                                                                <th>
                                                                    Porción
                                                                    Bruta
                                                                </th>
                                                                <th>Tipo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {gruposIngredientes[
                                                                'direct'
                                                            ].ingredientes.map(
                                                                (
                                                                    ingrediente,
                                                                    idx
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            idx
                                                                        }>
                                                                        <td>
                                                                            {
                                                                                ingrediente.subCodigo
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                ingrediente.descripcion
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                ingrediente.unidadMedida
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                ingrediente.porcionBruta
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <Badge
                                                                                bg={
                                                                                    ingrediente.tipo ===
                                                                                    'MP'
                                                                                        ? 'info'
                                                                                        : 'warning'
                                                                                }>
                                                                                {
                                                                                    ingrediente.tipo
                                                                                }
                                                                            </Badge>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                )}

                                                {/* Ingredientes agrupados por PT */}
                                                {Object.entries(
                                                    gruposIngredientes
                                                )
                                                    .filter(
                                                        ([key]) =>
                                                            key !== 'direct' &&
                                                            gruposIngredientes[
                                                                key
                                                            ].pt
                                                    )
                                                    .map(([, grupo], gIdx) => (
                                                        <Card
                                                            key={gIdx}
                                                            className="mb-3 border-secondary">
                                                            <Card.Header className="bg-secondary text-white">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <strong>
                                                                        {
                                                                            grupo
                                                                                .pt
                                                                                ?.descripcion
                                                                        }
                                                                    </strong>
                                                                    <Badge
                                                                        bg="light"
                                                                        text="dark">
                                                                        {
                                                                            grupo
                                                                                .pt
                                                                                ?.subCodigo
                                                                        }{' '}
                                                                        - PT
                                                                    </Badge>
                                                                </div>
                                                                <small>
                                                                    Porción:{' '}
                                                                    {
                                                                        grupo.pt
                                                                            ?.porcionBruta
                                                                    }{' '}
                                                                    {
                                                                        grupo.pt
                                                                            ?.unidadMedida
                                                                    }
                                                                </small>
                                                            </Card.Header>
                                                            <Card.Body className="p-0">
                                                                <Table
                                                                    striped
                                                                    bordered
                                                                    hover
                                                                    responsive
                                                                    className="m-0">
                                                                    <thead className="table-light">
                                                                        <tr>
                                                                            <th>
                                                                                Código
                                                                            </th>
                                                                            <th>
                                                                                Descripción
                                                                            </th>
                                                                            <th>
                                                                                Unidad
                                                                            </th>
                                                                            <th>
                                                                                Porción
                                                                                Bruta
                                                                            </th>
                                                                            <th>
                                                                                Tipo
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {grupo.ingredientes.map(
                                                                            (
                                                                                ingrediente,
                                                                                idx
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        idx
                                                                                    }>
                                                                                    <td>
                                                                                        {
                                                                                            ingrediente.subCodigo
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            ingrediente.descripcion
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            ingrediente.unidadMedida
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            ingrediente.porcionBruta
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <Badge bg="info">
                                                                                            {
                                                                                                ingrediente.tipo
                                                                                            }
                                                                                        </Badge>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                </Table>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                )}
                            </Card.Body>
                        </Card>
                    );
                })}
            </Container>
        </AuthLayout>
    );
};

export default WeeklySchedule;
