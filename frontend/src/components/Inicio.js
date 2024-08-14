import React from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../components/About';
import Contact from '../components/Contact';
import Login from '../components/login';
import Inicio from '../components/Inicio';
import DicomViewer from '../components/DicomViewer';
import DicomHeader from '../components/DicomHeader';
import Registro from '../components/Registro';

import Nav from '../components/Nav';
import '../styles/inicio.css';


function Dashboard() {
  return (
    <div>
      <nav>
        <Nav />
      </nav>
      <body className="fondo">
          <div className="introduction-container">
            <h1>Bienvenidos al Visualizador de Imágenes de Cabecera DICOM</h1>
            <p>
              En este programa, podrás cargar archivos DICOM y explorar la información contenida en sus cabeceras.
              Los archivos DICOM (Digital Imaging and Communications in Medicine) son un estándar utilizado para
              manejar, almacenar, imprimir y transmitir información en imágenes médicas.
            </p>
            <p>
              Al cargar un archivo DICOM, podrás visualizar datos esenciales como el nombre del paciente,
              su identificación, la fecha del estudio, el sexo, la institución donde se realizó el estudio,
              y muchos otros detalles importantes. Esta herramienta te permitirá no solo ver esta información,
              sino también buscar términos específicos dentro de la cabecera para encontrar rápidamente lo que necesitas.
            </p>
            <p>
              Características principales del programa:
            </p>
            <ul>
              <li>
                <strong>Carga de archivos DICOM:</strong> Puedes cargar tus propios archivos DICOM desde tu computadora.
              </li>
              <li>
                <strong>Visualización de cabeceras:</strong> Muestra información detallada de la cabecera del archivo DICOM cargado.
              </li>
              <li>
                <strong>Búsqueda de información:</strong> Utiliza el campo de búsqueda para encontrar términos específicos en la cabecera.
              </li>
              <li>
                <strong>Reinicio de la carga:</strong> Si necesitas cargar un nuevo archivo, puedes reiniciar fácilmente la aplicación.
              </li>
            </ul>
            <p>
              Esta herramienta está diseñada para profesionales médicos, estudiantes y cualquier persona interesada en
              explorar los detalles técnicos y clínicos de las imágenes médicas. Esperamos que encuentres útil y fácil de usar esta aplicación.
            </p>
          </div>
        </body>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/DicomViewer" element={<DicomViewer />} />
        <Route path="/DicomHeader" element={<DicomHeader />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
