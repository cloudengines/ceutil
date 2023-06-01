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
 * @file ceutil/index.js
 * @author Brad Dietrich
 * @brief Cloud Engines Utilities
 */
'use strict'

const log = require('./log')
const config = require('./config')
const base32 = require('./base32')
//const base64 = require('./base64')

module.exports = {
  log: log.log,
  warn: log.warn,
  error: log.error,
  debug: log.debug,
  logger: log.logger,
  setRootLogger: log.setRootLogger,
  patch: config.patch,
  Config: config.Config,
  config: config.config,
  base32: base32.base32,
  genid: base32.genid
}
