"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
// Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
// Router
app.use('/api/tranking', require('./routes/tRanking'));
// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'));
});
//# sourceMappingURL=index.js.map