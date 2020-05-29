import mockFs from 'mock-fs';
import {
    BaseCLI,
    Command,
    CommandFactory,
    STDOUT_PRINTER_SERVICE
} from '@flowscripter/cli-framework';
import { mockProcessStdout, mockProcessStderr } from 'jest-mock-process';
import mockProcessStdIn from 'mock-stdin';
import REPLCommand from '../../src/command/REPLCommand';

const mockStderr = mockProcessStderr();
const mockStdout = mockProcessStdout();
const mockStdIn = mockProcessStdIn.stdin();

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
            return [new REPLCommand()];
        }
    }());

    return baseCLI;
}

describe('REPLCommand test', () => {

    beforeEach(() => {
        mockStdout.mockReset();
    });

    afterAll(() => {
        mockStdout.mockRestore();
    });

    test('REPLCommand is instantiable', () => {
        expect(new REPLCommand()).toBeInstanceOf(REPLCommand);
    });

    test('REPLCommand run', async () => {

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI();
        await testCLI.execute(['repl']);

        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('foo 1.2.3'));
        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('foobar'));
    });

    test('REPLCommand failure with invalid history location', async () => {
        mockFs({
            '/history': {
                foo: 'bar'
            }
        });

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI();
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('foo 1.2.3'));
        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('foobar'));
    });

    test('REPLCommand non-existent history file', async () => {
        mockFs({
            '/history': ''
        });

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI();
        await testCLI.execute(['repl', '--location', '/foo']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not visible!'));
    });

    test('REPLCommand history file is directory', async () => {
        mockFs({
            '/history': {
                foo: 'bar'
            }
        });

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI();
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('is a directory!'));
    });

    test('REPLCommand non-writable history file', async () => {
        mockFs({
            '/history': mockFs.file({
                mode: 0o1000,
                content: ''
            })
        });

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI();
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not writable!'));
    });
});
