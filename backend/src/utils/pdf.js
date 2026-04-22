const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// S'assurer que le dossier uploads/factures existe
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const generateFacturePDF = (facture) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../../uploads/factures');
    ensureDir(dir);

    const filename = `facture-${facture.numero}.pdf`;
    const filepath = path.join(dir, filename);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // ── En-tête ──────────────────────────────────────────────────────────────
    doc.rect(0, 0, 595, 100).fill('#060D1F');
    doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold')
      .text('SORA', 50, 30, { continued: true })
      .fillColor('#0099FF').text('TECH');
    doc.fontSize(10).fillColor('#8899BB')
      .text('SORA TECH COMPANY', 50, 60)
      .text('Cocody, Angré 8ème — Abidjan, Côte d\'Ivoire', 50, 74)
      .text('+225 07 04 92 80 68 | contact@soratech.ci', 50, 88);

    // Numéro de facture (coin droit)
    doc.fontSize(18).fillColor('#0099FF').font('Helvetica-Bold')
      .text('FACTURE', 400, 30, { align: 'right' });
    doc.fontSize(12).fillColor('#ffffff')
      .text(facture.numero, 400, 55, { align: 'right' });
    const statColor = facture.status === 'payee' ? '#00C48C' : '#FF4757';
    doc.fontSize(10).fillColor(statColor)
      .text(facture.status.toUpperCase(), 400, 74, { align: 'right' });

    // ── Infos client + date ───────────────────────────────────────────────────
    doc.moveDown(4);
    doc.fontSize(10).fillColor('#333333').font('Helvetica');
    const infoY = 120;

    doc.font('Helvetica-Bold').fillColor('#060D1F').text('FACTURER À :', 50, infoY);
    doc.font('Helvetica').fillColor('#444')
      .text(facture.clientName, 50, infoY + 16)
      .text(facture.clientEmail || '', 50, infoY + 30)
      .text(facture.clientPhone || '', 50, infoY + 44)
      .text(facture.clientAddress || '', 50, infoY + 58);

    doc.font('Helvetica-Bold').fillColor('#060D1F').text('DATE :', 380, infoY);
    doc.font('Helvetica').fillColor('#444')
      .text(new Date(facture.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), 380, infoY + 16);
    if (facture.echeance) {
      doc.font('Helvetica-Bold').fillColor('#060D1F').text('ÉCHÉANCE :', 380, infoY + 36);
      doc.font('Helvetica').fillColor('#FF4757')
        .text(new Date(facture.echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), 380, infoY + 52);
    }

    // ── Tableau des articles ──────────────────────────────────────────────────
    const tableY = 220;
    const cols = { desc: 50, qty: 310, unit: 370, total: 470 };

    // En-tête tableau
    doc.rect(50, tableY, 495, 24).fill('#060D1F');
    doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
      .text('DESCRIPTION', cols.desc + 5, tableY + 7)
      .text('QTÉ', cols.qty, tableY + 7)
      .text('P. UNITAIRE', cols.unit, tableY + 7)
      .text('TOTAL', cols.total, tableY + 7);

    // Lignes
    let rowY = tableY + 28;
    facture.items.forEach((item, index) => {
      if (index % 2 === 0) doc.rect(50, rowY - 4, 495, 22).fill('#f8f9fa');
      doc.fontSize(9).fillColor('#333').font('Helvetica')
        .text(item.description, cols.desc + 5, rowY, { width: 250 })
        .text(item.quantity.toString(), cols.qty, rowY)
        .text(`${item.unitPrice.toLocaleString('fr-FR')} F`, cols.unit, rowY)
        .text(`${item.total.toLocaleString('fr-FR')} F`, cols.total, rowY);
      rowY += 26;
    });

    // ── Totaux ────────────────────────────────────────────────────────────────
    rowY += 10;
    doc.moveTo(350, rowY).lineTo(545, rowY).strokeColor('#ddd').stroke();
    rowY += 10;

    const addTotal = (label, value, isTotal = false) => {
      doc.fontSize(isTotal ? 11 : 9)
        .fillColor(isTotal ? '#0066FF' : '#555')
        .font(isTotal ? 'Helvetica-Bold' : 'Helvetica')
        .text(label, 350, rowY)
        .text(value, 450, rowY, { align: 'right', width: 95 });
      rowY += isTotal ? 22 : 18;
    };

    addTotal('Sous-total', `${facture.subtotal.toLocaleString('fr-FR')} FCFA`);
    if (facture.tva > 0) {
      addTotal(`TVA (${facture.tva}%)`, `${facture.tvaAmount.toLocaleString('fr-FR')} FCFA`);
    }
    doc.moveTo(350, rowY).lineTo(545, rowY).strokeColor('#0066FF').lineWidth(1.5).stroke();
    rowY += 6;
    addTotal('TOTAL', `${facture.total.toLocaleString('fr-FR')} FCFA`, true);

    // ── Notes ─────────────────────────────────────────────────────────────────
    if (facture.notes) {
      rowY += 20;
      doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('NOTES :', 50, rowY);
      doc.font('Helvetica').fillColor('#555').text(facture.notes, 50, rowY + 14, { width: 495 });
    }

    // ── Pied de page ──────────────────────────────────────────────────────────
    doc.rect(0, 760, 595, 82).fill('#060D1F');
    doc.fontSize(9).fillColor('#8899BB').font('Helvetica')
      .text('Merci de votre confiance — SORA TECH COMPANY', 50, 772, { align: 'center', width: 495 })
      .text('contact@soratech.ci | +225 07 04 92 80 68 | Abidjan, Côte d\'Ivoire', 50, 786, { align: 'center', width: 495 })
      .fillColor('#0099FF').text('www.soratech.ci', 50, 800, { align: 'center', width: 495 });

    doc.end();

    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
};

module.exports = { generateFacturePDF };
