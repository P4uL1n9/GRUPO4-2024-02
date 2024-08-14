import React, { useState } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import '../styles/dicomViewer.css';
import Nav from '../components/Nav'


const DicomViewer = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo DICOM.');
      return;
    }

    try {
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.configure({
        useWebWorkers: true
      });

      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      const element = document.getElementById('dicomImage');

      cornerstone.enable(element);
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
    } catch (error) {
      console.error(error);
      setError('Error al cargar el archivo DICOM.');
    }
  };

  return (
    <div>
      <nav>
        <Nav />
      </nav>
      <div>
        <h2>Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleFileSubmit}>
          <input type="file" accept=".dcm" onChange={handleFileChange} />
          <button type="submit">Cargar DICOM</button>
        </form>
        <div id="dicomImage" style={{ width: '512px', height: '512px', border: '1px solid black' }}></div>
      </div>
    </div>
  );
};


export default DicomViewer;
