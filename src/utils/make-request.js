// @flow


import { partial, anyPass, equals, not, isNil } from 'ramda'
const OAuth = require('oauth-1.0a')
const CryptoJS = require('crypto-js')

import { prepareResponse } from './prepare-response'

import type { ResponseAPI, MethodType } from './../../types/api'

// var oauth = OAuth({
//   consumer: {
//     key: 'consumer_key',
//     secret: 'consumer_secret',
//   },
//   signature_method: 'HMAC-SHA1',
//   hash_function: (base_string, key) => CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64),
// })

const getOAuthSigner = (credentials: Credentials) => OAuth({
  consumer: {
    ...credentials.consumer,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (base_string, key) => CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64),
})

// var token = {
//   key: 'user_access_key',
//   secret: 'user_access_secret',
// }

type Token = {|
  key: string,
  secret: string,
|}

/** Credentials */
export type Credentials = {
  consumer: {
    secret: string,
  },
  user: {
    key: string,
    secret: string,
  }
}

type Options = {|
  data?: any,
|}

const isPOST = equals('POST')
const isPUT = equals('PUT')
const isPATCH = equals('PATCH')
const isAllowBodyMethod = anyPass([isPOST, isPUT, isPATCH])

export const makeRequestOptions = (method: MethodType, url: string, credentials: Credentials, data: any = {}) => {
  const oauth = getOAuthSigner(credentials)
  const oauth_data = oauth.authorize({ url, method }, credentials.user)
  const oauthHeaders = oauth.toHeader(oauth_data)

  const options = {
    method,
    headers: { ...oauthHeaders },
  }

  if (isAllowBodyMethod(method) && not(isNil(data))) {
    const body = JSON.stringify(data)
    return {
      ...options,
      body,
    }
  }

  return options
}

export const makeAPIRequest = async (
  method: MethodType,
  url: string,
  credentials: Credentials,
  data?: any,
): Promise<ResponseAPI<any>> => {
  const options = makeRequestOptions(method, url, credentials, data)


  try {
    const response = await fetch(url, options)

    try {
      return await prepareResponse(response)
    } catch (err) {
      return Promise.reject(err)
    }
  } catch (err) {
    return Promise.reject({
      ok: false,
      status: -1,
      error: 'Network error',
      data: err,
    })
  }
}

export const makeGETRequest = partial(makeAPIRequest, ['GET'])
export const makePOSTRequest = partial(makeAPIRequest, ['POST'])
export const makePUTRequest = partial(makeAPIRequest, ['PUT'])
export const makePATCHRequest = partial(makeAPIRequest, ['PATCH'])
export const makeDELETERequest = partial(makeAPIRequest, ['DELETE'])
