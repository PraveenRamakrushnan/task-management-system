const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value} is not a valid date!`
    }},
  assignedTo: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  userId: { type: String, required: true }, // Links task to authenticated user
});
module.exports = mongoose.model('Task', taskSchema);