// @flow

import fetchMock from 'fetch-mock'
import reviewsResponse from './example-response'
import { getReviewList } from './index'

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
  fetchMock.get(
    'https://www.goodreads.com/review/list/37152837?format=xml&page=1&per_page=200&v=2',
    reviewsResponse,
  )
  const data = await getReviewList(credentials, userID)
  expect(data).toMatchSnapshot()
})
