@api
Feature: Obtener Contactos - API

  Background:
    Given el usuario está autenticado via API
    And existe un contacto creado via API

  Scenario: Obtener todos los contactos exitosamente
    When se envía GET a "/contacts" con token válido
    Then el status code debería ser 200
    And el body debería ser un array

  Scenario: Obtener contacto por ID exitosamente
    When se envía GET a "/contacts/:id" con el id del contacto creado
    Then el status code debería ser 200
    And el body debería contener el campo "_id"

  Scenario: Obtener contacto eliminado retorna 404
    Given el contacto ha sido eliminado via API
    When se envía GET a "/contacts/:id" con el id del contacto eliminado
    Then el status code debería ser 404
