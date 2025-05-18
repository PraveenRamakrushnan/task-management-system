module.exports = (err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };