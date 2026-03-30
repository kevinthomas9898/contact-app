const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contacts.find({ user_id: req.user.id });
    res.status(200).json(contact);
})

const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields required");
    }

    const existingContact = await Contacts.findOne({
        user_id: req.user.id,
        $or: [{ email }, { phone }],
    });

    if (existingContact) {
        res.status(400);
        if (existingContact.email === email) {
            throw new Error(`Email already exists: ${email}`);
        }
        if (existingContact.phone === phone) {
            throw new Error(`Phone already exists: ${phone}`);
        }
    }

    const contact = await Contacts.create({
        name: name,
        email: email,
        phone: phone,
        user_id: req.user.id
    });
    res.status(201).json(contact)
})

const getContactById = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User not authorized");
    }

    res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User not authorized");
    }

    const updatedContact = await Contacts.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    // 🔐 Authorization check
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User not authorized");
    }

    await Contacts.deleteOne({ _id: req.params.id });

    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContactById, updateContact, deleteContact }