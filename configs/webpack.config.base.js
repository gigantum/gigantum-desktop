/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies } from '../package.json';

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.svg', '.scss'],
    alias: {
      Components: path.resolve(__dirname, '../app/components/'),
      Images: path.resolve(__dirname, '../app/assets/images/'),
      Styles: path.resolve(__dirname, '../app/assets/css/'),
      Fonts: path.resolve(__dirname, '../app/assets/fonts/')
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      IMAGE_TAG: 'd0c812c2',
      CLIENT_VERSION: '1.3.3'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
