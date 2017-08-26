// @flow

import { ENDPOINT } from './../../constants'
import { xmlToJSON } from './../../utils'
import { makeGETRequest } from './../../utils/make-request'
import type { Credentials } from './../../utils/make-request'

/**
Lists shelves for a user.

URL: https://www.goodreads.com/shelf/list.xml    (sample url)
HTTP method: GET

Parameters:

- key: Developer key (required)
- user_id: Goodreads user id (required)
- page: 1-N (default 1).
@example
const shelves = await getShelves(credentials, 37152837)
*/
export const getShelves = async (credentials: Credentials, userID: number): Promise<Credentials> => {
  const url = `${ENDPOINT}/shelf/list.xml?user_id=${userID}`
  const resp = await makeGETRequest(url, credentials)
  console.log(resp);
  return xmlToJSON(resp.data)
}
