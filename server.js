const express = require('express')
const moment = require('moment')
const app = express()
const pool = require('./pggres_db')
const i_log = require('./valids/student')
const check_spk = require('./valids/s_valid_sign');
const bodyParser = require('body-parser');
const { result } = require('@hapi/joi/lib/base');

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); //not using this will give empty req.body

//GET method to print and solve all students
app.get("/all_students", async (req, res) => {
    try {
        const allstd = await pool.query('SELECT * FROM pms2.student_info');

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startInd = (page - 1) * limit;
        const endInd = (page) * limit;

        const results = {};

        if (endInd < allstd.rows.length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startInd > 0) {
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }
        results.results = allstd.rows.slice(startInd, endInd);

        res.paginatedResults = results;

        res.status(200).render('admin/all_studs.ejs', { data: res.paginatedResults });
        //print
    }
    catch (err) {
        console.error(err.message);
    }
});

//GET method to print and solve all Employee
app.get("/all_employees", async (req, res) => {
    try {
        const allstd = await pool.query('SELECT * FROM pms2.employee_info');

        const page = parseInt(req.query.page);//get value from url
        const limit = parseInt(req.query.limit);

        const startInd = (page - 1) * limit;
        const endInd = (page) * limit;

        const results = {};

        if (endInd < allstd.rows.length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startInd > 0) {
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }
        results.results = allstd.rows.slice(startInd, endInd);

        res.paginatedResults = results;

        res.status(200).render('admin/all_employees.ejs', { data: res.paginatedResults });
        //print
    }
    catch (err) {
        console.error(err.message);
    }
});


//home page redirect
app.get('/', (req, res) => {
    res.status(301).redirect('/home')
});

//home page main link
app.get('/home', (req, res) => {
    res.status(200).render('home/home.ejs')
});

//student sign in done by admin
app.get('/s_signin_basic', (req, res) => {
    res.status(200).render('student/s_signin_basic.ejs')
});

//student sign in addrs by admin
app.get('/s_signin_address', (req, res) => {
    res.status(200).render('student/s_signin_address.ejs')
});

//instructor sign in basic done by admin
app.get('/i_signin_basic', (req, res) => {
    res.status(200).render('instructor/i_signin_basic.ejs')
});

//instrictor sign in addrs done by admin
app.get('/i_signin_address', (req, res) => {
    res.status(200).render('instructor/i_signin_address.ejs')
});

//after log out home screen
app.get('/login', (req, res) => {
    res.status(301).redirect('/home')
});

//instructor login page
app.get('/i_login', (req, res) => {
    res.status(200).render('instructor/i_login.ejs')
});

//student log in page
app.get('/s_login', (req, res) => {
    res.status(200).render('student/s_login.ejs')
});

//admin login page
app.get('/a_login', (req, res) => {
    res.status(200).render('admin/a_login.ejs')
});

//admn login page post method
app.post('/a_login', (req, res) => {
    console.log(req.body);
    if (req.body.a_passwd == "admin") {
        res.status(304).redirect('/a_choice');
    } else {
        res.status(404).send("Wrong Pass");
    }
});

//admin choices to show
app.get('/a_choice', (req, res) => {
    res.status(200).render('admin/choice.ejs');
});

//instructor login
app.post('/i_login', async (req, res) => {
    try {
        const allstd = await pool.query(`SELECT * FROM pms2.employee_info WHERE employee_id = ${req.body.i_id}`);

        if (allstd.rows.length > 0) {
            allstd.rows[0].joining_date = (allstd.rows[0].joining_date).toISOString().slice(0,10);
            allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
            if (req.body.i_passwd == allstd.rows[0].employee_login_password) {
                res.status(200).render('instructor/i_info.ejs', {data: allstd.rows[0]});
            } else {
                res.status(404).send("Wrong Pass");
            }
        } else {
            res.status(404).send("User ID not found");
        }
    } catch (err) {
        console.error(err.message);
    }
});

//edit employee for employee
app.get('/i_edit',async (req, res) => {
    try {
        const allstd = await pool.query(`SELECT * FROM pms2.employee_info WHERE employee_id = ${req.query.id}`);

        if (allstd.rows.length > 0) {
            allstd.rows[0].joining_date = (allstd.rows[0].joining_date).toISOString().slice(0,10);
            allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
            res.status(200).render('instructor/i_edit.ejs', {data: allstd.rows[0]});
        }else {
            res.status(404).send("User ID not found");
        }
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/i_edit', async(req,res) => {
    try {
        console.log(req.body);
        const qury = `UPDATE pms2.employee_info 
        SET employee_email = $1, 
        street = $2, 
        city = $3, 
        pincode=$4 
        WHERE employee_id=$5`;
        await pool.query(qury, [req.body.email, req.body.street, req.body.city, req.body.pincode, req.body.id]);
        const allstd = await pool.query(`SELECT * FROM pms2.employee_info WHERE employee_id=${req.body.id}`);
        allstd.rows[0].joining_date = (allstd.rows[0].joining_date).toISOString().slice(0,10);
        allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
        res.status(200).render('instructor/i_info.ejs', {data: allstd.rows[0]});
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000);