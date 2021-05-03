const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server');
const path = require("path");

const testEmail = 'test';
const testPass = 'test';
var agent = request.agent(server);

let postId;

describe('Posts Controller Testing', function() {

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

    describe('Features of index page', function() {
        it("should allow us to see the / page without redirecting when authenticated", function(done) {
            agent
            .get('/')
            .expect(200)
            done();
        });
    
        it("should have welcome us depending on our name", function(done) {
            agent
            .get('/')
            .then(function(response) {
                expect(response.text).to.contain('victor');
                done();
            })
        }).timeout(7500);
    
        it("should display the number of credits the user has", function(done) {
            agent
            .get('/')
            .then(function(response) {
                expect(response.text).to.contain('credits');
                done();
            });
        }).timeout(7500);
    
        it("should allow the user to upload a post", function(done) {
            agent
            .get('/')
            .then(function(response) {
                expect(response.text).to.contain('Upload Post');
                done();
            });
        }).timeout(7500);

    });

    describe('Uploading Posts (POST /posts)', function() {

        it("should render us to status view with success", function(done) {
            agent
            .post('/posts')
            .attach("post", path.resolve(__dirname, "test_img.png"))
            .field('caption', 'test image')
            .set('Accept', 'application/json')
            .then(function (response) {
                if (response.statusCode == 200) {
                    postId = response.body.postId;
                    done();
                }
            });
        }).timeout(7500);

    });

    describe('Delete Posts (POST /posts/delete)', function() {

        it("should delete the post successfully", function(done) {
            agent
            .post('/posts/delete')
            .send({postId: postId})
            .then(function (response) {
                if (response.statusCode == 200) {
                    done();
                }
            });
        });

    });

});