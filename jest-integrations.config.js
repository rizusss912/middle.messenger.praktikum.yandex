module.exports = {
    "transform": {
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
        "^.+\\.(js|ts|tsx)$": "ts-jest"
    },
    "roots": [
        "src"
    ],
    "testMatch": [
        "**/?(*.)+(spec).+(ts|tsx|js)"
    ],
    "globals": {
        "ts-jest": {
          "tsconfig": "tsconfig.json"
        }
    },
    "preset": "ts-jest",
    "globalSetup": "jest-environment-puppeteer/setup",
    "globalTeardown": "jest-environment-puppeteer/teardown",
    "testEnvironment": "jest-environment-puppeteer",
    "setupTestFrameworkScriptFile": "expect-puppeteer",
}