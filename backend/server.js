const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./middlewares/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this after all your routes
app.use(require('./middlewares/errorHandler'));