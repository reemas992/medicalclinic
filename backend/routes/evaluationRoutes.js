const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/auth');

// الحصول على جميع التقييمات
router.get('/', auth, evaluationController.getAllEvaluations);

// إنشاء تقييم جديد
router.post('/', auth, evaluationController.createEvaluation);

// حذف تقييم (المستخدم العادي يمكنه حذف تقييمه، الأدمن يمكنه حذف أي تقييم)
router.delete('/:id', auth, evaluationController.deleteEvaluation);

module.exports = router;
