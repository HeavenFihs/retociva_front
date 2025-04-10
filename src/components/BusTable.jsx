import React, { useEffect, useState } from "react";

const BusTable = () => {
    const [buses, setBuses] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async (page) => {
        try{
            setLoading(true);
            const data = await fetch(`http://localhost:8080/bus?page=${page}&size=5`)
                .then(res => res.json());
            setBuses(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error("Error al obtener buses:", err);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handlePrev = () => {
        if(page>0)setPage(page-1);
    };
    const handleNext = () => {
        if(page<totalPages-1)setPage(page+1);
    }

    const fetchBusById = async (id) => {
        try{
            const response = await fetch(`http://localhost:8080/bus/${id}`);
            if(!response.ok)throw new Error("No se pudo obtener el bus");
            const bus = await response.json();

            alert(`Bus ID: ${bus.id}\nNúmero: ${bus.numeroBus}\nPlaca:${bus.placa}\nMarca: ${bus.marca}\nEstado: ${bus.estado?"Activo":"Inactivo"}`);
        } catch (error) {
            console.error("Error al obtener bus: ", error);
            alert("Error al obtener información del bus");
        }
    }

    return (
        <div>
            <h2>Lista de Buses (Página {page+1} de {totalPages})</h2>
            {loading? <p>Espere un momento...</p> : (<>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número de bus</th>
                        <th>Placa</th>
                        <th>Fecha de registro</th>
                        <th>Características</th>
                        <th>Marca</th>
                        <th>estado</th>
                    </tr>
                </thead>
                <tbody>
                    {buses.map((bus) => (
                        <tr 
                            key={bus.id}
                            onClick={() => fetchBusById(bus.id)}
                            style={{cursor:"pointer"}}
                        >
                            <td>{bus.id}</td>
                            <td>{bus.numeroBus}</td>
                            <td>{bus.placa}</td>
                            <td>{bus.fechaCreacion}</td>
                            <td>{bus.caracteristicas}</td>
                            <td>{bus.marca}</td>
                            <td>{bus.estado?"Activo":"Inactivo"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div style={{marginTop:"1rem"}}>
                <button onClick={handlePrev} disabled={page === 0}>Anterior</button>
                <span style={{margin:"0 1rem"}}>Página {page +1}</span>
                <button onClick={handleNext} disabled={page === totalPages-1}>Siguiente</button>
            </div>
            
            </>)}
        </div>
    );
};

export default BusTable;