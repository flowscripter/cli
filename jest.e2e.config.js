module.exports = {
    projects: [
        {
            displayName: 'cli',
            moduleFileExtensions: [
                'js',
                'ts',
                'json'
            ],
            testEnvironment: 'node',
            testMatch: [
                '**/e2e/cli/**/?(*.)test.ts'
            ],
            transform: {
                ts: 'ts-jest'
            }
        }
    ]
};
