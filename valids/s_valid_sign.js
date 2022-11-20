const pool = require('../pggres_db')

const check_spka = (data) => {
    const cnt = pool.query(`SELECT COUNT(*) FROM pms2.student_info WHERE student_id = $1`,[data.student_id]);
    console.log(cnt);
};

module.exports.check_spk = check_spka;