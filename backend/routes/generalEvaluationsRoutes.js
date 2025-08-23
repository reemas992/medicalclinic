const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const generalEvalController = require('../controllers/generalEvaluationController');

// إنشاء تقييم عام (Patient)
router.post('/general', auth, generalEvalController.createGeneralEvaluation);

// جلب جميع التقييمات العامة (Admin فقط)
router.get('/general', auth, generalEvalController.getAllGeneralEvaluations);

module.exports = router;
