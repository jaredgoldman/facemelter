require('dotenv').config();
import { Game } from './types';
import { players } from './mockdata';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
const uri: string = process.env.MONGO_URI;

if (!uri) {
  throw new Error('no uri');
} else {
  console.log('uri:', uri);
}

const client = new MongoClient(uri);

const addPlayers = async () => {
  try {
    await client.connect();
    const database: Db = client.db('facemelter');
    const collection: Collection = database.collection('users');
    await collection.insertMany(players.roundOne);
  } catch (error) {
    console.log('error adding players');
  }
};

const findGame = async () => {
  try {
    await client.connect();
    const database: Db = client.db('facemelter');
    const collection: Collection = database.collection('game');
    return await collection.findOne();
  } catch (error) {
    console.log('error finding game');
  }
};

const addGame = async () => {
  try {
    const game = {
      round: 'roundOne',
      players: players.roundOne,
    };
    await client.connect();
    const database: Db = client.db('facemelter');
    const collection: Collection = database.collection('game');
    return await collection.insertOne(game);
  } catch (error) {
    console.log('error adding game');
  }
};

const updateGame = async (data: Game, gameId: ObjectId) => {
  await client.connect();
  const database: Db = client.db('facemelter');
  const collection: Collection = database.collection('game');
  return await collection.findOneAndReplace({ _id: gameId }, data);
};

const clearGame = async (gameId: ObjectId) => {
  await client.connect();
  const database: Db = client.db('facemelter');
  const collection: Collection = database.collection('game');
  return await collection.deleteOne({ _id: gameId });
};

export { addPlayers, findGame, addGame, updateGame, clearGame };
