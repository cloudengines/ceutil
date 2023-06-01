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
 * @file ceutil/config.js
 * @author Brad Dietrich
 * @brief Cloud Engines Utilities
 */
'use strict'

const fs = require('fs')
const path = require('path')

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

function patch(obj) {
  function patchO(o1, o2, path) {
    for (var prop in o2) {
      let p2 = path + '[' + prop + ']'
      if (!hasProp(o2, prop)) {
        // SKip
      } else if (hasProp(o1, prop)) {
        // log('Looking at: '+p2, o1[prop], o2[prop])
        // if (o1[prop] instanceof Array && o2[prop] instanceof Array) {
        // }
        if (o1[prop] instanceof Function && o2[prop] instanceof Function) {
          // log('Replacing '+p2, o2[prop])
          o1[prop] = o2[prop]
        } else if (o1[prop] instanceof Object && o2[prop] instanceof Object) {
          patchO(o1[prop], o2[prop], p2)
        } else {
          // log('Replacing '+p2, o2[prop])
          o1[prop] = o2[prop]
        }
      } else {
        // log('Adding '+p2, o2[prop])
        o1[prop] = o2[prop]
      }
    }
    return o1
  }

  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i] == null) continue
    patchO(obj, arguments[i], '.')
  }
  return obj
}

function Config() {
  if (!(this instanceof Config)) {
    throw new Error('Config must be called with new')
  }
  for (let i = 0, len = arguments.length; i < len; i++) {
    try {
      // log('Checking ['+i+']: '+arguments[i])
      fs.accessSync(arguments[i], fs.constants.R_OK)
      // log('Loading configuration from: '+arguments[i])
      let c = JSON.parse(fs.readFileSync(arguments[i]))
      patch(this, c)
    } catch (e) {
      if (e.code === 'ENOENT') {
        // Ignore exception from access
      } else {
        throw new Error('Fail to Load (' + arguments[i] + '): ' + e.message)
      }
    }
  }

  Config.prototype.isDebug = function(item) {
    var debug = false
    var dbg = this['debug']
    if (
      dbg === true ||
      dbg === 'true' ||
      (item &&
        ((dbg instanceof Array && dbg.find(e => e === item)) ||
          (dbg instanceof Object && hasProp(dbg, item) && dbg[item])))
    ) {
      debug = true
    }
    return debug
  }

  Config.prototype.get = function(key, def) {
    var ar = key.split('.')
    var l = this
    for (let i = 0, len = ar.length; i < len; i++) {
      if (hasProp(l, ar[i])) {
        l = l[ar[i]]
      } else {
        // log('Defaulting: ', key, ' -> ', l, 'does not contain', ar[i])
        return def
      }
    }
    // log('Returning:', key, ' -> ', l)
    return l
  }
}

const configs = {}
var defaultconfig
function config(configname) {
  if (!defaultconfig) {
    defaultconfig = configname
  }
  if (!configname) {
    configname = defaultconfig
  }
  if (!configname) {
    throw new Error('config() missing configname parameter')
  }
  if (!hasProp(configs, configname)) {
    configs[configname] = new Config(
      '/etc/' + configname + '.json',
      path.join(process.env.HOME, '.' + configname + '.json'),
      configname + '.json'
    )
  }
  return configs[configname]
}

module.exports = {
  patch,
  Config,
  config
}
