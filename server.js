const express = require('express')
const app = express()
const pool = require('./pggres_db')
const i_log = require('./valids/student')
const check_spk = require('./valids/s_valid_sign');
const bodyParser = require('body-parser');
const { result } = require('@hapi/joi/lib/base');

app.set('view engine', 'ejs')
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); //not using this will give empty req.body

//GET method to print and solve all students
app.get("/all_students",async (req, res) => {
    try{
        const allstd = await pool.query('SELECT * FROM pms2.student_info');

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startInd = (page-1)*limit;
        const endInd = (page)*limit;

        const results = {};

        if(endInd < allstd.rows.length){
            results.next = {
                page: page+1,
                limit: limit
            }
        }
        if(startInd > 0){
            results.prev = {
                page: page-1,
                limit:limit
            }
        }
        results.results = allstd.rows.slice(startInd, endInd);

        res.paginatedResults = results;

        res.status(200).render('admin/all_studs.ejs', {data: res.paginatedResults});
        //print
    }
    catch(err){
        console.error(err.message);
    }
});

//GET method to print and solve all Employee
app.get("/all_employees",async (req, res) => {
    try{
        const allstd = await pool.query('SELECT * FROM pms2.employee_info');

        const page = parseInt(req.query.page);//get value from url
        const limit = parseInt(req.query.limit);

        const startInd = (page-1)*limit;
        const endInd = (page)*limit;

        const results = {};

        if(endInd < allstd.rows.length){
            results.next = {
                page: page+1,
                limit: limit
            }
        }
        if(startInd > 0){
            results.prev = {
                page: page-1,
                limit:limit
            }
        }
        results.results = allstd.rows.slice(startInd, endInd);
        
        res.paginatedResults = results;

        res.status(200).render('admin/all_employees.ejs', {data: res.paginatedResults});
        //print
    }
    catch(err){
        console.error(err.message);
    }
});


//home page redirect
app.get('/', (req, res) => {
    res.status(301).redirect('/home')
});

//home page main link
app.get('/home', (req,res) => {
    res.status(200).render('home/home.ejs')
});

//student sign in done by admin
app.get('/s_signin_basic', (req,res) => {
    res.status(200).render('student/s_signin_basic.ejs')
});

//student sign in addrs by admin
app.get('/s_signin_address', (req, res) => {
    res.status(200).render('student/s_signin_address.ejs')
});

//instructor sign in basic done by admin
app.get('/i_signin_basic', (req,res) => {
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
app.get('/a_login', (req,res)=>{
    res.status(200).render('admin/a_login.ejs')
});

//admn login page post method
app.post('/a_login', (req,res) => {
    if(req.body.a_passwd == "admin"){
        res.status(304).redirect('/a_choice');
    }else{
        res.status(404).send("Wrong Pass");
    }
});

//admin choices to show
app.get('/a_choice', (req,res) => {
    res.status(200).render('admin/choice.ejs');
})

app.listen(5000);