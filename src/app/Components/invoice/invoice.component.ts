import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../Services/sale.service';
import { PdfService } from '../../Services/pdf.service';
import { Sale } from '../../Models/sale';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  sale: Sale | null = null; // To store the sale details
  constructor(
    private invoiceService: PdfService,
    private route: ActivatedRoute,
    private salesService: SalesService
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const saleId = params.get('saleId');
      if (saleId) {
        this.getSaleDetails(saleId);
      }
    });
  }
   // New method to print the invoice
   printInvoice() {
    const printContent = document.getElementById('invoiceElement');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (printContent && WindowPrt) {
      WindowPrt.document.write('<html><head><title>Bill Receipt</title>');
      WindowPrt.document.write('</head><body >');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.write('</body></html>');
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }
  }

  // This method will trigger the PDF generation for the invoice
  generateInvoicePdf() {
    // Assuming 'invoiceElement' is the ID of the element containing the invoice data
    const elementIds = ['invoiceElement'];
    this.invoiceService.generateThermalPdf(elementIds)
      .then(() => {
        console.log('PDF generated successfully.');
      })
      .catch(err => {
        console.error('Error generating PDF:', err);
      });
  }
  getSaleDetails(saleId: string): void {
    this.salesService.getSaleById(saleId).subscribe({
      next: (sale) => {
        this.sale = sale;
        console.log(this.sale);  // This will show you the structure of the sale object
      },
      error: (err) => {
        console.error('Error fetching sale details:', err);
      }
    });
  }
  
}