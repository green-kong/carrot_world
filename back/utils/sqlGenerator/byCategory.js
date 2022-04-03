function makeSqlByCategory(categoryList, sql, table) {
  return categoryList.reduce((acc, cur, i, t) => {
    let returnVal = `${acc}${sql
      .replace(/{c_code}/g, cur.c_code)
      .replace('{c_name}', cur.c_name)
      .replace('{table}', table)}`;
    if (i !== t.length - 1) {
      returnVal = `${returnVal},`;
    }
    return returnVal;
  }, '');
}

module.exports = makeSqlByCategory;
