module.exports = function(ajv) {
  ajv.addKeyword("isValidPreviousReference", {
    $data: true,
    validate: function isValid(sections, entityData, fieldValue, dataPath) {
      isValid.errors = [];

      if (!entityData.previousAnswer) {
        return false;
      }

      // dataPage contains reference to currently tested component
      // e.g. /sections/0/pages/1/answers/2/validation/maxValue is 3rd answer on 2nd page of first section

      // Get current page index
      const dataPathArr = dataPath.split("/");
      const currentSectionIndex = dataPathArr[2];
      const currentPageIndex = dataPathArr[4];

      let referenceValid = false;

      sections.forEach((section, sectionIndex) => {
        section.pages.forEach((page, pageIndex) => {
          page.answers.forEach(answer => {
            if (answer.id === entityData.previousAnswer) {
              referenceValid =
                sectionIndex <= currentSectionIndex &&
                pageIndex < currentPageIndex;
            }
          });
        });
      });

      if (!referenceValid) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: "ERR_VALID_REQUIRED",
            params: {},
          },
        ];
      }
      return referenceValid;
    },
  });
};
