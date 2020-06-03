/**
 * @module @flowscripter/cli
 */

import _ from 'lodash';
import fs from 'fs';
import { Script } from 'vm';
import debug from 'debug';
import {
    CommandArgs,
    STDOUT_PRINTER_SERVICE,
    Printer,
    Context,
    SubCommand
} from '@flowscripter/cli-framework';

export default class ScriptCommand implements SubCommand {

    private readonly log: debug.Debugger = debug('ScriptCommand');

    readonly name = 'script';

    readonly description = 'Execute a script and display the result';

    readonly topic = 'Scripting';

    readonly positionals = [{
        name: 'location',
        description: 'The location of the script file'
    }];

    readonly options = [];

    /**
     * @inheritdoc
     *
     * Runs a script. Expects:
     * * an implementation of `Printer` registered with the `STDOUT_PRINTER_SERVICE` ID
     * in the provided `Context`.
     */
    // eslint-disable-next-line class-methods-use-this
    public async run(commandArgs: CommandArgs, context: Context): Promise<void> {

        const printer = context.serviceRegistry.getServiceById(STDOUT_PRINTER_SERVICE) as unknown as Printer;
        if (!printer) {
            throw new Error('STDOUT_PRINTER_SERVICE not available in context');
        }

        const location = commandArgs.location as string;
        this.log(`Using scriptLocation: ${location}`);

        try {
            fs.accessSync(location, fs.constants.F_OK);
        } catch (err) {
            throw new Error(`script: ${location} doesn't exist or not visible!`);
        }

        try {
            fs.accessSync(location, fs.constants.R_OK);
        } catch (err) {
            throw new Error(`script: ${location} is not readable!`);
        }

        const stat = fs.statSync(location);
        if (stat.isDirectory()) {
            throw new Error(`script: ${location} is a directory!`);
        }

        const scriptSource = fs.readFileSync(location, 'utf8');
        const script = new Script(scriptSource, { filename: location });
        const result = script.runInThisContext({ breakOnSigint: true });
        if (!_.isUndefined(result) && !_.isNull(result)) {
            printer.info(`${result}\n`);
        }
    }
}
