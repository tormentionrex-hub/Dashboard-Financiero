import * as XLSX from 'xlsx';

/**
 * Lee un archivo Excel y devuelve un objeto con el nombre de la empresa (si existe)
 * y una lista de datos de las hojas.
 * @param {File} file 
 */
export const processExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result = {
          fileName: file.name,
          sheets: []
        };

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          result.sheets.push({
            name: sheetName,
            data: jsonData
          });
        });

        resolve(result);
      } catch (error) {
        reject(new Error("Error al procesar el Excel: " + error.message));
      }
    };

    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsArrayBuffer(file);
  });
};
