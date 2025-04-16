const express = require('express');
const {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addPet)
  .get(protect, getPets);

router.route('/:id')
  .get(protect, getPetById)
  .put(protect, updatePet)
  .delete(protect, deletePet);

module.exports = router;
