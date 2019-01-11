const mongoose = require('mongoose');
const randomstring = require('randomstring');
const User = require('../models/users');
const Application = require('../models/applications');
const CONSTANTS = require('../../lib/constants');

exports.applications_get_all = (req, res) => {
  Application.find({ user_id: req.userData.userId })
  .exec()
  .then(applications => {
    res.status(200).json({
      count: applications.length,
      applications: applications.map(application => {
        return res.status(200).json({
          _id: application._id,
          user_id: application.user_id,
          name: application.name,
          type: application.type,
          created_at: application.created_at,
          api_key: application.api_key,
          api_secret: application.api_secret,
          users: [],
          request: {
            type: 'GET',
            url: `http://localhost:3000/applications/${application._id}`
          }
        });
      })
    });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
};

exports.applications_create = (req, res) => {
  User.findOne({ _id: req.userData.userId })
  .exec()
  .then(user => {
    const application = new Application({
      _id: mongoose.Types.ObjectId(),
      user_id: user._id,
      name: req.body.name,
      type: CONSTANTS.application.WALLET,
      created_at: new Date().getTime(),
      api_key: randomstring.generate(),
      api_secret: randomstring.generate(45),
      users: []
    });

    application.save()
    .then(result => {
      return res.status(200).json({
        _id: result._id,
        user_id: result.user_id,
        name: result.name,
        type: result.type,
        created_at: result.created_at,
        api_key: result.api_key,
        api_secret: result.api_secret,
        users: [],
        request: {
          type: 'GET',
          url: `http://localhost:3000/applications/${result._id}`
        }
      });
    })
    .catch(err => {
      res.status(200).json({ error: err });
    });
  })
  .catch(err => {
    res.status(200).json({ error: err });
  });
};
