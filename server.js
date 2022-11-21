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

app.post('/delete_employee', async (req, res)=>{
    try {
        console.log(req.body);
        const qury = `DELETE FROM pms2.employee_info WHERE employee_id = $1`;
        await pool.query(qury, [req.body.id]);
        await pool.query(`DELETE FROM pms2.employee_phoneno WHERE employee_id=${req.body.id}`);
        res.status(304).redirect('/home');
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/i_signin', async(req,res) => {
    try {
        var len1 = await pool.query(`SELECT max(employee_id) FROM pms2.employee_info;`)
        len1 = parseInt(len1.rows[0].max);
        const qury = `INSERT INTO pms2.employee_info(employee_id, employee_fname, employee_mname, employee_lname, employee_email, employee_login_password, joining_date, salary, date_of_birth, street, city, pincode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
        await pool.query(`INSERT INTO pms2.employee_info VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`, [len1+parseInt(1), req.body.fname, req.body.mname, req.body.lname, req.body.email, req.body.passwd, req.body.jd, req.body.salary, req.body.dob, req.body.street, req.body.city, req.body.pin])
        await pool.query(`INSERT INTO pms2.employee_phoneno VALUES($1, $2);`,[len1+1, req.body.phone]);
        res.status(304).redirect('/home');
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/s_signin', async(req,res) => {
    try {
        var len1 = await pool.query(`SELECT max(student_id) FROM pms2.student_info;`)
        len1 = parseInt(len1.rows[0].max);
        const qury = `INSERT INTO pms2.student_info VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);`;
        await pool.query(qury, [len1+parseInt(1), req.body.fname, req.body.mname, req.body.lname, req.body.email, req.body.passwd, req.body.cpi, req.body.weight, req.body.height, req.body.dob, req.body.street, req.body.city, req.body.pin]);
        //await pool.query(`INSERT INTO pms2.student_phoneno VALUES($1, $2);`,[len1+parseInt(1), req.body.phone]);
        res.status(304).redirect('/home');
    } catch (err) {
        console.error(err.message);
    }
});

//student login 

//student login
app.post('/s_login', async (req, res) => {
    try {
        const allstd = await pool.query(`SELECT * FROM pms2.student_info WHERE student_id = ${req.body.s_id}`);

        if (allstd.rows.length > 0) {
            allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
            if (req.body.s_passwd == allstd.rows[0].student_login_password) {
                res.status(200).render('student/s_info.ejs', {data: allstd.rows[0]});
            } else {
                res.status(404).send("Wrong Pass");
            }
        } else {
            res.status(404).send("User ID not found");
        }
    } catch (err) {
        console.error(err.message);
    }
});//done

//edit student for student
app.get('/s_edit',async (req, res) => {
    try {
        const allstd = await pool.query(`SELECT * FROM pms2.student_info WHERE student_id = ${req.query.id}`);
        console.log(1);
        console.log(allstd.rows);
        console.log(2);

        if (allstd.rows.length > 0) {
            allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
            res.status(200).render('student/s_edit.ejs', {data: allstd.rows[0]});
        }else {
            res.status(404).send("User ID not found");
        }
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/s_edit', async(req,res) => {
    try {
        const qury = `UPDATE pms2.Student_info 
        SET student_email = $1, 
        street = $2, 
        city = $3, 
        pincode=$4 
        WHERE student_id=$5`;
        await pool.query(qury, [req.body.email, req.body.street, req.body.city, req.body.pincode, req.body.id]);
        const allstd = await pool.query(`SELECT * FROM pms2.student_info WHERE student_id=${req.body.id}`);
        allstd.rows[0].date_of_birth = (allstd.rows[0].date_of_birth).toISOString().slice(0,10);
        res.status(200).render('student/s_info.ejs', {data: allstd.rows[0]});
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/delete_student', async (req, res)=>{
    try {
        console.log(req.body);
        const qury = `DELETE FROM pms2.student_info WHERE student_id = $1`;
        await pool.query(qury, [req.body.id]);
        await pool.query(`DELETE FROM pms2.student_phoneno WHERE student_id=${req.body.id}`);
        res.status(304).redirect('/home');
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(5000);