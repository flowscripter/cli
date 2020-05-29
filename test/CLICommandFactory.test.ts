import CLICommandFactory from '../src/CLICommandFactory';

describe('CLICommandFactory test', () => {

    test('CLICommandFactory is instantiable', () => {
        expect(new CLICommandFactory()).toBeInstanceOf(CLICommandFactory);
    });
});
