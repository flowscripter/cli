/**
 * @module @flowscripter/cli
 */

import { Command, CommandFactory } from '@flowscripter/cli-framework';
import REPLCommand from './command/REPLCommand';
import ScriptCommand from './command/ScriptCommand';

/**
 * Provides additional flowscripter CLI commands.
 */
export default class CLICommandFactory implements CommandFactory {

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line class-methods-use-this
    public getCommands(): Iterable<Command> {
        return [
            new REPLCommand(),
            new ScriptCommand()
        ];
    }
}
