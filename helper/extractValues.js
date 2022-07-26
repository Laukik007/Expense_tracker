const extractTypeOfExpense = (obj) => {
  let inputreceived = null;
  Object.keys(obj).forEach((fieldname) => {
    inputreceived =
      obj[fieldname]["type_of_expense"]["selected_option"]["text"]["text"];
    //console.log("input received", inputreceived);
  });
  return inputreceived;
};
const extractDate = (obj) => {
  let inputreceived = null;
  Object.keys(obj).forEach((fieldname) => {
    inputreceived = obj[fieldname]["datepicker-action"]["selected_date"];
    //console.log("input received", inputreceived);
  });
  return inputreceived;
};
module.exports = {
  extractTypeOfExpense,
  extractDate,
};
