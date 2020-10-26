
require('./connection')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var load = require('lodash')
var indexRouter = require('./routes/index');
var profile = require('./routes/profile');
var User = require('./models/user');
var Chat = require('./models/chat')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 var userStack = {};

  var userSocket = {};
 
io.on('connection',(socket)=>{



 
socket.on('set-user-data', function(username) {
      console.log(username+ "  logged In");

      socket.username = username;
      userSocket[socket.username] = socket.id;
     
      getuser();
      console.log(userSocket)
      console.log(userStack)
    })






	
  // code for Setting user online or offline1
      function  sendUserStack(){
        for (i in userSocket) {
          for (j in userStack) {
            if (j == i) {
              userStack[j] = "Online";
            }
          }
        }
        io.emit('onlineStack', userStack);
      } 



    
 function getuser(){   
 	User.find({}).exec(function(err, result) {
        if(result){
         
         for (var i = 0; i < result.length; i++) {
            userStack[result[i].username] = "Offline";
        }
        sendUserStack();
      }
})
}
  

    //showing msg on typing.
    socket.on('typing', function(data) {

    socket.broadcast.emit('typing', {toUser:data.toUser,uname:data.username,mss: data.username + ' is typing...'});
    });
  
     socket.on('message',data=>{
      console.log(data);
      savechat(data);
      readchat(data)
     io.emit('message', {toUser:data.toUser,uname:data.username,mss:data.info});
     
 
    })   

     // function oldchat(result){
     // io.emit('message', {toUser:result.to,uname:result.from,mss:result.msg});

     //  }

 function savechat(data){   
  var newChat = new Chat({
        from: data.username,
        to: data.toUser,
        msg: data.msg
        
    });

    newChat.save(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
      }
    });} 




function readchat(data){
     Chat.find({  
      $or: [
    { 'from': data.username },
    { 'to': data.toUser }
    ]}, function(err, result) {
        if (err) {
          console.log(err);
        } 
        else {
          console.log(result)
        }
      }); 
      }                         

	 socket.on('disconnect', function() {
      console.log(socket.username+ " logged out");
      // socket.broadcast.emit('broadcast',{ description: socket.username + ' Logged out'});
      console.log("chat disconnected.");
      load.unset(userSocket, socket.username);
      userStack[socket.username] = "Offline";
      io.emit('onlineStack', userStack);
    });
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(session({

	
  secret: 'sessi0nS3cr3t',
  saveUninitialized: true,
  resave: false
}))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports ={app:app,server:server};
