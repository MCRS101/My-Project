const Product = require('../Models/Models_products');




exports.read = async(req,res)=>{
    try {
        const id = req.params.id;
        const producted = await Product.findOne({_id: id}).exec();
    res.send(producted);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}
exports.list = async(req,res)=>{
    try {
        const producted = await Product.find({}).exec();
    res.send(producted);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}
exports.create = async(req,res)=>{
    try {
    console.log(req.body);
    const producted = await Product(req.body).save();
    res.send(producted);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}
exports.update = async(req,res)=>{
    try {
    
    const id = req.params.id;
    const updated = await Product.findOneAndUpdate({_id: id}, req.body, {new: true}).exec();
    res.send(updated);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}

exports.remove = async(req,res)=>{
    try {
    const id = req.params.id;
    const deleted = await Product.findOneAndDelete({_id: id}).exec();
    res.send(deleted);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}