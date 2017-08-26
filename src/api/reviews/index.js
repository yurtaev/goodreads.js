// @flow

import queryString from 'query-string'

import { ENDPOINT } from './../../constants'
import { xmlToJSON } from './../../utils'
import { makeGETRequest } from './../../utils/make-request'

import type { Credentials } from './../../utils/make-request'

/** Type annotation */
export type Review = {
  name: string,
}

type Query = {
  shelf?: string,
  search?: string,
  order?: 'a' | 'd',
  page?: number,
  per_page?: number,
  sort?:
    | 'title'
    | 'author'
    | 'cover'
    | 'rating'
    | 'year_pub'
    | 'date_pub'
    | 'date_pub_edition'
    | 'date_started'
    | 'date_read'
    | 'date_updated'
    | 'date_added'
    | 'recommender'
    | 'avg_rating'
    | 'num_ratings'
    | 'review'
    | 'read_count'
    | 'votes'
    | 'random'
    | 'comments'
    | 'notes'
    | 'isbn'
    | 'isbn13'
    | 'asin'
    | 'num_pages'
    | 'format'
    | 'position'
    | 'shelves'
    | 'owned'
    | 'date_purchased'
    | 'purchase_location'
    | 'condition',
}

const defaultQuery: Query = Object({
  format: 'xml',
  v: 2,
  per_page: 200,
  page: 1,
})

/**
Get the books on a members shelf. Customize the feed with the below variables. Viewing members with profiles who have set them as visible to members only or just their friends requires using OAuth.

- URL: https://www.goodreads.com/review/list?v=2    (sample url)
- HTTP method: GET

Parameters:

- v: 2
- id: Goodreads id of the user
- shelf: read, currently-reading, to-read, etc. (optional)
- sort: title, author, cover, rating, year_pub, date_pub, date_pub_edition, date_started, date_read, date_updated, date_added, recommender, avg_rating, num_ratings, review, read_count, votes, random, comments, notes, isbn, isbn13, asin, num_pages, format, position, shelves, owned, date_purchased, purchase_location, condition (optional)
- search[query]: query text to match against member's books (optional)
- order: a, d (optional)
- page: 1-N (optional)
- per_page: 1-200 (optional)
- key: Developer key (required).

@example
const reviews = await getReviewList(credentials, 37152837)
*/
export const getReviewList = async (
  credentials: Credentials,
  userID: number,
  query: Query = {},
): Promise<Review[]> => {
  const url = `${ENDPOINT}/review/list/${userID}?${queryString.stringify({
    ...defaultQuery,
    ...query,
  })}`
  const resp = await makeGETRequest(url, credentials)
  return xmlToJSON(resp.data)
}
