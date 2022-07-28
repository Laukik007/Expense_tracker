var express = require("express");
var multer = require("multer");
const { uploadFile, generatePublicUrl } = require("./upload");
var port = 3000;

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  async (req, res, next) => {
    console.log(JSON.stringify(req.file.path));
    const id = await uploadFile(req.file.path);
    const link = await generatePublicUrl(id);
    var response = '<a href="/">Home</a><br>';

    response += "Files uploaded successfully.<br>";
    response += "Public link is.<br>";
    response += `<p>${link}</p><br>`;
    response += `<img src="${req.file.path}" /><br>`;

    return res.send(response);
  }
);

app.listen(port, () => console.log(`Server running on port ${port}!`));
