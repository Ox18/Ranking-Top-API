import * as express from 'express';
import * as morgan from 'morgan';

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Router
app.use('/api/tranking', require('./routes/tRanking'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// starting the server
app.listen(app.get('port'), ()=>{
    console.log('Server on port ' + app.get('port'));
});