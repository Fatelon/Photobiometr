import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    this.express.use(bodyParser.json());
    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Origin, X-Requested-With");
      next();
    });
    this.express.use(express.static(path.join(__dirname, '../public')));
  }
}
  
export default new App().express