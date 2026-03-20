const express = require('express');

const router = express.Router();

const { getContacts, createContact, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const { validateToken } = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route('/').get(getContacts);
router.route('/').post(createContact);
router.route('/:id').get(getContactById)
router.route('/:id').put(updateContact);
router.route('/:id').delete(deleteContact)

module.exports = router; 