# app.py (Backend en Python)
from flask import Flask, request, jsonify
import os
import numpy as np
import pydicom
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_dicom():
    files = request.files.getlist('files')
    views = []

    for file in files:
        dicom_file = pydicom.dcmread(file)
        # Procesa el archivo DICOM aquí y genera las tres vistas ortogonales
        # (ejemplo básico, personaliza según tus necesidades)
        
        # Extraer las imágenes de los planos axial, sagital y coronal
        axial_image = dicom_file.pixel_array
        sagital_image = np.flip(axial_image, axis=0)  # Simple inversión para ejemplo
        coronal_image = np.flip(axial_image, axis=1)  # Simple inversión para ejemplo
        
        # Guarda las imágenes en el disco (o devuélvelas como respuesta)
        views.append({
            'axial': axial_image.tolist(),  # Convierte a lista para JSON
            'sagital': sagital_image.tolist(),
            'coronal': coronal_image.tolist(),
        })

    return jsonify(views)

if __name__ == '__main__':
    app.run(debug=True)
