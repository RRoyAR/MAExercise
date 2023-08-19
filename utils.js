const RedisManager = require("./RedisManager");

async function startup(){
    console.log("Startup procedure started");

    const serverTimes = await RedisManager.getTimesForThisServer();
    for(const currentTime of serverTimes){
        setTimeoutForMessages(currentTime);
    }

    console.log("Startup procedure ended");
}

function setTimeoutForMessages(TimeToLog){
    const targetTime = new Date(TimeToLog);
    const currentTime = new Date();
    const messageTimeout = targetTime - currentTime;

    /* If got here it means that its the first time. 
    *  Therefor we'll add the setTimeout for logging the message. 
    */
    setTimeout(async ()=>{
        const messages = await RedisManager.getValuesForTime(TimeToLog);
        for(const message of messages){
            console.log(message);
        }

        await RedisManager.deleteForTime(TimeToLog);
       
    }, messageTimeout)
}

async function saveAndScheduleLog(time, message){
    await RedisManager.insertData({time, message});
    var currentValues = await RedisManager.getValuesForTime(time);
    if(currentValues.length > 1){
        return; //No need for additional set timeout
    }

    setTimeoutForMessages(time);
} 

module.exports.setTimeoutForMessages = setTimeoutForMessages;
module.exports.saveAndScheduleLog = saveAndScheduleLog;
module.exports.startup = startup;
