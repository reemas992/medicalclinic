const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/auth');

// 🟢 Routes
router.get('/', auth, evaluationController.getAllEvaluations);
router.post('/', auth, evaluationController.createEvaluation);
router.put('/:id', auth, evaluationController.updateEvaluation);
router.delete('/:id', auth, evaluationController.deleteEvaluation);

module.exports = router;
