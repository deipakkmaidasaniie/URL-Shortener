const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Shorturl=require('./models/shortUrl');
const port=8080;
mongoose.connect("mongodb://localhost/urlShortener",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
},()=>{
    console.log("connected to database");
})
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');

app.get('/',async(req,res)=>{
    const shortUrls=await Shorturl.find();
    res.render('index',{
        shortUrls:shortUrls
    });
});
app.post('/shortUrl',(req,res)=>{
     Shorturl.create({full:req.body.fullUrl})
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await Shorturl.findOne({ short: req.params.shortUrl })
    console.log(req.params.shortUrl);
    if (shortUrl == null) return res.sendStatus(404).json;
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
  
app.listen(process.env.port || port,()=>{
    console.log("app started at ",port)
});