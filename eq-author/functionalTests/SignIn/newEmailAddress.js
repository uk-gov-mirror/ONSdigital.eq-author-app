describe("Signing in with a new email address", () => {
  const emailInputSelector = "input[type='email'][name='email']";
  const submitEmailSelector = "button[type='submit']";

  const nameInputSelector = "input[type='text'][name='name']";

  const passwordInputSelector = "input[type='password'][name='newPassword']";

  const mockEmail = "nightwatch@ons.gov.uk";
  const mockName = "Nightwatch";
  const mockPassword = "MySuperSafePassword";

  test("Given I am on the sign in page", browser => {
    browser.url("http://localhost:3000/#/sign-in");
  });

  test("When I enter my email address", browser => {
    browser
      .waitForElementVisible(emailInputSelector)
      .setValue(emailInputSelector, mockEmail);
  });

  test("And I click submit", browser => {
    browser.click(submitEmailSelector);
  });

  test("Then it should retain the email address I gave", browser => {
    browser
      .waitForElementVisible(emailInputSelector)
      .assert.value(emailInputSelector, mockEmail);
  });

  test("And I should be asked for my first and last name", browser => {
    browser
      .waitForElementVisible(nameInputSelector)
      .setValue(nameInputSelector, mockName);
  });

  test("And I should be asked for a password", browser => {
    browser
      .waitForElementVisible(passwordInputSelector)
      .setValue(passwordInputSelector, mockPassword);
  });
});
