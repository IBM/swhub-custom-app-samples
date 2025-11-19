const ibm = require('ibm-cos-sdk');

const config = {
    endpoint: process.env.COS_ENDPOINT,
    apiKeyId: process.env.COS_APIKEY,
    serviceInstanceId: process.env.COS_RESOURCE_INSTANCE_ID,
};

const cos = new ibm.S3(config);

const bucketName = process.env.BUCKETNAME;

exports.uploadP3Data = async (key, file) => {

    try {

        return await uploadObject(bucketName, key, JSON.stringify(file));
    } catch (e) {
        console.log(e);
        throw e;
    }


}


var uploadObject = (bucketName, key, file) => {

    try {

        return cos.putObject({
            "Bucket": bucketName,
            "Key": key,
            "Body": file
        }).promise()
            .then(() => {
                console.log(`Item: ${key} created!`);
            })
            .catch((e) => {
                console.log(`ERROR: ${e.code} - ${e.message}\n`);
            });
    } catch (e) {
        console.log(e);
        throw e;
    }

}
