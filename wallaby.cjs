module.exports = function (/* _wallaby */) {
  return {
    slowTestThreshold: 500,
    runMode: 'onsave',
    lowCoverageThreshold: 70,
    resolveGetters: true,
    workers: {
      initial: 6,
      regular: 3,
      restart: false,
    },
    hints: {
      // or /istanbul ignore next/, or any RegExp
    },
    filesWithNoCoverageCalculated: ['lib/**/**'],
  };
};
