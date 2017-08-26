// @flow

import { failure } from 'awaiting'

import { prepareResponse } from './prepare-response'

const dataOK = "xml data"
const dataError = "response error"

describe('prepareResponse', () => {
  test('200', async () => {
    const response = new Response(dataOK, {
      ok: true,
      status: 200,
    })

    const resp = await prepareResponse(response)

    expect(resp).toMatchSnapshot('200')
  })

  test('400', async () => {
    const response = new Response(dataError, {
      ok: false,
      status: 400,
    })

    const err = await failure(prepareResponse(response))
    expect(err).toMatchSnapshot('400')
  })

  test('401', async () => {
    const response = new Response(dataError, {
      ok: false,
      status: 401,
    })

    const err = await failure(prepareResponse(response))
    expect(err).toMatchSnapshot('401')
  })

  test('500', async () => {
    const response = new Response(dataError, {
      ok: false,
      status: 500,
      statusText: 'internal server error',
    })

    const err = await failure(prepareResponse(response))
    expect(err).toMatchSnapshot('500')
  })

  test('Unknown response status', async () => {
    const response = new Response(dataError, {
      ok: false,
      status: 500,
      statusText: 'Unknown response status',
    })

    const err = await failure(prepareResponse(response))
    expect(err).toMatchSnapshot('500')
  })
})
