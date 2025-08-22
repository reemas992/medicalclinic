const { Job } = require('../models');

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status } : {};
    
    const jobs = await Job.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get job by ID
exports.getJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const { title, department, description, requirements } = req.body;
    
    const job = await Job.create({
      title,
      department,
      description,
      requirements,
      status: 'open'
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, description, requirements, status } = req.body;
    
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    job.title = title || job.title;
    job.department = department || job.department;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.status = status || job.status;
    
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.destroy({ where: { id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};