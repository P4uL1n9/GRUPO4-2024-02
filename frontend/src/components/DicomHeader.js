import React, { useState } from 'react';
import dicomParser from 'dicom-parser';
import '../styles/styles.css'; // Importa tu archivo CSS personalizado
import Nav from '../components/Nav';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx

const DicomHeader = () => {
  const [dicomInfo, setDicomInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);

        // Extrae la información que necesitas de la cabecera DICOM
        const info = [
          { title: 'Patient Name', value: dataSet.string('x00100010') },
          { title: 'Patient ID', value: dataSet.string('x00100020') },
          { title: 'Study Date', value: dataSet.string('x00080020') },
          { title: 'Patient Birth Date', value: dataSet.string('x00100030') },
          { title: 'Patient Sex', value: dataSet.string('x00100040') },
          { title: 'Study ID', value: dataSet.string('x00200010') },
          { title: 'Study Description', value: dataSet.string('x00081030') },
          { title: 'Series Number', value: dataSet.string('x00200011') },
          { title: 'Modality', value: dataSet.string('x00080060') },
          { title: 'Institution Name', value: dataSet.string('x00080080') },
          { title: 'Manufacturer', value: dataSet.string('x00080070') },
          { title: 'Model', value: dataSet.string('x00081090') },
          { title: 'Software Version', value: dataSet.string('x00181020') },
          { title: 'Body Part Examined', value: dataSet.string('x00180015') },
          { title: 'Slice Thickness', value: dataSet.string('x00180050') },
          { title: 'Pixel Spacing', value: dataSet.string('x00280030') },
          { title: 'Instance Number', value: dataSet.string('x00200013') },
          { title: 'Image Position (Patient)', value: dataSet.string('x00200032') },
          { title: 'Image Orientation (Patient)', value: dataSet.string('x00200037') },
          { title: 'Acquisition Date', value: dataSet.string('x00080022') },
          { title: 'Acquisition Time', value: dataSet.string('x00080032') },
          { title: 'Content Date', value: dataSet.string('x00080023') },
          { title: 'Content Time', value: dataSet.string('x00080033') },
          { title: 'Referring Physician\'s Name', value: dataSet.string('x00080090') },
          { title: 'Series Description', value: dataSet.string('x0008103e') },
          { title: 'Protocol Name', value: dataSet.string('x00181030') },
          { title: 'Contrast/Bolus Agent', value: dataSet.string('x00180010') },
          { title: 'Number of Slices', value: dataSet.string('x00540081') },
          { title: 'Number of Frames', value: dataSet.string('x00280008') },
          { title: 'Window Center', value: dataSet.string('x00281050') },
          { title: 'Window Width', value: dataSet.string('x00281051') },
          { title: 'Rescale Intercept', value: dataSet.string('x00281052') },
          { title: 'Rescale Slope', value: dataSet.string('x00281053') },
        ];

        setDicomInfo(info);
      } catch (error) {
        console.error('Error reading DICOM file:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setDicomInfo([]);
    setSearchTerm('');
    setFileName('');
    document.getElementById('dicom-file-input').value = null;
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
      <nav>
        <Nav />
      </nav>
      <div className="dicom-info-container">
        <input
          id="dicom-file-input"
          type="file"
          accept=".dcm"
          onChange={handleFileChange}
        />
        {fileName && <p>Archivo cargado: {fileName}</p>}
        <input
          type="text"
          className="search-input"
          placeholder="Buscar información..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleReset} className="reset-button">Limpiar</button>
        <button onClick={handleExportToExcel} className="export-button">Exportar a Excel</button>
        {filteredDicomInfo.map((item, index) => (
          <div key={index} className="dicom-info-item">
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DicomHeader;
