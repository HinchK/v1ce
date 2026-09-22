const { withAppBuildGradle } = require("expo/config-plugins");

module.exports = function withAndroidJsBundle(config) {
  return withAppBuildGradle(config, (config) => {
    const source = config.modResults.contents;
    const marker = "debuggableVariants = []";
    if (source.includes(marker)) return config;

    config.modResults.contents = source.replace(
      /react\s*\{/,
      'react {\n    debuggableVariants = []'
    );

    return config;
  });
};
