const router = new require('express').Router();
const Projects = require('../models/projects');

router.get('/projects', (req, res) => {
  const username = req.user && req.user.username;

  Projects.getAll((err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    return res.status(200).json({
      data,
      success: true
    });
  });
});

router.post('/projects', (req, res) => {
  const title = req.body.title || null;
  const username = req.user && req.user.username;

  if (!title) {
    return res.status(400).json({
      message: 'No title provided',
      success: false
    });
  }

  Projects.create({ title }, (err, data) => {
    if (err) {
      if (err.constraint && err.constraint === 'projects_title_key') {
        return res.status(409).json({
          message: 'Project title already taken',
          success: false
        });
      }

      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    return res.status(200).json({
      data,
      message: 'Project created',
      success: true
    });
  });
});

router.delete('/projects/:id', (req, res) => {
  const projId = req.params.id || null;
  const username = req.user && req.user.username;

  if (!projId) {
    return res.status(400).json({
      message: 'No project id provided',
      success: false
    });
  }

  Projects.remove(projId, (err, data, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Project id does not exist',
        success: false
      });
    }

    return res.status(200).json({
      message: 'Project removed',
      success: true
    });
  });
});

router.post('/projects/:id', (req, res) => {
  const projId = req.params.id || null;
  const title = req.body.title || null;
  const username = req.user && req.user.username;

  if (!projId || !title) {
    return res.status(400).json({
      message: 'No project id or title provided',
      success: false
    });
  }

  Projects.update({ projId, title }, (err, data, result) => {
    if (err) {
      if (err.constraint && err.constraint === 'projects_title_key') {
        return res.status(409).json({
          message: 'Project title already taken',
          success: false
        });
      }

      return res.status(500).json({
        message: 'Database unavailable',
        success: false
      });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Project id does not exist',
        success: false
      });
    }

    return res.status(200).json({
      data,
      message: 'Project updated',
      success: true
    });
  });
});

module.exports = router;
