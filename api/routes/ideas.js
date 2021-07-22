module.exports = app => {
  const controller = require('../controllers/ideas')();

  app.route('/api/ideas')
    .get(controller.ideas);
  app.route('/api/ideas/count')
    .get(controller.count);
  app.route('/api/ideas/count-users')
    .get(controller.countByUser);
  app.route('/api/ideas/count-owner')
    .get(controller.countOwner);
  app.route('/api/ideas/count-saved')
    .get(controller.countSaved);
  app.route('/api/ideas/:userId')
    .get(controller.getData);
  app.route('/api/ideas/favorites/:userId')
    .get(controller.getFavorites);

  app.route('/api/ideas/create')
    .post(controller.create)
  app.route('/api/ideas/delete/:ideaId')
    .get(controller.delete)
  
  
  // seting Like, dislike and Favorite
  app.route('/api/ideas/like')
    .post(controller.like);
  app.route('/api/ideas/dislike')
    .post(controller.dislike);
  app.route('/api/ideas/favorite')
    .post(controller.favorite);
}