'use strict';

// Module dependencies
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as logMiddleWare from 'morgan';
import * as Logger from 'bunyan';
import * as chalk from 'chalk';
import * as request from 'request';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Express;
  private log: Logger.Logger;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(app?: express.Express): Server {
    return new Server(app);
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(app?: express.Express) {
    // Create logger
    this.createLogger();

    // create expressjs application
    this.app = app || express();

    // configure application
    this.config();
  }

  /**
   *
   */
  private createLogger() {
    fs.mkdir(path.join('./dist', 'logs'), e => console.log('Log directory allready exists. Good!'));
    this.log = Logger.createLogger({
      name: 'informasjonsmodell',
      streams: [
        { level: 'trace', stream: process.stdout },
        { level: 'info', stream: process.stdout },
        {
          level: 'debug',
          type: 'rotating-file',
          path: './dist/logs/debug.log',
          period: '1d',   // daily rotation
          count: 3        // keep 3 back copies}
        },
        {
          level: 'error',
          type: 'rotating-file',
          path: './dist/logs/error.log',
          period: '1d',   // daily rotation
          count: 3        // keep 3 back copies}
        }
      ]
    });
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config(): void {
    // Determine if we are in standalone mode or going through ng dev mode
    let base = './';
    let clientPath = path.join(__dirname, base + '/public');
    console.log('Public dir: ' + chalk.yellow(clientPath));
    let me = this;

    me.app.set('etag', false);
    me.app.disable('x-powered-by');
    me.app.set('trust proxy', true);                          // Listen for external requests

    me.app.use(bodyParser.json());                            // mount json form parser
    me.app.use(bodyParser.urlencoded({ extended: false }));   // mount query string parser
    me.app.use(methodOverride());                             // Enforce HTTP verbs
    me.app.use(cookieParser());                               // populate req.cookies

    me.app.use(logMiddleWare('dev'/*, {stream: accessLogStream}*/));

    // Setup paths and routes
    me.app.use(express.static(clientPath));                    // Serve static paths
    me.app.use(favicon(path.join(clientPath, 'favicon.ico'))); // Serve favicon

    // Pipe traffic to fetch raw github content
    me.app.get('/github/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      let fileToFetch = req.url.substr('/github/'.length);
      let newReq = request('https://rawgit.com/' + fileToFetch);

      req.pipe(newReq)
        .on('response', newRes => newRes.headers['content-type'] = 'text/xml;charset=win-1252')
        .pipe(res);
    });

    // Setup base route to everything else
    me.app.get('/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
      me.log.info(' ... Loading index.html: url - ' + req.url);
      res.sendFile(path.resolve(clientPath, 'index.html'));
    });
  }
}
