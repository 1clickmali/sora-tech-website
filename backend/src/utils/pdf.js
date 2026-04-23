const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ── FACTURE (pour le modèle Facture) ─────────────────────────────────────────

const generateFacturePDF = (facture) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../../uploads/factures');
    ensureDir(dir);

    const filename = `facture-${facture.numero}.pdf`;
    const filepath = path.join(dir, filename);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // En-tête
    doc.rect(0, 0, 595, 100).fill('#060D1F');
    doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold')
      .text('SORA', 50, 30, { continued: true })
      .fillColor('#0099FF').text('TECH');
    doc.fontSize(10).fillColor('#8899BB')
      .text('SORA TECH COMPANY', 50, 60)
      .text('Cocody, Angré 8ème — Abidjan, Côte d\'Ivoire', 50, 74)
      .text('+225 07 04 92 80 68 | contact@soratech.ci', 50, 88);

    doc.fontSize(18).fillColor('#0099FF').font('Helvetica-Bold')
      .text('FACTURE', 400, 30, { align: 'right' });
    doc.fontSize(12).fillColor('#ffffff')
      .text(facture.numero, 400, 55, { align: 'right' });
    const statColor = facture.status === 'payee' ? '#00C48C' : '#FF4757';
    doc.fontSize(10).fillColor(statColor)
      .text(facture.status.toUpperCase(), 400, 74, { align: 'right' });

    doc.moveDown(4);
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

    const tableY = 220;
    const cols = { desc: 50, qty: 310, unit: 370, total: 470 };
    doc.rect(50, tableY, 495, 24).fill('#060D1F');
    doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
      .text('DESCRIPTION', cols.desc + 5, tableY + 7)
      .text('QTÉ', cols.qty, tableY + 7)
      .text('P. UNITAIRE', cols.unit, tableY + 7)
      .text('TOTAL', cols.total, tableY + 7);

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
    if (facture.tva > 0) addTotal(`TVA (${facture.tva}%)`, `${facture.tvaAmount.toLocaleString('fr-FR')} FCFA`);
    doc.moveTo(350, rowY).lineTo(545, rowY).strokeColor('#0066FF').lineWidth(1.5).stroke();
    rowY += 6;
    addTotal('TOTAL', `${facture.total.toLocaleString('fr-FR')} FCFA`, true);

    if (facture.notes) {
      rowY += 20;
      doc.fontSize(9).fillColor('#888').font('Helvetica-Bold').text('NOTES :', 50, rowY);
      doc.font('Helvetica').fillColor('#555').text(facture.notes, 50, rowY + 14, { width: 495 });
    }

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

// ── COMMANDE (reçu de commande PDF) ──────────────────────────────────────────

