const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server');
const { v4: uuidv4 } = require('uuid');

const testEmail = uuidv4()
const testPass = uuidv4()
var agent = request.agent(server);


describe('Authentication Controller Testing', function() {
    describe('Unauthorized request to view the homepage', function() {

        it("should return status code 302 and redirect to login page (not authenticated)", function() {
            return agent
            .get('/')
            .expect(302)
            .expect('Location', '/login');
        });
    
    });
    
    describe('Registering', function() {
    
        it("should return status code 200", function() {
            return agent
            .get('/login')
            .expect(200);
        });
    
        it("should allow us to register and redirect us to /login", function() {
            return agent
            .post('/register')
            .type('form')
            .send({email: testEmail, password: testPass, name: 'test'})
            .expect(302)
            .expect('Location', '/login');
        });
    });
    
    describe('Authenticating', function() {
        it("should allow us to login with correct credentials and redirect to /", function() {
            return agent
            .post('/login')
            .type('form')
            .send({email: testEmail, password: testPass})
            .expect(302)
            .expect('Location', '/');
        });
    
        it("should not allow us to login with incorrect credentials + redirect to /login", function() {
            return agent
            .post('/login')
            .type('form')
            .send({email: 'victoryun1811@gmail.com', password: '123'})
            .expect(302)
            .expect('Location', '/login');
        })
    
        it("should redirect us to /login after logging out", function() {
            agent
            .post('/login')
            .type('form')
            .send({email: testEmail, password: testPass})
            .expect(302)
            .expect('Location', '/')
            
            return agent.get('/logout')
            .expect(302)
            .expect('Location', '/login');
        });
    });
});



