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

/**
 * Genera un documento Word a partir de los datos procesados del Excel.
 * @param {Object} excelData 
 * @param {string} summaryText
 */
export const generateWordReport = async (excelData, summaryText = "") => {
  const sections = [];

  // Portada / Cabecera
  const coverChildren = [
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
  ];

  sections.push({
    properties: {},
    children: coverChildren,
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

  // Agregar recomendaciones al final del documento
  if (summaryText) {
    sections[0].children.push(
      new Paragraph({ text: "", spacing: { before: 600 } })
    );

    const parts = summaryText.split("##COMPARACION##");
    const recomendaciones = parts[0];
    const comparacion = parts[1] || "";

    sections[0].children.push(
      new Paragraph({
        text: "Recomendaciones Estratégicas",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
    
    recomendaciones.split('\n').forEach(line => {
      if (line.trim()) {
        sections[0].children.push(new Paragraph({ text: line, spacing: { after: 120 } }));
      }
    });

    if (comparacion) {
      sections[0].children.push(
        new Paragraph({ text: "", spacing: { before: 500 } }),
        new Paragraph({
          text: "Comparación con otras páginas web",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          shading: { fill: "F2F2F2" }
        })
      );
      
      comparacion.split('\n').forEach(line => {
        if (line.trim()) {
          sections[0].children.push(new Paragraph({ text: line, spacing: { after: 120 } }));
        }
      });
    }
  }

  const doc = new Document({
    sections: sections,
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};