const generateCommandePDF = (commande) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../../uploads/factures');
    ensureDir(dir);

    const filename = `commande-${commande.reference}.pdf`;
    const filepath = path.join(dir, filename);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // ── En-tête noir ─────────────────────────────────────────────────────────
    doc.rect(0, 0, 595, 110).fill('#060D1F');
    doc.fontSize(26).fillColor('#ffffff').font('Helvetica-Bold')
      .text('SORA', 50, 28, { continued: true })
      .fillColor('#0099FF').text('TECH');
    doc.fontSize(9).fillColor('#8899BB')
      .text('SORA TECH COMPANY', 50, 62)
      .text('Cocody, Angré 8ème — Abidjan, Côte d\'Ivoire', 50, 75)
      .text('+225 07 04 92 80 68  |  contact@soratech.ci', 50, 88);

    // Référence + statut (coin droit)
    doc.fontSize(20).fillColor('#0099FF').font('Helvetica-Bold')
      .text('REÇU DE COMMANDE', 280, 25, { align: 'right', width: 265 });
    doc.fontSize(13).fillColor('#ffffff')
      .text(commande.reference, 280, 52, { align: 'right', width: 265 });
    doc.fontSize(10).fillColor('#00C48C')
      .text('CONFIRMÉE', 280, 70, { align: 'right', width: 265 });
    doc.fontSize(9).fillColor('#8899BB')
      .text(new Date(commande.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), 280, 85, { align: 'right', width: 265 });

    // ── Infos client ─────────────────────────────────────────────────────────
    const clientY = 130;
    doc.rect(50, clientY, 230, 100).fill('#F0F4FF').stroke('#E0E8FF');
    doc.rect(315, clientY, 230, 100).fill('#F0F4FF').stroke('#E0E8FF');

    doc.fontSize(8).fillColor('#0066FF').font('Helvetica-Bold')
      .text('CLIENT', 60, clientY + 10);
    doc.fontSize(10).fillColor('#111').font('Helvetica-Bold')
      .text(commande.clientName || '-', 60, clientY + 22);
    doc.fontSize(9).fillColor('#555').font('Helvetica')
      .text(`📞 ${commande.clientPhone || '-'}`, 60, clientY + 38)
      .text(`✉  ${commande.clientEmail || 'Non renseigné'}`, 60, clientY + 52)
      .text(`📍 ${commande.clientQuartier || commande.quartier || ''}`, 60, clientY + 66);
    if (commande.clientAddress || commande.address) {
      doc.text((commande.clientAddress || commande.address).substring(0, 40), 60, clientY + 80);
    }

    doc.fontSize(8).fillColor('#0066FF').font('Helvetica-Bold')
      .text('PAIEMENT & LIVRAISON', 325, clientY + 10);
    const modeLabel = commande.paymentMode === 'online' ? '💳 Paiement en ligne' : '🚚 Paiement à la livraison';
    doc.fontSize(9).fillColor('#111').font('Helvetica-Bold')
      .text(modeLabel, 325, clientY + 22);
    if (commande.paymentProvider) {
      doc.fontSize(9).fillColor('#555').font('Helvetica')
        .text(`Via : ${commande.paymentProvider}`, 325, clientY + 38);
    }
    doc.fontSize(8).fillColor('#0066FF').font('Helvetica-Bold')
      .text('CODE DE SUIVI', 325, clientY + 55);
    doc.fontSize(12).fillColor('#0099FF').font('Helvetica-Bold')
      .text(commande.trackingCode || '-', 325, clientY + 67);
    doc.fontSize(8).fillColor('#8899BB').font('Helvetica')
      .text(commande.trackingUrl || '', 325, clientY + 83, { width: 225 });

    // ── Tableau des articles ──────────────────────────────────────────────────
    const tableY = 250;
    doc.rect(50, tableY, 495, 22).fill('#060D1F');
    doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
      .text('PRODUIT / SERVICE', 58, tableY + 7)
      .text('QTÉ', 360, tableY + 7)
      .text('PRIX UNIT.', 400, tableY + 7)
      .text('TOTAL', 480, tableY + 7);

    let rowY = tableY + 26;
    (commande.items || []).forEach((item, i) => {
      if (i % 2 === 0) doc.rect(50, rowY - 3, 495, 20).fill('#F8FAFF');
      doc.fontSize(9).fillColor('#222').font('Helvetica')
        .text(item.title || '-', 58, rowY, { width: 290 })
        .text(String(item.quantity || 1), 360, rowY)
        .text(`${(item.price || 0).toLocaleString('fr-FR')} F`, 400, rowY)
        .text(`${((item.price || 0) * (item.quantity || 1)).toLocaleString('fr-FR')} F`, 480, rowY);
      if (item.digital) {
        doc.fontSize(7).fillColor('#00C48C').text('DIGITAL', 58, rowY + 10);
      }
      rowY += 22;
    });

    // ── Récapitulatif financier ───────────────────────────────────────────────
    rowY += 8;
    doc.moveTo(350, rowY).lineTo(545, rowY).strokeColor('#CCDDFF').lineWidth(1).stroke();
    rowY += 8;

    const addLine = (label, val, highlight = false) => {
      doc.fontSize(highlight ? 11 : 9)
        .fillColor(highlight ? '#0066FF' : '#555')
        .font(highlight ? 'Helvetica-Bold' : 'Helvetica')
        .text(label, 355, rowY)
        .text(val, 460, rowY, { align: 'right', width: 85 });
      rowY += highlight ? 20 : 16;
    };

    addLine('Sous-total', `${(commande.subtotal || 0).toLocaleString('fr-FR')} FCFA`);
    if (commande.deliveryFee > 0) {
      addLine('Frais de livraison', `${commande.deliveryFee.toLocaleString('fr-FR')} FCFA`);
    }
    doc.moveTo(350, rowY).lineTo(545, rowY).strokeColor('#0066FF').lineWidth(1.5).stroke();
    rowY += 6;
    addLine('TOTAL', `${(commande.total || 0).toLocaleString('fr-FR')} FCFA`, true);

    // ── Message de suivi ──────────────────────────────────────────────────────
    rowY += 20;
    if (rowY < 680) {
      doc.rect(50, rowY, 495, 50).fill('#EEF5FF').stroke('#AACCFF');
      doc.fontSize(9).fillColor('#0066FF').font('Helvetica-Bold')
        .text('📦 SUIVEZ VOTRE COMMANDE EN TEMPS RÉEL', 60, rowY + 8);
      doc.fontSize(9).fillColor('#333').font('Helvetica')
        .text(`Rendez-vous sur : ${commande.trackingUrl || 'soratech.ci/suivi'}`, 60, rowY + 22)
        .text(`Code de suivi : ${commande.trackingCode || '-'}`, 60, rowY + 36);
    }

    // ── Pied de page ──────────────────────────────────────────────────────────
    doc.rect(0, 760, 595, 82).fill('#060D1F');
    doc.fontSize(9).fillColor('#8899BB').font('Helvetica')
      .text('Merci de votre confiance — SORA TECH COMPANY', 50, 772, { align: 'center', width: 495 })
      .text('contact@soratech.ci  |  +225 07 04 92 80 68  |  Cocody, Angré 8ème, Abidjan', 50, 786, { align: 'center', width: 495 });
    doc.fillColor('#0099FF').text('www.soratech.ci', 50, 800, { align: 'center', width: 495 });

    doc.end();
    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
};

module.exports = { generateFacturePDF, generateCommandePDF };
