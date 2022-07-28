var Airtable = require("airtable");
const api_key = process.env.AIRTABLE_API_KEY;
const base_id = process.env.AIRTABLE_BASE_ID;
var base = new Airtable({ apiKey: api_key }).base(base_id);
const createRecord = (tableId, Data) => {
  base(tableId).create(
    [
      {
        fields: Data,
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
};
module.exports = {
  createRecord,
};
