/* eslint-disable import/no-extraneous-dependencies */
import nixt from 'nixt';

describe('CLI test', () => {

    test('no argument', (done) => {
        nixt({ colors: false })
            .run('./bin/flowscripter')
            .stdout(/.*Try running\?*/)
            .code(0)
            .end(done);
    });

    test('invalid command', (done) => {
        nixt({ colors: false })
            .run('./bin/flowscripter hello')
            .stderr(/.*Unused arg: hello/)
            .stdout(/.*Try running/)
            .code(0)
            .end(done);
    });

    test('valid command', (done) => {
        nixt({ colors: false })
            .run('./bin/flowscripter help')
            .stdout(/.*Flowscripter CLI/)
            .code(0)
            .end(done);
    });

    test('incorrectly typed command name arg for help command', (done) => {
        nixt({ colors: false })
            .run('./bin/flowscripter help greetes')
            .stderr(/.*Unknown command: greetes\?*/)
            .stdout(/.*Usage\?*/)
            .code(0)
            .end(done);
    });
});
