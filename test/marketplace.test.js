const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server');

const testEmail = 'test';
const testPass = 'test';
var agent = request.agent(server);


describe('Marketplace Testing', function() {

    beforeEach(function(done) {
        agent
        .post('/login')
        .type('form')
        .send({email: testEmail, password: testPass})
        .end(function(err, res) {
            if (expect(res.statusCode).to.equal(302)) {
                return done();
            }
        });
    });


    it("should buy the post after hitting the endpoint", function() {
        agent
        .post('/buy')
        .type('form')
        .send({postId: 'test'});
    });

});