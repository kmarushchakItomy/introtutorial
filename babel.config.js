module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.ios.ts',
          '.ios.js',
          '.ios.tsx',
          '.android.js',
          '.android.ts',
          '.android.tsx',
        ],
        root: ['./src/'],
      },
    ],
    ['react-native-reanimated/plugin'],
    'babel-plugin-styled-components',
  ],
};
