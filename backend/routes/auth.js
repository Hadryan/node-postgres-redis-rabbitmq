const router = new require('express').Router();
const Users = require('../models/users');

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'No username or password provided',
      success: false
    });
  }

  Users.authenticate(req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    if (!data) {
      return res.status(404).json({
        message: 'Username or password incorrect',
        success: false
      });
    }

    // store session

    // generate token
    return res.status(200).json({
      data,
      message: 'Login successful',
      success: true
    });
  });
});

router.post('/users', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'No username or password provided',
      success: false
    });
  }

  Users.find(req.body.username, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    if (data.length !== 0) {
      return res.status(409).json({
        message: 'Username already exists',
        success: false
      });
    }

    // generate salt and password
    Users.create(req.body, (err, data) => {
      if (err) {
        if (err.constraint && err.constraint === 'check_pwd_lng') {
          return res.status(400).json({
            message: 'Password must be at least 8 characters',
            success: false
          });
        }

        if (err.constraint && err.constraint === 'check_usr_lng') {
          return res.status(400).json({
            message: 'Username must be at least 5 characters',
            success: false
          });
        }

        return res.status(500).json({
          message: 'Database unavailable',
          success: false
        });
      }

      // generate token
      return res.status(200).json({
        data,
        message: 'User created',
        success: true
      });
    });
  })
});

module.exports = router;
