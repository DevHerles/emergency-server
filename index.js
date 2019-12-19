const app = require('./app');

//Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
