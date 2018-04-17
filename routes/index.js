var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login',function (req,res,next) {
   res.render('index');
});
router.post('/logout',function (req,res,next) {
    res.render('login');
})
module.exports = router;
