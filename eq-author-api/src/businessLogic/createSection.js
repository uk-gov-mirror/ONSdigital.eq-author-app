const { v4: uuidv4 } = require("uuid");
const createFolder = require("./createFolder");

const createSection = (input = {}) => ({
  id: uuidv4(),
  title: "",
  introductionEnabled: false,
  folders: [createFolder()],
  alias: "",
  ...input,
});

module.exports = createSection;
