module.exports = () => {
  const controller = {};

  controller.ideas = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
    select 
      i.*,
      count(likes.id) as likes,
      count(dislikes.id) as dislikes,
      count(favorites.id) as favorites
    from ideas i
    left join idea_likes likes on likes.idea_id = i.id and likes.like = 1
    left join idea_likes dislikes on dislikes.idea_id = i.id and dislikes.like = 0
    left join idea_favorites favorites on favorites.idea_id = i.id
    group by i.id;
    `);
    res.status(200).json(results);
  };
  controller.count = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from ideas');
    res.status(200).json(results);
  };
  controller.countByUser = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(i.id) as count from ideas i left join idea_favorites f on f.idea_id = i.id where (i.owner is not null or f.id is not null)');
    res.status(200).json(results);
  };
  controller.countSaved = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from idea_favorites;');
    res.status(200).json(results);
  };
  controller.countOwner = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from ideas  where owner is not null;');
    res.status(200).json(results);
  };

  controller.getData = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
      select 
        i.*,
        il.like,
        fav.id as favorite
      from 
        ideas i
      left join idea_likes il on il.idea_id = i.id and il.user_id = ${req.params.userId}
      left join idea_favorites fav on fav.idea_id = i.id and fav.user_id = ${req.params.userId}
      where
        i.owner is null;
    `);
    res.status(200).json(results);
  };
  
  controller.getFavorites = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
      select 
        i.*,
        fav.id as favorite
      from 
        ideas i
      left join idea_favorites fav on fav.idea_id = i.id
      left join projects p on p.idea_id = i.id and p.user_id = ${req.params.userId}
      where
        (fav.user_id = ${req.params.userId} or
        i.owner = ${req.params.userId}) and
        p.id is null;
    `);
    res.status(200).json(results);
  };
  
  controller.like = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
      select 
        *
      from 
        idea_likes
      where
        user_id = ${req.body.user_id} and
        idea_id = ${req.body.idea_id};
    `);
    if(results.length === 0) {
      await db.query(`insert into idea_likes values ('', ${req.body.idea_id}, ${req.body.user_id}, ${true})`);
    }
    else {
      if(results[0].like === 1){
        await db.query(`update idea_likes il set il.like = null where id = ${results[0].id}`);
      }
      else {
        await db.query(`update idea_likes il set il.like = 1 where id = ${results[0].id}`);
      }
    }
    res.status(200).json({message: 'updated'});  
  };
  
  controller.dislike = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
      select 
        *
      from 
        idea_likes
      where
        user_id = ${req.body.user_id} and
        idea_id = ${req.body.idea_id};
    `);
    if(results.length === 0) {
      await db.query(`insert into idea_likes values ('', ${req.body.idea_id}, ${req.body.user_id}, ${false})`);
    }
    else {
      if(results[0].like === 0  ){
        console.log(`update idea_likes il set il.like = null where id = ${results[0].id}`);
        await db.query(`update idea_likes il set il.like = null where id = ${results[0].id}`);
      }
      else {
        console.log(`update idea_likes il set il.like = 0 where id = ${results[0].id}`);
        await db.query(`update idea_likes il set il.like = 0 where id = ${results[0].id}`);
      }     
    }
    res.status(200).json({message: 'updated'});  
  };
  
  controller.favorite = async (req, res) => {
    const db = require('../../db');
    let results = await db.query(`
      select 
        *
      from 
        idea_favorites
      where
        user_id = ${req.body.user_id} and
        idea_id = ${req.body.idea_id};
    `);
    if(results.length === 0) {
      await db.query(`insert into idea_favorites values ('', ${req.body.idea_id}, ${req.body.user_id})`);
    }
    else {
      await db.query(`delete from idea_favorites where id = ${results[0].id}` );
    }
    res.status(200).json({message: 'updated'});  
  };

  controller.create = async (req, res) => {
    let keys = Object.keys(req.body.data);
    let values = Object.values(req.body.data).map(val => {
      return val.toString().replace("'", "").replace(';', '');
    });

    const db = require('../../db');
    await db.query(`insert into ideas (${keys.join(', ')}) values ('${values.join("','")}')`);
    res.status(200).json({message: 'inserted!'});
  }
  controller.delete = async (req, res) => {
    let id = req.params.ideaId;

    const db = require('../../db');
    await db.query(`delete from ideas where id = ${id}`);
    res.status(200).json({message: 'deleted!'});
  }

  return controller;
}
