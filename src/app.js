import express from 'express';
import { urlencoded, json } from 'body-parser';
import { initWorker, generateKey } from 'openpgp';
const app = express();

initWorker({ path: 'openpgp.worker.js' });

//BODY PARSER TO PARSE DATA FROM REQUEST
app.use(urlencoded({
    extended: true
}));
app.use(json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/pgpgen', (req, res) => {
    if (!req.body || !req.body.name || !req.body.email || !req.body.passphrase)
        res.send('Error: Invalid data pased. Expect: name, email, numBits and passphrase');
    else {
        const name = req.body.name;
        const email = req.body.email;
        // const numBits = req.body.numBits ? req.body.numBits : 2048;
        const numBits = 2048;
        const passphrase = req.body.passphrase;

        //**********
        //TEST
        // const name = "test name";
        // const email = "test@test.com";
        // const numBits = 2048;
        // const passphrase = "secret^^";
        //**********

        var options = {
            userIds: [{ name: name, email: email }],
            numBits: numBits,
            passphrase: passphrase
        };
        console.log(options);
        var pubKey, privKey, fingerPrint;
        // (async() => {
        generateKey(options).then(key => {
            privKey = key.privateKeyArmored;
            pubKey = key.publicKeyArmored;
            fingerPrint = key.key.keyPacket.getFingerprint();
            console.log('Key generated');
            const resObj = {
                privKey,
                pubKey,
                fingerPrint
            }
            console.log(resObj);
            res.send(resObj);
        }).catch(function (error) {
            console.error(error);
            res.send(error);
        });
        // });
    }
});

app.listen(3005, () => console.log('APP Port 3005!'))
