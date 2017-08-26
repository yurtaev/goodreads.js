// fetch() polyfill for making API calls.
import 'isomorphic-fetch'

import program from 'commander'

import { getFriends, getReviewList, getShelves } from '../src'

const getCredentials = () => ({
  consumer: {
    secret: program.goodreadsSecret,
  },
  user: {
    key: program.userKey,
    secret: program.userSecret,
  },
})

program
  .version('0.0.1')
  .usage('[options]')
  .option('--goodreads-secret [goodreadsSecret]', 'Your Goodreads Secret [GOODREADS_API_SECRET]', process.env.GOODREADS_API_SECRET)
  .option('--user-key [userKey]', 'User access_key [GOODREADS_USER_KEY]', process.env.GOODREADS_USER_KEY)
  .option('--user-secret [userSecret]', 'User access_secret [GOODREADS_USER_SECRET]', process.env.GOODREADS_USER_SECRET)

program
  .command('friends <userID>')
  .description("Get a user's friends")
  .action(async (userID) => {
    try {
      const credentials = getCredentials()
      const friends = await getFriends(credentials, userID)
      console.log(JSON.stringify(friends, null, 4))
    } catch (err) {
      console.log(err)
    }
  })

program
  .command('reviews <userID>')
  .description('Get the books on a members shelf')
  .action(async (userID) => {
    try {
      const credentials = getCredentials()
      const reviews = await getReviewList(credentials, userID)
      console.log(JSON.stringify(reviews, null, 4))
    } catch (err) {
      console.log(err)
    }
  })

program
  .command('shelves <userID>')
  .description("Get a user's shelves")
  .action(async (userID) => {
    try {
      const credentials = getCredentials()
      const shelves = await getShelves(credentials, userID)
      console.log(JSON.stringify(shelves, null, 4))
    } catch (err) {
      console.log(err)
    }
  })

program.parse(process.argv)
