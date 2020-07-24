import {
    BaseCLI,
    Command,
    PrompterService,
    StderrPrinterService,
    STDOUT_PRINTER_SERVICE,
    StdoutPrinterService
} from '@flowscripter/cli-framework';

// eslint-disable-next-line import/prefer-default-export
export function getTestCLI(command: Command): BaseCLI {

    const serviceConfigs = new Map();
    serviceConfigs.set(STDOUT_PRINTER_SERVICE, { colorEnabled: false });

    return new BaseCLI({
        name: 'foo',
        description: 'foo bar',
        version: '1.2.3',
        stdout: process.stdout,
        stderr: process.stderr,
        stdin: process.stdin
    }, [
        new PrompterService(90),
        new StdoutPrinterService(90),
        new StderrPrinterService(90)
    ], [command], serviceConfigs, new Map());
}
