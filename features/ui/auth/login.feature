@ui
Feature: UI - User Login

  Background:
    Given a registered user exists

  Scenario: Successful login via UI
    Given I navigate to the login page
    When I fill in the login form with valid credentials
    And I submit the login form
    Then I should be redirected to the contact list page
    And I should be logged in

  Scenario: Login fails with wrong password
    Given I navigate to the login page
    When I fill in the login form with an incorrect password
    And I submit the login form
    Then I should see an error message

  Scenario: Login fails with non-existent email
    Given I navigate to the login page
    When I fill in the login form with a non-existent email
    And I submit the login form
    Then I should see an error message
