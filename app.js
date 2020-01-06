const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const modelRouter = require('./routes/models');
const devicesRouter = require('./routes/devices');
const mqttRouter = require('./routes/mqtt');
const dashboardRouter = require('./routes/dashboard');
const modelsDataRouter = require('./routes/modelsData');
const dataTypesRouter = require('./routes/dataType');
const meansurementsRouter = require('./routes/measurements');
const meansurementsgetRouter = require('./routes/measurementsget');
const viewsRouter = require('./routes/views');

const gaugesRouter = require('./routes/gauges');
const linesRouter = require('./routes/lines');
const barsRouter = require('./routes/bars');
const radarsRouter = require('./routes/radars');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/models', modelRouter);
app.use('/devices', devicesRouter);
app.use('/mqtt', mqttRouter);
app.use('/dashboard', dashboardRouter);
app.use('/modelsData', modelsDataRouter);
app.use('/dataTypes', dataTypesRouter);
app.use('/meansurements', meansurementsRouter);
app.use('/meansurementsget', meansurementsgetRouter);
app.use('/views', viewsRouter);

app.use('/gauges', gaugesRouter);
app.use('/lines', linesRouter);
app.use('/bars', barsRouter);
app.use('/radars', radarsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
