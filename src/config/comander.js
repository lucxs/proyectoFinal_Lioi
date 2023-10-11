import {Command} from "commander"

const program = new Command();

program.option('-p <port>','puerto del servidor',8080);

program.parse();

req.logger.debug('Options: ', program.opts());
req.logger.debug('Remaining arguments: ', program.args);

