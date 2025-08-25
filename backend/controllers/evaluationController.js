const { Evaluation, User } = require('../models');

// الحصول على جميع التقييمات
exports.getAllEvaluations = async (req, res) => {
  try {
  const evaluations = await Evaluation.findAll({
  include: { 
    model: User, 
    as: 'evaluator',  // يجب أن يطابق alias في العلاقة
    attributes: ['id', 'name', 'role'] 
  },
  order: [['createdAt', 'DESC']]
});

    res.json(evaluations);
  } catch (err) {
    console.error('Error fetching evaluations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// إنشاء تقييم جديد
exports.createEvaluation = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const evaluation = await Evaluation.create({ userId, rating, comment });
    res.status(201).json(evaluation);
  } catch (err) {
    console.error('Error creating evaluation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// حذف تقييم
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluationId = req.params.id;
    const user = req.user;

    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    // التحقق من الصلاحية
    if (user.role !== 'admin' && evaluation.userId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this evaluation' });
    }

    await evaluation.destroy();
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (err) {
    console.error('Error deleting evaluation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
