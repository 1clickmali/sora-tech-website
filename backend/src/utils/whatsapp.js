// Intégration Twilio WhatsApp — structure préparée
// Pour activer : renseigner les variables Twilio dans .env

const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('[WhatsApp] Twilio non configuré — message ignoré');
    return;
  }

  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Formater le numéro (ex: 07 04 92 80 68 → whatsapp:+2250704928068)
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:+225${to.replace(/\D/g, '')}`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedTo,
    });

    console.log(`[WhatsApp] Message envoyé à ${formattedTo}`);
  } catch (error) {
    console.error('[WhatsApp] Erreur Twilio:', error.message);
  }
};

const sendCommandeWhatsApp = async (commande) => {
  if (!commande.clientPhone) return;
  const msg = `✅ *SORA TECH — Commande confirmée !*\n\nBonjour ${commande.clientName},\nVotre commande *${commande.reference}* a bien été reçue.\n\nTotal : *${commande.total.toLocaleString('fr-FR')} FCFA*\n\nNous vous contacterons bientôt.\n\n_SORA TECH COMPANY_`;
  await sendWhatsApp(commande.clientPhone, msg);
};

const sendDevisWhatsApp = async (devis) => {
  if (!devis.clientPhone) return;
  const msg = `📋 *SORA TECH — Devis reçu !*\n\nBonjour ${devis.clientName},\nVotre demande de devis *${devis.reference}* est enregistrée.\n\nRDV le *${devis.rdvDate}* à *${devis.rdvSlot}*\n\nNotre équipe vous contactera sous 24h.\n\n_SORA TECH COMPANY_`;
  await sendWhatsApp(devis.clientPhone, msg);
};

module.exports = { sendWhatsApp, sendCommandeWhatsApp, sendDevisWhatsApp };
