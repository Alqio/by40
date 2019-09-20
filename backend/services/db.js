const { Pool } = require('pg');
const pool = new Pool();
const db = module.exports = {};
//Create db by
// su postgres
// createdb <dbname>
// psql
// grant all privileges on database <dbname> to <username> ;

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

db.signupIntoParams = (signupObj) => {
    return [
        signupObj.name,
        signupObj.email,
        signupObj.start_year,
        signupObj.student,
        signupObj.no_alcohol,
        signupObj.sillis,
        signupObj.invited,
        signupObj.avec || '',
        signupObj.food_requirements || '',
        signupObj.table_group || '',
        signupObj.representative_of || '',
        signupObj.support || false,
        signupObj.dish || '',
    ];
};

db.getSignupDetails = async (signupId) => {
  const { rows } = await pool.query('SELECT * FROM signups WHERE id=$1', [signupId]);
  return rows[0];
}

getInvitedParticipants = async () => {
  const { rows } = await pool.query('SELECT * FROM signups WHERE invited=true');
  return rows;
};

getNormalParticipants = async () => {
  const { rows } = await pool.query('SELECT * FROM signups WHERE invited=false');
  return rows;
};

db.getAllParticipants = async () => {
  const normal = pool.query('SELECT name, table_group, created FROM signups WHERE invited=false');
  const invited = pool.query('SELECT name, table_group, created FROM signups WHERE invited=true');
  const r1 = await normal;
  const r2 = await invited;
  const rows = {
    normal: r1.rows,
    invited: r2.rows,
  }
console.log(rows);
  return rows;
};

db.signup = async (signupObj) => {
  const params = db.signupIntoParams(signupObj);
  const { rows } = await pool.query('insert into signups (name, email, start_year, student, no_alcohol, sillis, invited, avec, food_requirements, table_group, representative_of, support, dish) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning id', params);
  return rows[0].id;
};

db.deleteSignup = async (signup_id) => {
    return await pool.query('delete from signups where id=$1', [signup_id]);
};

db.updateSignup = async (signupId, signupObj) => {
    let params = db.signupIntoParams(signupObj);
    params.unshift(signupId);
    console.log(params);
    return await pool.query('update signups set name=$2, email=$3, start_year=$4, student=$5, no_alcohol=$6, sillis=$7, invited=$8, avec=$9, food_requirements=$10, table_group=$11, representative_of=$12, support=$13 , dish=$14 where id=$1', params);
};

db.terminate = async () => {
  await pool.end();
};
