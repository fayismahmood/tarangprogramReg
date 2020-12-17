let jwt=require("jsonwebtoken")
console.log("https://tarang-r.glitch.me/?h="+jwt.sign({house:"AMPHAN"},"token"));