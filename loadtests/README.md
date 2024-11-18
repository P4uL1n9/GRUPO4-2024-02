Prueba 1: Registro válido
Prueba 2: Registro inválido
Prueba 3: Login inválido

Se realizaron 100 tests en un tiempo límite de 30 segundos.

Intentamos realizar los requests con localhost y el url correspondiente, pero por algún motivo el programa daba error para todas las pruebas.
En concreto, el error que tiraba era "error 500: Internal Server Error".
Si uno miraba el terminal para la primera prueba, lo que soltaba la app era "Error al crear usuario: Error: WHERE parameter "email" has invalid "undefined" value" Lo mismo para la segunda prueba.
Y para la prueba 3, "Error al iniciar sesión: Error: WHERE parameter "nombre" has invalid "undefined" value"