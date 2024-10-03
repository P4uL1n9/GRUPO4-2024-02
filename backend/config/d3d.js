// Inicialización de cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        decodeTask: {
            codecsPath: 'https://unpkg.com/cornerstone-wado-image-loader@2.3.0/dist/cornerstoneWADOImageLoaderCodecs.js'
        }
    }
});

// Configurar Cornerstone para mostrar la imagen DICOM
function loadDicomImage(dicomUrl) {
    const element = document.getElementById('dicom-viewer-container');
    cornerstone.enable(element);
    
    cornerstone.loadAndCacheImage(dicomUrl).then(function(image) {
        cornerstone.displayImage(element, image);
        
        // Aquí puedes obtener los píxeles del archivo DICOM
        const pixelData = image.getPixelData();
        visualizeIn3D(pixelData, image.width, image.height);
    });
}

// Función para visualizar en 3D utilizando Three.js
function visualizeIn3D(pixelData, width, height) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.getElementById('3d-viewer-container').appendChild(renderer.domElement);

    // Crear una geometría basada en los datos DICOM (esto es un ejemplo simple con un cubo)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();
}

// Llamar a la función con el archivo DICOM
// Usamos un ejemplo de URL, pero podrías permitir cargar un archivo local
const dicomUrl = 'DATOS_DICOM/DATOS_DICOM/BSSFP';  // Cambia la URL por tu archivo DICOM
loadDicomImage(dicomUrl);

