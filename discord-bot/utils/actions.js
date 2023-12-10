const generateFunction = (stringFunction) => {
  return new Function(`return ${stringFunction}`)();
};

const createBulletList = (title, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "No items to list.";
  }

  const bulletList = items
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");
  return `**${title}**\n${bulletList}`;
};

exports.generateFunction = generateFunction;
exports.createBulletList = createBulletList;
