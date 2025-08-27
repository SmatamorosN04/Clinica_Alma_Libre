import React, { useEffect} from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function AgregarLectura(){
    //funciones para los botones
    const mostrarPerfil =() => console.log("Mostrar perfil");
    const verCitas = () => console.log("Solicitar cita");
    const historialcitas = () => console.log("Historial de citas");
    const cerrarSesion= () => console.log("cerrar sesion");

    useEffect(() => {
        if(window.CKEDITOR) {
            CKEDITOR.replace("contenido");
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const titulo = document.getElementById("titulo").value;
        const contenido = CKEDITOIR.intences.contenido.getData();
        console.log({ titulo, contenido});
            // Aquí iría la lógica de guardar la lectura

    };

    const menuItem = [
        { label: "Inicio", icon: "home", onClick: () => console.log("inicio")},
        {
            label: "Perfil",
            icon: "person",
            onClick: mostrarPerfil,
        },
        {
            label: "Citas",
            icon: "calendar_today",
            onClick: verCitas,
        },
    ];
    
    const button = [];

  return (
    <DashboardLayout title="CLÍNICA PSICOLÓGICA" menuItems={menuItems} buttons={buttons}>
      <div className="botones-header">
        <h2>Menú para agregar nuevas lecturas</h2>
      </div>

      <main>
        <div className="tarjeta form-container">
          <h2>Agregar Nueva Lectura</h2>
          <p className="palabras">
            Complete el siguiente formulario para registrar un nuevo artículo.
          </p>

          <form id="form-articulo" onSubmit={handleSubmit}>
            <label htmlFor="titulo"><strong>Título:</strong></label>
            <textarea id="titulo" placeholder="Ingrese el título de la lectura"></textarea>

            <label htmlFor="contenido"><strong>Contenido de la lectura:</strong></label>
            <textarea id="contenido" placeholder="Ingrese la información de la lectura"></textarea>

            <button type="submit" className="menu-btn">Guardar Lectura</button>
          </form>
        </div>
      </main>

      {/* Perfil Modal */}
      <div className="background" id="perfil" style={{ display: "none" }}>
        <div className="outer-div">
          <div className="inner-div">
            <div className="front">
              <div className="front__bkg-photo"></div>
              <div className="front__face-photo" id="foto-perfil"></div>
              <div className="front__text">
                <h3 className="front__text-header" id="nombre-usuario">Nombre Apellido</h3>
                <h2 id="rol-usuario">Rol</h2>
                <p className="front__text-para">
                  <span id="ubicacion-usuario">Ubicación</span>
                </p>
                <span className="front__text-hover">Contáctame</span>
              </div>
            </div>
            <div className="back">
              <div className="social-media-wrapper">
                <ul>
                  <li>Edad: <span id="edad-usuario">--</span> años</li>
                  <li>Género: <span id="genero-usuario">--</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );


}