import { NodeCLI, PLUGIN_REGISTRY_SERVICE } from '@flowscripter/cli-framework';
import CLICommandFactory from './CLICommandFactory';

(async (): Promise<void> => {

    // Provide PluginRegistry custom config to force a module scope
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceConfigs = new Map<string, any>();
    serviceConfigs.set(PLUGIN_REGISTRY_SERVICE, {
        moduleScope: '@flowscripter'
    });

    const nodeCLI: NodeCLI = new NodeCLI('flowscripter', serviceConfigs, new Map());
    nodeCLI.addCommandFactory(new CLICommandFactory());
    await nodeCLI.execute();
})();
