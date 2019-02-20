const regex = new RegExp('(?<=%)(.*)(?=%)');

const replaceId = (text, id) => {
  let prefix = text.match(regex);
  return prefix[0] + id;
};

module.exports = async (testProperties) => {
  let scenario = testProperties.scenario;
  let uniqueId = Math.floor(1000 + Math.random() * 1000);
  scenario.request.uniqueId = uniqueId;

  scenario.request.fields.map(field => {
    if (regex.test(field.value)) {
      field.value = replaceId(field.value, uniqueId);
    }
  });

  scenario.expected.data.map(item => {
    if (regex.test(item.equals)) {
      item.equals = replaceId(item.equals, uniqueId);
    }
  });
};