/**
 * 
 * @link https://www.npmjs.com/package/winston#logging-levels , info by default
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview This is designed to log with winston library.
 */
'use strict';
const config = require('../config');
const winston = require('winston');
const { timestamp, combine, json } = winston.format;

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp(), json()),
  transports: [
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({
      filename: 'server.error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// if in dev environment , log to console.
if (config.nodeEnv === 'dev') {
  logger.add(
    new winston.transports.Console({
      format: combine(json(), timestamp())
    })
  );
}

module.exports = logger;