const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require('fs')
const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}));

   app.get("/api/users",(req,res) => {
    return res.json(users);
});
   app.get("/api/users/:id",(req,res) =>{
    const id=Number( req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});
     app.post("/api/users",(req,res) =>{
        const body = req.body;
        users.push({...body,id: users.length+1});
        fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
            return res.json({status:"success",id:users.length});

        });
     
});
    app.patch("/api/users/:id",(req,res) =>{
        const id = parseInt(req.params.id);
        const updatedUserData = req.body;
    
   
        let users = []; 
    

        fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to load users" });
            }
            users = JSON.parse(data);
    
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                return res.status(404).json({ status: "error", message: "Item not found" });
            }
    
          
            users[userIndex] = { ...users[userIndex], ...updatedUserData };
    
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Failed to update item" });
                }
                return res.json({ status: "success", id: users[userIndex].id });
            });
        });  
   
    
    });

    app.delete("/api/users/:id",(req,res) =>{
        const userId = parseInt(req.params.id);

        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
    
        users.splice(userIndex, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to delete user" });
            }
            return res.json({ status: "success", message: "User deleted successfully" });
        });
        
        });
    
app.listen(PORT,() => console.log('Server Started at PORT:${PORT}'))