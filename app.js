const express = require("express");
const bodyParser = require("body-parser");

const app = express();


const mongoose = require('mongoose');

mongoose.set('strictQuery', true);



mongoose.connect("mongodb://127.0.0.1/todolistDB",{useNewUrlParser:true}); //make db

const itemsSchema = {
    name:String

};

const Item = mongoose.model("Item" , itemsSchema);



//  var items = [" Complete  section 20 " ," Solve 20 questions "]; //global variable  from more item
 var workItems = [];


app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended :true}));

app.use(express.static("public"));   //to use css file

const item1 =new Item({
    name:"Welcome to you lis " 
});

const item2 =new Item({
    name:"hello " 
});

const defaultItems = [item1,item2];




app.get("/" , function(req,res)
{


    Item.find( {},function(err,foundItems)
    {

        if(foundItems.length === 0)
        {
        
Item.insertMany(defaultItems ,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Suxccess ");
    }
});
res.redirect("/");
  }

  else
  {
        res.render("list",{listTitle :"Today"  ,newListItem : foundItems});
  }
        // console.log(foundItems);
    })

   var today=new Date();
 var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
 };

 var day = today.toLocaleDateString("en-US" ,options);


    // var currentDay = today.getDay();
    // var day="";
    // if(currentDay == 6 || currentDay==0)
    // {
    //     day = "Weekend";
    // }

    // else
    // {
    //     day="weekday";
    // }

    

});


app.post("/" ,function(req,res) 
{
    const itemName =  req.body.newItem; 
    const item = new Item({
        name:itemName
    });
    item.save();

    res.redirect("/");
if(req.body.list ==="Work"){
    workItems.push(item);
    res.redirect("/work");
}
else{
    items.push(item);
    res.redirect("/");
}
});



app.post("/delete" ,function(req,res)
{
   const checkedItemId =  req.body.checkbox;
//    console.log(req.body.checkbox);
   Item.findByIdAndRemove(checkedItemId ,function(err)
   {
    if(!err)
    {
        console.log("successfully deleted");
        res.redirect("/");
    }
   })

})

app.get("/work" ,function(req,res)
{
    res.render("list",{listTitle :"Work List" ,newListItem : workItems});
});


app.post("/work" ,function(req,res) 
{
    var item =  req.body.newItem; 

    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000,function()
{
    console.log("server connect");
});