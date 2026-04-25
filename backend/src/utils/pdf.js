const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PassThrough } = require('stream');

// ── Formatter monnaie (ASCII uniquement — compatible PDFKit Helvetica) ──────
const fcfa = (n) => {
  const s = Math.round(n || 0).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Convertit un SVG en buffer PNG via sharp (mis en cache au premier appel)
let _logoPng = null;
const getLogoPng = async () => {
  if (_logoPng) return _logoPng;
  const candidates = [
    path.join(__dirname, '../../../public/SORA_TECH_logo_clair.svg'),
    path.join(__dirname, '../../public/SORA_TECH_logo_clair.svg'),
  ];
  const svgPath = candidates.find(fs.existsSync);
  if (!svgPath) return null;
  _logoPng = await sharp(svgPath).resize(420).png().toBuffer();
  return _logoPng;
};

// ─────────────────────────────────────────────────────────────────────────────
// RECU DE COMMANDE — design premium inspiré Stripe / Apple
// ─────────────────────────────────────────────────────────────────────────────
const generateCommandePDF = async (commande) => {
  const filename = `commande-${commande.reference}.pdf`;

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const chunks = [];
      const stream = new PassThrough();
      stream.on('data', c => chunks.push(c));
      doc.pipe(stream);

      const W = 595.28;
      const BLEU = '#0099FF';
      const VERT = '#00C48C';
      const NOIR = '#060D1F';
      const GRIS = '#8899BB';
      const GRIS_CLAIR = '#E8EDF2';
      const FOND = '#F8F9FA';

      // ── HEADER fond noir (hauteur 140) ─────────────────────────────────────
      doc.rect(0, 0, W, 140).fill(NOIR);

      // Logo image (SVG → PNG)
      const logoPng = await getLogoPng();
      if (logoPng) {
        doc.image(logoPng, 40, 32, { width: 160 });
      } else {
        // Fallback texte si logo non disponible
        doc.fontSize(26).fillColor('#FFFFFF').font('Helvetica-Bold')
          .text('SORA', 44, 36, { continued: true })
          .fillColor(BLEU).text('TECH');
      }

      // Infos entreprise sous le logo
      doc.fontSize(7.5).fillColor(GRIS).font('Helvetica')
        .text('Abidjan, Cocody — Angre 8eme', 40, 100)
        .text('Tel : +225 07 04 92 80 68  |  contact@soratech.ci', 40, 112);

      // Bloc droit : titre + référence + statut + date
      doc.fontSize(22).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('RECU DE COMMANDE', 0, 34, { align: 'right', width: W - 40 });
      doc.fontSize(15).fillColor(BLEU).font('Helvetica-Bold')
        .text(commande.reference || '-', 0, 62, { align: 'right', width: W - 40 });
      doc.fontSize(10).fillColor(VERT).font('Helvetica-Bold')
        .text('CONFIRMEE', 0, 83, { align: 'right', width: W - 40 });
      doc.fontSize(9).fillColor(GRIS).font('Helvetica')
        .text(
          new Date(commande.createdAt || Date.now()).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'long', year: 'numeric',
          }),
          0, 99, { align: 'right', width: W - 40 }
        );
      doc.fontSize(8).fillColor('#A0AABB').font('Helvetica')
        .text('soratech.ci', 0, 113, { align: 'right', width: W - 40 });

      // ── SECTION CLIENT + PAIEMENT ─────────────────────────────────────────
      const IY = 156;
      const BLOC_W = 238;
      const BLOC_H = 115;

      // Fond global des deux blocs
      doc.rect(40, IY, W - 80, BLOC_H).fill(FOND).stroke(GRIS_CLAIR);

      // Séparateur vertical
      doc.moveTo(40 + BLOC_W, IY).lineTo(40 + BLOC_W, IY + BLOC_H)
        .strokeColor(GRIS_CLAIR).lineWidth(1).stroke();

      // Colonne gauche : CLIENT
      doc.fontSize(7.5).fillColor(BLEU).font('Helvetica-Bold')
        .text('CLIENT', 52, IY + 12);
      doc.fontSize(12).fillColor('#111111').font('Helvetica-Bold')
        .text(commande.clientName || '-', 52, IY + 25, { width: BLOC_W - 24 });
      doc.fontSize(8.5).fillColor('#444444').font('Helvetica');

      let cy = IY + 43;
      if (commande.clientPhone) {
        doc.text('Tel : ' + commande.clientPhone, 52, cy, { width: BLOC_W - 24 });
        cy += 13;
      }
      if (commande.clientEmail) {
        doc.text('Email : ' + commande.clientEmail, 52, cy, { width: BLOC_W - 24 });
        cy += 13;
      }
      const quartier = commande.clientQuartier || commande.quartier || '';
      const adresse = commande.clientAddress || commande.address || '';
      if (quartier) {
        doc.text('Quartier : ' + quartier, 52, cy, { width: BLOC_W - 24 });
        cy += 13;
      }
      if (adresse) {
        doc.text('Adresse : ' + adresse.substring(0, 50), 52, cy, { width: BLOC_W - 24 });
      }

      // Colonne droite : PAIEMENT & SUIVI
      const RX = 40 + BLOC_W + 16;
      const RW = W - 80 - BLOC_W - 16;
      doc.fontSize(7.5).fillColor(BLEU).font('Helvetica-Bold')
        .text('PAIEMENT & LIVRAISON', RX, IY + 12);
      const modeLabel = commande.paymentMode === 'online' ? 'Paiement en ligne' : 'Paiement a la livraison';
      doc.fontSize(10).fillColor('#111111').font('Helvetica-Bold')
        .text(modeLabel, RX, IY + 25, { width: RW });

      if (commande.trackingCode) {
        doc.fontSize(7.5).fillColor(BLEU).font('Helvetica-Bold')
          .text('CODE DE SUIVI', RX, IY + 55);
        doc.fontSize(15).fillColor(BLEU).font('Helvetica-Bold')
          .text(commande.trackingCode, RX, IY + 67);
        if (commande.trackingUrl) {
          doc.fontSize(7).fillColor(GRIS).font('Helvetica')
            .text(commande.trackingUrl, RX, IY + 88, { width: RW });
        }
      }

      // ── TABLEAU ARTICLES ──────────────────────────────────────────────────
      const TY = IY + BLOC_H + 18;

      // En-tête tableau fond noir
      doc.rect(40, TY, W - 80, 24).fill(NOIR);
      doc.fontSize(8.5).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('PRODUIT / SERVICE', 52, TY + 8)
        .text('QTE', 370, TY + 8, { width: 35, align: 'center' })
        .text('PRIX UNIT.', 410, TY + 8, { width: 70 })
        .text('TOTAL', 485, TY + 8, { width: 70 });

      let rowY = TY + 28;
      const items = commande.items || [];

      items.forEach((item, i) => {
        const rowH = item.digital ? 28 : 22;
        if (i % 2 === 0) {
          doc.rect(40, rowY - 2, W - 80, rowH).fill(FOND);
        }
        const ligneTotal = (item.price || 0) * (item.quantity || 1);

        doc.fontSize(9).fillColor('#1A1A2E').font('Helvetica')
          .text(item.title || '-', 52, rowY, { width: 310 })
          .text(String(item.quantity || 1), 370, rowY, { width: 35, align: 'center' })
          .text(fcfa(item.price || 0).replace(' FCFA', ' F'), 410, rowY, { width: 70 })
          .text(fcfa(ligneTotal).replace(' FCFA', ' F'), 485, rowY, { width: 70 });

        if (item.digital) {
          doc.fontSize(7).fillColor(VERT).font('Helvetica-Bold')
            .text('DIGITAL — livraison instantanee', 52, rowY + 11);
        }
        rowY += rowH + 2;

        // Ligne séparatrice légère
        doc.moveTo(40, rowY - 1).lineTo(W - 40, rowY - 1)
          .strokeColor('#E0E4EA').lineWidth(0.5).stroke();
      });

      // ── RÉCAPITULATIF MONTANTS ────────────────────────────────────────────
      rowY += 10;

      const addLigne = (label, valeur, gras = false, couleur = '#555555') => {
        doc.fontSize(gras ? 11 : 9)
          .fillColor(couleur)
          .font(gras ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, 360, rowY)
          .text(valeur, 0, rowY, { align: 'right', width: W - 40 });
        rowY += gras ? 22 : 16;
      };

      doc.moveTo(360, rowY - 4).lineTo(W - 40, rowY - 4)
        .strokeColor('#DDDDDD').lineWidth(0.8).stroke();

      addLigne('Sous-total :', fcfa(commande.subtotal || commande.total || 0));
      if ((commande.deliveryFee || 0) > 0) {
        addLigne('Frais de livraison :', fcfa(commande.deliveryFee));
      }

      // Ligne TOTAL colorée
      rowY += 4;
      doc.rect(360, rowY - 3, W - 40 - 360, 26).fill(BLEU);
      doc.fontSize(12).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('TOTAL', 368, rowY + 3)
        .text(fcfa(commande.total || 0), 0, rowY + 3, { align: 'right', width: W - 40 });
      rowY += 36;

      // ── BLOC QR CODE + SUIVI ──────────────────────────────────────────────
      if (commande.trackingUrl && rowY < 650) {
        try {
          const qrBuffer = await QRCode.toBuffer(commande.trackingUrl, {
            width: 100, margin: 1,
            color: { dark: '#060D1F', light: '#FFFFFF' },
          });

          const blcH = 80;
          // Fond bleu clair pour la section suivi
          doc.rect(40, rowY, W - 80, blcH).fill(BLEU);

          doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold')
            .text('SUIVEZ VOTRE COMMANDE EN TEMPS REEL', 52, rowY + 10, { width: W - 200 });
          doc.fontSize(8.5).fillColor('#D0EEFF').font('Helvetica')
            .text('Lien : ' + commande.trackingUrl, 52, rowY + 26, { width: W - 200 })
            .text('Code : ' + (commande.trackingCode || '-'), 52, rowY + 40);
          doc.fontSize(7.5).fillColor('#A0D8FF').font('Helvetica')
            .text('Mise a jour automatique — rafraichissez la page', 52, rowY + 56);

          // QR code
          doc.image(qrBuffer, W - 40 - 90, rowY - 5, { width: 90, height: 90 });
          doc.fontSize(7).fillColor('#D0EEFF').font('Helvetica')
            .text('Scanner', W - 40 - 90, rowY + 86, { width: 90, align: 'center' });
          rowY += 100;
        } catch (qrErr) {
          console.error('[QR Code]', qrErr.message);
        }
      }

      // ── CONDITIONS ────────────────────────────────────────────────────────
      if (rowY < 710) {
        rowY += 8;
        doc.moveTo(40, rowY).lineTo(W - 40, rowY)
          .strokeColor('#EEEEEE').lineWidth(0.5).stroke();
        rowY += 10;
        doc.fontSize(7.5).fillColor(GRIS).font('Helvetica')
          .text(
            'Ce recu vaut preuve d\'achat. Garantie 1 an sur les produits digitaux. ' +
            'Support : contact@soratech.ci | Paiement securise — Donnees protegees par SORA TECH.',
            40, rowY, { width: W - 80 }
          );
      }

      // ── PIED DE PAGE ──────────────────────────────────────────────────────
      doc.rect(0, 802, W, 40).fill(NOIR);
      doc.fontSize(8.5).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('SORA TECH COMPANY — Votre partenaire digital en Cote d\'Ivoire', 0, 812, { align: 'center', width: W });
      doc.fontSize(7.5).fillColor(GRIS).font('Helvetica')
        .text(
          'Tél : +225 07 04 92 80 68  |  Email : contact@soratech.ci  |  soratech.ci  |  Abidjan, Cocody',
          0, 825, { align: 'center', width: W }
        );

      doc.end();
      stream.on('end', () => resolve({ buffer: Buffer.concat(chunks), filename }));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// FACTURE PDF (manuelles ou liées à des devis)
