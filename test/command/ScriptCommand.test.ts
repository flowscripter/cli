import mockFs from 'mock-fs';
import { mockProcessStderr, mockProcessStdout } from 'jest-mock-process';
import { getTestCLI } from '../fixtures/TestCLI';
import ScriptCommand from '../../src/command/ScriptCommand';

const mockStdout = mockProcessStdout();
const mockStderr = mockProcessStderr();

describe('ScriptCommand test', () => {

    beforeEach(() => {
        mockStdout.mockReset();
        mockStderr.mockReset();
        mockFs.restore();
    });

    afterAll(() => {
        mockStdout.mockRestore();
        mockStderr.mockRestore();
        mockFs.restore();
    });

    test('ScriptCommand is instantiable', () => {
        expect(new ScriptCommand()).toBeInstanceOf(ScriptCommand);
    });

    test('ScriptCommand run', async () => {
        mockFs({
            '/script.js': 'const num = 2 + 2;num;'
        });

        const testCLI = getTestCLI(new ScriptCommand());

        await testCLI.execute(['script', '/script.js']);

        expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('4'));
    });

    test('ScriptCommand return null', async () => {
        mockFs({
            '/script.js': 'return null;'
        });

        const testCLI = getTestCLI(new ScriptCommand());

        await testCLI.execute(['script', '/script.js']);

        expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    test('ScriptCommand error', async () => {
        mockFs({
            '/script.js': 'throw new Error(\'foo\');'
        });

        const testCLI = getTestCLI(new ScriptCommand());

        await testCLI.execute(['script', '/script.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('foo'));
    });

    test('ScriptCommand non-existent script file', async () => {
        mockFs({
            '/script.js': 'throw new Error(\'foo\');'
        });

        const testCLI = getTestCLI(new ScriptCommand());

        await testCLI.execute(['script', '/foo.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not visible!'));
    });

    test('ScriptCommand script file is directory', async () => {
        mockFs({
            '/script.js': {
                foo: 'throw new Error(\'foo\');'
            }
        });

        const testCLI = getTestCLI(new ScriptCommand());

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

        const testCLI = getTestCLI(new ScriptCommand());

        await testCLI.execute(['script', '/script.js']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not readable!'));
    });
});
