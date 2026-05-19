@api
Feature: Crear Contacto - API

  Background:
    Given el usuario está autenticado via API

  Scenario: Creación exitosa de contacto con datos válidos
    When se envía POST a "/contacts" con payload de contacto válido
    Then el status code debería ser 201
    And el body debería contener el campo "_id"

  Scenario: Creación falla sin token de autorización
    When se envía POST a "/contacts" sin token de autorización
    Then el status code debería ser 401

  Scenario: Creación falla con fecha de nacimiento inválida
    When se envía POST a "/contacts" con birthdate "not-a-date"
    Then el status code debería ser 400
