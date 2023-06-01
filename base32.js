/********************************************************************
 * Copyright 2018-2022 Cloud Engines, LLC
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
 * @file ceutil/base32.js
 * @author Brad Dietrich
 * @brief Cloud Engines Utilities
 */
'use strict'
const crypto = require('crypto')

const b32a = 'abcdefghjklmnpqrstuvwxyz23456789'
function base32(input) {
  if( input instanceof ArrayBuffer ) {
    input = new Uint8Array(input)
  }
  var output = ''
  const len = input.length
  // var iv = ''
  // for(var i=0;i<len;i++) {
  //   iv += input[i].toString(16)
  // }
  // console.log('I:  0x'+iv)
  for (var i = 0; i < Math.floor(len / 5); i++) {
    // 0 0xf8 00 00 00 00 >>35
    // console.log('O0: 0x'+(((input[i*5+0] & 0xf8) >> 3)).toString(16))
    output += b32a[(input[i * 5 + 0] & 0xf8) >> 3]
    // 1 0x07 c0 00 00 00 >>30
    // console.log('O1: 0x'+(((input[i*5+0] & 0x07) << 2) | ((input[i*5+1] & 0xc0) >> 6)).toString(16))
    output += b32a[((input[i * 5 + 0] & 0x07) << 2) | ((input[i * 5 + 1] & 0xc0) >> 6)]
    // 2 0x00 3e 00 00 00 >>25
    // console.log('O2: 0x'+(((input[i*5+1] & 0x3e) >> 1)).toString(16))
    output += b32a[(input[i * 5 + 1] & 0x3e) >> 1]
    // 3 0x00 01 f0 00 00 >>20
    // console.log('O3: 0x'+(((input[i*5+1] & 0x01) << 4) | ((input[i*5+2] & 0xf0) >> 4)).toString(16))
    output += b32a[((input[i * 5 + 1] & 0x01) << 4) | ((input[i * 5 + 2] & 0xf0) >> 4)]
    // 4 0x00 00 0f 80 00 >>15
    // console.log('O4: 0x'+(((input[i*5+2] & 0x0f) << 1) | ((input[i*5+3] & 0x80) >> 7)).toString(16))
    output += b32a[((input[i * 5 + 2] & 0x0f) << 1) | ((input[i * 5 + 3] & 0x80) >> 7)]
    // 5 0x00 00 00 7c 00 >>10
    // console.log('O5: 0x'+(((input[i*5+3] & 0x7c) >> 2)).toString(16))
    output += b32a[(input[i * 5 + 3] & 0x7c) >> 2]
    // 6 0x00 00 00 03 e0 >>5
    // console.log('O6: 0x'+(((input[i*5+3] & 0x03) << 3) | ((input[i*5+4] & 0xe0) >> 5)).toString(16))
    output += b32a[((input[i * 5 + 3] & 0x03) << 3) | ((input[i * 5 + 4] & 0xe0) >> 5)]
    // 7 0x00 00 00 00 1f
    // console.log('O7: 0x'+(((input[i*5+4] & 0x1f))).toString(16))
    output += b32a[input[i * 5 + 4] & 0x1f]
  }
  const q = len % 5
  if (q) {
    // 0 0xf8 00 00 00 00 >>35
    // console.log('O0: 0x'+(((input[i*5+0] & 0xf8) >> 3)).toString(16))
    output += b32a[(input[i * 5 + 0] & 0xf8) >> 3]
    if (q == 1) {
      // 1 0x07 c0 00 00 00 >>30
      // console.log('O1: 0x'+(((input[i*5+0] & 0x07) << 2)).toString(16))
      output += b32a[(input[i * 5 + 0] & 0x07) << 2]
    } else {
      // 1 0x07 c0 00 00 00 >>30
      // console.log('O1: 0x'+(((input[i*5+0] & 0x07) << 2) | ((input[i*5+1] & 0xc0) >> 6)).toString(16))
      output += b32a[((input[i * 5 + 0] & 0x07) << 2) | ((input[i * 5 + 1] & 0xc0) >> 6)]
      // 2 0x00 3e 00 00 00 >>25
      // console.log('O2: 0x'+(((input[i*5+1] & 0x3e) >> 1)).toString(16))
      output += b32a[(input[i * 5 + 1] & 0x3e) >> 1]
      if (q == 2) {
        // 3 0x00 01 f0 00 00 >>20
        // console.log('O3: 0x'+(((input[i*5+1] & 0x01) << 4)).toString(16))
        output += b32a[(input[i * 5 + 1] & 0x01) << 4]
      } else {
        // 3 0x00 01 f0 00 00 >>20
        // console.log('O3: 0x'+(((input[i*5+1] & 0x01) << 4) | ((input[i*5+2] & 0xf0) >> 4)).toString(16))
        output += b32a[((input[i * 5 + 1] & 0x01) << 4) | ((input[i * 5 + 2] & 0xf0) >> 4)]
        if (q == 3) {
          // 4 0x00 00 0f 80 00 >>15
          // console.log('O4: 0x'+(((input[i*5+2] & 0x0f) << 1)).toString(16))
          output += b32a[(input[i * 5 + 2] & 0x0f) << 1]
        } else {
          // 4 0x00 00 0f 80 00 >>15
          // console.log('O4: 0x'+(((input[i*5+2] & 0x0f) << 1) | ((input[i*5+3] & 0x80) >> 7)).toString(16))
          output += b32a[((input[i * 5 + 2] & 0x0f) << 1) | ((input[i * 5 + 3] & 0x80) >> 7)]
          // 5 0x00 00 00 7c 00 >>10
          // console.log('O5: 0x'+(((input[i*5+3] & 0x7c) >> 2)).toString(16))
          output += b32a[(input[i * 5 + 3] & 0x7c) >> 2]
          // NB: q cannot be > 4
          // 6 0x00 00 00 03 e0 >>5
          // console.log('O6: 0x'+(((input[i*5+3] & 0x03) << 3)).toString(16))
          output += b32a[(input[i * 5 + 3] & 0x03) << 3]
        }
      }
    }
  }
  // if(count>0) {
  //   let q = 0
  //   while(count < 5) {
  //     acc = acc << 8
  //     q++
  //     count++
  //   }
  //   output += b32a[(acc & 0xf800000000)>>35]
  //   output += b32a[(acc & 0x07c0000000)>>30]
  //   if(q < 3) {
  //     output += b32a[(acc & 0x003e000000)>>25]
  //     output += b32a[(acc & 0x0001f00000)>>20]
  //   }
  //   if(q < 2) {
  //     output += b32a[(acc & 0x00000f8000)>>15]
  //     output += b32a[(acc & 0x0000007c00)>>10]
  //   }
  //   if(q < 1) {
  //     output += b32a[(acc & 0x00000003e0)>>5]
  //   }
  // }
  return output
}
function genid(len) {
  if (!len) len = 15
  return base32(crypto.randomBytes(len))
}

module.exports = {
  base32,
  genid
}
