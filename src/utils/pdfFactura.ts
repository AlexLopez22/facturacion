import jsPDF from "jspdf";

export function generarPDF(factura: any) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Factura Electrónica", 20, 20);

  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 20, 30);
  doc.text(`Cliente: ${factura.razonSocial}`, 20, 40);
  doc.text(`RUC: ${factura.ruc}`, 20, 50);

  doc.text("Detalles:", 20, 65);
  let y = 75;
  factura.items.forEach((item: any, index: number) => {
    doc.text(
      `${index + 1}. ${item.descripcion} - ${item.cantidad} x S/ ${item.precioUnitario.toFixed(2)}`,
      25,
      y
    );
    y += 10;
  });

  doc.text(`IGV: S/ ${factura.igv.toFixed(2)}`, 20, y + 10);
  doc.text(`Total: S/ ${factura.total.toFixed(2)}`, 20, y + 20);

  doc.save(`Factura_${factura.id}.pdf`);
}