// ─────────────────────────────────────────────────────────────────────────────
const generateFacturePDF = async (facture) => {
  const filename = `facture-${facture.numero || facture._id}.pdf`;

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const chunks = [];
      const stream = new PassThrough();
      stream.on('data', c => chunks.push(c));
      doc.pipe(stream);

      const W = 595.28;
      const H = 841.89;
      const INK = '#07111F';
      const INK_2 = '#101B2E';
      const BLUE = '#006DFF';
      const CYAN = '#00C6FF';
      const GREEN = '#00A676';
      const RED = '#E5484D';
      const GOLD = '#F7B731';
      const MUTED = '#6B7890';
      const LINE = '#DCE3EE';
      const PAPER = '#F6F8FB';
      const WHITE = '#FFFFFF';

      const payStatus = facture.paymentStatus || facture.status || 'impayee';
      const statColor = payStatus === 'payee' ? GREEN : payStatus === 'annulee' ? MUTED : RED;
      const statLabel = payStatus === 'payee' ? 'PAYEE' : payStatus === 'annulee' ? 'ANNULEE' : 'IMPAYEE';
      const left = 42;
      const right = W - 42;
      const contentW = right - left;
      const issueDate = new Date(facture.issuedAt || facture.createdAt || Date.now());
      const dueDate = facture.echeance ? new Date(facture.echeance) : null;

      const label = (text, x, y, width) => {
        doc.fontSize(7).fillColor(MUTED).font('Helvetica-Bold')
          .text(String(text).toUpperCase(), x, y, { width, characterSpacing: 0.4 });
      };

      const value = (text, x, y, width, options = {}) => {
        doc.fontSize(options.size || 9.5).fillColor(options.color || INK).font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(text || '-', x, y, { width, lineGap: options.lineGap || 2 });
      };

      const footer = () => {
        doc.rect(0, H - 54, W, 54).fill(INK);
        doc.fontSize(8.5).fillColor(WHITE).font('Helvetica-Bold')
          .text('SORA TECH COMPANY', left, H - 39, { width: 160 });
        doc.fontSize(7.5).fillColor('#B8C4D6').font('Helvetica')
          .text('Cocody, Angre 8eme, Abidjan | +225 07 04 92 80 68 | contact@soratech.ci | soratech.ci', left, H - 25, { width: contentW });
      };

      doc.rect(0, 0, W, H).fill(WHITE);

      // Premium brand header
      doc.rect(0, 0, W, 166).fill(INK);
      doc.rect(0, 0, 12, H).fill(BLUE);
      doc.rect(12, 0, 4, H).fill(CYAN);
      doc.roundedRect(W - 210, -34, 250, 130, 18).fill('#0E2A56');
      doc.roundedRect(W - 170, 66, 180, 80, 16).fill('#083D7C');

      const logoPng = await getLogoPng();
      if (logoPng) {
        doc.image(logoPng, left, 34, { width: 156 });
      } else {
        doc.fontSize(27).fillColor(WHITE).font('Helvetica-Bold')
          .text('SORA', left, 38, { continued: true })
          .fillColor(CYAN).text('TECH');
      }

      doc.fontSize(8).fillColor('#A9B8CC').font('Helvetica')
        .text('Abidjan, Cocody - Angre 8eme', left, 96)
        .text('+225 07 04 92 80 68 | contact@soratech.ci', left, 110)
        .text('soratech.ci', left, 124);

      doc.fontSize(34).fillColor(WHITE).font('Helvetica-Bold')
        .text('FACTURE', 0, 38, { align: 'right', width: right });
      doc.fontSize(12).fillColor(CYAN).font('Helvetica-Bold')
        .text(facture.numero || '-', 0, 78, { align: 'right', width: right });
      doc.roundedRect(right - 94, 101, 94, 24, 7).fill(statColor);
      doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold')
        .text(statLabel, right - 94, 109, { width: 94, align: 'center' });

      // Top information panel
      const panelY = 188;
      doc.roundedRect(left, panelY, contentW, 112, 10).fill(PAPER).stroke(LINE);
      doc.rect(left, panelY, 5, 112).fill(BLUE);

      const col1 = left + 22;
      const col2 = left + 202;
      const col3 = left + 382;

      label('Client', col1, panelY + 18, 150);
      value(facture.clientName || '-', col1, panelY + 34, 160, { size: 13, bold: true });
      value([
        facture.clientPhone ? `Tel : ${facture.clientPhone}` : '',
        facture.clientEmail ? `Email : ${facture.clientEmail}` : '',
        facture.clientQuartier ? `Quartier : ${facture.clientQuartier}` : '',
      ].filter(Boolean).join('\n'), col1, panelY + 55, 165, { size: 8.5, color: '#344054', lineGap: 3 });

      label('Emission', col2, panelY + 18, 150);
      value(issueDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), col2, panelY + 34, 145, { bold: true });
      label('Echeance', col2, panelY + 62, 150);
      value(dueDate ? dueDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'A reception', col2, panelY + 78, 145, { bold: true });

      label('Reference', col3, panelY + 18, 110);
      value(facture.commandeRef || facture.trackingCode || facture.numero || '-', col3, panelY + 34, 120, { size: 12, bold: true, color: BLUE });
      label('Mode paiement', col3, panelY + 62, 130);
      value(facture.paymentMode === 'online' ? 'Paiement en ligne' : facture.paymentMode === 'virement' ? 'Virement' : 'Paiement a la livraison', col3, panelY + 78, 135, { bold: true });

      // Items table
      let rowY = 334;
      doc.fontSize(10).fillColor(INK).font('Helvetica-Bold').text('Details de facturation', left, rowY - 22);
      doc.roundedRect(left, rowY, contentW, 30, 8).fill(INK_2);
      doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold')
        .text('DESCRIPTION', left + 16, rowY + 11, { width: 276 })
        .text('QTE', left + 314, rowY + 11, { width: 42, align: 'center' })
        .text('PRIX UNIT.', left + 372, rowY + 11, { width: 72, align: 'right' })
        .text('TOTAL', left + 454, rowY + 11, { width: 58, align: 'right' });

      rowY += 42;
      const items = facture.items && facture.items.length ? facture.items : [{ description: 'Prestation SORA TECH', quantity: 1, unitPrice: facture.total || 0, total: facture.total || 0 }];

      for (const [i, item] of items.entries()) {
        if (rowY > 670) {
          footer();
          doc.addPage({ margin: 0, size: 'A4' });
          doc.rect(0, 0, W, H).fill(WHITE);
          doc.rect(0, 0, 12, H).fill(BLUE);
          doc.rect(12, 0, 4, H).fill(CYAN);
          rowY = 54;
        }

        const rowH = 38;
        if (i % 2 === 0) doc.roundedRect(left, rowY - 8, contentW, rowH, 7).fill(PAPER);
        const total = item.total ?? ((item.unitPrice || 0) * (item.quantity || 1));

        doc.fontSize(9).fillColor(INK).font('Helvetica-Bold')
          .text(item.description || '-', left + 16, rowY, { width: 276, lineGap: 2 });
        doc.fontSize(8).fillColor(MUTED).font('Helvetica')
          .text(String(item.quantity || 1), left + 314, rowY + 2, { width: 42, align: 'center' })
          .text(fcfa(item.unitPrice || 0), left + 356, rowY + 2, { width: 88, align: 'right' })
          .text(fcfa(total), left + 438, rowY + 2, { width: 74, align: 'right' });
        rowY += rowH;
      }

      rowY += 18;
      const totalsX = 338;
      const totalsW = right - totalsX;
      const addTotalLine = (name, amount, bold = false) => {
        doc.fontSize(bold ? 10 : 8.5).fillColor(bold ? INK : MUTED).font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(name, totalsX, rowY, { width: 92 })
          .text(fcfa(amount), totalsX + 92, rowY, { width: totalsW - 92, align: 'right' });
        rowY += bold ? 20 : 16;
      };

      doc.roundedRect(totalsX - 14, rowY - 14, totalsW + 14, 112, 10).fill('#F0F5FF').stroke('#C9DAFF');
      addTotalLine('Sous-total', facture.subtotal || 0);
      if ((facture.deliveryFee || 0) > 0) addTotalLine('Livraison', facture.deliveryFee || 0);
      if ((facture.tva || 0) > 0) addTotalLine(`TVA ${facture.tva}%`, facture.tvaAmount || 0);
      doc.moveTo(totalsX, rowY + 2).lineTo(right - 10, rowY + 2).strokeColor('#BFD2F6').lineWidth(0.8).stroke();
      rowY += 12;
      doc.roundedRect(totalsX, rowY - 8, totalsW - 10, 34, 8).fill(BLUE);
      doc.fontSize(12).fillColor(WHITE).font('Helvetica-Bold')
        .text('TOTAL', totalsX + 12, rowY + 2, { width: 70 })
        .text(fcfa(facture.total || 0), totalsX + 82, rowY + 2, { width: totalsW - 104, align: 'right' });

      const notesY = Math.max(rowY + 48, 638);
      doc.roundedRect(left, notesY, 268, 74, 8).fill(PAPER).stroke(LINE);
      label('Conditions', left + 14, notesY + 12, 100);
      value('Merci pour votre confiance. Cette facture est generee par SORA TECH COMPANY. Toute reclamation doit etre signalee sous 7 jours apres reception.', left + 14, notesY + 28, 238, { size: 8.2, color: '#344054', lineGap: 3 });

      if (facture.notes) {
        doc.roundedRect(left + 286, notesY, contentW - 286, 74, 8).fill('#FFF8E5').stroke('#F2D58A');
        label('Note', left + 300, notesY + 12, 80);
        value(String(facture.notes), left + 300, notesY + 28, contentW - 314, { size: 8.2, color: '#5F4B18', lineGap: 3 });
      }

      footer();

      doc.end();
      stream.on('end', () => resolve({ buffer: Buffer.concat(chunks), filename }));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCommandePDF, generateFacturePDF };
