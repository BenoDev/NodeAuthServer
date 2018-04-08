//Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://localhost:27017/auth', function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
});
mongoose.Promise = global.Promise;

//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({type:'*/*'}));
router(app);
//Server Setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);


server.listen(port,()=>{
	console.log('server listening on port',port)
})