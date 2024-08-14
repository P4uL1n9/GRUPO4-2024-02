import React, { useState } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Nav from '../components/Nav'
import '../styles/styles.css'; // Importa tu archivo CSS personalizado

const DicomViewer = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      try {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.configure({
          useWebWorkers: true
        });

        const imageIds = [];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.name.endsWith('.dcm')) {
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            imageIds.push(imageId);
          }
        }

        setImages(imageIds);
        setError('');
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Error loading images');
      }
    }
  };

  const displayImages = async () => {
    try {
      const element = document.getElementById('dicomImage');
      cornerstone.enable(element);

      for (let i = 0; i < images.length; i++) {
        const imageId = images[i];
        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);
      }
    } catch (error) {
      console.error('Error displaying images:', error);
      setError('Error displaying images');
    }
  };

  return (
    <div>
      <nav>
        <Nav/>
      </nav>
      <div>
        <h2>Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={{ display: 'flex', justifyContent: 'center' }}>
          <input type="file" accept=".dcm" multiple onChange={handleFileChange} />
          <button type="button" onClick={displayImages}>Mostrar Imágenes</button>
        </form>
        <div id="dicomImage" className="dicom-wrapper">
          {images.map((imageId, index) => (
            <div key={index} className="dicom-viewer">
              <canvas className="cornerstone-canvas" id={`dicomCanvas-${index}`}></canvas>
            </div>
          ))}
        </div>
      </div>
      </div>
  );
};

export default DicomViewer;
