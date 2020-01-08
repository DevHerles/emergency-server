const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
  mongoose.set('useCreateIndex', true);
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

//require('dotenv').config();

const app = express();

//Middlewares
app.use(express.json());
//app.use(morgan('dev'));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
//MongoDB
//const uri = process.env.ATLAS_URI;
mongoose.Promise = global.Promise;
//mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//const connection = mongoose.connection;
//connection.once('open', () => {
  //console.log('MongoDB database connection established successfully');
//});

if (process.env.NODE_ENV === "test") {
  mongoose.connect("mongodb://localhost/APIAuthenticationTEST", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} else {
  //mongoose.connect("mongodb+srv://herlesinc:G8ihnuTczO3AtPAP@cluster0-6qikg.gcp.mongodb.net/test?retryWrites=true&w=majority", {
  mongoose.connect("mongodb://localhost/APIAuthentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
}

//Routers
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const emergencyRouter = require('./routes/emergency.route');
const sequenceRouter = require('./routes/sequence.route');
const themeRouter = require('./routes/theme.route');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/emergencies', emergencyRouter);
app.use('/sequences', sequenceRouter);
app.use('/themes', themeRouter);

module.exports = app;

