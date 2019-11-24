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
        await Template.deleteOne({_id : req.params.templateId});
        res.status(204).send();
    }catch(err){
        log.error(`Error during template deletion :  ${err}`);
        res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});
    }
};