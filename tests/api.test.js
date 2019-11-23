'use strict';

const assert = require('assert');
const request = require('supertest');
const expect = require('expect')
const api = require('../api/categories');

describe('RESTFul API Integration test', function() {
  describe('should create a category with a display name', function(){
    it('should create a category if input is valid', (done) =>  {
      request(api).post('/categories/')
                  .set('Accept', 'application/json')
                  .send({displayName : 'NumberOne'})
                  .expect(201)
                  .expect((res) => {
                    expect(res.body).toBeTruthy();                  
                  })
                  .end((err) => {
                    if (err)
                    done(err);
                    else
                    done();
                  });
    });

    it('should return an error if input is not valid , display name not present', (done) =>  {
      request(api).post('/categories/')
                  .set('Accept', 'application/json')
                  .send({})
                  .expect(400)
                  .expect((res) => {
                    expect(res.body).toBeTruthy();                  
                    expect(res.body.err).toMatch('Invalid input, please specify display name into your body request');
                  })
                  .end((err) => {
                    if (err)
                    done(err);
                    else
                    done();
                  });
    });
  });
});
