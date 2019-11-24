/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Delete a category.
 */
'use strict';
const { db, Template, Category } = require('../models');
const log = require('../loggers');
module.exports = async (req, res) => {
  //TODO you can use Promise.all here , to improve performance.
  let session;
  try {
    session = await db.startSession();
    log.info(`Starting transaction to delete the category ${req.params.categoryId}`);
    session.startTransaction();
    await Category.deleteOne({_id : req.params.categoryId }, { session: session });
    let subCategories = await Category.find({ parentIds : req.params.categoryId} , null , {session: session});
    let deleteResult = await Category.deleteMany({ parentIds : req.params.categoryId} , {session: session});
    log.info(`Number of sub categories deleted --> ${deleteResult.deletedCount}`); // Number of documents removed
    // build ids
    let ids = subCategories.map(doc => doc.id);
    ids.push(req.params.categoryId);
    let templateDel = await Template.deleteMany({categoryId : { $in: ids }} , {session: session});
    log.info(`Number of templates deleted --> ${templateDel.deletedCount}`); // Number of documents removed    
    await session.commitTransaction();
    res.status(204).send();
  }catch(err){
      log.error('Error, aborting transaction');
      await session.abortTransaction();
      log.error(`Error during category deletion :  ${err}`);
      res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
  }
};
