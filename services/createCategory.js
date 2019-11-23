/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview Create a category.
 */
'use strict';
const {Category} = require('../models');
const log = require('../loggers');

module.exports = (req,res) => {
    let category = req.body;
    if(!category.displayName){
        res.status(400).send({err : 'Invalid input, please specify display name into your body request'});
    }else{
        let categoryToAdd = new Category(req.body);
        categoryToAdd.save()
                     .then(created => {
                        res.status(201).send({id : created._id});
                     }).catch(err => {
                        log.error(`Error during category creation :  ${err}`);
                        res.status(500).send({err : 'Internal Server Error'});    
                     });
    }
};