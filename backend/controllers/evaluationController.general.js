const { Evaluation, User } = require('../models');

// -------------------- Create General Evaluation -------------------- //
exports.createGeneralEvaluation = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const patientId = req.user.id;

    if (!rating) return res.status(400).json({ error: 'Rating is required' });

    // يمكن السماح بتكرار تقييم أو حصر تقييم واحد لكل مستخدم
    // مثال: Allow multiple
    const evaluation = await Evaluation.create({
      patientId,
      rating,
      comment,
      type: 'general'  // حقل جديد في جدول Evaluation
    });

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get All General Evaluations -------------------- //
exports.getAllGeneralEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      where: { type: 'general' },
      include: [{ model: User, as: 'patient', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
