const Savings = require('../Models/Models_savings');


exports.create = async(req,res)=>{
    try {
    console.log(req.body);
    const Save = await Savings(req.body).save();
    res.send(Save);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}

exports.list = async (req, res) => {
    try {
    const { id } = req.params;

    const Save = await Savings.find({
      Income_ID: id
    });

    res.json(Save);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

exports.update = async(req,res) =>{
try {
    const { amount } = req.body;

    const goal = await Savings.findById(req.params.goalId);
    if (!goal) return res.status(404).json("ไม่พบเป้าหมาย");

    goal.InAmount += Number(amount);
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

exports.remove = async(req,res) =>{
  try {

    const deleted = await Savings.findByIdAndDelete(req.params.goalId);

    if (!deleted) {
      return res.status(404).json("ไม่พบเป้าหมาย");
    }

    res.json({ message: "ลบสำเร็จ", deleted });

  } catch (err) {
    res.status(500).send("Server Error");
  }
}