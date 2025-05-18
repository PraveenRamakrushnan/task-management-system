const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const jsPDF = require('jspdf');
const PDFDocument = require('pdfkit');

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
// Update the generatePDF function in backend/controllers/taskController.js
exports.generatePDF = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.pdf');
    
    doc.pipe(res);
    doc.fontSize(20).text('Task Report', { align: 'center' });
    
    tasks.forEach((task, i) => {
      doc.fontSize(12)
         .text(`${i+1}. ${task.title} - ${task.status}`)
         .text(`Due: ${task.deadline.toDateString()}`)
         .text(`Description: ${task.description}`)
         .moveDown();
    });
    
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};