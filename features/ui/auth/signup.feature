@ui
Feature: UI - User Sign Up

  Scenario: Successful user registration via UI
    Given I navigate to the sign up page
    When I fill in the registration form with valid data
    And I submit the registration form
    Then I should be redirected to the contact list page
    And I should be logged in

  Scenario: Registration fails with an existing email
    Given I navigate to the sign up page
    And a user with the email already exists
    When I fill in the registration form with an existing email
    And I submit the registration form
    Then I should see an error message

  Scenario: Registration fails with invalid password
    Given I navigate to the sign up page
    When I fill in the registration form with a password that is too short
    And I submit the registration form
    Then I should see an error message
