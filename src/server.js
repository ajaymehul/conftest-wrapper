const express = require('express');

const routes = require('./routes/index.js');
const conftest_routes = require('./routes/conftest');

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/conftest', conftest_routes);

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});