import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';
import tempDir from 'temp-dir';

module.exports = [
    {
        input: {
            node: 'src/index.ts'
        },
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true
        },
        watch: {
            include: 'src/**',
        },
        external: [
            'crypto',
            'fs',
            'os',
            'path',
            'tty',
            'util',
            'buffer',
            'string_decoder',
            'readline',
            'assert',
            'events',
            'stream',
            'http',
            'https',
            'url',
            'zlib',
            'constants',
            'readable-stream',
            'repl',
            'vm'
        ],
        plugins: [
            peerDepsExternal(),
            typescript({
                typescript: ts,
                useTsconfigDeclarationDir: true,
                cacheRoot: `${tempDir}/.rpt2_cache`
            }),
            commonjs(),
            resolve(),
            cleanup({
                extensions: ['ts']
            })
        ]
    }
];
