var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat')

/* GET users listing. */

            router.get('/', function (req, res, next) {
			if(req.session.loggedin){
				var name = req.session.username;
		        var email = req.session.email ;
				Chat.find().exec(function(err, result) {


            if(result){
                 // for(var i=0;i<result.length;i++){
            // console.log("this is read data ........"+result[i].msg)
         	 res.render('chat',{name:name,email:email,result:result})

            // }
        }



				})
			}else{
				res.redirect('/')
			}
			})
			









module.exports = router;
