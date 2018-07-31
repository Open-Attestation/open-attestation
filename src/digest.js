const _ = require('lodash');
const { flatten } = require("flat");

const { sha3 } = require("ethereumjs-util");

const flattenHashArray = (data) => {
  const flattenedData = _.omitBy(
    flatten(data),
    (value, key) => (value === undefined || key === undefined)
  );
  return Object.keys(flattenedData).map(k => {
    const obj = {};
    obj[k] = flattenedData[k];
    return sha3(JSON.stringify(obj)).toString('hex');
  });
}

const digestDocument = (document) => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = _.get(document, 'privacy.filteredData', []);

  // Prepare array of hashes from visible data
  const unhashedData = _.get(document, 'data');
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = _.sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  const digest = sha3(JSON.stringify(sortedHashes)).toString('hex');
  return digest;
}

module.exports = {
  flattenHashArray,
  digestDocument,
}