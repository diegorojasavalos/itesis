'use strict';
const config = require("../config/config.json");
const dblink = config.link;
const mongojs = require("mongojs");
const db = mongojs(dblink, ['itesis']);
const server = require("../app");

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('/POST login', () => {
    it('Se deberia tener la respuesta de un usuario valido de la bd ', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                cod:"12345673",
                pwd:"quintana"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.cod.should.be.eql(1);
                done();
            });
    });
});