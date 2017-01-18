import express  from 'express'
import metadata from './webtask.json';
import routes   from './routes';
import hooks    from './hooks';

const app = express();

app.use('/.extensions', hooks);
app.use(routes);

app.use(function (err, req, res, next){
  console.log(err);
  console.log(req.path);
  return res.status(501).end('Internal Server Error');
});

export default app;
