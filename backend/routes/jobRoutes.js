const express = require('express');
const { 
  getJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob 
} = require('../controllers/jobController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', auth, requireRole('admin'), createJob);
router.put('/:id', auth, requireRole('admin'), updateJob);
router.delete('/:id', auth, requireRole('admin'), deleteJob);

module.exports = router;