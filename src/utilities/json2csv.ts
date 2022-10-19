export default (arr, columns, delimiter = ',') => {
  return [
    columns.join(delimiter),
    ...arr.map((obj) =>
      columns.reduce(
        (acc, key) => `${acc}${!acc.length ? '' : delimiter}"${!obj[key] ? '' : obj[key]}"`,
        '',
      ),
    ),
  ].join('\n');
};
