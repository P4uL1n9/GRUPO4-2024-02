import unittest
import requests

class TestLoginEndpoint(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.base_url = 'http://localhost:5000'  # Actualiza con tu URL real
        cls.login_url = f"{cls.base_url}/login"
        cls.registration_url = f"{cls.base_url}/register"
    
    @classmethod
    def tearDownClass(cls):
        pass  # Código de limpieza si es necesario
    
    def test_login_exitoso(self):
        # Entradas: credenciales válidas
        datos_login = {
            "nombre": "usuarioValido",
            "password": "contraseñaValida"
        }
        respuesta = requests.post(self.login_url, json=datos_login)
        self.assertEqual(respuesta.status_code, 200)
        self.assertIn('user', respuesta.json())  # Salida esperada: token de inicio de sesión
    
    def test_login_fallido(self):
        # Entradas: credenciales inválidas
        datos_login = {
            "nombre": "usuarioInvalido",
            "password": "contraseñaInvalida"
        }
        respuesta = requests.post(self.login_url, json=datos_login)
        self.assertEqual(respuesta.status_code, 401)
        self.assertIn('error', respuesta.json())  # Salida esperada: mensaje de error
    
class TestRegistrationEndpoint(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.base_url = 'http://localhost:5000'  # Actualiza con tu URL real
        cls.registration_url = f"{cls.base_url}/register"
    
    @classmethod
    def tearDownClass(cls):
        pass  # Código de limpieza si es necesario
    
    def test_registro_exitoso(self):
        # Entradas: datos de registro válidos
        datos_registro = {
            "nombre": "nuevoUsuario",
            "password": "nuevaContraseña",
            "email": "nuevoemail@example.com"
        }
        respuesta = requests.post(self.registration_url, json=datos_registro)
        self.assertEqual(respuesta.status_code, 201)
        self.assertIn('user', respuesta.json())  # Salida esperada: ID de usuario registrado
    
    def test_registro_fallido(self):
        # Entradas: usuario duplicado
        datos_registro = {
            "nombre": "usuarioExistente",
            "password": "contraseña",
            "email": "usuarioexistente@example.com"
        }
        respuesta = requests.post(self.registration_url, json=datos_registro)
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn('message', respuesta.json())  # Salida esperada: mensaje de error

if __name__ == '__main__':
    unittest.main()