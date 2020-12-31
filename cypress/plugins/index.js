/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
require("dotenv").config();

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Supply global environment variables
  config.env.CYPRESS_EMAIL = process.env.CYPRESS_EMAIL;
  config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;
  config.baseUrl = process.env.FUNCTIONAL_TESTING_BASE_URL;

  // do not forget to return the changed config object!
  return config;
};
