// Module dependencies
import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs';

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
import * as Iconv from 'iconv-lite';

const xml2js = require('xml2js');
const parser = new xml2js.Parser();

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
${chalk.green('**********************')}
${chalk.green.bold('  Starting server')}
${chalk.green('**********************')}
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
    const appPath = path.resolve(__dirname);
    const me = this;

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
    const faviconPath = path.join(this.clientPath, 'favicon.ico');
    if (fs.existsSync(path.resolve(faviconPath))) {
      this.app.use(favicon(faviconPath)); // Serve favicon
    }

    // Pipe traffic to fetch raw github content
    this.app.get('/api/doc/:version/xml', function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
      const url = `https://rawgit.com/FINTprosjektet/fint-informasjonsmodell/${req.params.version}/FINT-informasjonsmodell.xml`;
      me.load(url, (xml: string) => {
        res.header({ 'content-type': 'application/xml; charset=utf-8' });
        res.send(xml);
      }, (error: any) => res.send(500, error));
    });

    // Pipe traffic to fetch raw github content
    this.app.get('/api/doc/:version/json', function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
      const url = `https://rawgit.com/FINTprosjektet/fint-informasjonsmodell/${req.params.version}/FINT-informasjonsmodell.xml`;
      me.load(url, (xml: string) => {
        parser.parseString(xml, function (err: any, result: any) {
          res.header({ 'content-type': 'text/json; charset=utf-8' });
          res.send(result);
        });
      }, (error: any) => res.send(500, error));
    });

    this.app.get('/api/doc/branches', function (req: Express.Request, res: Express.Response, next: Express.NextFunction) {
      const options = {
        method: 'GET',
        url: 'https://api.github.com/repos/FINTprosjektet/fint-informasjonsmodell/branches',
        headers: {
          'User-Agent': 'NodeJS-Express',
          'cache-control': 'no-cache'
        }
      };
      request(options, function (err, response, body) {
        if (err) { Logger.log.error(err); res.send(500, err); }
        res.send(body);
      });
    });

    // Setup base route to everything else
    this.app.get('/*', (req: Express.Request, res: Express.Response) => {
      res.sendFile(path.resolve(this.clientPath, 'index.html'));
    });
  }

  load(url: string, callback: Function, error: Function) {
    request({ url: url, encoding: null }, function (err, response, body) {
      if (err) { Logger.log.error(err); error(err); }
      if (!err && response.statusCode == 200) {
        const xml = Iconv.decode(body, 'win-1252');
        callback(xml);
      }
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
  public $onServerInitError(error: any) {
    // handle specific listen errors with friendly messages if configured. Default to the stack-trace.
    Logger.log.error((ERROR_MESSAGES[error.code] ? ERROR_MESSAGES[error.code] : error));
  }
}

(function standalone() {
  Server.Initialize();
})();
