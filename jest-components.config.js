module.exports = {
    "transform": {
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
        "^.+\\.(js|ts|tsx)$": "ts-jest"
    },
    "roots": [
        "src"
    ],
    "testMatch": [
        "**/?(*.)+(test).+(ts|tsx|js)"
    ],
    "globals": {
        "ts-jest": {
          "tsconfig": "tsconfig.json"
        }
    },
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
}