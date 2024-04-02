var express = require('express');

var PORT;
var Cloudant = require('@cloudant/cloudant');


if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 8000;
}
var Cloudant = require('@cloudant/cloudant');
var url = "https://apikey-v2-2e5kdlgplmovp6jb5xfuok6afjra827zegiyhiw2ul1u:d32ec5f34b80eec562777356d8d80d1b@b9884815-a388-4e5e-8d1d-784e73de0044-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-2e5kdlgplmovp6jb5xfuok6afjra827zegiyhiw2ul1u";
var password = "d32ec5f34b80eec562777356d8d80d1b";
var app = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
//app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/////////////
app.get('/', function (req, res) {
  res.send("Welcome to cloudant database on IBM Cloud");
});



//////////
app.get('/list_of_databases', function (req, res) {
  
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ...
  
  // Lists all the databases.
  cloudant.db.list().then((body) => {
res.send(body);
  }).catch((err) => { res.send(err); });
});
});

///////////////  create database
app.post('/create-database', (req, res) => {
var name=req.body.name;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ...

cloudant.db.create(name, (err) => {
  if (err) {
    res.send(err);
  } else {
res.send("database created")
    
  }
});
});
});    




////////////// insert single document
app.post('/insert-document', function (req, res) {
var id,name,address,phone,age,database_name;
database_name=req.body.db;
id= req.body.id,
        name= req.body.name;
        address= req.body.address;
        phone= req.body.phone;
        age= req.body.age;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).insert({ "name": name, "address": address, "phone": phone, "age": age }, id , (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
});
});   
   




/////   insert bulk documents
app.post("/insert-bulk/:database_name", function (req, res) {
  const database_name = req.params.database_name;
  const students = req.body.docs.map(doc => ({
    _id: doc.id, // Ensure this is the correct field for your document ID
    name: doc.name,
    address: doc.address,
    phone: doc.phone,
    age: doc.age
  }));

  // Initialize Cloudant outside of your route handler if possible
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant) {
    if (err) {
      console.log("Failed to initialize Cloudant: " + err.message);
      res.status(500).send("Failed to initialize Cloudant");
      return;
    }

    const db = cloudant.use(database_name);
    db.bulk({ docs: students }, function (err, result) {
      if (err) {
        console.log("Error inserting documents: " + err.message);
        res.status(500).send("Error inserting documents");
        return;
      }
      res.send("Inserted all documents: " + JSON.stringify(result));
    });
  });
});





//////////////// delete a document
app.delete('/delete-document', function (req, res) {
var id,rev,database_name;
database_name=req.body.db;
id=req.body.id;
rev=req.body.rev;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).destroy(id, rev, function(err) {
  if (err) {
    throw err;
  }

  res.send('document deleted');
});
});
});

////////////////



//////////////// update existing document
app.put('/update-document', function (req, res) {
var id,rev,database_name;
database_name=req.body.db;
id=req.body.id;
rev=req.body.rev;
name = req.body.name;
address =req.body.address;
phone= req.body.phone;
age= req.body.age;
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log(pong); // {"couchdb":"Welcome","version": ..

cloudant.use(database_name).insert({ _id:id , _rev: rev, "name": name , "age": age, "address": address, "phone": phone }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
});
});


//////////////



app.listen(PORT);
//console.log(message.getPortMessage() + PORT);

