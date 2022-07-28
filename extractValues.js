const extractValues = (obj) => {
  let data = [];
  data.push(
    obj["type_of_expense"]["static_select-action"]["selected_option"]["text"][
      "text"
    ]
  );
  data.push(obj["date"]["datepicker-action"]["selected_date"]);
  data.push(obj["Name"]["plain_text_input-action"]["value"]);
  data.push(parseInt(obj["Price"]["plain_text_input-action"]["value"]));
  data.push(obj["Url"]["plain_text_input-action"]["value"]);

  const dataObj = {
    "Type of expense": data[0],
    "Date of Expense": data[1],
    "Name of the Product": data[2],
    "Price of the product": data[3],
    Receipt: data[4],
  };

  return dataObj;
};
module.exports = {
  extractValues,
};
