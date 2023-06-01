/********************************************************************
 * Copyright 2018-2020 Cloud Engines, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @file ceutil/log.js
 * @author Brad Dietrich
 * @brief Cloud Engines Utilities
 */
'use strict'

const dmod = require('debug')

var root = console

function Logger(name, props) {
  var _debug = dmod(name)

  this.log = function() {
    if(root) root.log.apply(root, [new Date().toISOString(), name, ...arguments])
  }

  this.warn = function() {
    if(root) root.warn.apply(root, [new Date().toISOString(), name, 'WARNING', ...arguments])
  }

  this.error = function() {
    if(root) root.error.apply(root, [new Date().toISOString(), name, 'ERROR', ...arguments])
  }

  this.assert = function(check, ...extraargs) {
    if (!check) {
      if(root) root.error.apply(root, [new Date().toISOString(), name, 'ASSERT', ...extraargs, Error().stack])
    }
  }

  this.debug = function() {
    _debug.apply(undefined, [new Date().toISOString(), ...arguments])
  }
}

var loggers = {}

function logger(name, props) {
  if (!loggers[name]) {
    loggers[name] = new Logger(name, props)
  }
  return loggers[name]
}

function log() {
  logger('default').log.apply(undefined, arguments)
}

function warn() {
  logger('default').warn.apply(undefined, arguments)
}

function error() {
  logger('default').error.apply(undefined, arguments)
}

function debug() {
  logger('default').debug.apply(undefined, arguments)
}

function setRootLogger(lr) {
  root = lr
}

module.exports = {
  log,
  warn,
  error,
  debug,
  logger,
  setRootLogger
}
