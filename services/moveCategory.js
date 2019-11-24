/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Create a category.
 */
'use strict';
const { db, Category } = require('../models');
const log = require('../loggers');
module.exports = async (req,res) => {
  //TODO you can use Promise.all here , to improve performance.
  let session;
  try {
    let body = req.body;
    if(!body.targetCategoryId){
        res.status(400).send({err : 'Please specify a category id where you want to move the category'});
    }
    session = await db.startSession();
    log.info(`Starting transaction to move the category ${req.params.categoryId}`);
    session.startTransaction();
    let targetCategory = await Category.findById(body.targetCategoryId);
    // you have to update the category with this ids
    let ids = targetCategory.parentIds;
    ids.push(targetCategory._id);
    let updatedCategory = await Category.findOneAndUpdate({_id : req.params.categoryId} , {parentIds : ids}, {useFindAndModify : false, new: true , session:session});
    // childs will need another id.
    ids.push(updatedCategory._id);
    await Category.updateMany({parentIds : { $in: req.params.categoryId }} , { parentIds : ids} , {session: session});
    await session.commitTransaction();
    res.status(200).send(updatedCategory);
  }catch(err){
      log.error('Error, aborting transaction');
      await session.abortTransaction();
      log.error(`Error during move category operation:  ${err}`);
      res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
  }
};