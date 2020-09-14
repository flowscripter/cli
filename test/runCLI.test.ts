import { mockProcessExit, mockProcessStderr, mockProcessStdout } from 'jest-mock-process';

import runCLI from '../src/runCLI';

const mockStdout = mockProcessStdout();
const mockStderr = mockProcessStderr();
const mockExit = mockProcessExit();

describe('CLI test', () => {

    beforeAll(() => {
        mockStdout.mockReset();
        mockStderr.mockReset();
        mockExit.mockReset();
    });

    afterAll(() => {
        mockStdout.mockRestore();
        mockStderr.mockRestore();
        mockExit.mockRestore();
    });

    test('CLI is instantiable', async () => {
        await runCLI();
        expect(mockExit).toHaveBeenCalledWith(0);
    });
});
