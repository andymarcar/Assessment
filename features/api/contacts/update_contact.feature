@api
Feature: Actualizar Contacto - API

  Background:
    Given el usuario está autenticado via API
    And existe un contacto creado via API

  Scenario: Actualización completa exitosa con PUT
    When se envía PUT a "/contacts/:id" con todos los campos actualizados
    Then el status code debería ser 200
    And el body debería reflejar el campo "city" actualizado

  Scenario: Actualización parcial exitosa con PATCH
    When se envía PATCH a "/contacts/:id" con solo el campo "phone" actualizado
    Then el status code debería ser 200
    And el campo "phone" del response debería coincidir con el nuevo valor

  Scenario: Actualización falla sin token de autorización
    When se envía PUT a "/contacts/:id" sin token de autorización
    Then el status code debería ser 401
