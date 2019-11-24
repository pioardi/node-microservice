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

  // check exists, do that before to start the session.
  try{
    let category = await Category.findById(req.params.categoryId);
    if(!category){
      res.status(404).send({err : 'Cannot delete a category that does not exist'});
      return;
    }
  }catch(err){
    log.error(`Error during category deletion :  ${err}`);
    res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
    return;
  }
  
  try {
    session = await db.startSession();
    log.info(`Starting transaction to delete the category ${req.params.categoryId}`);
    session.startTransaction();
    await Category.deleteOne({_id : req.params.categoryId }, { session: session });
    let subCategories = await Category.find({ anchestorIds : req.params.categoryId} , null , {session: session});
    let deleteResult = await Category.deleteMany({ anchestorIds : req.params.categoryId} , {session: session});
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
      log.error(`Error during category deletion :  ${err}`);
      await session.abortTransaction();
      res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
  }
};
