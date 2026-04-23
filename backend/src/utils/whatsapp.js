// Service WhatsApp — Twilio ou fallback wa.me

const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    // Fallback : log du lien wa.me pour envoi manuel
    const encoded = encodeURIComponent(message);
    const phone = to.replace(/\D/g, '').replace(/^0/, '225');
    console.log(`[WhatsApp] Twilio non configuré.`);
    console.log(`[WhatsApp] Lien fallback : https://wa.me/${phone}?text=${encoded}`);
    return;
  }

  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:+225${to.replace(/\D/g, '')}`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: formattedTo,
    });
    console.log(`[WhatsApp] Message envoyé à ${formattedTo}`);
  } catch (error) {
    console.error('[WhatsApp] Erreur Twilio:', error.message);
  }
};

// ── Client : confirmation de commande ────────────────────────────────────────

const sendCommandeWhatsApp = async (commande) => {
  if (!commande.clientPhone) return;

  const items = (commande.items || [])
    .map(i => `  • ${i.title} × ${i.quantity || 1} — ${((i.price || 0) * (i.quantity || 1)).toLocaleString('fr-FR')} F`)
    .join('\n');

  const quartier = commande.clientQuartier || commande.quartier || '';
  const tracking = commande.trackingCode || commande.reference;
  const trackingUrl = commande.trackingUrl || `https://soratech.ci/suivi/${tracking}`;

  const msg =
`✅ *SORA TECH — Commande confirmée !*

Bonjour *${commande.clientName}*,
Votre commande a bien été reçue et enregistrée.

📦 *Référence :* ${commande.reference}
🔍 *Code suivi :* ${tracking}

*Articles :*
${items}

💰 *Total : ${(commande.total || 0).toLocaleString('fr-FR')} FCFA*
${commande.paymentMode === 'cod' ? `🚚 Paiement à la livraison${quartier ? ` (${quartier})` : ''}` : '💳 Paiement en ligne'}

📲 *Suivez votre commande :*
${trackingUrl}

Merci de votre confiance ! 🙏
_SORA TECH COMPANY — Abidjan_`;

  await sendWhatsApp(commande.clientPhone, msg);
};

// ── Admin : alerte nouvelle commande ─────────────────────────────────────────

const sendCommandeAdminWhatsApp = async (commande) => {
  const adminPhone = process.env.ADMIN_WHATSAPP || process.env.ADMIN_PHONE;
  if (!adminPhone) return;

  const items = (commande.items || [])
    .map(i => `  • ${i.title} × ${i.quantity || 1}`)
    .join('\n');

  const msg =
`🛒 *NOUVELLE COMMANDE — SORA TECH*

👤 *Client :* ${commande.clientName}
📞 *Tél :* ${commande.clientPhone}
${commande.clientEmail ? `✉️ *Email :* ${commande.clientEmail}\n` : ''}\
${commande.clientQuartier || commande.quartier ? `📍 *Quartier :* ${commande.clientQuartier || commande.quartier}\n` : ''}\

🧾 *Réf :* ${commande.reference}
🔍 *Suivi :* ${commande.trackingCode || '-'}

*Articles :*
${items}

💰 *Total : ${(commande.total || 0).toLocaleString('fr-FR')} FCFA*
${commande.paymentMode === 'cod' ? '🚚 Livraison (paiement à la remise)' : '💳 Paiement en ligne'}

⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}`;

  await sendWhatsApp(adminPhone, msg);
};

// ── Devis ─────────────────────────────────────────────────────────────────────

const sendDevisWhatsApp = async (devis) => {
  if (!devis.clientPhone) return;
  const msg =
`📋 *SORA TECH — Devis reçu !*

Bonjour *${devis.clientName}*,
Votre demande de devis *${devis.reference}* est enregistrée.

📅 RDV : *${devis.rdvDate}* à *${devis.rdvSlot}*

Notre équipe vous contactera sous *24h*.

_SORA TECH COMPANY_`;
  await sendWhatsApp(devis.clientPhone, msg);
};

const sendDevisAdminWhatsApp = async (devis) => {
  const adminPhone = process.env.ADMIN_WHATSAPP || process.env.ADMIN_PHONE;
  if (!adminPhone) return;
  const serviceNames = { web: 'Site web', soft: 'Logiciel', app: 'App mobile', erp: 'ERP', cyber: 'Cybersécurité', maint: 'Maintenance' };
  const msg =
`📋 *NOUVEAU DEVIS — SORA TECH*

👤 ${devis.clientName} — ${devis.clientPhone}
🛠 ${serviceNames[devis.serviceType] || devis.serviceType}
📅 RDV : ${devis.rdvDate} à ${devis.rdvSlot}
💰 ~${devis.estimatedPrice?.toLocaleString('fr-FR')} FCFA`;
  await sendWhatsApp(adminPhone, msg);
};

module.exports = {
  sendWhatsApp,
  sendCommandeWhatsApp,
  sendCommandeAdminWhatsApp,
  sendDevisWhatsApp,
  sendDevisAdminWhatsApp,
};
