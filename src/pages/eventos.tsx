import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Nav } from 'react-bootstrap';
import AuthLayout from '@/components/AuthLayout';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ComandaAttributes } from '@/models/Comanda';
import Link from 'next/link';
//import DashboardNavbar from '@/components/DashboardNavbar';

interface Event {
    id: number;
    name: string;
    date: Date;
}

const Eventos = () => {
    const [currentWeek, setCurrentWeek] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [eventos, setEventos] = useState<Event[]>([]);

    useEffect(() => {
        fetch('/api/eventos/get')
            .then((response) => response.json())
            .then((data: ComandaAttributes[]) => {
                setEventos(
                    data.map((evento: ComandaAttributes) => {
                        return {
                            id: evento.id ? evento.id : 0,
                            name: evento.nombre,
                            date: new Date(evento.fecha),
                        };
                    })
                );
            });
    }, []);

    const changeWeek = (direction: 'prev' | 'next') => {
        setCurrentWeek(
            direction === 'next'
                ? addDays(currentWeek, 7)
                : subDays(currentWeek, 7)
        );
    };

    const weekDays = Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeek, i)
    );

    return (
        <AuthLayout>
            <Container className="mt-4">
                <h2 className="text-center mb-4">Eventos</h2>
                <div className="d-flex justify-content-between mb-3">
                    <Button
                        variant="primary"
                        onClick={() => changeWeek('prev')}>
                        Semana Anterior
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => changeWeek('next')}>
                        Siguiente Semana
                    </Button>
                </div>
                <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="text-center">
                    <thead className="table-dark">
                        <tr>
                            {weekDays.map((day) => (
                                <th key={day.toISOString()}>
                                    {format(day, 'EEEE dd/MM')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {weekDays.map((day) => {
                                const dayEvents = eventos.filter(
                                    (event) =>
                                        format(event.date, 'yyyy-MM-dd') ===
                                        format(day, 'yyyy-MM-dd')
                                );
                                return (
                                    <td
                                        key={day.toISOString()}
                                        className="align-top">
                                        {dayEvents.length > 0 ? (
                                            dayEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="mb-2 p-2 border rounded bg-light">
                                                    <Nav.Link
                                                        href={`/eventos/${event.id}`}
                                                        as={Link}>
                                                        {event.name}
                                                    </Nav.Link>
                                                </div>
                                            ))
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </AuthLayout>
    );
};

export default Eventos;
