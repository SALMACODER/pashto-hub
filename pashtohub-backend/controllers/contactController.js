const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

/**
 * @desc   Submit contact form
 * @route  POST /api/contact
 * @access Public
 */
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contact = await Contact.create({ name, email, subject, message });

  res.status(201).json({
    success: true,
    message: 'Your message has been received. We will respond soon.',
    contact,
  });
});

/**
 * @desc   Get all contact messages
 * @route  GET /api/contact
 * @access Admin
 */
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, count: contacts.length, contacts });
});

/**
 * @desc   Mark contact as read / replied
 * @route  PUT /api/contact/:id
 * @access Admin
 */
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }
  if (typeof req.body.isRead === 'boolean') contact.isRead = req.body.isRead;
  if (typeof req.body.isReplied === 'boolean') contact.isReplied = req.body.isReplied;
  const updated = await contact.save();
  res.json({ success: true, contact: updated });
});

/**
 * @desc   Delete a contact message
 * @route  DELETE /api/contact/:id
 * @access Admin
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }
  await contact.deleteOne();
  res.json({ success: true, message: 'Message deleted' });
});

module.exports = { submitContact, getContacts, updateContact, deleteContact };