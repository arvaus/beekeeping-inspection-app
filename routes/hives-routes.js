const express = require('express');
const ensure = require('connect-ensure-login');
const multer = require('multer');
const Hive = require('../models/hive-model');

const router  = express.Router();
const hivesRoutes = express.Router();
// const uploads = multer({ dest: '__dirname' + '/../public/uploads/' });

hivesRoutes.get('/hives/index', ensure.ensureLoggedIn(), (req, res, next) => {
  Hive.find({owner: req.user._id}, (err, myHives) => {
    if (err) { return next(err); }

    res.render('hives/hive-index', {
      hives: myHives,
      userInfo: req.user
    });
  });
});

hivesRoutes.get('/hives/new', ensure.ensureLoggedIn(), (req, res, next) => {
  res.render('hives/new-view.ejs', {
    message: req.flash('success')
  });
});

// router.post('/hives', ensureAuthenticated, (req, res, next) => {
hivesRoutes.post('/hives',
  ensure.ensureLoggedIn(),


    (req, res, next) => {
  //    const filename = req.file.filename;

    const newHive = new Hive ({
      name:  req.body.name,
      dateCreated: req.body.dateCreated,
      comment:  req.body.comment,
      owner: req.user._id   // <-- we add the user ID
    });
    newHive.save ((err) => {
      if (err) {
        next(err);
        return;
      } else {
        req.flash('success', 'Your hive has been created');
        res.redirect('/hives/new');
      }
    });
});

router.get('/hives/:id/edit', (req, res, next) => {
  const hiveId = req.params.id;

  Hive.findById(hiveId, (err, hiveDoc) => {
    if (err) { return next(err); }
    res.render('hives/edit-view', {
      hive: hiveDoc
    });
  });
});

router.post('/hives/:id', (req, res, next) => {
  const hiveId = req.params.id;
  const hiveUpdates = {
    name:  req.body.name,
    dateCreated: req.body.dateCreated,
    numberOfBroodBoxes: req.body.numberOfBroodBoxes,
    numberOfFrames: req.body.numberOfFrames,
    typeOfHive: req.body.typeOfHive,
    comment:  req.body.comment,
    owner: req.user._id
};
  // db.hives.updateOne({ _id: hive }, { $set: hiveUpdates })
  Hive.findByIdAndUpdate(hiveId, hiveUpdates, (err, hive) => {
    if (err){
      next(err);
      return;
    }
      res.redirect('/hives');
    });
  });

  router.post('/hives/:id/delete', (req, res, next) => {
    const hiveId = req.params.id;

    console.log(hiveId);

    // db.hives.deleteOne({_id: hiveId })
    Hive.findByIdAndRemove(hiveId, (err, hive) => {
      if (err) {
        next(err);
        return;
      }
      res.render('hive-index');
    });
  });


module.exports = hivesRoutes;
