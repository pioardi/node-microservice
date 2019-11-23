/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview This contain mongoose models
 */
'use strict';
const mongoose = require('mongoose');
const log = require('../loggers');
mongoose.set('useCreateIndex', true);
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
    displayName : {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
});

const CategorySchema = new Schema({
    // TODO display name should be unique ?!
    displayName : {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    parentIds : {
      type : [ObjectId],
      ref : 'Category',
      validate: {
        validator: async input => {
          if (input.length > 0) {
            let exists = await Category.findById(input);
            log.info(exists);
            return exists;
          } else {
            return true;
          }
        },
        message: 'Parent id does not exist'
      }
    },
    templateIds: {
      type : [ObjectId],
      ref : 'Template'

    }
});


const Category = mongoose.model('Category', CategorySchema);
const Template = mongoose.model('Template', TemplateSchema);


module.exports = {
  Category: Category,
  Template: Template
};
