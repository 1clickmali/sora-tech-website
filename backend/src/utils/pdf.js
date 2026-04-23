const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
  const svgPath = path.join(__dirname, '../../../assets/logos/SORA_TECH_logo_clair.svg');
  if (!fs.existsSync(svgPath)) return null;
  _logoPng = await sharp(svgPath).resize(420).png().toBuffer();
  return _logoPng;
};

// ─────────────────────────────────────────────────────────────────────────────
// RECU DE COMMANDE — design premium inspiré Stripe / Apple
// ─────────────────────────────────────────────────────────────────────────────
const generateCommandePDF = async (commande) => {
  const dir = path.join(__dirname, '../../uploads/factures');
  ensureDir(dir);

  const filename = `commande-${commande.reference}.pdf`;
  const filepath = path.join(dir, filename);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const stream = fs.createWriteStream(filepath);
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
      stream.on('finish', () => resolve({ filepath, filename }));
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
  const dir = path.join(__dirname, '../../uploads/factures');
  ensureDir(dir);

  const filename = `facture-${facture.numero}.pdf`;
  const filepath = path.join(dir, filename);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      const W = 595.28;
      const BLEU = '#0099FF';
      const NOIR = '#060D1F';
      const GRIS = '#8899BB';
      const GRIS_CLAIR = '#E8EDF2';
      const FOND = '#F8F9FA';

      const payStatus = facture.paymentStatus || facture.status || 'impayee';
      const statColor = payStatus === 'payee' ? '#00C48C' : payStatus === 'annulee' ? '#64748B' : '#FF4757';
      const statLabel = payStatus === 'payee' ? 'PAYEE' : payStatus === 'annulee' ? 'ANNULEE' : 'IMPAYEE';

      // Header
      doc.rect(0, 0, W, 140).fill(NOIR);

      const logoPng = await getLogoPng();
      if (logoPng) {
        doc.image(logoPng, 40, 32, { width: 160 });
      } else {
        doc.fontSize(26).fillColor('#FFFFFF').font('Helvetica-Bold')
          .text('SORA', 44, 36, { continued: true })
          .fillColor(BLEU).text('TECH');
      }

      doc.fontSize(7.5).fillColor(GRIS).font('Helvetica')
        .text('Abidjan, Cocody — Angre 8eme', 40, 100)
        .text('Tel : +225 07 04 92 80 68  |  contact@soratech.ci', 40, 112);

      doc.fontSize(22).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('FACTURE', 0, 34, { align: 'right', width: W - 40 });
      doc.fontSize(15).fillColor(BLEU).font('Helvetica-Bold')
        .text(facture.numero, 0, 62, { align: 'right', width: W - 40 });
      doc.fontSize(10).fillColor(statColor).font('Helvetica-Bold')
        .text(statLabel, 0, 83, { align: 'right', width: W - 40 });
      doc.fontSize(9).fillColor(GRIS).font('Helvetica')
        .text(
          new Date(facture.createdAt || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          0, 99, { align: 'right', width: W - 40 }
        );

      // Section infos
      const IY = 156;
      const BLOC_W = 238;
      const BLOC_H = 100;

      doc.rect(40, IY, W - 80, BLOC_H).fill(FOND).stroke(GRIS_CLAIR);
      doc.moveTo(40 + BLOC_W, IY).lineTo(40 + BLOC_W, IY + BLOC_H)
        .strokeColor(GRIS_CLAIR).lineWidth(1).stroke();

      // Emetteur
      doc.fontSize(7.5).fillColor(BLEU).font('Helvetica-Bold').text('EMETTEUR', 52, IY + 10);
      doc.fontSize(10).fillColor('#111111').font('Helvetica-Bold').text('SORA TECH COMPANY', 52, IY + 23);
      doc.fontSize(8.5).fillColor('#444444').font('Helvetica')
        .text('Fonde par Sissoko Abdoulaye', 52, IY + 38)
        .text('Abidjan, Cocody — Angre 8eme', 52, IY + 51)
        .text('Tel : +225 07 04 92 80 68', 52, IY + 64)
        .text('contact@soratech.ci', 52, IY + 77);

      // Destinataire
      const RX = 40 + BLOC_W + 16;
      const RW = W - 80 - BLOC_W - 16;
      doc.fontSize(7.5).fillColor(BLEU).font('Helvetica-Bold').text('FACTURE A', RX, IY + 10);
      doc.fontSize(11).fillColor('#111111').font('Helvetica-Bold')
        .text(facture.clientName || '-', RX, IY + 23, { width: RW });
      doc.fontSize(8.5).fillColor('#444444').font('Helvetica');
      let cy2 = IY + 40;
      if (facture.clientPhone) { doc.text('Tel : ' + facture.clientPhone, RX, cy2, { width: RW }); cy2 += 13; }
      if (facture.clientEmail) { doc.text('Email : ' + facture.clientEmail, RX, cy2, { width: RW }); cy2 += 13; }
      if (facture.clientQuartier) { doc.text('Quartier : ' + facture.clientQuartier, RX, cy2, { width: RW }); cy2 += 13; }
      if (facture.clientAddress) { doc.text('Adresse : ' + facture.clientAddress.substring(0, 45), RX, cy2, { width: RW }); }

      // Tableau
      const TY = IY + BLOC_H + 18;
      doc.rect(40, TY, W - 80, 24).fill(NOIR);
      doc.fontSize(8.5).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('DESCRIPTION', 52, TY + 8)
        .text('QTE', 370, TY + 8, { width: 35, align: 'center' })
        .text('PRIX UNIT.', 410, TY + 8, { width: 70 })
        .text('TOTAL', 485, TY + 8, { width: 70 });

      let rowY = TY + 28;
      (facture.items || []).forEach((item, i) => {
        if (i % 2 === 0) doc.rect(40, rowY - 2, W - 80, 22).fill(FOND);
        doc.fontSize(9).fillColor('#1A1A2E').font('Helvetica')
          .text(item.description || '-', 52, rowY, { width: 310 })
          .text(String(item.quantity || 1), 370, rowY, { width: 35, align: 'center' })
          .text(fcfa(item.unitPrice || 0).replace(' FCFA', ' F'), 410, rowY, { width: 70 })
          .text(fcfa(item.total || 0).replace(' FCFA', ' F'), 485, rowY, { width: 70 });
        rowY += 24;
        doc.moveTo(40, rowY - 1).lineTo(W - 40, rowY - 1)
          .strokeColor('#E0E4EA').lineWidth(0.5).stroke();
      });

      rowY += 10;
      doc.moveTo(360, rowY - 4).lineTo(W - 40, rowY - 4)
        .strokeColor('#DDDDDD').lineWidth(0.8).stroke();

      const addLigne2 = (label, val, gras = false, couleur = '#555555') => {
        doc.fontSize(gras ? 11 : 9).fillColor(couleur)
          .font(gras ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, 360, rowY)
          .text(val, 0, rowY, { align: 'right', width: W - 40 });
        rowY += gras ? 22 : 16;
      };

      addLigne2('Sous-total :', fcfa(facture.subtotal || 0));
      if ((facture.deliveryFee || 0) > 0) addLigne2('Frais de livraison :', fcfa(facture.deliveryFee));
      if ((facture.tva || 0) > 0) addLigne2(`TVA (${facture.tva}%) :`, fcfa(facture.tvaAmount || 0));

      rowY += 4;
      doc.rect(360, rowY - 3, W - 40 - 360, 26).fill(BLEU);
      doc.fontSize(12).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('TOTAL', 368, rowY + 3)
        .text(fcfa(facture.total || 0), 0, rowY + 3, { align: 'right', width: W - 40 });
      rowY += 36;

      if (facture.notes) {
        doc.fontSize(8.5).fillColor(GRIS).font('Helvetica-Bold').text('NOTES :', 40, rowY);
        doc.font('Helvetica').fillColor('#555555').text(facture.notes, 40, rowY + 14, { width: W - 80 });
        rowY += 32;
      }

      // Pied de page
      doc.rect(0, 802, W, 40).fill(NOIR);
      doc.fontSize(8.5).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('SORA TECH COMPANY — Votre partenaire digital en Cote d\'Ivoire', 0, 812, { align: 'center', width: W });
      doc.fontSize(7.5).fillColor(GRIS).font('Helvetica')
        .text(
          'Tel : +225 07 04 92 80 68  |  Email : contact@soratech.ci  |  soratech.ci  |  Abidjan, Cocody',
          0, 825, { align: 'center', width: W }
        );

      doc.end();
      stream.on('finish', () => resolve({ filepath, filename }));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCommandePDF, generateFacturePDF };
