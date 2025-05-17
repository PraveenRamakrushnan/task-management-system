const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const jsPDF = require('jspdf');

// Create Task
exports.createTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('deadline').isDate().withMessage('Valid deadline is required'),
  body('assignedTo').notEmpty().withMessage('Assigned To is required'),
  body('status').isIn(['Pending', 'In Progress', 'Done']).withMessage('Invalid status'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const task = new Task({ ...req.body, userId: req.user.id });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
];

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Task
exports.updateTask = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('deadline').isDate(),
  body('assignedTo').notEmpty(),
  body('status').isIn(['Pending', 'In Progress', 'Done']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
];

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate PDF
exports.generatePDF = async (req, res) => {
  try {
    console.log('User ID:', req.user.id); 
    const tasks = await Task.find({ userId: req.user.id });
    console.log('Tasks fetched:', tasks); 
    const doc = new jsPDF();
    doc.text('Task Report', 10, 10);
    tasks.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, task.title, task.status, task.deadline);
      doc.text(
        `${index + 1}. ${task.title} - ${task.status} (Due: ${task.deadline.toDateString()})`,
        10,
        20 + index * 10
      );
    });
    const pdf = doc.output();
    console.log('PDF generated, sending response');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error in generatePDF:', error); // Debug error
    res.status(500).json({ error: 'Error generating PDF', details: error.message });
  }
};