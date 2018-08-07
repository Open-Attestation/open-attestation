const _ = require("lodash");
const { flatten } = require("flat");
const { toBuffer } = require("../utils");
const { saltData, unsaltData } = require("./salt");

const getData = document => unsaltData(document.data);

const setData = (document, data, obfuscatedData = []) => {
  const privacy = Object.assign(
    {},
    document.privacy,
    obfuscatedData && obfuscatedData.length > 0 ? { obfuscatedData } : {}
  );
  return Object.assign({}, document, {
    data: saltData(data),
    privacy
  });
};

const obfuscateData = (_data, fields) => {
  const data = _.cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = fields instanceof Array ? fields : [fields];

  // Obfuscate data by hashing them with the key
  const dataToObfuscate = flatten(_.pick(data, fieldsToRemove));
  const obfuscatedData = Object.keys(dataToObfuscate).map(k => {
    const obj = {};
    obj[k] = dataToObfuscate[k];
    return toBuffer(obj).toString("hex");
  });

  // Return remaining data
  fieldsToRemove.forEach(path => {
    _.unset(data, path);
  });

  return {
    data,
    obfuscatedData
  };
};

const obfuscateDocument = (_document, fields) => {
  const existingData = getData(_document);
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  const currentObfuscatedData = _.get(_document, "privacy.obfuscatedData", []);
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  const document = setData(_document, data, newObfuscatedData);
  return document;
};

module.exports = {
  getData,
  setData,
  obfuscateData,
  obfuscateDocument
};
