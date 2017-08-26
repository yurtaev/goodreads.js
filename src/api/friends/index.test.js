// @flow

import fetchMock from 'fetch-mock'
import friendsResponse from './example-response'
import { getFriends } from './index'

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
  fetchMock.get('https://www.goodreads.com/friend/user/37152837?format=xml', friendsResponse)
  const data = await getFriends(credentials, userID)
  expect(data).toMatchSnapshot()
})
