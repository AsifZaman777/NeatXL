// lib/csvUtils.ts
export function downloadCSV(data: string[][], headers: string[]) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'neatxl-cleaned-data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function cleanData(
  data: string[][], 
  options: { trimWhitespace: boolean; removeDuplicates: boolean }
) {
  let cleanedData = [...data];

  // Trim whitespace
  if (options.trimWhitespace) {
    cleanedData = cleanedData.map(row => 
      row.map(cell => typeof cell === 'string' ? cell.trim() : cell)
    );
  }

  // Remove duplicates
  if (options.removeDuplicates) {
    const uniqueRows = new Set(cleanedData.map(row => JSON.stringify(row)));
    cleanedData = Array.from(uniqueRows).map(row => JSON.parse(row));
  }

  return cleanedData;
}
