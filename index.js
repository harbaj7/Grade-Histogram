const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:123qweasd@localhost/users',
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

  app.use('/public',express.static('public'));
  app.use(express.static(path.join(__dirname, '/public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))

//Add Students---------------------------
app.post('/Add', (req,res) => {

  console.log("post request for /add");

  var fname = req.body.fname;
  var S_weight = req.body.S_weight;
  var S_height = req.body.S_height;
  var S_haircolor = req.body.S_haircolor;
  var S_gpa = req.body.S_gpa;
  var S_id = req.body.S_id;
  var LastName = req.body.LastName;
  
  var insertQuery = `INSERT INTO s_list VALUES ('${fname}',${S_weight},${S_height},'${S_haircolor}',${S_gpa},${S_id},'${LastName}')`;

  pool.query(insertQuery, (error,result) =>{

    if(error)
      res.render('pages/ADDerror');
    else

      res.render('pages/success',result);
  });
  
});

//EDIT-----------------------------------
//Search for ID to edit
app.post('/Edit_id', async (req,res) => {

  var S_id = req.body.S_id;
  
  var editSearch = `SELECT * FROM s_LIST WHERE S_id=${S_id}`;

  pool.query(editSearch, (error, result) => {
    if (error)
      res.render('pages/notFound');

    if (result.rowCount == 0)
      res.render('pages/notFound');
    
    else {
      var formInfo = {'rows':result.rows};
      res.render('pages/EditForm',formInfo);
    }
  });
});
//Search for LastName to Edit
app.post('/Edit_name', (req,res) => {

  var LastName = req.body.LastName;
  
  var editSearch = `SELECT * FROM s_LIST WHERE LastName='${LastName}'`;

  pool.query(editSearch, (error, result) => {
    if (error)
      res.render('pages/notFound'); 
    
    if (result.rowCount == 0)
      res.render('pages/notFound');   
    else {
      var formInfo = {'rows':result.rows};
      res.render('pages/EditForm',formInfo);
    }
  });
});
app.post('/EditComplete', (req,res) => {

  var fname = req.body.fname;
  var LastName = req.body.LastName;
  var S_weight = req.body.S_weight;
  var S_height = req.body.S_height;
  var S_haircolor = req.body.S_haircolor;
  var S_gpa = req.body.S_gpa;
  var S_id = req.body.S_id;
  
  var updateInfo = `UPDATE s_LIST set fname='${fname}', S_weight=${S_weight}, S_height=${S_height}, S_haircolor='${S_haircolor}', S_gpa=${S_gpa}, LastName='${LastName}' WHERE S_id=${S_id}`;

  pool.query(updateInfo, (error, result) => {
    if (error)
      res.render('pages/error');    
    else {
      res.render('pages/updateSuccess',result);
    }
  });
});

//DELETE-----------------------------------
//DELETE using Last Name
app.post('/deleteName', (req,res) => {

  var LastName = req.body.LastName;

  var deleteQuery = `DELETE FROM s_LIST WHERE LastName='${LastName}'`;
  

  pool.query(deleteQuery, (error,result) => {

    if (error)
      res.render('pages/Error');
          
    if (result.rowCount == 0)
      res.render('pages/notFound');
    
    else
      res.render('pages/deleted');
  });
});
//DELETE by ID
app.post('/deleteID', (req,res) => {

  var S_id = req.body.S_id;

  var deleteQuery = `DELETE FROM s_LIST WHERE S_id = ${S_id}`;

  pool.query(deleteQuery, (error,result) => {

    if (error)
      res.render('pages/Error');
          
    if (result.rowCount == 0)
      res.render('pages/notFound');
    
    else
      res.render('pages/deleted');
  });

});

// SEARCH----------------------------------
// search and display by Last Name
app.post('/search_name', (req,res) => {

  var LastName = req.body.LastName;
  
  var editSearch = `SELECT * FROM s_LIST WHERE LastName='${LastName}'`;

  pool.query(editSearch, (error, result) => {
    
    if (error)
      res.render('pages/Error'); 
    
    if (result.rows == 0)
      res.render('pages/notFound');
    
    else{
      var results = {'rows':result.rows};
      res.render('pages/db',results);
    }
  });
});
// search and display by id
app.post('/search_id', (req,res) => {

  var S_id = req.body.S_id;
  var searchQuery = `SELECT * FROM s_LIST WHERE S_id='${S_id}'`;

  pool.query(searchQuery, (error,result) => {
    
    if (error)
      res.render('pages/Error');
    if (result.rows == 0)
      res.render('pages/notFound');
    else{
      var results = {'rows':result.rows};
      res.render('pages/db',results);
    }
  });
});

// Display students------------------------------
app.get('/displayAll', (req,res) => {
  var getUsersQuery = `SELECT * FROM s_LIST`;
  pool.query(getUsersQuery, (error,result) => {
    if (error)
      res.render('pages/ADDerror');
    if (result.rows == 0)
      res.render('pages/Empty');
    var results = {'rows':result.rows};
    res.render('pages/db',results);
  });
});

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
