import mockFs from 'mock-fs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { mockProcessStderr, mockProcessStdout } from 'jest-mock-process';
import mockProcessStdIn from 'mock-stdin';
import { getTestCLI } from '../fixtures/TestCLI';
import REPLCommand from '../../src/command/REPLCommand';

const mockStderr = mockProcessStderr();
const mockStdout = mockProcessStdout();
const mockStdIn = mockProcessStdIn.stdin();

describe('REPLCommand test', () => {

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

    test('REPLCommand is instantiable', () => {
        expect(new REPLCommand()).toBeInstanceOf(REPLCommand);
    });

    test('REPLCommand run', async () => {
        mockFs({
            [path.join(os.homedir(), '.flowscripter_history')]: ''
        });

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI(new REPLCommand());
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

        const testCLI = getTestCLI(new REPLCommand());
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('is a directory!'));
    });

    test('REPLCommand non-existent custom history file is created', async () => {
        mockFs({});

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI(new REPLCommand());
        await testCLI.execute(['repl', '--location', '/foo']);

        expect(fs.statSync('/foo').isFile()).toBeTruthy();
    });

    test('REPLCommand non-existent default history file is created', async () => {
        mockFs({
            [path.join(os.homedir(), '.flowscripter_history')]: ''
        });

        fs.unlinkSync(path.join(os.homedir(), '.flowscripter_history'));
        expect(fs.existsSync(path.join(os.homedir(), '.flowscripter_history'))).toBeFalsy();

        process.nextTick(() => {
            mockStdIn.send('await Promise.resolve(\'foobar\')\r');
            mockStdIn.send('.exit\r');
        });

        const testCLI = getTestCLI(new REPLCommand());
        await testCLI.execute(['repl']);

        expect(fs.statSync(path.join(os.homedir(), '.flowscripter_history')).isFile()).toBeTruthy();
    });

    test('REPLCommand history file is directory', async () => {
        mockFs({
            '/history': {
                foo: 'bar'
            }
        });

        const testCLI = getTestCLI(new REPLCommand());
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('is a directory!'));
    });

    test('REPLCommand non-writable history file', async () => {
        mockFs({
            '/history': mockFs.file({
                mode: 0,
                content: ''
            })
        });

        const testCLI = getTestCLI(new REPLCommand());
        await testCLI.execute(['repl', '--location', '/history']);

        expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('not writable!'));
    });
});
