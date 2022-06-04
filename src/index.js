const app = require('./app');
const path = require('path');
const dbConnection = require('./database/config');
app. use(function(req, res, next) {
  res. header('Access-Control-Allow-Origin', '*');
  res. header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  });

(async function() {
  await dbConnection();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on port: ${port}`));
})();
