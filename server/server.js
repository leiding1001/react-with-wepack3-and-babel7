/*eslint-disable no-console*/
import Express from 'express';
import config from '../config/build-config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import proxy from 'express-http-proxy';
import morgan from 'morgan';

console.log('--------------------------API-CONFIG-START---------------------------------------');

const project = process.env.project || '';
const {apiHost, apiPort, isRemoteProxy, remoteProxy} = config;

console.log(`API PROJECT: ${project}`);
console.log(`API HOST: ${apiHost}`);
console.log(`API PORT: ${apiPort}`);
console.log(`API IS REMOTE: ${isRemoteProxy}`);
console.log(`API REMOTE PROXY TARGET: ${remoteProxy}`);

const app = new Express();

app.use(morgan('\\n[:date[clf]] :method :url :status - :response-time ms'));
app.use(cookieParser('express_react_cookie'));
app.use(
  session({
    secret: 'express_react_cookie',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 30
    } //过期时间
  })
);

//API 主入口
if (isRemoteProxy) {
  // 远程API服务
  app.use(
    '/',
    proxy(remoteProxy)
  );
} else {
  // 本地API服务
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(bodyParser({limit:'50mb'}));
  app.use(bodyParser.json());
  app.use('/', require('./api/main'));
}

app.listen(apiPort, function(err) {
  if (err) {
    console.error('err:', err);
  } else {
    console.info(`===> api server is running at ${apiHost}:${apiPort}`);
  }
  console.log('-------------------------API-CONFIG-END----------------------------------------');
});
