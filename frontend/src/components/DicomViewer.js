import React, { useState, useRef, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import * as THREE from 'three';
import Nav from '../components/Nav';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx
import '../styles/styles.css'; // Importa tu archivo CSS personalizado
import '../styles/dicomViewer.css'; // Importa tu archivo CSS personalizado

const ModalComponent = ({ children, isOpen, toggleModal }) => {
  return (
    <div>
      <button onClick={toggleModal} className="open-modal-btn">Header</button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-modal" onClick={toggleModal}>&times;</span>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DicomViewer = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNegative, setIsNegative] = useState(false);
  const [contrast, setContrast] = useState(1);
  const [dicomInfo, setDicomInfo] = useState([]); // Para la información DICOM
  const [searchTerm, setSearchTerm] = useState('');
  const [fileName, setFileName] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Controla si el modal está abierto o cerrado
  const threeViewerRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      displayImages();
      visualizeIn3D(images[currentIndex]);
    }
  }, [images, currentIndex, isNegative, contrast]);

  const toggleModal = () => {
    setIsOpen(!isOpen); // Cambia el estado del modal al hacer clic
  };

  const handleFileChange = async (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      setFileName(fileList[0].name); // Guarda el nombre del archivo

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
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            
            // Extrae la información que necesitas de la cabecera DICOM
            const info = [
              { title: 'Patient Name', value: dataSet.string('x00100010') },
              { title: 'Study Date', value: dataSet.string('x00080020') },
              { title: 'Patient Birth Date', value: dataSet.string('x00100030') },
              { title: 'Patient Sex', value: dataSet.string('x00100040') },
              { title: 'Study Description', value: dataSet.string('x00081030') },
              { title: 'Modality', value: dataSet.string('x00080060') },
              { title: 'Institution Name', value: dataSet.string('x00080080') },
            ];

            setDicomInfo(info);
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            imageIds.push(imageId);
          }
        }

        setImages(imageIds);
        setError('');
        setCurrentIndex(0);
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

      const imageId = images[currentIndex];
      const image = await cornerstone.loadImage(imageId);

      let pixelData = image.getPixelData();
      pixelData = applyContrast(pixelData, contrast);

      if (isNegative) {
        const negativePixelData = new Uint8Array(pixelData.length);
        for (let i = 0; i < pixelData.length; i++) {
          negativePixelData[i] = 255 - pixelData[i];
        }
        const negativeImage = { ...image, getPixelData: () => negativePixelData };
        cornerstone.displayImage(element, negativeImage);
      } else {
        const adjustedImage = { ...image, getPixelData: () => pixelData };
        cornerstone.displayImage(element, adjustedImage);
      }
    } catch (error) {
      console.error('Error displaying images:', error);
      setError('Error displaying images');
    }
  };

  const applyContrast = (pixelData, contrast) => {
    const adjustedPixelData = new Uint8Array(pixelData.length);
    for (let i = 0; i < pixelData.length; i++) {
      adjustedPixelData[i] = Math.min(255, Math.max(0, pixelData[i] * contrast));
    }
    return adjustedPixelData;
  };

  const visualizeIn3D = (imageId) => {
    const element = threeViewerRef.current;
    const width = element.clientWidth;
    const height = element.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.innerHTML = '';
    element.appendChild(renderer.domElement);

    camera.position.z = 5;
  };

  const handleIndexChange = (event) => {
    const newIndex = Number(event.target.value);
    setCurrentIndex(newIndex);
    displayImages();
  };

  const handleNegativeToggle = () => {
    setIsNegative((prev) => !prev);
    displayImages();
  };

  const handleContrastChange = (event) => {
    const newContrast = Number(event.target.value);
    setContrast(newContrast);
    displayImages();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportToExcel = () => {
    const headers = ['Title', 'Value'];
    const data = dicomInfo.map((item) => [item.title, item.value]);

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    XLSX.utils.book_append_sheet(wb, ws, 'DICOM_Info');

    // Descargar el archivo de Excel
    XLSX.writeFile(wb, 'dicom_info.xlsx');
  };

  // Filtrar la información según el término de búsqueda
  const filteredDicomInfo = dicomInfo.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <div>
        <h2 className="custom-h2">Visor de Archivos DICOM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
          <form style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <input 
              type="file" 
              accept=".dcm" 
              multiple 
              onChange={handleFileChange} 
              className='custom-file-upload'
            />
          </form>
          <ModalComponent isOpen={isOpen} toggleModal={toggleModal}>
            <h2>Información DICOM</h2>
            <div className="dicom-info-container">
              {fileName && <p>Archivo cargado: {fileName}</p>}
              <input
                type="text"
                className="search-input"
                placeholder="Buscar información..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button onClick={handleExportToExcel} className="export-button">Exportar a Excel</button>
              {/* Mapea solo una vez para mostrar la información DICOM filtrada */}
              {filteredDicomInfo.map((item, index) => (
                <div key={index} className="dicom-info-item">
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </ModalComponent>
        </div>
        <div id="dicomImage" className="dicom-wrapper">
          <canvas className="cornerstone-canvas"></canvas>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <label htmlFor="index" style={{ marginRight: '10px', color:'white' }}>Imagen: </label>
          <input
            id="index"
            type="range"
            min="0"
            max={images.length - 1}
            value={currentIndex}
            onChange={handleIndexChange}
            className='custom-range'
          />
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
            className="switch-checkbox"
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