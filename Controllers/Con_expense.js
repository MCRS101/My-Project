const Expense = require('../Models/Models_expenes')


exports.create = async(req,res)=>{
    try {
    console.log(req.body);
    const Expenses = await Expense(req.body).save();
    res.send(Expenses);       
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}


exports.list = async (req, res) => {
    try {
    const { id } = req.params;

    const Expenses = await Expense.find({
      Expense_ID: id
    });

    res.json(Expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

exports.read = async (req, res) => {
    try {
    const { id } = req.params;
  const { month, year } = req.query;

  let filter = { Expense_ID: id };

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    filter.Expense_Date = { $gte: start, $lt: end };
  }

  const expenses = await Expense.find(filter).sort({ Expense_Date: 1 });
  res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}
