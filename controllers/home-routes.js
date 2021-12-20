const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      { model: User, attributes: ['username'] },
      {
        model: Comment,
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));

      // add property for conditional rendering of 'edit post'
      posts.forEach((post) => {
        if (post.user.username === req.session.username) {
          post.isAuthoredByUser = true;
        } else {
          post.isAuthoredByUser = false;
        }
      });

      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn,
        currentUser: req.session.username,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      let post = dbPostData.get({ plain: true });

      // add property for conditional rendering of 'edit post'
      if (post.user.username === req.session.username) {
        post.isAuthoredByUser = true;
      }

      // add property for conditional rendering of 'edit comment' and 'delete comment'
      post.comments.forEach((comment) => {
        if (comment.user_id === req.session.user_id) {
          comment.isAuthoredByUser = true;
        } else {
          comment.isAuthoredByUser = false;
        }
      });

      res.render('single-post', {
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

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard/');
    return;
  }

  res.render('login');
});

module.exports = router;
