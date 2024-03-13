import { createClient, RedisClientType } from 'redis'
import hash from 'object-hash'
import { env } from '@/env'

// Initialize the Redis client variable
let redisClient: RedisClientType

async function initializeRedisClient() {
  // Read the Redis connection URL from the environment variables
  const redisURL = env.REDIS_URI
  if (redisURL) {
    // Create the Redis client object
    redisClient = createClient({ url: redisURL })

    // Error handling for Redis client creation
    redisClient.on('error', (err: any) => {
      console.error('Failed to create the Redis client with error:', err)
    })

    try {
      // Connect to the Redis server
      await redisClient.connect()
      console.log('Connected to Redis successfully!')
    } catch (err) {
      console.error('Connection to Redis failed with error:', err)
    }
  }
}

function requestToKey(req: { query: any; body: any; path: any }) {
  // Build a custom object to use as part of the Redis key
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  }

  // Construct the Redis key using request path and hashed request data
  return `${req.path}@${hash.sha1(reqDataToHash)}`
}

function isRedisWorking() {
  // Verify whether there is an active connection to a Redis server or not
  return redisClient && redisClient.isOpen
}

async function writeData(key: string, data: any, options: { EX: number }) {
  if (isRedisWorking()) {
    try {
      // Write data to the Redis cache
      await redisClient.set(key, JSON.stringify(data), options)
    } catch (err) {
      console.error(`Failed to cache data for key=${key}`, err)
    }
  }
}

async function readData(key: string) {
  if (isRedisWorking()) {
    // Try to get the cached response from Redis
    return await redisClient.get(key)
  }
  return null
}

// async function deleteData(key: string) {
//   // Delete specific key
//   return await redisClient?.del(key)
// }

function redisCachingMiddleware(options = { EX: 21600 }) {
  return async (
    req: any,
    res: {
      send: (arg0: { fromCache: boolean; data: any }) => any
      statusCode: { toString: () => string }
    },
    next: () => void,
  ) => {
    if (isRedisWorking()) {
      const key = requestToKey(req)
      // If there is some cached data, retrieve it and return it
      const cachedValue = await readData(key)
      console.log('Reading data in Redis...')
      if (cachedValue) {
        try {
          // If it is JSON data, then return it
          return res.send({
            fromCache: true,
            data: JSON.parse(cachedValue),
          })
        } catch (err) {
          console.error('Error parsing cached JSON data:', err)
        }
      } else {
        // Override how res.send behaves to introduce the caching logic
        const oldSend = res.send
        res.send = function (data: any) {
          // Set the function back to avoid the 'double-send' effect
          res.send = oldSend
          // Cache the response only if it is successful
          if (res.statusCode.toString().startsWith('2')) {
            writeData(key, data, options).then()
            console.log('Writing data in Redis...')
          }

          return res.send(data)
        }
        // Continue to the controller function
        next()
      }
    } else {
      // Proceed with no caching
      next()
    }
  }
}

export { initializeRedisClient, redisCachingMiddleware, redisClient }
