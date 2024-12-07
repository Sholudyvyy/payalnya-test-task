export const sortTable = (
  table: Array<Array<string>>,
  order: string,
  index: number,
): Array<Array<string>> => {
  if (table.length === 0) {
    return table
  }

  const sortedTable = [...table]

  switch (order) {
    case 'asc':
      sortedTable.sort((row1, row2) => {
        if (isNaN(+row1[index])) {
          return row1[index].localeCompare(row2[index]);
        } else {
          return +row1[index] - +row2[index];
        }
      })
      break
    case 'desc':
      sortedTable.sort((row1, row2) => {
        if (isNaN(+row1[index])) {
          return row2[index].localeCompare(row1[index]);
        } else {
          return +row2[index] - +row1[index];
        }
      })
      break
    default:
      throw new Error('Invalid order value. Use "asc" or "desc".')
  }

  return sortedTable
}
