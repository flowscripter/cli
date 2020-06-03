import CLICommandFactory from '../src/CLICommandFactory';

describe('CLICommandFactory test', () => {

    test('CLICommandFactory is instantiable', () => {
        expect(new CLICommandFactory()).toBeInstanceOf(CLICommandFactory);
    });

    test('CLICommandFactory returns commands', () => {
        expect(new CLICommandFactory().getCommands()).toHaveLength(2);
    });
});
