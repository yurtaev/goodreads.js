// @flow

import fetchMock from 'fetch-mock'
import shelvesResponse from './example-response'
import { getShelves } from './index'

const credentials = {
  consumer: {
    secret: 'consumer_secret',
  },
  user: {
    key: 'user_key',
    secret: 'user_secret',
  },
}

const userID = 37152837

afterEach(() => {
  fetchMock.restore()
})

test('get', async () => {
  fetchMock.get('https://www.goodreads.com/shelf/list.xml?user_id=37152837', shelvesResponse)
  const data = await getShelves(credentials, userID)
  expect(data).toMatchSnapshot()
})
