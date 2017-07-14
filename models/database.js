const pg = require('pg');
//const connectionString = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/skywalker';
pg.defaults.ssl = true;
//const Sequelize = require('sequelize');
//const sequelize = new Sequelize('postgres://...');
const connectionString = 'postgres://sswxmywwgxzcey:16fad1bea25d4ff354cbbde0c3aba4fb53dbc0355ebc160be436c5f2a7df28a1@ec2-107-21-113-16.compute-1.amazonaws.com:5432/d4kim9eudirduk';

var getData = function(qry, array_data, callback) {
    var results = [];
    console.log(qry);
    console.log(array_data);
    console.log('----------------------------------------');
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done();
            console.log(err);
            callback(false);
        }
        const query = client.query(qry, array_data);
        query.on('row', (row) => {
            results.push(row);
        });
        query.on('end', () => {
            done();
            callback(results);
        });
    });
}

var insertData = function(qry, array_data, callback) {
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            callback(false);
        }
        client.query(qry, array_data,function(err,result){
            callback(true);      
        });
    });
}

var updateData = function(qry, array_data, callback) {
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            callback(false);
        }
        client.query(qry, array_data,function(err,result){
            callback(true);
        });        
    });
}

var deleteData = function(qry, array_data, callback) {
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            callback(false);
        }
        client.query(qry, array_data,function(err,result){
            callback(true);
        });    
    });
}

exports.getData = getData;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteData = deleteData;