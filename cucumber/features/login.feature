@login
Feature: Login page

  As am user
  I want to be able to login and logout

  Scenario: Visit login
    When I go to the login page
    Then I should be on the login page
    And I should see the login form

  Scenario: login with valid credentials
    When I log in
    Then I should be redirected to the dashboard page

  @wip
  Scenario: Attempt to login with a bad email
    When I log in with a bad email
    Then I should see an invalid credentials error
  @wip
  Scenario: Attempt to login with a password
    When I log in with a bad password
    Then I should see an invalid credentials error
  @wip
  Scenario: Visit home page
    When I go to the dashboard page
    Then I should be redirected to the login page
