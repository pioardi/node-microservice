/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview This contain mongoose models
 */
'use strict';
const mongoose = require('mongoose');
const log = require('../loggers');
// object destructuring
const { dataSourceConnectionString } = require('../config');
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(dataSourceConnectionString, { useNewUrlParser: true , useUnifiedTopology: true})
        .then(res => {
           log.info('Success connection with MONGO DB '); 
        })
        .catch(err => {
           log.error(`Error during connection with mongo db`);
        });
        

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
    displayName: String
});

const CategorySchema = new Schema({
    // TODO display name should be unique ?!
    displayName : String,
    parentIds : [ObjectId],
    templates: [String]
});


const Category = mongoose.model('Category', CategorySchema);
const Template = mongoose.model('Template', TemplateSchema);

module.exports = {
  Category: Category,
  Template: Template
};
