const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const uploadFile = async (storedopath) => {
  const filePath = path.join(__dirname, storedopath);
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "ss.jpg", //This can be name of your choice
        mimeType: "image/jpg",
      },
      media: {
        mimeType: "image/jpg",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
    return response.data.id;
  } catch (error) {
    console.log(error.message);
  }
};

//uploadFile();

const generatePublicUrl = async (id) => {
  try {
    const fileId = id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
    return result.data.webViewLink;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  uploadFile,
  generatePublicUrl,
};
