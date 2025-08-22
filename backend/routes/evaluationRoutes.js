const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");
const auth = require("../middleware/auth");

// المريض يضيف تقييم
router.post("/", auth, evaluationController.createEvaluation);

// جلب التقييمات الخاصة بدكتور
router.get("/doctor/:doctorId", evaluationController.getDoctorEvaluations);

// المريض يشوف تقييماته الخاصة
router.get("/me", auth, evaluationController.getMyEvaluations);

module.exports = router;
