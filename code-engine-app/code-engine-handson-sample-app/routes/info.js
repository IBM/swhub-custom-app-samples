var express = require('express');
var router = express.Router();
var icos = require("../service/objectstorage");

/* GET users listing. */
router.get('/get', function(req, res, next) {
  var podName = process.env.HOSTNAME || "pod Name desu";
  var configmapValue = process.env.TESTVALUE || "config Map Value desu";
  var bucketName = process.env.BUCKETNAME || "bucket Name desu";

  res.json({
    "podName" : podName,
    "configmapValue" : configmapValue,
    "bucketName" : bucketName
  });
});

router.post('/post',async (req,res) => {

  var podName = process.env.HOSTNAME || "pod Name desu";
  var configmapValue = process.env.TESTVALUE || "configMapValuedesu";
  var bucketName = process.env.BUCKETNAME || "bucket Name desu";

  var json = {
    "podName" : podName,
    "configmapValue" : configmapValue,
    "bucketName" : bucketName
  };

  var key = "code-engine-session-"+podName+"_"+configmapValue+".json";

  try {
    await icos.uploadP3Data(key,json);
    res.json({
      "status" : 200,
      "message" : "ICOSへのUploadが完了しました。"
    })
  } catch (e) {
    res.json({
      "status" : 503,
      "message" : "ICOSへのUploadが失敗しました。"
    })
  }
  

});

module.exports = router;
