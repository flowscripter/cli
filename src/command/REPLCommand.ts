/**
 * @module @flowscripter/cli
 */

/* eslint-disable no-underscore-dangle,@typescript-eslint/ban-ts-comment */

import debug from 'debug';
import os from 'os';
import fs from 'fs';
import repl from 'repl';
import {
    CommandArgs,
    PROMPTER_SERVICE,
    STDOUT_PRINTER_SERVICE,
    Prompter,
    Printer,
    Context,
    SubCommand
} from '@flowscripter/cli-framework';

export default class REPLCommand implements SubCommand {

    private readonly log: debug.Debugger = debug('REPLCommand');

    readonly name = 'repl';

    readonly description = 'Start the CLI in REPL interactive mode';

    readonly topic = 'Scripting';

    readonly positionals = [];

    readonly options = [{
        name: 'location',
        description: 'The location of the history file',
        defaultValue: `${os.homedir()}/.flowscripter_history`,
        isOptional: false
    }];

    /**
     * @inheritdoc
     *
     * Launches a REPL. Expects:
     * * an implementation of `Printer` registered with the `STDOUT_PRINTER_SERVICE` ID
     * in the provided `Context`.
     * * an implementation of `Prompter` registered with the `PROMPTER_SERVICE` ID
     * in the provided `Context`.
     */
    // eslint-disable-next-line class-methods-use-this
    public async run(commandArgs: CommandArgs, context: Context): Promise<void> {

        const printer = context.serviceRegistry.getServiceById(STDOUT_PRINTER_SERVICE) as unknown as Printer;
        if (!printer) {
            throw new Error('STDOUT_PRINTER_SERVICE not available in context');
        }
        const prompter = context.serviceRegistry.getServiceById(PROMPTER_SERVICE) as unknown as Prompter;
        if (!prompter) {
            throw new Error('PROMPTER_SERVICE not available in context');
        }

        const historyLocation = commandArgs.location as string;
        this.log(`Using REPL history at: ${historyLocation}`);

        try {
            fs.accessSync(historyLocation, fs.constants.F_OK);
        } catch (err) {
            this.log(`Location doesn't exist or not visible, attempting to create: ${historyLocation}`);
            try {
                fs.openSync(historyLocation, 'a');
                fs.accessSync(historyLocation, fs.constants.F_OK);
            } catch (err2) {
                throw new Error(`Unable to create REPL history location: ${historyLocation} : ${err2.message}`);
            }
        }

        try {
            fs.accessSync(historyLocation, fs.constants.W_OK);
        } catch (err) {
            throw new Error(`REPL history: ${historyLocation} is not writable!`);
        }

        const stat = fs.statSync(historyLocation);
        if (stat.isDirectory()) {
            throw new Error(`REPL history: ${historyLocation} is a directory!`);
        }

        printer.info(`${printer.blue(context.cliConfig.name)} ${printer.blue(context.cliConfig.version)}\n`);
        printer.info(printer.dim('Type ".help" for more information.\n'));

        return new Promise((resolve, reject) => {

            const replServer = repl.start({
                prompt: `${printer.blue('»')} `,
                output: printer.writable,
                input: prompter.readable,
                useColors: printer.colorEnabled,
                ignoreUndefined: true,
                breakEvalOnSigint: true
            });
            replServer.on('error', (err) => {
                this.log('Received "error" event from repl, rejecting');
                reject(err);
            });
            replServer.on('close', () => {
                this.log('Received "close" event from repl, resolving');
                resolve();
            });
            // @ts-ignore setupHistory is not defined on type
            replServer.setupHistory(historyLocation, (err) => {
                if (err) {
                    reject(err);
                }
            });
        });
    }
}
