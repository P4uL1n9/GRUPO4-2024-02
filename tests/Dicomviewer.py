import os
import numpy as np
import pydicom
import matplotlib.pyplot as plt

def load_dicom_images(folder_path):
    """Carga imágenes DICOM desde un directorio."""
    slices = []
    for file in os.listdir(folder_path):
        if file.endswith('.dcm'):
            filepath = os.path.join(folder_path, file)
            ds = pydicom.dcmread(filepath)
            slices.append(ds)
    # Ordenar las imágenes por la posición Z
    slices.sort(key=lambda x: float(x.ImagePositionPatient[2]))
    return slices

def get_views(slices):
    """Genera las vistas sagital, coronal y axial a partir de los cortes DICOM."""
    # Suponiendo que las imágenes tienen la misma forma
    shape = slices[0].pixel_array.shape
    num_slices = len(slices)
    
    # Crear un array 3D para las imágenes
    image_data = np.zeros((num_slices, shape[0], shape[1]), dtype=slices[0].pixel_array.dtype)
    
    for i, s in enumerate(slices):
        image_data[i] = s.pixel_array

    # Vistas ortogonales
    sagital_view = np.mean(image_data, axis=0)  # Promedia a través del eje Z
    coronal_view = np.mean(image_data, axis=1)  # Promedia a través del eje X
    axial_view = np.mean(image_data, axis=2)    # Promedia a través del eje Y

    return sagital_view, coronal_view, axial_view

def display_views(sagital, coronal, axial):
    """Muestra las tres vistas ortogonales."""
    plt.figure(figsize=(15, 5))

    plt.subplot(1, 3, 1)
    plt.title("Vista Sagital")
    plt.imshow(sagital, cmap='gray')
    plt.axis('off')

    plt.subplot(1, 3, 2)
    plt.title("Vista Coronal")
    plt.imshow(coronal, cmap='gray')
    plt.axis('off')

    plt.subplot(1, 3, 3)
    plt.title("Vista Axial")
    plt.imshow(axial, cmap='gray')
    plt.axis('off')

    plt.show()

def main(folder_path):
    """Función principal para ejecutar el procesamiento de imágenes DICOM."""
    slices = load_dicom_images(folder_path)
    if not slices:
        print("No se encontraron archivos DICOM en el directorio.")
        return

    sagital_view, coronal_view, axial_view = get_views(slices)
    display_views(sagital_view, coronal_view, axial_view)

# Especifica la ruta de la carpeta que contiene los archivos DICOM
folder_path = 'C:/Users/rahar/Desktop/anal2/GRUPO4-2024-02/tests/BSSFP'
  # Cambia esto a tu ruta
main(folder_path)
