@ui
Feature: UI - Add Contact

  Background:
    Given I am logged in via UI

  Scenario: Successfully add a contact via UI
    Given I am on the contact list page
    When I click the add contact button
    And I fill in the contact form with valid data
    And I submit the contact form
    Then the new contact should appear in the contact list

  Scenario: Add contact fails with missing required fields
    Given I am on the contact list page
    When I click the add contact button
    And I submit the contact form without required fields
    Then I should see an error message
