@api
Feature: Autenticación de Usuario - API

  Background:
    Given existe un usuario registrado con email generado

  Scenario: Login exitoso con credenciales válidas
    When se envía POST a "/users/login" con las credenciales del usuario
    Then el status code de respuesta debería ser 200
    And el body de respuesta debería contener el campo "token"
    And el campo "token" no debería estar vacío

  Scenario: Login falla con password incorrecto
    When se envía POST a "/users/login" con password incorrecto "wrongpassword123"
    Then el status code de respuesta debería ser 401

  Scenario: Acceso a recurso protegido sin token de autorización
    When se envía GET a "/contacts" sin header de Authorization
    Then el status code debería ser 401

  Scenario: Acceso a recurso protegido con token inválido
    When se envía GET a "/contacts" con token "invalidtoken_xyz_abc"
    Then el status code debería ser 401
