import { OAuth } from 'oauth'
import xml2js from 'xml2js'
import util from 'util'
import opn from 'opn'
import http from 'http'
import url from 'url'
import program from 'commander'

const DEFAULT_SERVER_PORT = 8000

program
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --port [port]', `Port [${DEFAULT_SERVER_PORT}]`, DEFAULT_SERVER_PORT)

program.parse(process.argv)

let session = {}

const key = process.env.GOODREADS_API_KEY
const secret = process.env.GOODREADS_API_SECRET

const sleep = (time = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })

const PROTOCOL = 'https'
const HOST = 'www.goodreads.com'
const ENDPOINT = `${PROTOCOL}://${HOST}`
const OAUTH_REQUEST_URL = `${ENDPOINT}/oauth/request_token`
const OAUTH_ACCESS_URL = `${ENDPOINT}/oauth/access_token`
const OAUTH_AUTH_URL = `${ENDPOINT}/oauth/authorize`

const oauth = new OAuth(OAUTH_REQUEST_URL, OAUTH_ACCESS_URL, key, secret, '1.0A', null, 'HMAC-SHA1')

const requestToken = () => {
  return new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
      if (error) {
        return reject(`Error getting OAuth request token : ${JSON.stringify(error)}`, 500)
      } else {
        // assemble goodreads URL
        let url = `https://goodreads.com/oauth/authorize?oauth_token=${oauthToken}&oauth_callback=http://127.0.0.1:${program.port}/`
        return resolve({ oauthToken, oauthTokenSecret, url })
      }
    })
  })
}

const processCallback = (oauthToken, oauthTokenSecret, authorize) => {
  return new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      oauthToken,
      oauthTokenSecret,
      authorize,
      (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        let parser = new xml2js.Parser()
        if (error) {
          reject(
            `Error getting OAuth access token : ${util.inspect(
              error,
            )}[${oauthAccessToken}] [${oauthAccessTokenSecret}] [${util.inspect(results)}]`,
            500,
          )
        } else {
          oauth.get(
            'http://www.goodreads.com/api/auth_user',
            oauthAccessToken,
            oauthAccessTokenSecret,
            (error, data, response) => {
              if (error) {
                reject(`Error getting User ID : ${util.inspect(error)}`, 500)
              } else {
                return parser.parseString(data)
              }
            },
          )
        }

        return parser.on('end', result => {
          result = result.GoodreadsResponse // Object is now getting this in front of the object
          if (result.user[0]['$'].id !== null) {
            resolve({
              username: result.user[0].name[0],
              userid: result.user[0]['$'].id,
              success: 1,
              accessToken: oauthAccessToken,
              accessTokenSecret: oauthAccessTokenSecret,
            })
          } else {
            reject('Error: Invalid XML response received from Goodreads', 500)
          }
        })
      },
    )
  })
}

const main = async () => {
  session = await requestToken()
  console.log('Open =>', JSON.stringify(session))

  // open url
  opn(session.url, { wait: false })
}

const view = async (req, res) => {
  const { query } = url.parse(req.url, true)
  console.log('req', query)
  const auth = await processCallback(query.oauth_token, session.oauthTokenSecret, query.authorize)
  res.end(JSON.stringify(auth, null, 4))
}

const server = http.createServer(view)
server.listen(program.port, main)

console.log(`Server started on port ${program.port}`)
