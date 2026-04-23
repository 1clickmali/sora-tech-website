const nodemailer = require('nodemailer');
const fs = require('fs');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE !== 'false', // true pour le port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Template HTML premium ────────────────────────────────────────────────────

const baseTemplate = (content, { ctaUrl = '', ctaLabel = '' } = {}) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#0D1B2E; color:#E2E8F0; }
    .wrap { max-width:600px; margin:30px auto; border-radius:16px; overflow:hidden; background:#0B1628; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
    .header { background:linear-gradient(135deg,#060D1F,#0B1628); padding:32px; text-align:center; border-bottom:1px solid #1E2D4A; }
    .logo-text { font-size:28px; font-weight:900; letter-spacing:4px; color:#fff; }
    .logo-text span { color:#0099FF; }
    .tagline { font-size:11px; color:#8899BB; margin-top:6px; letter-spacing:2px; text-transform:uppercase; }
    .body { padding:36px; }
    .greeting { font-size:16px; color:#CBD5E1; margin-bottom:20px; }
    .greeting strong { color:#fff; }
    .info-card { background:#060D1F; border:1px solid #1E2D4A; border-left:4px solid #0099FF; border-radius:10px; padding:20px; margin:20px 0; }
    .info-card .label { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#8899BB; margin-bottom:4px; }
    .info-card .value { font-size:14px; color:#E2E8F0; font-weight:600; }
    .info-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #1E2D4A; }
    .info-row:last-child { border-bottom:none; }
    .info-row .name { font-size:13px; color:#CBD5E1; }
    .info-row .price { font-size:13px; color:#0099FF; font-weight:700; font-family:monospace; }
    .total-row { display:flex; justify-content:space-between; padding:14px 0 0; }
    .total-row .name { font-size:15px; color:#fff; font-weight:700; }
    .total-row .price { font-size:18px; color:#0099FF; font-weight:900; font-family:monospace; }
    .tracking-card { background:linear-gradient(135deg,#0099FF15,#0066FF10); border:1px solid #0099FF40; border-radius:12px; padding:20px; margin:20px 0; text-align:center; }
    .tracking-code { font-size:22px; font-weight:900; color:#0099FF; letter-spacing:4px; font-family:monospace; margin:8px 0; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(135deg,#0066FF,#0099FF); color:#fff !important; border-radius:10px; text-decoration:none; font-weight:700; font-size:14px; margin:20px 0; letter-spacing:0.5px; }
    .btn-whatsapp { background:linear-gradient(135deg,#128C7E,#25D366); }
    .steps { display:flex; justify-content:space-between; margin:24px 0; }
    .step { text-align:center; flex:1; }
    .step-dot { width:32px; height:32px; border-radius:50%; background:#1E2D4A; border:2px solid #1E2D4A; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-size:14px; }
    .step-dot.active { background:#0099FF20; border-color:#0099FF; }
    .step-label { font-size:10px; color:#8899BB; }
    .footer { background:#060D1F; padding:24px; text-align:center; border-top:1px solid #1E2D4A; }
    .footer p { font-size:11px; color:#8899BB; margin:4px 0; }
    .footer a { color:#0099FF; text-decoration:none; }
    .social { margin-top:12px; }
    .social a { display:inline-block; margin:0 8px; font-size:11px; color:#0099FF; text-decoration:none; }
    .divider { height:1px; background:linear-gradient(90deg,transparent,#1E2D4A,transparent); margin:20px 0; }
    @media(max-width:600px){ .body{padding:20px;} .info-row{flex-direction:column;gap:4px;} }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo-text">SORA<span>TECH</span></div>
    <div class="tagline">Votre partenaire tech en Côte d'Ivoire</div>
  </div>
  <div class="body">
    ${content}
    ${ctaUrl ? `<div style="text-align:center"><a href="${ctaUrl}" class="btn">${ctaLabel || 'Voir le détail'}</a></div>` : ''}
  </div>
  <div class="footer">
    <p>🏢 SORA TECH COMPANY — Cocody, Angré 8ème, Abidjan, Côte d'Ivoire</p>
    <p>📞 +225 07 04 92 80 68 &nbsp;|&nbsp; ✉️ <a href="mailto:contact@soratech.ci">contact@soratech.ci</a></p>
    <p style="margin-top:8px">© 2025 SORA TECH COMPANY. Tous droits réservés.</p>
    <div class="social">
      <a href="https://wa.me/2250704928068">💬 WhatsApp</a>
      <a href="https://soratech.ci">🌐 Site web</a>
    </div>
  </div>
</div>
</body>
</html>`;

// ── Emails CLIENT ─────────────────────────────────────────────────────────────

const sendCommandeConfirmation = async (commande, invoicePath = null, publicToken = null) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[Email] EMAIL_USER ou EMAIL_PASS manquant dans .env — email ignoré');
    return;
  }
  const transporter = createTransporter();

  const itemsHtml = (commande.items || []).map(i =>
    `<div class="info-row">
      <span class="name">${i.title}${i.digital ? ' <span style="font-size:10px;color:#00C48C">(Digital)</span>' : ''} × ${i.quantity || 1}</span>
      <span class="price">${((i.price || 0) * (i.quantity || 1)).toLocaleString('fr-FR')} F</span>
    </div>`
  ).join('');

  const html = baseTemplate(`
    <h2 style="color:#fff;font-size:20px;margin-bottom:8px">✅ Commande confirmée !</h2>
    <p class="greeting">Bonjour <strong>${commande.clientName}</strong>,</p>
    <p style="font-size:13px;color:#8899BB;margin-bottom:20px">
      Nous avons bien reçu votre commande. Voici votre récapitulatif et votre code de suivi :
    </p>

    <div class="tracking-card">
      <div style="font-size:11px;color:#8899BB;letter-spacing:2px;text-transform:uppercase">Code de suivi</div>
      <div class="tracking-code">${commande.trackingCode || commande.reference}</div>
      <div style="font-size:12px;color:#8899BB">Suivez votre commande en temps réel</div>
      ${commande.trackingUrl ? `<a href="${commande.trackingUrl}" class="btn" style="margin-top:12px;padding:10px 24px;font-size:12px">Suivre ma commande</a>` : ''}
      ${publicToken ? `<br><a href="${process.env.BACKEND_URL || 'https://sora-tech-website-production.up.railway.app'}/api/factures/public/${publicToken}" style="display:inline-block;margin-top:8px;padding:8px 20px;background:#1E2D4A;color:#00E5FF;border-radius:8px;text-decoration:none;font-size:11px;font-weight:700;">Telecharger ma facture PDF</a>` : ''}
    </div>

    <div class="info-card">
      <div class="label">Référence commande</div>
      <div class="value">${commande.reference}</div>
      <div style="margin-top:10px" class="label">Mode de paiement</div>
      <div class="value">${commande.paymentMode === 'online' ? '💳 Paiement en ligne' : '🚚 Paiement à la livraison'}</div>
      ${commande.clientQuartier || commande.quartier ? `<div style="margin-top:10px" class="label">Livraison</div><div class="value">📍 ${commande.clientQuartier || commande.quartier}${commande.clientAddress || commande.address ? ` — ${commande.clientAddress || commande.address}` : ''}</div>` : ''}
    </div>

    <div style="margin:20px 0">
      <div style="font-size:11px;color:#8899BB;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Articles commandés</div>
      ${itemsHtml}
      ${commande.deliveryFee > 0 ? `<div class="info-row"><span class="name">🚚 Frais de livraison</span><span class="price">${commande.deliveryFee.toLocaleString('fr-FR')} F</span></div>` : ''}
      <div class="divider"></div>
      <div class="total-row">
        <span class="name">TOTAL</span>
        <span class="price">${(commande.total || 0).toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>

    <p style="font-size:12px;color:#8899BB;margin-top:16px">
      Notre équipe vous contactera sous peu. N'hésitez pas à nous joindre directement :
    </p>
    <div style="text-align:center;margin-top:12px">
      <a href="https://wa.me/2250704928068?text=Commande%20${commande.reference}" class="btn btn-whatsapp" style="margin:8px 4px">💬 WhatsApp</a>
    </div>
  `);

  const mailOptions = {
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: commande.clientEmail,
    subject: `✅ Commande ${commande.reference} — Code suivi : ${commande.trackingCode || ''}`,
    html,
  };

  // Attacher le PDF si disponible
  if (invoicePath && fs.existsSync(invoicePath)) {
    mailOptions.attachments = [{
      filename: `Commande-${commande.reference}.pdf`,
      path: invoicePath,
      contentType: 'application/pdf',
    }];
  }

  await transporter.sendMail(mailOptions);
  console.log(`[Email] Confirmation envoyée à ${commande.clientEmail}`);
};

const sendDevisConfirmation = async (devis) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const transporter = createTransporter();
  const serviceNames = { web: 'Site web', soft: 'Logiciel de gestion', app: 'Application mobile', erp: 'ERP complet', cyber: 'Cybersécurité', maint: 'Maintenance' };

  const html = baseTemplate(`
    <h2 style="color:#fff;font-size:20px;margin-bottom:8px">📋 Devis reçu !</h2>
    <p class="greeting">Bonjour <strong>${devis.clientName}</strong>,</p>
    <p style="font-size:13px;color:#8899BB;margin-bottom:20px">
      Nous avons bien reçu votre demande. Un expert vous contactera dans les <strong style="color:#0099FF">24 heures</strong>.
    </p>
    <div class="info-card">
      <div class="label">Référence</div><div class="value">${devis.reference}</div>
      <div style="margin-top:10px" class="label">Service demandé</div>
      <div class="value">${serviceNames[devis.serviceType] || devis.serviceType}</div>
      <div style="margin-top:10px" class="label">RDV prévu</div>
      <div class="value">📅 ${devis.rdvDate} à ${devis.rdvSlot}</div>
      <div style="margin-top:10px" class="label">Estimation préliminaire</div>
      <div class="value" style="color:#0099FF">${devis.estimatedPrice?.toLocaleString('fr-FR')} FCFA — ${devis.estimatedDays} jours</div>
    </div>
  `, { ctaUrl: 'https://wa.me/2250704928068', ctaLabel: '💬 Nous contacter sur WhatsApp' });

  await transporter.sendMail({
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: devis.clientEmail,
    subject: `📋 Devis ${devis.reference} — SORA TECH`,
    html,
  });
};

const sendContactConfirmation = async (contact) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const transporter = createTransporter();

  const html = baseTemplate(`
    <h2 style="color:#fff;font-size:20px;margin-bottom:8px">📬 Message reçu !</h2>
    <p class="greeting">Bonjour <strong>${contact.name}</strong>,</p>
    <p style="font-size:13px;color:#8899BB;margin-bottom:20px">
      Nous avons bien reçu votre message et nous vous répondrons dans les <strong style="color:#0099FF">24 heures</strong>.
    </p>
    <div class="info-card">
      <div class="label">Sujet</div><div class="value">${contact.service || 'Question générale'}</div>
      <div style="margin-top:10px" class="label">Votre message</div>
      <div class="value" style="font-weight:400;color:#CBD5E1">${contact.message.substring(0, 300)}${contact.message.length > 300 ? '...' : ''}</div>
    </div>
  `, { ctaUrl: 'https://wa.me/2250704928068', ctaLabel: '💬 Réponse rapide WhatsApp' });

  await transporter.sendMail({
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: `📬 Message reçu — SORA TECH vous répond sous 24h`,
    html,
  });
};

// ── Emails ADMIN ──────────────────────────────────────────────────────────────

const notifyAdmin = async (subject, content) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) return;
  const transporter = createTransporter();
  const html = baseTemplate(`<h2 style="color:#FF4757;font-size:18px;margin-bottom:16px">🔔 Notification Admin</h2>${content}`);
  await transporter.sendMail({
    from: `"SORA TECH Système" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `[ADMIN] ${subject}`,
    html,
  });
};

const notifyAdminNewCommande = async (commande) => {
  await notifyAdmin(
    `🛒 Nouvelle commande ${commande.reference} — ${(commande.total || 0).toLocaleString('fr-FR')} FCFA`,
    `<div class="info-card">
      <div class="label">Client</div>
      <div class="value">${commande.clientName} — ${commande.clientPhone}</div>
      ${commande.clientEmail ? `<div style="margin-top:6px" class="label">Email</div><div class="value">${commande.clientEmail}</div>` : ''}
      ${commande.clientQuartier || commande.quartier ? `<div style="margin-top:6px" class="label">Quartier</div><div class="value">${commande.clientQuartier || commande.quartier}</div>` : ''}
      <div style="margin-top:10px" class="label">Total</div>
      <div class="value" style="font-size:20px;color:#0099FF">${(commande.total || 0).toLocaleString('fr-FR')} FCFA</div>
      <div style="margin-top:10px" class="label">Paiement</div>
      <div class="value">${commande.paymentMode === 'cod' ? '🚚 À la livraison' : '💳 En ligne'}</div>
      <div style="margin-top:10px" class="label">Articles</div>
      <div class="value">${(commande.items || []).map(i => `${i.title} × ${i.quantity || 1}`).join(', ')}</div>
      <div style="margin-top:10px" class="label">Code de suivi</div>
      <div class="value" style="color:#0099FF;font-family:monospace;font-size:16px">${commande.trackingCode || '-'}</div>
    </div>
    ${commande.trackingUrl ? `<div style="text-align:center;margin-top:16px"><a href="${commande.trackingUrl}" class="btn" style="padding:10px 20px;font-size:12px">📦 Voir le suivi</a></div>` : ''}`
  );
};

const notifyAdminNewDevis = async (devis) => {
  const serviceNames = { web: 'Site web', soft: 'Logiciel', app: 'App mobile', erp: 'ERP', cyber: 'Cybersécurité', maint: 'Maintenance' };
  await notifyAdmin(
    `📋 Nouveau devis ${devis.reference}`,
    `<div class="info-card">
      <div class="label">Client</div><div class="value">${devis.clientName} — ${devis.clientPhone}</div>
      <div style="margin-top:6px" class="label">Email</div><div class="value">${devis.clientEmail}</div>
      <div style="margin-top:6px" class="label">Service</div><div class="value">${serviceNames[devis.serviceType] || devis.serviceType}</div>
      <div style="margin-top:6px" class="label">RDV</div><div class="value">${devis.rdvDate} à ${devis.rdvSlot}</div>
      <div style="margin-top:6px" class="label">Estimation</div><div class="value" style="color:#0099FF">${devis.estimatedPrice?.toLocaleString('fr-FR')} FCFA</div>
    </div>`
  );
};

const notifyAdminNewContact = async (contact) => {
  await notifyAdmin(
    `✉️ Nouveau message de ${contact.name}`,
    `<div class="info-card">
      <div class="label">De</div><div class="value">${contact.name} — ${contact.email}</div>
      <div style="margin-top:6px" class="label">Téléphone</div><div class="value">${contact.phone || 'Non renseigné'}</div>
      <div style="margin-top:6px" class="label">Service</div><div class="value">${contact.service || 'Non renseigné'}</div>
      <div style="margin-top:6px" class="label">Message</div><div class="value" style="font-weight:400;color:#CBD5E1">${contact.message}</div>
    </div>`
  );
};

// Vérification de la config email au démarrage du serveur
const verifyEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER ou EMAIL_PASS manquant — les emails ne seront PAS envoyés');
    return;
  }
  const t = createTransporter();
  t.verify((err) => {
    if (err) console.error('[Email] Erreur de configuration SMTP:', err.message);
    else console.log('[Email] Configuration SMTP OK — emails prets a etre envoyes');
  });
};

module.exports = {
  sendCommandeConfirmation,
  sendDevisConfirmation,
  sendContactConfirmation,
  notifyAdminNewCommande,
  notifyAdminNewDevis,
  notifyAdminNewContact,
  verifyEmailConfig,
};
