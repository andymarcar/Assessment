@api
Feature: Eliminar Contacto - API

  Background:
    Given el usuario está autenticado via API

  Scenario: Eliminación exitosa de contacto
    Given existe un contacto creado via API
    When se envía DELETE a "/contacts/:id" con token válido
    Then el status code debería ser 200

  Scenario: Eliminación falla sin token de autorización
    Given existe un contacto creado via API
    When se envía DELETE a "/contacts/:id" sin token de autorización
    Then el status code debería ser 401
