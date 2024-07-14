const express = require('express');
const staticRouter = require('./routes/staticRoutes');
const dynamicRouter = require('./routes/dynamicRoutes');
const { connectToMongoDB } = require('./connect');
const cookieParser = require('cookie-parser');

const PORT = 8000;
const db_url = "mongodb://127.0.0.1:27017/authentication";
connectToMongoDB(db_url)
.then(() => console.log('MongoDB connected..'));

// Express object
const app = express();

app.use(cookieParser());

// POST data read middleware
app.use(express.urlencoded({ extended: true }));

// EJS view engine
app.set('view engine', 'ejs');

// // Define the directory for views
// app.set('views', path.join(__dirname, 'views'));

app.use('/', staticRouter);
app.use('/', dynamicRouter);

app.listen(PORT, () => {
    console.log('Server started.');
    console.log(`localhost:${PORT} in this link`);
});