const express = require('express');
const router = express.Router();
var db = require('../models/database');

router.get('/tasks', function(req, res) {
    var query = '';
    var array_data = [req.query.id];
    if (req.query.permission.trim() == 'admin') {
        if(req.query.Type == 'UniqueTask'){
            query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo where userid = $1 or userid != $1 group by userid,tasks,"startDate" '
        } else {
            query = 'select * from taskinfo where userid = $1 or userid != $1';
        }
    } else {
        if(req.query.Type == 'UniqueTask'){
            query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate" FROM public.taskinfo where userid = $1 group by userid,"startDate",tasks  limit 100'
        } else {
            query = 'select * from taskinfo where userid = $1 limit 100';
        }
    }
    try {
        db.getData(query, array_data, function(result) {
            res.send(result);
        });
    } catch (ex) {
        console.log(ex);
        res.send();
    }
});

router.post('/tasks', function(req, res) {
    //var query = 'insert into taskinfo values($1,$2,$3,$4,$5,$6)';
    var query = 'insert into taskinfo values($1,$2,$3,$4)';
    console.log(req.body);
    req.body.task = JSON.parse(req.body.task);
    console.log(req.body.task);
    var array_data = [req.body.id, req.body.task.tasks, req.body.task.startDate, req.body.task.seconds];
    try {
        db.insertData(query, array_data, function(result) {
            if (req.body.permission.trim() == 'admin') {
                if(req.body.Type == 'UniqueTask'){
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo group by userid,tasks,"startDate" '
                } else {
                    query = 'select * from taskinfo where userid = $1 and userid != $1';
                }
            } else {
                if(req.body.Type == 'UniqueTask'){
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo where userid = $1 group by userid,tasks,"startDate"   limit 100'
                } else {
                    query = 'select * from taskinfo where userid = $1 limit 100';
                }
            }
            array_data = [req.body.id];
            if (result) {
                db.getData(query, array_data, function(result) {
                    //  console.log(result);
                    res.send(result);
                });
            }

        });
    } catch (ex) {
        console.log(ex);
        res.send();
    }
});

router.put('/tasks', function(req, res) {
    var query = 'update taskinfo set tasks = $2 where id = $1  ';
    var array_data = [req.body.id, req.body.tasks];
    if(req.body.Type == 'UniqueTask'){
        var query = 'update taskinfo set tasks = $3 where tasks = $2 and userid=$1';
        array_data = [req.body.userid, req.body.pTask,req.body.uTask];
    }
    console.log(query);
    try {
        db.updateData(query, array_data, function(result) {
            if (req.body.permission.trim() == 'admin') {
                if(req.body.Type == 'UniqueTask'){
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo group by userid,tasks,"startDate" ';
                } else {
                    query = 'select * from taskinfo where userid = $1 and userid != $1';
                }
            } else {
                if(req.body.Type == 'UniqueTask'){
                    console.log('asdasd')
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo where userid = $1 group by userid,tasks,"startDate"   limit 100';
                } else {
                    query = 'select * from taskinfo where userid = $1 limit 100';
                }
            }
            array_data = [req.body.userid];
            console.log(req.body.Type);
            console.log('with');
            console.log(array_data,query);
            console.log('Over');

            if (result) {
                db.getData(query, array_data, function(result) {
                    res.send(result);
                });
            }
        });
    } catch (ex) {
        console.log(ex);
        res.send();
    }
});

router.delete('/tasks', function(req, res) {
    var query = 'delete from taskinfo where id = $1 ';
    var array_data = [req.body.id];
    if(req.body.Type == 'UniqueTask'){
        array_data = [req.body.id,req.body.userid];
        var query = 'delete from taskinfo where tasks = $1 and userid= $2';
    }
    console.log(array_data);
    try {
        db.deleteData(query, array_data, function(result) {
            if (req.body.permission.trim() == 'admin') {
                if(req.body.Type == 'UniqueTask'){
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo group by userid,tasks,"startDate" '
                } else {
                    query = 'select * from taskinfo where userid = $1 and userid != $1';
                }
            } else {
                if(req.body.Type == 'UniqueTask'){
                    query = 'SELECT userid,tasks,sum(seconds) as seconds,"startDate"  FROM public.taskinfo where userid = $1 group by userid,tasks,"startDate"   limit 100'
                } else {
                    query = 'select * from taskinfo where userid = $1 limit 100';
                }
            }
            array_data = [req.body.userid];
            if (result) {
                db.getData(query, array_data, function(result) {
                    res.send(result);
                });
            }
        });
    } catch (ex) {
        console.log(ex);
        res.send();
    }
});

module.exports = router;