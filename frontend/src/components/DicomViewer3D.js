// src/components/DicomViewer.js
import React, { useRef, useState } from 'react';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import dicomParser from 'dicom-parser';
import Nav from '../components/Nav';
import '../styles/styles.css'; // Asegúrate de que este archivo exista y esté correctamente referenciado

const DicomViewer = () => {
  const containerRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validar que todos los archivos tengan la extensión .dcm
    const invalidFiles = files.filter(file => !file.name.toLowerCase().endsWith('.dcm'));
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos con extensión .dcm');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Parsear archivos DICOM y extraer datos de píxeles
      const dicomImages = await Promise.all(files.map(file => parseDicomFile(file)));

      // Ordenar las imágenes por ubicación de la slice (Z)
      dicomImages.sort((a, b) => a.sliceLocation - b.sliceLocation);

      // Obtener dimensiones y espaciamiento
      const { dimensions, spacing } = getVolumeInfo(dicomImages);

      // Crear el volumen de imagen
      const vtkImage = vtkImageData.newInstance();
      vtkImage.setDimensions(...dimensions);
      vtkImage.setSpacing(...spacing);
      vtkImage.setOrigin(0, 0, 0);

      // Agregar los datos de píxeles al volumen
      const pixelData = new Uint16Array(dimensions[0] * dimensions[1] * dimensions[2]);
      dicomImages.forEach((img, index) => {
        pixelData.set(img.pixelData, index * dimensions[0] * dimensions[1]);
      });

      vtkImage.getPointData().setScalars(vtkDataArray.newInstance({
        name: 'Scalars',
        values: pixelData,
        numberOfComponents: 1,
      }));

      // Crear el mapper y el volumen para la visualización
      const mapper = vtkVolumeMapper.newInstance();
      mapper.setInputData(vtkImage);

      const volume = vtkVolume.newInstance();
      volume.setMapper(mapper);

      // Configurar las transferencias de color y opacidad
      const ctfun = vtkPiecewiseFunction.newInstance();
      ctfun.addPoint(0, 0.0);
      ctfun.addPoint(500, 1.0);

      const rgb = vtkColorTransferFunction.newInstance();
      rgb.addRGBPoint(0, 0.0, 0.0, 0.0);
      rgb.addRGBPoint(500, 1.0, 0.5, 0.3);

      volume.getProperty().setRGBTransferFunction(0, rgb);
      volume.getProperty().setScalarOpacity(0, ctfun);
      volume.getProperty().setScalarOpacityUnitDistance(0, 4.5);

      // Crear la ventana de renderizado
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        rootContainer: containerRef.current,
        background: [0, 0, 0],
        containerStyle: { width: '100%', height: '600px' },
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      // Agregar el volumen al renderer
      renderer.addVolume(volume);
      renderer.resetCamera();
      renderWindow.render();

      // Configurar interactor
      const interactor = renderWindow.getInteractor();
      interactor.initialize();
      interactor.bindEvents(containerRef.current);

      setLoading(false);
    } catch (err) {
      console.error('Error al procesar archivos DICOM:', err);
      setError('Error al procesar archivos DICOM. Asegúrate de seleccionar archivos válidos y pertenecientes a la misma serie.');
      setLoading(false);
    }
  };

  // Función para parsear un archivo DICOM
  const parseDicomFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const byteArray = new Uint8Array(event.target.result);
          const dataSet = dicomParser.parseDicom(byteArray);

          // Extraer datos necesarios
          const imageOrientationPatient = dataSet.string('x00200037').split('\\').map(Number);
          const imagePositionPatient = dataSet.string('x00200032').split('\\').map(Number);
          const pixelSpacing = dataSet.string('x00280030').split('\\').map(Number);
          const rows = dataSet.uint16('x00280010');
          const columns = dataSet.uint16('x00280011');
          const sliceThickness = parseFloat(dataSet.string('x00180050') || '1.0');

          // Obtener datos de píxeles
          const pixelDataElement = dataSet.elements.x7FE00010;
          const pixelData = new Uint16Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);

          // Calcular la ubicación de la slice (Z)
          const sliceLocation = imagePositionPatient[2] || 0;

          resolve({
            pixelData,
            sliceLocation,
            rows,
            columns,
            pixelSpacing,
            sliceThickness,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Función para obtener información del volumen
  const getVolumeInfo = (dicomImages) => {
    const rows = dicomImages[0].rows;
    const columns = dicomImages[0].columns;
    const numSlices = dicomImages.length;

    const spacing = [
      dicomImages[0].pixelSpacing[0],
      dicomImages[0].pixelSpacing[1],
      dicomImages[0].sliceThickness,
    ];

    return {
      dimensions: [columns, rows, numSlices],
      spacing,
    };
  };

  return (
    <div>
      <nav style={{ backgroundColor: '#ffffff', padding: '10px' }}>
        <Nav />
      </nav>
      <div>
        <h2 className='custom-h2'>Visor de Archivos DICOM en 3D</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <input 
            type="file" 
            accept=".dcm" 
            multiple 
            onChange={handleFileChange} 
            style={{ marginRight: '10px' }}
          />
          <button type="button" onClick={() => {}} disabled>
            Mostrar Imágenes
          </button>
        </form>
        {loading && <p style={{ textAlign: 'center' }}>Cargando y procesando archivos DICOM...</p>}
        <div ref={containerRef}></div>
      </div>
    </div>
  );
};

export default DicomViewer;
