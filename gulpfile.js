const sonarqubeScanner = require('sonarqube-scanner');

function sonar(callback) {
    sonarqubeScanner(
        {
            options: {
                'sonar.sources': 'src',
                'sonar.tests': 'test',
                'sonar.projectKey': 'flowscripter_cli',
                'sonar.projectVersion': `travis_build_${process.env.TRAVIS_BUILD_NUMBER}`,
                'sonar.links.homepage': 'https://www.npmjs.com/package/@flowscripter/cli',
                'sonar.links.ci': 'https://travis-ci.com/flowscripter/cli',
                'sonar.links.scm': 'https://github.com/flowscripter/cli',
                'sonar.links.issue': 'https://github.com/flowscripter/cli/issues',
                'sonar.typescript.lcov.reportPaths': 'reports/lcov.info',
                'sonar.eslint.reportPaths': 'reports/eslint.json'
            }
        },
        callback
    );
}

exports.sonar = sonar;
