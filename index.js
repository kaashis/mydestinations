// require express
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const {getUID, getPhotoFromUnsplash}= require("./Services");

//call express to create our server
const server = express();
server.use(cors());

//express to grab the body from a client's request and
// create a body property on the request object
//req.body
server.use(express.json());

//expect to get some payload data directly from a form 
//when you do put them on req.body
server.use(express.urlencoded({extended:true}))

//make our server listen on a port
const PORT = process.env.PORT || 3000
server.listen(PORT,(req,res)=>{
    console.log(`Server listening on PORT: ${PORT}`);
});

//database
const {db} = require("./Database");


//routes
//CRUD
//Create Read Update Delete
//POST GET PUT DELETE

//GET / => db : READ operation
server.get("/",(req,res)=>{
    res.send(db);
});

//GET /?location => destinations in that location
server.get("/", (req,res)=>{
    const {location}= req.query

    if(!location) return res.status(400).json({error:"location required"})

    const locations = db.filter(dest=>dest.location.toLowerCase()===location.toLowerCase())

    return res.send(locations)
})

//POST / : CREATE
//expects {name, location, description?}
//before we create a destination in our db, we wiull get a photo of that destination from Unsplash
//server.post("/Destinations",(req,res)=>)
server.post("/", async(req,res)=>{
    //console.log("/Inside POST/");
    //console.log(req.body);

    const{name,location, description}= req.body;

    if (!name||!location)
        return res.status(400).send("name and location required ");

    //generate a random UID
    const uid = getUID();

    //get picture from Unsplash
    const photo = await getPhotoFromUnsplash(name);


        db.push({
            uid,
            name,
            photo,
            location,
            description:description || ""
        })

        res.send({uid,name, photo, location, description});

}
);

//PUT  /?uid : UPDATE operation
//expect {name, location, desciption?}

server.put("/", async(req,res)=>{

    let {uid} = req.body;
        
    if(!uid|| uid.toString().length !==6) return res.status(400).json({error:"uid is a required 6 digit number"});

    const{ name, location, description}= req.body;

    if(!name&& !location && !description){
        return res.status(400).json({error:"we need at least one property to update"});
    }

    for (let index =0; index<db.length;index++){
        const dest =db[index];

        if(dest.uid===uid){
            dest.description=description ? description:dest.description;
            dest.location = location? location : dest/location;

            if(name){
                //first get the photo and then update name and photo
                const photo = await getPhotoFromUnsplash(name);
                dest.name = name;
                dest.photo = photo;
            return res.send(db[index]).send({satus:"found and updated"});
            }
        }
        else
            res.send({status:"not found"})
    }

    //let index;
    // if ("uid" in req.body && uid1.length==6) {

    //   for (var i = 0; i < db.length; i++) {
    //     if (db[i].uid === uid1) {
    //       index = i;
    //       console.log(db[i]);
    //       db[i].name = req.body.name;
    //       db[i].description = req.body.description;
    //     }
    //   }
    //   console.log(db[index]);
    // } else res.status(400).json({ error: "uid is a required 6 digit number" });
    
})

//DELETE /?uid
server.delete("/", (req,res)=>{

    let {uid} = req.body;
        
    if(!uid|| uid.toString().length !==6) return res.status(400).json({error:"uid is a required 6 digit number"});

    const matchingCondition= (element)=> element.uid===uid;
    let matchingElementIndex=db.findIndex(matchingCondition);
    if(matchingElementIndex!==-1){
        delete db[matchingElementIndex];
        return res.send(db);
    }
    else  return res.send({status:"No matching element found"})

    // for (let index =0; index<db.length;index++){
    //     const dest =db[index];
    //     if(dest.uid===uid){ 
    //         console.log(db[index]);
    //         delete db[index];
    //         return res.send(db);
    //     }     
    // }
     
    // return res.send("not found")
}
    ) 