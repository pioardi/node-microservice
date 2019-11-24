/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Move a category
 */
'use strict';
const { Template } = require('../models');
const log = require('../loggers');
module.exports = async (req,res) => {
    try{
        let body = req.body;
        if(!body.targetCategoryId){
            res.status(400).send({err : 'Please specify a category id where you want to move the template'});
        }
        let updatedTemplate = await Template.findOneAndUpdate({_id : req.params.templateId} , {categoryId : body.targetCategoryId}, {new: true, useFindAndModify: false});
        res.status(200).send({updatedTemplate});
    }catch(err){
        log.error(`Error moving a template :  ${err}`);
        res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
    }
};