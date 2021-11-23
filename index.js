const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')

const AuthRoute = require('./Routes/Auth.route')
const UsersRoute = require('./Routes/User.route')

const Message = require('./Models/Messages')
const User = require('./Models/User.model')

const app = express()
app.use(cors({ origin: '*' }));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('port', 3030);

const http = require('https');

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});



////SOCKET ///

const io = require('socket.io')(
  server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}
);

io.on('connection', (socket) => {
  console.log('usuario conectado');

  io.emit('start', 'Hello to My Chat');

  socket.on('online', msg => {
    console.log('se conecto', msg)
    User.findOneAndUpdate({ _id: msg }, { online: true }).then(() => {
      //Obtener todos los mensajes
      Message.find().sort({ test: -1 }).then(result => {
        console.log('mensajes enviados')
        io.emit('load-messages', result)
      });
    })

  })


  /* socket.on('sendChatToServer', (message) => {
      console.log(message);
       //io.sockets.emit('sendChatToClient', message);
      socket.broadcast.emit('sendChatToClient', message);
  });*/

  socket.on('send-message', msg => {
    //crear nuevo mensaje
    console.log('new msg', msg)
    const message = new Message({ text: msg.text, user_id: msg.user_id });
    //Guardar nuevo mensajsend-messagee

    message.save().then(() => {
      console.log('guardado')
      //io.emit('receive-message', message)
      try {
        socket.broadcast.emit('receive-message', message);
      } catch (error) {
        
      }
      //reenviar mensaje
    })
  })

  socket.on('disconnect', (socket) => {
    console.log('Usuario desconectado');
  });
});



app.get('/', async (req, res, next) => {
  res.send('WELLCOME TO MY CHAT \\(o o ,)//.')
})

app.use('/api/auth', AuthRoute)

app.use('/api', UsersRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})