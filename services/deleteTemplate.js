/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Delete a template.
 */
'use strict';
const { Template } = require('../models');
const log = require('../loggers');
module.exports = async (req,res) => {
    try{
        let deleted = await Template.deleteOne({_id : req.params.templateId});
        if(deleted.deletedCount > 0){
            res.status(204).send();
        }else{
            res.status(404).send({err : 'Cannot delete a template that does not exist'});
        }
    }catch(err){
        log.error(`Error during template deletion :  ${err}`);
        res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
    }
};