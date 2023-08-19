const Redis = require("ioredis");
const settings = require("./settings");

/**
 * A class for managing redis in this server.
 * Beware that without the environment variable 'serverUUID' the class will not operate correctly.
 */
class RedisManager
{
    constructor()
    {
        console.log(`Open Redis connection to: ${settings.redisHost} on port ${settings.redisPort}`);
        this._redis = new Redis(`redis://${settings.redisHost}:${settings.redisPort}`);
        this.serverId = settings.serverUUID;
    }

    /**
     * This function pushes a new message to the time key of this server 
     * (in case there is more than one server it will handle it correctly)
     * @param {object} data An object with 2 properties: 'time' and 'message'
     */
    async insertData(data){
        console.log(`Instering new data. key: ${this.serverId}:${data.time} # value: ${data.message}`);
        await this._redis.rpush(`${this.serverId}:${data.time}`, data.message);
    }

    /**
     * 
     * @returns All keys for this server.
     */
    async allKeysForThisServer(){
        return await this._redis.keys(`${this.serverId}:*`);
    }

    async getTimesForThisServer(){
        const keys = await this._redis.keys(`${this.serverId}:*`);
        return keys.map(currentKey => currentKey.replace(`${this.serverId}:`, ""))
    }

    /**
     * This function will return all the messages relevant for this key
     * @param {string} key to fetch message for
     * @returns list of messages
     */
    async getAllMessagesForKey(key){
        return await this._redis.lrange(key, 0, -1);
    }

    async getValuesForTime(value){
        return await this._redis.lrange(`${this.serverId}:${value}`, 0, -1);
    }
    
    /**
     * 
     * @returns list with objects for all data in redis for this server
     */
    async getAllForThisServer(){
        const keys = await this.allKeysForThisServer();
        var finalResult = [];

        for(const key of keys){
            const valuesForKey = await this.getAllMessagesForKey(key);
            for(const value of valuesForKey){
                finalResult.push({
                    time: key,
                    message: value
                })
            }
        }

        return finalResult;
    }

    /**
     * 
     * @param {string} value iso-string for the time you want to delete from redis
     */
    async deleteForTime(value){
        console.log(`Delete for ${value}`);
        await this._redis.del(`${this.serverId}:${value}`);
    }

    async deleteForKey(key){
        await this._redis.del(key);
    }

    async deleteAll(){
        console.log(`Deleting all`);
        const keys = await this.allKeysForThisServer();
        for(const key of keys){
            await this.deleteForKey(key);
        }
    }
}

module.exports = new RedisManager();

