const settings = require("./settings");
const RedisManager = require("./RedisManager");
const {saveAndScheduleLog, startup} = require("./utils");

const express = require('express');
const app = express();

app.use(express.json());

app.post('/echoAtTime', (req, res) => {
    saveAndScheduleLog(req.body.time, req.body.message)
    .then(()=>res.send())
    .catch(()=>res.sendStatus(500));
})


startup().then(()=>{
    app.listen(settings.serverPort, () => {
        console.log(`Server up on port: ${settings.serverPort}`)
    });
});
