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
mongoose.connect(dataSourceConnectionString, { useNewUrlParser: true , useUnifiedTopology: true , dbName: 'xaratest'})
        .then(() => {
           log.info('Success connection with MONGO DB '); 
        })
        .catch(err => {
           log.error(`Error during connection with mongo db : ${err}`);
        });
        

const Schema = mongoose.Schema;

// Validators ------


// Validators End ------

const TemplateSchema = new Schema({
    displayName : {
      type: String,
      required: true,
      trim: true
    },
    categoryId : {
      type : ObjectId,
      ref : 'Category',
      validate: {
        validator: async input => {
          if (input) {
            let exists = await Category.findById(input);
            return exists;
          } else {
            return true;
          }
        },
        message: 'Parent id does not exist'
      }    
    }
});

const CategorySchema = new Schema({
    // TODO display name should be unique ?!
    displayName : {
      type: String,
      required: true,
      //index: {unique: true},
      trim: true
    },
    parentIds : {
      type : [ObjectId],
      ref : 'Category',
      validate: {
        validator: async input => {
          if (input.length > 0) {
            // FIXME , deal with multiple ids in input.
            let exists = await Category.findById(input);
            return exists;
          } else {
            return true;
          }
        },
        message: 'Parent id does not exist'
      },
      index : true
    }
});


const Category = mongoose.model('Category', CategorySchema);
const Template = mongoose.model('Template', TemplateSchema);

process.on('exit', function (){
  log.info('Closing mongo db connection');
  mongoose.disconnect();
});
module.exports = {
  Category: Category,
  Template: Template,
  db : mongoose
};
