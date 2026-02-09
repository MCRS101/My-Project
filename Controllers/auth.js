const user = require('../Models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.id = async (req,res)=>{
    try {
        const { id } = req.params;

        const userData = await user.findById(id).select("name");

        if(!userData){
            return res.status(404).json({msg:ไม่พบผู้ใช้})
        }
        res.status(200).json(userData);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:`User บ่ได้มีนะ`})
    }
}

exports.register = async (req, res) => {
    try {
        //1.Check User
    
        const {name, password, email,phone} = req.body;
        var USER = await user.findOne({name});
     
        if (USER) {
            return res.status(400).json({msg: 'User already exists'});
            
        }
        
        //2.Hash Password
        const salt = await bcrypt.genSalt(10);
        USER = new user ({
            name, 
            password,
            email,
            phone
        });
            USER.password = await bcrypt.hash(password, salt);
            
        //3.Save
      console.log(USER);
        await USER.save();
        res.status(201).json({msg: 'User Registered Successfully'});


      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Server Error1'});
    }
};

exports.login = async (req, res) => {
    try {

        //1.Check User Password
        const {name, password} = req.body;
        var USER = await user.findOneAndUpdate({ name },{new: true});
        
        if(USER){
            const isMatch = await bcrypt.compare(password, USER.password);
            if(!isMatch){
                return res.status(400).json({msg: 'Invalid Credentials'});
            }
        //2.Payload
            var payload = {
                USER:{
                    id: USER._id,
                    name: USER.name
                    
                }
        }
        //3.generate token
        jwt.sign(payload, 'jwtSecret',{ expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, payload });
            console.log("Payload:", payload);
        })
        
      
    } else {
        return res.status(400).send({msg: 'User Not Found'});
    }

    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Server Error'});
    }
};