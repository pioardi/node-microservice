/** 
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview This module is designed to collect all configurations for the application.
 */
module.exports = {
    // port to serve HTTP requests
    port: process.env.PORT || 3000,
    // winston log level , info by default
    logLevel : process.env.LOG_LEVEL || 'info',
    // env description , 
    //this kind of info is important to determinate if log should be on console or not and for other stuff
    nodeEnv : process.env.NODE_ENV || 'dev',
    // data source connection string
    dataSourceConnectionString : process.env.DATA_SOURCE_CONNECTION_STRING || 'mongodb+srv://supertest:supertest@xaratest-3lcgk.azure.mongodb.net/test?retryWrites=true&w=majority'
};