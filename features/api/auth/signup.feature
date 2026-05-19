@api
Feature: Registro de Usuario - API

  Scenario: Registro exitoso de un nuevo usuario
    When se envía una solicitud POST a "/users" con payload válido
    Then el status code de respuesta debería ser 201
    And el body de respuesta debería contener el campo "token"
    And el campo "token" no debería estar vacío

  Scenario: Registro falla con email duplicado
    Given existe un usuario registrado con email generado
    When se intenta registrar otro usuario con el mismo email
    Then el status code de respuesta debería ser 400
