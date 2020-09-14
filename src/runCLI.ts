import { AdvancedMultiCommandNodeCLI, PLUGIN_REGISTRY_SERVICE } from '@flowscripter/cli-framework';
import REPLCommand from './command/REPLCommand';
import ScriptCommand from './command/ScriptCommand';

export default async function runCLI(): Promise<void> {

    // Provide PluginRegistry custom config to force a module scope
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceConfigs = new Map<string, any>();
    serviceConfigs.set(PLUGIN_REGISTRY_SERVICE, {
        moduleScope: '@flowscripter'
    });

    const cli = new AdvancedMultiCommandNodeCLI([], [
        new REPLCommand(),
        new ScriptCommand()
    ], serviceConfigs, new Map(), 'flowscripter');
    await cli.execute();
}
