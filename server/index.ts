// Module dependencies
import * as path from 'path';
import * as chalk from 'chalk';

// Express
import * as http from 'http';
import * as Express from 'express';
import * as request from 'request';

// Express middlewares
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';

// Other
import { Logger } from './utils/Logger';
import { ERROR_MESSAGES } from './messages';

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  public app: Express.Express;
  private port: number = 3000;
  private clientPath = path.join(__dirname, './public');

  /**
   * Bootstrap the application.
   *
   * @returns {Promise<any>}
   * @constructor
   */
  static Initialize(): Promise<any> {
    Logger.log.debug(`
${chalk.green     ('**********************')}
${chalk.green.bold('  Starting server')}
${chalk.green     ('**********************')}
`);
    return new Server()
      .start()
      .then(() => Logger.log.debug('Server started...'))
      .catch((error: any) => {
        Logger.log.error((ERROR_MESSAGES[error.code]) ? ERROR_MESSAGES[error.code] : error);
      });
  }

  /**
   * Constructor.
   */
  constructor() {
    let appPath = path.resolve(__dirname);

    // Setup ExpressJS application
    this.app = Express();

    // Setup global middlewares
    this.app.use(morgan('combined', { stream: Logger.stream })); // Setup morgan access logger using winston

    // Configure express
    this.app.set('etag', false);        // TODO: Support etag
    this.app.disable('x-powered-by');   // Do not announce our architecture to the world!
    this.app.set('trust proxy', true);  // Listen for external requests

    // Setup static resources
    this.app.use(Express.static(this.clientPath));                    // Serve static paths
    this.app.use(favicon(path.join(this.clientPath, 'favicon.ico'))); // Serve favicon

    // Pipe traffic to fetch raw github content
    this.app.get('/api/github/*', function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
      console.log('Fetching Github document');
      let fileToFetch = req.url.substr('/api/github/'.length);
      let newReq = request('https://rawgit.com/' + fileToFetch);

      // Hardcode charset
      req.pipe(newReq)
        .on('response', newRes => newRes.headers['content-type'] = 'text/xml;charset=win-1252')
        .pipe(res);
    });

    // Setup base route to everything else
    this.app.get('/*', (req: Express.Request, res: Express.Response) => {
      res.sendFile(path.resolve(this.clientPath, 'index.html'));
    });
  }

  start(): Promise<http.Server> {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port)  // Listen on provided port, on all network interfaces.
        .on('listening', () => { this.$onReady(); resolve(); })
        .on('error', (error: any) => { this.$onServerInitError(error); reject(error); });
    });
  }

  /**
   * Server ready!
   */
  public $onReady() {
    let url = chalk.blue.underline(`http://localhost:${this.port}/`);
    Logger.log.info(`Serving on ${url}`);
  }

  /**
   * Fatal error occurred during startup of server
   * @param error
   */
  public $onServerInitError(error: any){
    // handle specific listen errors with friendly messages if configured. Default to the stack-trace.
    Logger.log.error((ERROR_MESSAGES[error.code] ? ERROR_MESSAGES[error.code] : error));
  }
}

(function standalone() {
  Server.Initialize();
})();
