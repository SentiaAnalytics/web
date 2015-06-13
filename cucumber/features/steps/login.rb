When(/^I go to the login page$/) do
  login_page.go
end

Then(/^I should be on the login page$/) do
  expect(page).to have_title(login_page.title)
end

Then(/^I should see the login form/) do
  login_page.loginform
end

When(/^I log in$/) do
  login_page.go
  login_page.login
end

When(/^I log in with a bad email$/) do
  login_page.go
  creds = {
    email: 'user@example.com',
    password: 'password'
  }
  login_page.login creds
end

When(/^I log in with a bad password$/) do
  login_page.go
  creds = {
    email: 'andreas@sentia.io',
    password: 'badpass'
  }
  login_page.login creds
end

When(/^I am logged in$/) do
  login_page.go
  login_page.login
end

Then(/^I should see an invalid credentials error$/) do
  expect(find('#loginerror')).to have_text('Invalid email or password')
end