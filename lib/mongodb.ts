import { MongoClient, Db } from "mongodb"

const options = {}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Please add your MongoDB URI to .env")
  }

  return uri
}

function getClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri()

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }

    return global._mongoClientPromise
  }

  const client = new MongoClient(uri, options)
  return client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db("theboysmenswear")
}

export default getClientPromise
