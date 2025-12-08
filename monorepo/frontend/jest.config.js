module.exports = {
  // ensure Jest runs from the frontend folder
  rootDir: __dirname,

  // collect coverage as before
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
  coverageDirectory: "coverage",

  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // here’s the crucial bit:
  moduleNameMapper: {
    // stub out styles
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    // map `@/whatever` → `<rootDir>/src/whatever`
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: ["**/__tests__/**/*.(test|spec).{ts,tsx,js,jsx}"],

  // ─── Add JUnit reporter ─────────────────────────────────────────────
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./",
        outputName: "frontend-junit.xml",
        // this makes each suite be named by its file path instead of just "app"
        suiteNameTemplate: "{filepath}",
      },
    ],
  ],
};
