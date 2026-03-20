const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contacts.find();
    res.status(200).json(contact);
})

const createContact = asyncHandler(async (req, res) => {
    console.log(req.body.name);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields required");
    }

    const contact = await Contacts.create({
        name: name,
        email: email,
        phone: phone
    });
    res.status(201).json(contact)
})

const getContactById = asyncHandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
})

const updateContact = asyncHandler(async (req, res) => {
    const updateContact = await Contacts.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!updateContact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(updateContact);
})

const deleteContact = asyncHandler(async (req, res) => {
    const deleteContact = await Contacts.findByIdAndDelete(req.params.id);

    if (!deleteContact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json(deleteContact)
})

module.exports = { getContacts, createContact, getContactById, updateContact, deleteContact }