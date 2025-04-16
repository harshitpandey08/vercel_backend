const express = require('express');
const {
  addHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthStats,
} = require('../controllers/healthRecordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addHealthRecord);

router.route('/:id')
  .get(protect, getHealthRecordById)
  .put(protect, updateHealthRecord)
  .delete(protect, deleteHealthRecord);

router.get('/pet/:petId', protect, getHealthRecords);
router.get('/stats/:petId', protect, getHealthStats);

module.exports = router;
