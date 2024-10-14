from flask import Flask, request, jsonify
import numpy as np
import pydicom
import os

app = Flask(__name__)

def generate_views(dicom_files):
    images = [pydicom.dcmread(f) for f in dicom_files]
    pixel_arrays = [img.pixel_array for img in images]

    # Convertir a un array 3D
    volume = np.array(pixel_arrays)

    # Vistas
    sagittal_view = volume[:, :, volume.shape[2] // 2]  # Corte en el medio del eje Z
    coronal_view = volume[:, volume.shape[1] // 2, :]  # Corte en el medio del eje Y
    axial_view = volume[volume.shape[0] // 2, :, :]  # Corte en el medio del eje X

    return {
        'sagittal': sagittal_view.tolist(),
        'coronal': coronal_view.tolist(),
        'axial': axial_view.tolist()
    }

@app.route('/generate_views', methods=['POST'])
def generate_views_endpoint():
    files = request.files.getlist("dicom_files")
    dicom_file_paths = []
    
    for file in files:
        file_path = f"./tmp/{file.filename}"  # Cambia la ruta según tu estructura
        file.save(file_path)
        dicom_file_paths.append(file_path)
    
    views = generate_views(dicom_file_paths)
    
    # Eliminar archivos temporales
    for file_path in dicom_file_paths:
        os.remove(file_path)
    
    return jsonify(views)

if __name__ == '__main__':
    app.run(debug=True)
