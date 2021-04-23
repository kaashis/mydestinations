const { default: axios } = require("axios");

if(!process.env.PORT){
    require("../Secrets");
}


function getUID(){
    //generate six random numbers

    let uid ="";

    for (let i=0; i<6;i++){
        const rand = Math.floor(Math.random()*10)
        uid+=rand
    }
    return uid
}

async function getPhotoFromUnsplash(name){
const URL =`https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&&page=1&query=${name}`;
    //`https://images.unsplash.com/photo-1497215728101-856f4ea42174?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwyMjUzODF8MHwxfHNlYXJjaHwxfHxvZmZpY2V8ZW58MHx8fHwxNjE5MTI5NDYw\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=400`;


    const res = await axios.get(URL)

    const photos = res.data.results;

    let fallbackPhoto=`https://images.unsplash.com/photo-1497215728101-856f4ea42174?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwyMjUzODF8MHwxfHNlYXJjaHwxfHxvZmZpY2V8ZW58MHx8fHwxNjE5MTI5NDYw\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=400`;

    let photoIndx = Math.ceil(Math.random()*photos.length);
    console.log(photoIndx);
    
    if(photos.length===0)
        return fallbackPhoto;

    return photos[0].urls.small;
}
module.exports = {
    getUID,
    getPhotoFromUnsplash,
} 