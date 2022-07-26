const makeObj = (data) => {
  const obj = {
    "Type of Expense": data[0],
    "Date of Expense": data[1],
    "Name of Product": data[2],
    "Price of Product": data[3],
  };
  console.log(obj);
};

module.exports = {
  makeObj,
};
