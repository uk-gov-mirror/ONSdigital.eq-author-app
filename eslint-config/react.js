module.exports = {
  extends: ["react-app", "plugin:react/recommended"],
  plugins: ["react", "babel"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "latest",
    },
  },
  rules: {
    "react/display-name": "off",
    "react/prop-types": "warn",
    "react/forbid-prop-types": "warn",
    "react/no-danger": "error",
    "react/no-did-mount-set-state": "error",
    "react/no-did-update-set-state": "error",
    "react/self-closing-comp": "error",

    "react/jsx-boolean-value": "error",
    "react/jsx-handler-names": "error",
    "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],
    "react/jsx-pascal-case": "error",

    "babel/no-invalid-this": "error",
    "no-unused-vars": ["warn", { vars: "all", args: "after-used" }],
  },
};
