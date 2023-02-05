const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config/config');
const routerApi = require('./routes/index');
const { logErrors, errorHandler, ormHandlerError, boomErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet())
app.disable('x-powered-by')

require('./utils/auth');

app.get("/", (req, res) => {
  res.send("App running ✅");
});

routerApi(app);

app.use(logErrors);
app.use(ormHandlerError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} 🚀`);
});

