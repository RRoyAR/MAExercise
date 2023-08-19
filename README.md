# MAExercise

## Installation

1. Deploy Redis
make sure to set the environment variables related:     
```
REDIS_URL=
REDIS_PORT=
```   
2. Run this server
make sure to set the environment variables related:     
```
SERVER_PORT=
SERVER_UUID=
```   

## RedisManager

This is a class for managing our data in a persistant redis database.  
Each server should has its own unique ID (provided via evirinment variable ```SERVER_UUID```).

The data is messages and the time the message should be logged to the console.

In case of a server failure it will be able to read all data and log accordingly. In case a message should have been logged to the console when the server was down, it will be logged when the server is up and running again.

The data saved in the following format:  
The keys are in the pattern: ```SERVER_UUID:time``` and the value is a list of all the messages that should be logged in that particular point of time.

## Methodology

Every message that should be logged is provided to the function ```saveAndScheduleLog``` in ```utils.js```.

The message is saved into redis.  
If no other messages are to be logged in that time present, then we'll setTimeout using the function ```setTimeoutForMessages```.  
It calculates when the message should be logged using ```targetTime - currentTime``` providing it to the setTimeout callback.

The setTimeout callback will read from redis the messages it should log, log them, and then earase the messages so they will not ever be logged again (i.e when the server goes down and up again).

### On startup
The same function ```setTimeoutForMessages``` describe above is called on startup.


## APIS (RestAPI)

Description  | HTTP Method |   endpoint  | params |
-------------|-------------|-------------|--------|
echo message at the time provided   | GET         | /echoAtTime  |   ```{"time": "2023-08-20T16:02", "message": "Hello World!"}```     | 

## Notes

* Add validator to inputs 






