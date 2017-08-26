import MockDate from 'mockdate'

import { makeRequestOptions } from './make-request'

const data = {
  some: 'data',
  x: 123,
  y: false,
  z: null,
}

const token = 'test-token'
const url = 'https://example.com'

const credentials = {
  consumer: {
    secret: 'consumer_secret',
  },
  user: {
    key: 'user_key',
    secret: 'user_secret',
  }
}

describe('makeRequestOptions', () => {
  beforeAll(() => {
    MockDate.set('2017-01-31T00:00:00Z', -360) // 1/1/2017 Timezone +6

    const mockMath = Object.create(global.Math)
    mockMath.randomOld = Math.random
    mockMath.random = () => 0.5
    window.Math = mockMath
  })

  afterAll(() => {
    MockDate.reset()
    Math.random = Math.randomOld
  })

  test('GET', () => {
    expect(makeRequestOptions('GET', url, credentials, )).toMatchSnapshot('GET')
    expect(makeRequestOptions('GET', url, credentials)).toMatchSnapshot('GET token')
  })

  test('POST', () => {
    expect(makeRequestOptions('POST', url, credentials, data)).toMatchSnapshot('POST')
    expect(makeRequestOptions('POST', url, credentials, data)).toMatchSnapshot('POST token')
  })

  test('PUT', () => {
    expect(makeRequestOptions('PUT', url, credentials, data)).toMatchSnapshot('PUT')
    expect(makeRequestOptions('PUT', url, credentials, data)).toMatchSnapshot('PUT token')
  })

  test('PATCH', () => {
    expect(makeRequestOptions('PATCH', url, credentials, data)).toMatchSnapshot('PATCH')
    expect(makeRequestOptions('PATCH', url, credentials, data)).toMatchSnapshot('PATCH token')
  })

  test('DELETE', () => {
    expect(makeRequestOptions('DELETE', url, credentials, data)).toMatchSnapshot('DELETE')
    expect(makeRequestOptions('DELETE', url, credentials, data)).toMatchSnapshot('DELETE, token')
  })
})
