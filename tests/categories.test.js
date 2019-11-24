'use strict';
const request = require('supertest');
const expect = require('expect');
const api = require('../api/categories');
const {Category , Template} = require('../models');
const expectedErrorMessage = 'Invalid input, please specify display name into your body request';
const travelDestionation = 'Travel Destinations';
let mexico = 'Mexico';
let germany = 'Germany';
let beach = 'Beach';
let exclusiveName = 'Exclusive';
let acapulco = 'acapulco';
let munich = 'munich';
let loscabos = 'los cabos';
let lapaz = 'la paz';
let memo = 'la paz';


// I will create the category Travel Destinations (createId)
// and after I will create the categories Mexico,Germany under the Travel Destinations
let travelDestinationsId;
let mexicoId;
let germanyId;
let beachId;
let exclusiveId;
let losCabosId;
let lapazId;

  describe('API Integration test suite', function(){

    before((done) => {
      Category.deleteMany({displayName : { $in : [travelDestionation,mexico,germany,beach,exclusiveName]}})
              .then(() => {
                Template.deleteMany({displayName : { $in : [acapulco,munich,loscabos,lapaz]}}).then(() => done()).catch(err => done(err));
              })
              .catch(err => done(err));
    }); 

    it('should create the category Travel Destinarions if input is valid', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({displayName : travelDestionation})
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
                      expect(doc.displayName).toBe(travelDestionation);
                      done();
                    }).catch(err => done(err));               
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
                  .send({ displayName : mexico , parentIds : [travelDestinationsId]})
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
                      expect(doc.displayName).toBe(mexico);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should insert the category Germany under another one', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : germany , parentIds : [travelDestinationsId]})
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
                      expect(doc.displayName).toBe(germany);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template acapulco and put it under the Mexico category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : acapulco , categoryId : mexicoId})
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
                      expect(doc.displayName).toBe(acapulco);
                      done();
                    }).catch(err => done(err));               
                  });
    });

    
    it('should create the template munich and put it under the Germany category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : munich , categoryId : germanyId})
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
                      expect(doc.displayName).toBe(munich);
                      done();
                    }).catch(err => done(err));               
                  });
    });


    it('should insert the category beach under the category Germany', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : beach , parentIds : [germanyId , travelDestinationsId]})
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
                      expect(doc.displayName).toBe(beach);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template munich and put it under the Germany category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : loscabos , categoryId : beachId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    losCabosId = res.body.id;
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == beachId).toBeTruthy();
                      expect(doc.displayName).toBe(loscabos);
                      done();
                    }).catch(err => done(err));               
                  });
    });

    it('should insert the category Exclusive under the category beach', (done) =>  {
      request(api).post('/categories')
                  .set('Accept', 'application/json')
                  .send({ displayName : exclusiveName , parentIds : [beachId,germanyId,travelDestinationsId]})
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
                      expect(doc.displayName).toBe(exclusiveName);
                      done();
                    }).catch(error => {
                      done(error);
                    });
                  });
    });

    it('should create the template la paz  and put it under the Exclusive category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : lapaz , categoryId : exclusiveId})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    lapazId = res.body.id;
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeDefined();
                      expect(doc.categoryId == exclusiveId).toBeTruthy();
                      expect(doc.displayName).toBe(lapaz);
                      done();
                    }).catch(err => done(err));               
                  });
    });

    it('should move the category beach under the category Mexico', (done) =>  {
      request(api).put(`/categories/${beachId}`)
                  .set('Accept', 'application/json')
                  .send({targetCategoryId : mexicoId})
                  .expect(200)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body._id).toBeDefined();
                    Category.findById(beachId).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body._id);
                      expect(doc.parentIds).toBeDefined();
                      let parentIdsCheckOne = doc.parentIds.find(item => item == mexicoId);
                      expect(parentIdsCheckOne).toBeDefined();
                      let parentIdsCheckTwo = doc.parentIds.find(item => item == travelDestinationsId);
                      expect(parentIdsCheckTwo).toBeDefined();
                      expect(doc.displayName).toBe(beach);
                      Category.findById(exclusiveId).then(exclusive => {
                        expect(exclusive).toBeDefined();
                        expect(exclusive.parentIds).toBeDefined();
                        let parentIdsCheckOne = exclusive.parentIds.find(item => item == mexicoId);
                        expect(parentIdsCheckOne).toBeDefined();
                        let parentIdsCheckTwo = exclusive.parentIds.find(item => item == travelDestinationsId);
                        expect(parentIdsCheckTwo).toBeDefined();
                        let parentIdsCheckThree = exclusive.parentIds.find(item => item == beachId);
                        expect(parentIdsCheckThree).toBeDefined();
                        expect(exclusive.displayName).toBe(exclusiveName);
                        done();
                      }).catch(error => {
                          done(error);
                      });
                    }).catch(error => {
                      done(error);
                    });                              
                  });
    });


    it('should delete the category Beach', (done) =>  {
      request(api).delete(`/categories/${beachId}`)
                  .set('Accept', 'application/json')
                  .send({})
                  .expect(204)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    Promise.all([
                      Category.findById(beachId),
                      Category.findById(exclusiveId),
                      Template.findById(lapazId),
                      Template.findById(losCabosId)
                    ]).then(results => {
                       let beach = results[0];
                       let exclusive = results[1];
                       let lapaz = res[2];
                       let losCabos = res[3];
                       expect(beach).toBeFalsy();
                       expect(exclusive).toBeFalsy();
                       expect(losCabos).toBeFalsy();
                       expect(lapaz).toBeFalsy();
                       done();
                    }).catch(error => {
                      done(error);
                    });                              
                  });
    });

    it('should create the template memo without a category', (done) =>  {
      request(api).post('/templates')
                  .set('Accept', 'application/json')
                  .send({displayName : memo})
                  .expect(201)
                  .end((err,res) => {
                    if (err){
                      return done(err);
                    }
                    expect(res.body).toBeTruthy();
                    expect(res.body.id).toBeDefined();
                    losCabosId = res.body.id;
                    Template.findById(res.body.id).then(doc => {
                      expect(doc).toBeDefined();
                      expect(doc.id).toBe(res.body.id);
                      expect(doc.categoryId).toBeFalsy();
                      expect(doc.displayName).toBe(memo);
                      done();
                    });               
                  });
    });


  });