// @flow

import { propEq, cond, T, propSatisfies } from 'ramda'

import type { ResponseAPI } from './../../types/api'

export const isOK = propEq('ok', true)
export const isNotOK = propEq('ok', false)

export const is20x = propSatisfies(status => status >= 200 && status <= 299, 'status')
export const is40x = propSatisfies(status => status >= 400 && status <= 499, 'status')
export const is50x = propSatisfies(status => status >= 500 && status <= 599, 'status')

const on20x = async (response: Response) => {
  const result = await response.text()
  return {
    ok: true,
    status: response.status,
    data: result,
  }
}

const on50x = async (response: Response) => {
  const text = await response.text()
  return Promise.reject({
    ok: false,
    statusText: response.statusText,
    status: response.status,
    error: text,
  })
}

const on40x = async (response: Response) => {
  const result = await response.text()
  return Promise.reject({
    ok: false,
    status: response.status,
    error: result,
  })
}

const onUnknow = (response: Response) =>
  Promise.reject({
    ok: false,
    status: response.status,
    statusText: response.statusText,
    error: 'Unknown response status',
  })

const onOK = async (response: Response) => cond([[is20x, on20x]])(response)
const onNotOK = async (response: Response) =>
  cond([[is40x, on40x], [is50x, on50x], [T, onUnknow]])(response)

export const prepareResponse = async (response: Response): Promise<ResponseAPI<any>> =>
  cond([[isOK, onOK], [isNotOK, onNotOK]])(response)
