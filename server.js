const express = require("express"); 
const app = express(); 
const dotenv = require("dotenv");
dotenv.config();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");

const connection = require("./config/db.js");

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


//THIS IT TO CREATE THE DATA
app.post("/create", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  
  try {
    connection.query("INSERT INTO h_name (name,email) values(?,?)", [name,email],
      (err,rows)=>{
        if(err)
          throw err;
        else
        res.redirect("/data");
    }
  );
} catch (error) {
  throw error;
};
});


//THIS IT TO READ THE DATA
app.get("/data", (req,res)=>{
  connection.query("SELECT * from h_name", (err,rows)=>{
    if (err){
      console.log(err);
    }
    else{
      res.render("read.ejs",{rows});
    }
  });
});

//THIS IT TO DELETE THE DATA
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from h_name where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});



//send route to the update page(that collects the data that is to be updated)
app.get("/update-data",(req,res)=>{
  const id = req.query.id;
  connection.query("SELECT * from h_name where id=?", [id], (err, eachRow) => {
    if (err) {
      res.send(err);
    }
    else {
      console.log(eachRow[0]);
      result = JSON.parse(JSON.stringify(eachRow[0]));
      res.render("edit.ejs", { data: eachRow[0] });
    }
  })
});

//final-update in the DB
app.post("/final-update", (req,res)=>{
  const updateQuery = "UPDATE h_name set name=?, email=? where id=?";
  const id=req.body.id;
  const name=req.body.name;
  const email=req.body.email;
  connection.query(updateQuery,[name,email,id],(err,rows)=>{
    if(err){
      res.send(err);
    }
    else{
      res.redirect("/data");
    }
  })
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Server connected to port ${PORT}`);
});