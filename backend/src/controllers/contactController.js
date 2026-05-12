const Contact = require('../models/Contact');
const { sendContactConfirmation, notifyAdminNewContact } = require('../utils/email');
const upsertContact = require('../utils/upsertContact');

const escapeRegex = (str) => String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);

const getContacts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: contacts, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Public fields accepted from the contact form — prevents mass assignment
const CONTACT_PUBLIC_FIELDS = ['name', 'email', 'phone', 'subject', 'message'];

const createContact = async (req, res) => {
  try {
    const payload = {};
    for (const key of CONTACT_PUBLIC_FIELDS) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    if (!payload.name || !payload.email || !payload.message) {
      return res.status(400).json({ success: false, message: 'Nom, email et message requis' });
    }

    const contact = await Contact.create(payload);
    sendContactConfirmation(contact).catch(e => console.error('[Email client]', e.message));
    notifyAdminNewContact(contact).catch(e => console.error('[Email admin]', e.message));
    upsertContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      source: 'contact_form',
    }).catch(e => console.error('[upsertContact contact]', e.message));
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin-editable fields for PATCH — prevents overwriting sensitive fields
const CONTACT_ADMIN_FIELDS = new Set(['status', 'notes', 'assignedTo']);

const updateContact = async (req, res) => {
  try {
    const update = {};
    for (const key of Object.keys(req.body)) {
      if (CONTACT_ADMIN_FIELDS.has(key)) update[key] = req.body[key];
    }
    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Message introuvable' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
