/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
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

    test('repl command works', (done) => {
        nixt({ colors: false })
            .run('./bin/flowscripter repl')
            .stdout(/.*flowscripter\?*/)
            .stdin('await Promise.resolve(\'foobar1\')\r')
            .stdout(/.*foobar1\?*/)
            .code(0)
            .end(done);
    });

    test('script command works', (done) => {
        const scriptLocation = '/tmp/flowscripter-cli-script';
        try {
            fs.rmdirSync(scriptLocation, { recursive: true });
        } catch (err) {
            // ignore and carry on
        }
        try {
            nixt({ colors: false })
                .writeFile(scriptLocation, '(async () => {\n'
                    + 'await Promise.resolve(\'foobar1\');\n'
                    + ' })();\n'
                    + 'throw new Error(\'foo2\');\n')
                .run(`./bin/flowscripter script ${scriptLocation}`)
                .stderr(/.*foo2\?*/)
                .code(1)
                .end(done);
        } catch (err) {
            try {
                fs.rmdirSync(scriptLocation, { recursive: true });
            } catch (err2) {
                // ignore and carry on
            }
        }
    });

    // TODO: script install of test extension and test command
    // test plugin not installed
    // run script to install plugin: flowscripter script -file=script.js
    // test plugin installed

    // TODO: repl install of test extension and test command
    // test plugin not installed
    // run repl
    // install plugin
    // quit repl
    // test plugin installed
});
