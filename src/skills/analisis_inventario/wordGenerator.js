import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  AlignmentType,
  BorderStyle
} from "docx";
import { saveAs } from "file-saver";

/**
 * Genera un documento Word a partir de los datos procesados del Excel.
 * @param {Object} excelData 
 */
export const generateWordReport = async (excelData) => {
  const sections = [];

  // Portada / Cabecera
  sections.push({
    properties: {},
    children: [
      new Paragraph({
        text: "REPORTE DE INVENTARIO Y ANÁLISIS",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Archivo de origen: ${excelData.fileName}`,
            italics: true,
            color: "666666",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { before: 400 } }),
    ],
  });

  // Iterar por cada hoja del Excel
  excelData.sheets.forEach((sheet) => {
    const children = [
      new Paragraph({
        text: `Hoja: ${sheet.name}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
    ];

    if (sheet.data.length === 0) {
      children.push(new Paragraph({ text: "Esta hoja no contiene datos." }));
    } else {
      // Crear tabla
      const headers = Object.keys(sheet.data[0]);
      
      const tableRows = [
        new TableRow({
          children: headers.map(header => new TableCell({
            children: [new Paragraph({ text: header, bold: true })],
            shading: { fill: "F2F2F2" },
          })),
        }),
      ];

      sheet.data.forEach((row) => {
        tableRows.push(
          new TableRow({
            children: headers.map(header => new TableCell({
              children: [new Paragraph({ text: String(row[header] || "") })],
            })),
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        })
      );
    }

    sections[0].children.push(...children);
  });

  const doc = new Document({
    sections: sections,
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Reporte_${excelData.fileName.split('.')[0]}.docx`);
};
