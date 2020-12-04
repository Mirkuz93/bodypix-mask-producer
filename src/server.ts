import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import MaskRoute from './routes/mask.route';

const app = new App([
  new IndexRoute(),
  new MaskRoute()
]);

app.listen();