const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const busboy = require('busboy');
const { randomFillSync } = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const random = (() => {
    const buf = Buffer.alloc(16);
    return () => randomFillSync(buf).toString('hex');
})();

// Conftest evaluate function for post evaluate route
const evaluate = (req, res, next) => {
    const saveTo = path.join(__dirname, '../../tmp', `tmp-upload-${random()}`);
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
        console.log(saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    bb.on('finish', async () => {
        const eval = await exec('conftest test ' + saveTo, function (error, stdout, stderr) {
            if (error) {
                console.log(stderr)
                fs.unlinkSync(saveTo);
                res.writeHead(500, {'Connection': 'close'})
                res.end(stdout);
            }
            else {
                fs.unlinkSync(saveTo);
                res.writeHead(200, { 'Connection': 'close' });
                res.end(stdout);
            }
        });     
    });
    req.pipe(bb);
};

const version = async (req, res, next) => {
    const version = await exec('conftest -v');
    res.send(version.stdout)
};

module.exports = {evaluate, version};