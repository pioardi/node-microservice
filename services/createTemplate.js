/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Create a category.
 */
'use strict';
const {Template} = require('../models');
const log = require('../loggers');

module.exports = async (req,res) => {
    let template = req.body;
    if(!template.displayName){
        res.status(400).send({err : 'Invalid input, please specify display name into your body request'});
    }else{
        let templateToAdd = new Template(req.body);
        try{
            let created  = await templateToAdd.save();
            res.status(201).send({id : created._id});                     
        }catch(err){
            log.error(`Error during template creation :  ${err}`);
            res.status(500).send({err : err.errmsg || err.message || 'Internal server error'});  
        }
    }
};