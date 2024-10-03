import React, { useState, useRef, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import * as THREE from 'three';
import Nav from '../components/Nav';
import '../styles/styles.css'; // Importa tu archivo CSS personalizado
import '../styles/dicomViewer.css'; // Importa tu archivo CSS personalizado

const DicomViewer = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual
  const [isNegative, setIsNegative] = useState(false); // Estado para controlar el modo negativo
  const [contrast, setContrast] = useState(1); // Estado para controlar el contraste
  const threeViewerRef = useRef(null); // Para el contenedor 3D

  useEffect(() => {
    if (images.length > 0) {
      displayImages();
      visualizeIn3D(images[currentIndex]); // Visualiza solo la imagen actual en 3D
    }
  }, [images, currentIndex, isNegative, contrast]); // Añadir isNegative y contrast en dependencias

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      try {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.configure({
          useWebWorkers: true,
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
        setCurrentIndex(0); // Restablecer el índice al cargar nuevas imágenes
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

      const imageId = images[currentIndex]; // Solo muestra la imagen actual
      const image = await cornerstone.loadImage(imageId);

      // Aplicar negativo si está activado
      let pixelData = image.getPixelData();

      // Aplicar contraste si se ha ajustado
      pixelData = applyContrast(pixelData, contrast);

      if (isNegative) {
        // Crear un nuevo array para los datos de píxeles en negativo
        const negativePixelData = new Uint8Array(pixelData.length);
        for (let i = 0; i < pixelData.length; i++) {
          negativePixelData[i] = 255 - pixelData[i]; // Invertir el color
        }
        // Crear una nueva imagen con los datos de píxeles negativos
        const negativeImage = {
          ...image,
          getPixelData: () => negativePixelData,
        };
        cornerstone.displayImage(element, negativeImage);
      } else {
        // Crear una nueva imagen con los datos de píxeles ajustados
        const adjustedImage = {
          ...image,
          getPixelData: () => pixelData,
        };
        cornerstone.displayImage(element, adjustedImage);
      }
    } catch (error) {
      console.error('Error displaying images:', error);
      setError('Error displaying images');
    }
  };

  // Función para aplicar contraste a los datos de píxeles
  const applyContrast = (pixelData, contrast) => {
    const adjustedPixelData = new Uint8Array(pixelData.length);
    for (let i = 0; i < pixelData.length; i++) {
      adjustedPixelData[i] = Math.min(255, Math.max(0, pixelData[i] * contrast)); // Aplicar el factor de contraste
    }
    return adjustedPixelData;
  };

  // Función para visualizar en 3D con Three.js
  const visualizeIn3D = (imageId) => {
    const element = threeViewerRef.current;
    const width = element.clientWidth;
    const height = element.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.innerHTML = ''; // Limpiar el contenido anterior
    element.appendChild(renderer.domElement);

    camera.position.z = 5;
  };

  // Función para manejar el cambio de índice
  const handleIndexChange = (event) => {
    const newIndex = Number(event.target.value);
    setCurrentIndex(newIndex);
    displayImages(); // Actualizar la imagen 2D mostrada
  };

  // Función para manejar el cambio del modo negativo
  const handleNegativeToggle = () => {
    setIsNegative((prev) => !prev);
    displayImages(); // Actualizar la imagen 2D mostrada inmediatamente
  };

  // Función para manejar el cambio de contraste
  const handleContrastChange = (event) => {
    const newContrast = Number(event.target.value);
    setContrast(newContrast);
    displayImages(); // Actualizar la imagen 2D mostrada
  };

  return (
    <div>
      <nav style={{ backgroundColor: '#ffffff', padding: '10px' }}>
        <Nav />
      </nav>
      <div>
        <h2 className="custom-h2">Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={{ display: 'flex', justifyContent: 'center', color:'white', marginBottom: '20px'}}>
          <input 
            type="file" 
            accept=".dcm" 
            multiple 
            onChange={handleFileChange} 
            className='custom-file-upload'
          />
          {/* <button type="button" onClick={displayImages}>
            Mostrar Imágenes 2D
          </button> */}
        </form>
        <div id="dicomImage" className="dicom-wrapper">
          {/* Renderizado en 2D */}
          <canvas className="cornerstone-canvas"></canvas>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <label htmlFor="index" style={{ marginRight: '10px', color:'white' }}>Imagen: </label>
          <input
            id="index"
            type="range"
            min="0"
            max={images.length - 1} // Actualiza el máximo según el número de imágenes
            value={currentIndex}
            onChange={handleIndexChange}
            className='custom-range' // dicomViewer.css
            // style={{ marginLeft: '10px', width: '300px' }}
          />
          {/* Notificador para el índice */}
          <span style={{ marginLeft: '10px', color: 'white' }}>
              {currentIndex + 1}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <label htmlFor="negativeToggle" style={{ marginRight: '10px', color: 'white'}}>
            Modo Negativo:
          </label>
          <input
            id="negativeToggle"
            type="checkbox"
            checked={isNegative}
            onChange={handleNegativeToggle}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <label htmlFor="contrast" style={{ marginRight: '10px', color:'white' }}>
            Contraste:
          </label>
          <input
            id="contrast"
            type="range"
            min="0"
            max="3" // Puedes ajustar el rango según tus necesidades
            step="0.1"
            value={contrast}
            onChange={handleContrastChange}
            className='custom-range' // dicomViewer.css
            // style={{ marginLeft: '10px', width: '300px' }}
          />
          {/* Notificador para el contraste */}
          <span style={{ marginLeft: '10px', color: 'white' }}>{Math.round((contrast / 3) * 100)}%</span>
        </div>
        <div ref={threeViewerRef} style={{ width: '100%', height: '400px' }} />
      </div>
    </div>
  );
};

export default DicomViewer;

