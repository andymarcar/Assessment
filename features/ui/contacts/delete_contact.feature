@ui
Feature: UI - Delete Contact

  Background:
    Given I am logged in via UI
    And I have a contact in the list

  Scenario: Successfully delete a contact via UI
    Given I am on the contact list page
    When I click on the contact to view details
    And I click the delete contact button
    Then the contact should no longer appear in the contact list

  Scenario: Cancel deletion keeps the contact in the list
    Given I am on the contact list page
    When I click on the contact to view details
    And I cancel the delete operation
    Then the contact should still appear in the contact list
