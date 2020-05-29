import {
    BaseCLI,
    Command,
    CommandFactory,
    STDOUT_PRINTER_SERVICE
} from '@flowscripter/cli-framework';
import mockFs from 'mock-fs';
import { mockProcessStdout, mockProcessStderr } from 'jest-mock-process';
import ScriptCommand from '../../src/command/ScriptCommand';

const mockStdout = mockProcessStdout();
const mockStderr = mockProcessStderr();

function getTestCLI(): BaseCLI {

    const serviceConfigs = new Map();
    serviceConfigs.set(STDOUT_PRINTER_SERVICE, { colorEnabled: false });

    const baseCLI: BaseCLI = new BaseCLI({
        name: 'foo',
        description: 'foo bar',
        version: '1.2.3',
        stdout: process.stdout,
        stderr: process.stderr,
        stdin: process.stdin
    }, serviceConfigs, new Map());

    baseCLI.addCommandFactory(new class implements CommandFactory {
        // eslint-disable-next-line class-methods-use-this
        getCommands(): Iterable<Command> {
            return [new ScriptCommand()];
        }
    }());

    return baseCLI;
}

describe('ScriptCommand test', () => {

    beforeEach(() => {
        mockStdout.mockReset();
    });

    afterAll(() => {
        mockStdout.mockRestore();
    });

    test('ScriptCommand is instantiable', () => {
        expect(new ScriptCommand()).toBeInstanceOf(ScriptCommand);
    });

    test('ScriptCommand run', async () => {
        mockFs({
            '/script.js': 'const num = 2 + 2;num;'
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/script.js']);

        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('4'));
    });

    test('ScriptCommand return null', async () => {
        mockFs({
            '/script.js': 'return null;'
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/script.js']);

        expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    test('ScriptCommand error', async () => {
        mockFs({
            '/script.js': 'throw new Error(\'foo\');'
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/script.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('foo'));
    });

    test('ScriptCommand non-existent script file', async () => {
        mockFs({
            '/script.js': 'throw new Error(\'foo\');'
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/foo.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not visible!'));
    });

    test('ScriptCommand script file is directory', async () => {
        mockFs({
            '/script.js': {
                foo: 'throw new Error(\'foo\');'
            }
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/script.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('is a directory!'));
    });

    test('ScriptCommand non-readable script file', async () => {
        mockFs({
            '/script.js': mockFs.file({
                mode: 0o1000,
                content: 'throw new Error(\'foo\');'
            })
        });

        const testCLI = getTestCLI();

        await testCLI.execute(['script', '/script.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not readable!'));
    });
});
