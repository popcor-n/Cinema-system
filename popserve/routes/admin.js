var express = require('express');
var adminController = require('../controllers/admin.js');
var router = express.Router();

/* GET users listing. */



router.get('/', adminController.index);
router.get('/usersList',adminController.usersList);
router.post('/deleteUser' , adminController.deleteUser);

module.exports = router;