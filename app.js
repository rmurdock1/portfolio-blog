var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();
var PORT = process.env.PORT || 8000;

//DB Connection string
// const config = {
//   user: 'postgres',
//   database: 'blog',
//   password: '',
//   port:5432
// };
const config = process.env.DATABASE_URL;

const pool = new pg.Pool(config)
//var connect = "postgres://rashard:user@localhost/blog";

//Assiging Dust Engine to .dust files
app.engine('dust',cons.dust);

//Set default Ext .dust (similar to pug)
app.set('view engine', 'dust');
app.set('views',__dirname + '/views');

//Set Public Folder
//app.use('/portfolio', routes);
app.use(express.static('./public'));
app.use(express.static('./views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//Route
app.get('/', function(req,res){
  //PG connect
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error Fetching Client from pool' + err);
    }
    client.query('SELECT * FROM blogpost', function(err, result) {
      if(err){
        return console.error('error running query', err);
      }
      res.render('index', {blogpost: result.rows}); //This will take data from the database rows and display on the index page
      done();
    }); //end query
  }); // end connection
}); //end app.get

app.post('/add', function(req,res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error Fetching Client from pool' + err);
    }
    client.query('INSERT INTO blogpost(title, post, source) VALUES($1, $2, $3)',
      [req.body.title, req.body.post, req.body.source]);

      done();
      res.redirect('/')
  }); // end connection
});

app.delete('/delete/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error Fetching Client from pool' + err);
    }
    client.query('DELETE FROM blogpost WHERE id = $1',
      [req.params.id]);

      done();
      res.send(200);
  });
});

app.post('/edit', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error Fetching Client from pool' + err);
    }
    client.query('UPDATE blogpost SET title=$1, post=$2, source=$3 WHERE id=$4',
      [req.body.title, req.body.post, req.body.source, req.body.id]);

      done();
      res.redirect('/');
  });
});

//Heroku setup
//Server call
app.listen(PORT, function(){
  console.log("Listening on PORT " + PORT);
});
