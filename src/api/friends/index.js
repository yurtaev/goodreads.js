// @flow

import { ENDPOINT } from './../../constants'
import { xmlToJSON } from './../../utils'
import { makeGETRequest } from './../../utils/make-request'
import type { Credentials } from './../../utils/make-request'

/**
Get an xml response with the given user's friends using OAuth.
Parameters:

- id: Goodreads user_id (required)
- page: 1-N (optional, default 1)
- sort: first_name|date_added|last_online (optional)
@example
const friends = await getFriends(credentials, 37152837)
*/
export const getFriends = async (credentials: Credentials, userID: number): Promise<Credentials> => {
  const url = `${ENDPOINT}/friend/user/${userID}?format=xml`
  const resp = await makeGETRequest(url, credentials)
  return xmlToJSON(resp.data)
}
