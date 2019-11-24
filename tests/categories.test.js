'use strict';
const assert = require('assert');
const request = require('supertest');
const expect = require('expect')
const api = require('../api/categories');
const {Category , Template} = require('../models');
const expectedErrorMessage = 'Invalid input, please specify display name into your body request';
const expectedDisplayName = 'Travel Destinations';
let expectedDisplayNameForChildOne = 'Mexico';
let expectedDisplayNameForChildTwo = 'Germany';
let expectedDisplayNameForChildThree = 'Beach';
let expectedDisplayNameForChildFour = 'Exclusive';
let expectedTemplateNameOne = 'acapulco';
let expectedTemplateNameTwo = 'munich';
let expectedTemplateNameThree = 'los cabos';
let expectedTemplateNameFour = 'la paz';


// I will create the category Travel Destinations (createId)
// and after I will create the categories Mexico,Germany under the Travel Destinations
let travelDestinationsId;
let mexicoId;
let germanyId;
let beachId;
let exclusiveId;

  describe('API Integration test suite', function(){

    before((done) => {
      Category.deleteMany({displayName : { $in : [expectedDisplayName,expectedDisplayNameForChildOne,expectedDisplayNameForChildTwo,expectedDisplayNameForChildThree,expectedDisplayNameForChildFour]}})
              .then(res => {
                Template.deleteMany({displayName : { $in : [expectedTemplateNameOne,expectedTemplateNameTwo,expectedTemplateNameThree,expectedTemplateNameFour]}}).then(res => done()).catch(e => done(err));
              })
              .catch(err => done(err));
    }); 

    it('should create the category Travel Destinarions if input is valid', (done) =>  {
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
                    travelDestinationsId = res.body.id;
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
                  .send({ displayName : expectedDisplayNameForChildOne , parentIds : [travelDestinationsId]})
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
                      mexicoId = doc.id;
                      let parentIdsCheck = doc.parentIds.find(item => item == travelDestinationsId);
                      expect(parentIdsCheck).toBeDefined();
                      expect(doc.displayName).toBe(expectedDisplayNameForChildOne);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should insert the category Germany under another one', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : expectedDisplayNameForChildTwo , parentIds : [travelDestinationsId]})
                  .expect(201)
                  .end((err,res) => {
                    if(err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();  
                    expect(res.body.id).toBeDefined();
                    germanyId = res.body.id;
                    Category.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.parentIds).toBeDefined();
                      let parentIdsCheck = doc.parentIds.find(item => item == travelDestinationsId);
                      expect(parentIdsCheck).toBeDefined();
                      expect(doc.displayName).toBe(expectedDisplayNameForChildTwo);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template acapulco and put it under the Mexico category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : expectedTemplateNameOne , categoryId : mexicoId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == mexicoId).toBeTruthy();
                      expect(doc.displayName).toBe(expectedTemplateNameOne);
                      done();
                    });               
                  });
    });

    
    it('should create the template munich and put it under the Germany category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : expectedTemplateNameTwo , categoryId : germanyId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == germanyId).toBeTruthy();
                      expect(doc.displayName).toBe(expectedTemplateNameTwo);
                      done();
                    });               
                  });
    });


    it('should insert the category beach under the category Germany', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : expectedDisplayNameForChildThree , parentIds : [germanyId , travelDestinationsId]})
                  .expect(201)
                  .end((err,res) => { 
                    if(err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();  
                    expect(res.body.id).toBeDefined();
                    beachId = res.body.id;
                    Category.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.parentIds).toBeDefined();
                      let parentIdsCheck = doc.parentIds.find(item => item == germanyId);
                      expect(parentIdsCheck).toBeDefined();
                      expect(doc.displayName).toBe(expectedDisplayNameForChildThree);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template munich and put it under the Germany category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : expectedTemplateNameThree , categoryId : beachId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == beachId).toBeTruthy();
                      expect(doc.displayName).toBe(expectedTemplateNameThree);
                      done();
                    });               
                  });
    });

    it('should insert the category Exclusive under the category beach', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : expectedDisplayNameForChildFour , parentIds : [beachId,germanyId,travelDestinationsId]})
                  .expect(201)
                  .end((err,res) => { 
                    if(err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();  
                    expect(res.body.id).toBeDefined();
                    exclusiveId = res.body.id;
                    Category.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.parentIds).toBeDefined();
                      let parentIdsCheck = doc.parentIds.find(item => item == beachId);
                      expect(parentIdsCheck).toBeDefined();
                      expect(doc.displayName).toBe(expectedDisplayNameForChildFour);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template la paz  and put it under the Exclusive category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : expectedTemplateNameFour , categoryId : exclusiveId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == exclusiveId).toBeTruthy();
                      expect(doc.displayName).toBe(expectedTemplateNameFour);
                      done();
                    });               
                  });
    });

  });