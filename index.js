let express = require('express');
let app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser')
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.set('view engine', 'ejs');
app.use(express.static('dist'))

let {db}=require("./funcs/db")

app.get('/', (req, res) => {
  res.render('index', {foo: 'FOO'});
});
app.get("/getRegProgs",(req,res)=>{
    res.json(db.value())
})

io.on('connection', (socket) => {
    console.log('a user connected');
   
});

let crudOp={
    Add:(obj)=>{
        let NewOBj={
            Time:new Date(),
            cont:obj.cont,
            prog:obj.prog,
            catagory:obj.catagory,
            house:obj.house,
        }
        db.get("regedProg")
        .push(
            NewOBj
        ).write()
        io.sockets.emit("added", NewOBj);
        return "Added"
    },
    Delete:(obj)=>{
        let time=obj.Time;
        db.get("regedProg").remove({Time:time}).write()
        io.sockets.emit("removed", obj);
        console.log("dele",time);
    }
}


app.post("/crud",(req,res)=>{
    let b= req.body
    res.send(crudOp[b.action](b.data))

})

http.listen(4000, () => {
    console.log('listening on *:3000');
  });