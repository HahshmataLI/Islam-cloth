import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  async generateThermalPdf(elementIds: string[]): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297], // Thermal printer size (80mm x 297mm)
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    const margin = 5;
    const marginTop = 5;
    const marginBottom = 5;

    for (let i = 0; i < elementIds.length; i++) {
      const elementId = elementIds[i];
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element, { scale: 1.5 });
        const imgData = canvas.toDataURL('image/jpeg', 1);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = pageWidth - margin * 2;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (pdfHeight + marginTop + marginBottom > pageHeight) {
          console.error(`The element with ID '${elementId}' is too large for the thermal page size.`);
          continue;
        }

        if (i > 0) {
          doc.addPage();
        }

        doc.addImage(
          imgData,
          'JPEG',
          margin,
          marginTop,
          pdfWidth,
          pdfHeight,
          '',
          'FAST'
        );
      } else {
        console.error(`Element with ID '${elementId}' not found.`);
      }
    }

    // Save PDF locally
    doc.save('IslamClothBill.pdf');
  }
}