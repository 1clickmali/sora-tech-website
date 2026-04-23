const Contact = require('../models/Contact');
const { sendContactConfirmation, notifyAdminNewContact } = require('../utils/email');
const upsertContact = require('../utils/upsertContact');

const getContacts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: contacts, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
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

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
