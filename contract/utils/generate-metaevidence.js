const generateMetaevidence = () => ({
  category: "Curated List",
  title: "Moderatore rules",
  description:
    "A rule was added to a Moderatore server which is now being opposed.",
  question: "Should the rule be accepted ?",
  rulingOptions: {
    type: "single-select",
    titles: ["Accept the Rule", "Remove the Rule"],
    descriptions: ["Select to accept the rule", "Select to remove the rule"],
  },
  aliases: {},
});
module.exports = { generateMetaevidence };
