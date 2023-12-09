const generateFunction = (stringFunction) => {
  return new Function(`return ${stringFunction}`)();
};

exports.generateFunction = generateFunction;
