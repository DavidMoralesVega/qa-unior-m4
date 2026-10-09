# language: es
Característica: Inicio de sesión en Demo Web Shop
  Como cliente de la tienda
  quiero iniciar sesión con mi cuenta
  para comprar con mis datos guardados

  Antecedentes:
    Dado que estoy en la página de inicio de sesión

  Escenario: DWS-LOG-004 · credenciales válidas
    Cuando ingreso con el usuario de prueba
    Entonces veo el enlace "Log out"

  Escenario: DWS-LOG-005 · cerrar sesión
    Cuando ingreso con el usuario de prueba
    Y cierro la sesión
    Entonces veo el enlace "Log in"

  Esquema del escenario: <caso> · no deja entrar
    Cuando ingreso con el email "<email>" y la clave "<clave>"
    Entonces veo el error "<mensaje>"

    Ejemplos:
      | caso        | email                         | clave    | mensaje                   |
      | DWS-LOG-001 | qa.unior.modulo4@example.com  | Clave999 | Login was unsuccessful    |
      | DWS-LOG-002 | superadmin@test.com           | Test123  | No customer account found |
      | DWS-LOG-003 |                               |          | Login was unsuccessful    |
