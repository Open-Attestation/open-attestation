const _ = require('lodash');
const { flatten } = require("flat");
const { toBuffer } = require("./utils");

const getData = (document) => {
  // TODO: Add unsalt function here
  return document.data;
}

const setData = (document, data, _obfuscatedData = []) => {
  // TODO: Add salt function here
  const currentObfuscatedData = _.get(document, 'privacy.obfuscatedData', []);
  const obfuscatedData = currentObfuscatedData.concat(_obfuscatedData);
  const privacy = Object.assign(
    {},
    document.privacy,
    obfuscatedData && obfuscatedData.length > 0 ? {obfuscatedData} : {}
  );
  return {
    ...document,
    data,
    privacy,
  }
}

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
    obfuscatedData,
  };
};

const obfuscateDocument = (_document, fields) => {
  const _data = getData(_document);
  const {data, obfuscatedData} = obfuscateData(_data, fields);
  const document = setData(_document, data, obfuscatedData)
  return document;
}

module.exports = {
  getData,
  setData,
  obfuscateData,
  obfuscateDocument,
}