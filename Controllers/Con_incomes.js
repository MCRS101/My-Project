const Income = require('../Models/Models_incomes');


exports.create = async(req,res)=>{
    try {
    console.log(req.body);
    const Incomeing = await Income(req.body).save();
    res.send(Incomeing);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}

exports.list = async (req, res) => {
    try {
    const { id } = req.params;

    const incomes = await Income.find({
      Income_ID: id
    });

    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

exports.read = async (req, res) => {
      try {
    const { id } = req.params;
    const { day, month, year } = req.query;

    let filter = { Income_ID: id };

    // ====== กรณีเลือกวัน ======
    if (day && month && year) {
      const start = new Date(year, month - 1, day);
      const end = new Date(year, month - 1, Number(day) + 1);

      filter.Income_Date = { $gte: start, $lt: end };
    }

    // ====== กรณีเลือกเดือน ======
    else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      filter.Income_Date = { $gte: start, $lt: end };
    }

    // ====== กรณีเลือกปี ======
    else if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);

      filter.Income_Date = { $gte: start, $lt: end };
    }

    const incomes = await Income.find(filter).sort({ Income_Date: 1 });

    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}
