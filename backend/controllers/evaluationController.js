const { Evaluation, User } = require('../models');

// ✅ Get all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: {
        model: User,
        as: 'evaluator', // alias matches relation in model
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

// ✅ Create evaluation
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

// ✅ Update evaluation (only owner or admin)
exports.updateEvaluation = async (req, res) => {
  try {
    const evaluationId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user;

    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    if (user.role !== 'admin' && evaluation.userId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to update this evaluation' });
    }

    evaluation.rating = rating || evaluation.rating;
    evaluation.comment = comment || evaluation.comment;
    await evaluation.save();

    res.json(evaluation);
  } catch (err) {
    console.error('Error updating evaluation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Delete evaluation (owner OR admin)
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluationId = req.params.id;
    const user = req.user;

    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

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
