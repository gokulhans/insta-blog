if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//edit test by govind
const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./connection');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const createError = require('http-errors');

app.use(express.json())
app.use('/users', usersRouter)
app.use('/index', indexRouter)

db.connect((err) => {
    if (err) console.log("Connection Error" + err);
    else console.log("Database connected to port")
})




app.get("/insta", async (req, res) => {
    let insta = await fetch()
    db.get().collection('demoinsta').insertOne(insta).then((response) => {})
    let demodata = await db.get().collection('demoinsta').find().toArray();
    res.json(demodata);
})



if (process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'));
    const path = require('path')
    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});





// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.json({
    //     message: err.message,
    //     error: err
    //   });
});


// server listening

app.listen(process.env.PORT || PORT, () => {
    console.log(`server is listening on ${PORT}`);
})


module.exports = app;
