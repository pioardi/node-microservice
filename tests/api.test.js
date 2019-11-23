'use strict';
const assert = require('assert');
const request = require('supertest');
const expect = require('expect')
const api = require('../api/categories');
const {Category} = require('../models');
const expectedErrorMessage = 'Invalid input, please specify display name into your body request';
const expectedDisplayName = 'Travel Destinations';
let expectedDisplayNameForChildOne = 'Mexico';
let expectedDisplayNameForChildTwo = 'Germany';
// I will create the category Travel Destinations (createId)
// and after I will create the categories Mexico,Germany under the Travel Destinations
let createdId;

  describe('/categories POST - should create a category with a display name', function(){

    before((done) => {
        Category.deleteMany({displayName : { $in : [expectedDisplayName,expectedDisplayNameForChildOne,expectedDisplayNameForChildTwo]}}).then(response => done()).catch((err) => done(err));
    }); 

    it('should create a category if input is valid', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({displayName : expectedDisplayName})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    createdId = res.body.id;
                    Category.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.displayName).toBe(expectedDisplayName);
                      done();
                    });               
                  });
    });

    it('should return an error if input is not valid , display name not present', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({})
                  .expect(400)
                  .expect((res) => {
                    expect(res.body).toBeTruthy(); 
                    expect(res.body.err).toMatch(expectedErrorMessage);
                  })
                  .end((err) => {
                    if (err)
                    done(err);
                    else
                    done();
                  });
    });

    it('should return an error if input is not valid , display name not present', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send(null)
                  .expect(400)
                  .expect((res) => {
                    expect(res.body).toBeTruthy();                                     
                    expect(res.body.err).toMatch(expectedErrorMessage);
                  })
                  .end((err) => {
                    if (err)
                    done(err);
                    else
                    done();
                  });
    });

    it('should insert the category Mexico under another one', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : expectedDisplayNameForChildOne , parentIds : [createdId]})
                  .expect(201)
                  .end((err,res) => {
                    if(err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();  
                    expect(res.body.id).toBeDefined();
                    Category.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.parentIds).toBeDefined();
                      let parentIdsCheck = doc.parentIds.find(item => item == createdId);
                      expect(parentIdsCheck).toBeDefined();
                      expect(doc.displayName).toBe(expectedDisplayNameForChildOne);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });
  });
