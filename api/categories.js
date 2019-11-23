/**
 * @author Alessandro Pio Ardizio
 * @since 0.0.1
 * @fileoverview  Start express app to serve REST requests
 */
'use strict';
// express dependencies and configs
const express = require('express');
const app = express();
const { port } = require('../config');
const log = require('../loggers');

// services
const createCategory = require('../services/createCategory');
const createTemplate = require('../services/createTemplate');
const deleteCategory = require('../services/deleteCategory');
const deleteTemplate = require('../services/deleteTemplate');
const moveCategory = require('../services/moveCategory');
const moveTemplate = require('../services/moveTemplate');
app.use(express.json());
// TODO understand if CORS is needed
// app.use(cors());
// expose REST API
app.post('/categories', createCategory);
app.post('/categories/:categoryId/templates', createTemplate);
app.delete('/categories/:categoryId', deleteCategory);
app.delete('/categories/:categoryId/templates/:templateId', deleteTemplate);
app.put('/categories/:categoryId', moveCategory);
app.put('/categories/:categoryId/templates/:templateId', moveTemplate);
app.listen(port);
log.info(`Starting to serve HTTP requests on port ${port}`);
module.exports = app;
