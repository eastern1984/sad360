// firebase deploy
const functions = require('firebase-functions');
const {Storage} = require('@google-cloud/storage');
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.onFileChange = functions.storage.object().onFinalize(event => {
    const object = event;
    const bucket = object.bucket;
    const contentType = object.contentType;
    const filePath = object.name;
    console.log('123456');

    if (path.basename(filePath).startsWith('resize-')) {
        console.log('Already resized');
        return;
    }

    const storage = new Storage({
        projectId: 'sad360-b2790',
      });
    const destBucket = storage.bucket(bucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };

    return destBucket.file(filePath).download({
        destination: tmpFilePath
    }).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '250x250', tmpFilePath]).then(() => {
            return destBucket.upload(tmpFilePath, {
                destination: 'resize-' + path.basename(filePath),
                metadata: metadata
        })
        
        })
    });
  });