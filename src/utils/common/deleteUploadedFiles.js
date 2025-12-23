const fs = require("fs");

const deleteUploadedFiles = (files) => {
  if (!files) return;

  // single file (school_logo)
  if (files.school_logo) {
    files.school_logo.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }

  // multiple files (school_assets)
  if (files.school_assets) {
    files.school_assets.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};

module.exports = deleteUploadedFiles;
