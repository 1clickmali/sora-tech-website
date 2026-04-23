const Contact = require('../models/Contact');

/**
 * Upsert a contact from a commande, devis, or contact form.
 * Finds by email OR phone; creates if not found.
 * Updates CRM stats on each call.
 */
async function upsertContact({ name, email, phone, quartier, address, source, orderTotal = 0 }) {
  if (!email && !phone) return;

  try {
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const existing = await Contact.findOne({ $or: query });

    if (existing) {
      const update = {
        $set: {
          name: existing.name || name,
          ...(email && { email }),
          ...(phone && { phone }),
          ...(quartier && { quartier }),
          ...(address && { address }),
        },
        $inc: {
          totalOrders: source === 'commande' ? 1 : 0,
          totalSpent: source === 'commande' ? orderTotal : 0,
        },
      };
      if (source === 'commande') {
        update.$set.lastOrderDate = new Date();
        // Upgrade clientStatus
        const newTotal = (existing.totalSpent || 0) + orderTotal;
        if (newTotal >= 500000) update.$set.clientStatus = 'vip';
        else if (existing.clientStatus === 'lead') update.$set.clientStatus = 'client';
      }
      // Add source tag if not already there
      if (!existing.tags?.includes(source)) {
        update.$addToSet = { tags: source };
      }
      await Contact.updateOne({ _id: existing._id }, update);
    } else {
      const clientStatus = source === 'commande' ? 'client' : 'lead';
      const contact = {
        name,
        source,
        clientStatus,
        tags: [source],
        message: source === 'commande' ? 'Client ajouté automatiquement via commande.' : source === 'devis' ? 'Lead ajouté via devis.' : '',
      };
      if (email) contact.email = email;
      if (phone) contact.phone = phone;
      if (quartier) contact.quartier = quartier;
      if (address) contact.address = address;
      if (source === 'commande') {
        contact.totalOrders = 1;
        contact.totalSpent = orderTotal;
        contact.lastOrderDate = new Date();
      }
      await Contact.create(contact);
    }
  } catch (err) {
    console.error('[upsertContact]', err.message);
  }
}

module.exports = upsertContact;
