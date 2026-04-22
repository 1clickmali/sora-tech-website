const nodemailer = require('nodemailer');

// Créer le transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Template HTML de base
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: #060D1F; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .header span { color: #0099FF; }
    .body { padding: 30px; color: #333; }
    .info-block { background: #f8f9fa; border-left: 4px solid #0099FF; padding: 16px; margin: 16px 0; border-radius: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .badge-blue { background: #e3f2fd; color: #0066FF; }
    .badge-green { background: #e8f5e9; color: #00C48C; }
    .footer { background: #060D1F; color: #8899BB; padding: 20px; text-align: center; font-size: 12px; }
    .btn { display: inline-block; padding: 12px 24px; background: #0066FF; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SORA<span>TECH</span></h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #8899BB;">Votre partenaire tech en Côte d'Ivoire</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>SORA TECH COMPANY — Cocody, Angré 8ème, Abidjan</p>
      <p>📞 +225 07 04 92 80 68 | ✉️ contact@soratech.ci</p>
      <p>© 2025 SORA TECH COMPANY. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`;

// ── Emails CLIENT ──────────────────────────────────────────────────────────────

const sendCommandeConfirmation = async (commande) => {
  const transporter = createTransporter();
  const itemsHtml = commande.items.map(i =>
    `<tr><td>${i.title}</td><td style="text-align:right">${i.price.toLocaleString('fr-FR')} FCFA</td></tr>`
  ).join('');

  const html = baseTemplate(`
    <h2>✅ Votre commande est confirmée !</h2>
    <p>Bonjour <strong>${commande.clientName}</strong>,</p>
    <p>Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
    <div class="info-block">
      <strong>Référence :</strong> ${commande.reference}<br>
      <strong>Mode de paiement :</strong> ${commande.paymentMode === 'online' ? 'Paiement en ligne' : 'Paiement à la livraison'}<br>
      ${commande.quartier ? `<strong>Livraison :</strong> ${commande.quartier}<br>` : ''}
    </div>
    <table style="width:100%; border-collapse:collapse; margin:16px 0">
      <tr style="background:#f8f9fa"><th style="text-align:left; padding:8px">Article</th><th style="text-align:right; padding:8px">Prix</th></tr>
      ${itemsHtml}
      <tr style="border-top: 2px solid #0099FF">
        <td style="padding:8px; font-weight:bold">Total</td>
        <td style="text-align:right; padding:8px; font-weight:bold; color:#0066FF">${commande.total.toLocaleString('fr-FR')} FCFA</td>
      </tr>
    </table>
    <p>Notre équipe vous contactera sous peu pour finaliser votre commande.</p>
    <a href="https://wa.me/2250704928068" class="btn">💬 Nous contacter sur WhatsApp</a>
  `);

  await transporter.sendMail({
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: commande.clientEmail,
    subject: `✅ Commande ${commande.reference} confirmée — SORA TECH`,
    html,
  });
};

const sendDevisConfirmation = async (devis) => {
  const transporter = createTransporter();
  const serviceNames = { web: 'Site web', soft: 'Logiciel de gestion', app: 'Application mobile', erp: 'ERP complet', cyber: 'Cybersécurité', maint: 'Maintenance' };

  const html = baseTemplate(`
    <h2>📋 Votre demande de devis est reçue !</h2>
    <p>Bonjour <strong>${devis.clientName}</strong>,</p>
    <p>Nous avons bien reçu votre demande de devis. Un expert de notre équipe vous contactera dans les <strong>24 heures</strong>.</p>
    <div class="info-block">
      <strong>Référence :</strong> ${devis.reference}<br>
      <strong>Service :</strong> ${serviceNames[devis.serviceType] || devis.serviceType}<br>
      <strong>RDV :</strong> ${devis.rdvDate} à ${devis.rdvSlot}<br>
      <strong>Estimation :</strong> ${devis.estimatedPrice?.toLocaleString('fr-FR')} FCFA — ${devis.estimatedDays} jours
    </div>
    <p>En attendant, n'hésitez pas à nous contacter directement :</p>
    <a href="https://wa.me/2250704928068" class="btn">💬 WhatsApp Business</a>
  `);

  await transporter.sendMail({
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: devis.clientEmail,
    subject: `📋 Devis ${devis.reference} reçu — SORA TECH`,
    html,
  });
};

const sendContactConfirmation = async (contact) => {
  const transporter = createTransporter();
  const html = baseTemplate(`
    <h2>📬 Message bien reçu !</h2>
    <p>Bonjour <strong>${contact.name}</strong>,</p>
    <p>Nous avons bien reçu votre message et nous vous répondrons dans les <strong>24 heures</strong>.</p>
    <div class="info-block">
      <strong>Sujet :</strong> ${contact.service || 'Question générale'}<br>
      <strong>Message :</strong> ${contact.message.substring(0, 200)}${contact.message.length > 200 ? '...' : ''}
    </div>
    <a href="https://wa.me/2250704928068" class="btn">💬 Réponse rapide sur WhatsApp</a>
  `);

  await transporter.sendMail({
    from: `"SORA TECH" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: `📬 Message reçu — SORA TECH vous répond sous 24h`,
    html,
  });
};

// ── Emails ADMIN ──────────────────────────────────────────────────────────────

const notifyAdmin = async (subject, content) => {
  const transporter = createTransporter();
  const html = baseTemplate(`<h2>🔔 Notification Admin</h2>${content}`);

  await transporter.sendMail({
    from: `"SORA TECH Système" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `[ADMIN] ${subject}`,
    html,
  });
};

const notifyAdminNewCommande = async (commande) => {
  await notifyAdmin(
    `Nouvelle commande ${commande.reference}`,
    `<div class="info-block">
      <strong>Client :</strong> ${commande.clientName} — ${commande.clientPhone}<br>
      <strong>Total :</strong> ${commande.total.toLocaleString('fr-FR')} FCFA<br>
      <strong>Paiement :</strong> ${commande.paymentMode === 'cod' ? 'À la livraison' : 'En ligne'}<br>
      <strong>Articles :</strong> ${commande.items.map(i => i.title).join(', ')}
    </div>`
  );
};

const notifyAdminNewDevis = async (devis) => {
  const serviceNames = { web: 'Site web', soft: 'Logiciel', app: 'App mobile', erp: 'ERP', cyber: 'Cybersécurité', maint: 'Maintenance' };
  await notifyAdmin(
    `Nouveau devis ${devis.reference}`,
    `<div class="info-block">
      <strong>Client :</strong> ${devis.clientName} — ${devis.clientPhone}<br>
      <strong>Email :</strong> ${devis.clientEmail}<br>
      <strong>Service :</strong> ${serviceNames[devis.serviceType]}<br>
      <strong>RDV :</strong> ${devis.rdvDate} à ${devis.rdvSlot}<br>
      <strong>Estimation :</strong> ${devis.estimatedPrice?.toLocaleString('fr-FR')} FCFA
    </div>`
  );
};

const notifyAdminNewContact = async (contact) => {
  await notifyAdmin(
    `Nouveau message de ${contact.name}`,
    `<div class="info-block">
      <strong>De :</strong> ${contact.name} — ${contact.email}<br>
      <strong>Téléphone :</strong> ${contact.phone || 'Non renseigné'}<br>
      <strong>Service :</strong> ${contact.service || 'Non renseigné'}<br>
      <strong>Message :</strong> ${contact.message}
    </div>`
  );
};

module.exports = {
  sendCommandeConfirmation,
  sendDevisConfirmation,
  sendContactConfirmation,
  notifyAdminNewCommande,
  notifyAdminNewDevis,
  notifyAdminNewContact,
};
