const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    order: [['created_at', 'DESC']],
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: Comment,
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbPostData) => {
      let posts = dbPostData.map((post) => post.get({ plain: true }));

      // add property to posts for editing
      posts.forEach((post) => {
        post.isAuthoredByUser = true;
      });

      res.render('dashboard', {
        posts,
        loggedIn: req.session.loggedIn,
        currentUser: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'title', 'created_at'],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('edit-post', {
        post,
        loggedIn: req.session.loggedIn,
        currentUser: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
