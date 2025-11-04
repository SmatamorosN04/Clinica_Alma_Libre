import React from "react";

const Footer = ({ year = 2025, clinicName = 'Clinica Psicologica "Alma Libre"', contactEmail= 'SmatamorosN12@gmail.com'}) => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {year} {clinicName}, Todos los derechos reservados </p>
                <p>
                    <a href={`mailto:${contactEmail}`}>Contacto</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;