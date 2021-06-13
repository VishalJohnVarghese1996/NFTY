const express = require("express");
const mysql = require("mysql");
const bodyparser = require('body-parser')
const cors = require("cors");
const app = express();
const FileType = require('file-type');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');

var im =

  app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(bodyparser.json());



const db = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "password",
  database: "nft_db",
});

const options = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nft_db'
  }
}

const knex = require('knex')(options);

app.post("/register", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const username = req.body.username;
  const publicAddress = req.body.account;
  let password = req.body.newPassword;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", username).update(password).digest("hex");
  db.query(
    "INSERT INTO user_data (user_name, password, name, email_id, public_address) VALUES (?,?,?,?,?)",
    [username, password, name, email, publicAddress],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/api/createTokenImage", async (req, res) => {

  const title = req.body.title;
  const price = req.body.price;

  var dt = new Date();

  var options = {
    year: "numeric",
    month: "2-digit",
    day: "numeric"
  };

  var date = dt.toLocaleDateString("en", options)

  const data = req.files.file.data;
  const tokenArray = JSON.parse(req.body.tokenArray);
  const txHash = req.body.txHash;
  const ownerAddress = req.body.owner;
  const action = req.body.action;

  const low_res = await sharp(data)
    .metadata()
    .then(({ width }) => sharp(data)
      .resize(Math.round(width * 0.5))
      .toBuffer()
    );


  for (i = 0; i < tokenArray.length; i++) {

    // insert into image data table
    const sqlInsert = "INSERT INTO image_data (image, low_res_image, token_id, address, title, price, date) VALUES (?,?,?,?,?,?,?);"

    console.log(tokenArray[i]);
    db.query(sqlInsert, [data, low_res, tokenArray[i], ownerAddress, title, price, date], (err, result) => {
      console.log(err);
    })

    // insert into tx table
    const sqlInsertTx = "INSERT INTO tx_data (tx_hash, token_id, action) VALUES (?,?,?);"

    db.query(sqlInsertTx, [txHash, tokenArray[i], action], (err, result) => {
      console.log(err);
    })
  }
});

app.post("/loginAdmin", (req, res) => {
  const username = req.body.username;
  let password = req.body.password;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", username).update(password).digest("hex");
  db.query(
    "SELECT * FROM user_data where user_name=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length !== 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong UserID/Password" });
        }
      }
    }
  );
});

app.post("/loginPatient", (req, res) => {
  const userid = req.body.userid;
  const password = req.body.password;
  const crypto = require("crypto");
  // password = crypto.createHmac("sha256", userid).update(password).digest("hex");
  db.query(
    "SELECT* FROM patients where PID=? AND Password=?",
    [userid, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length !== 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong UserID/Password" });
        }
      }
    }
  );
});

app.post("/patientChangePassword", (req, res) => {
  const userid = req.body.userid;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let confirmPassword = req.body.confirmPassword;

  const crypto = require("crypto");
  oldPassword = crypto
    .createHmac("sha256", userid)
    .update(oldPassword)
    .digest("hex");
  db.query(
    "SELECT* FROM patients where PID=? AND Password=?",
    [userid, oldPassword],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length === 0) {
          res.send({ message: "Wrong UserID/Password" });
        }
      }
    }
  );
  if (newPassword !== confirmPassword) {
    res.send({ message: "New password does not match with confirm password!" });
  }
  newPassword = crypto
    .createHmac("sha256", userid)
    .update(newPassword)
    .digest("hex");
  db.query(
    "SELECT* FROM patients where PID=? AND Password=?",
    [userid, oldPassword],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length !== 0) {
          var privateEncryptOld = result[0].privateEncrypt;
          let pbkdf2 = require("pbkdf2");
          let symmetricKey = pbkdf2.pbkdf2Sync(
            oldPassword,
            "salt",
            1,
            32,
            "sha256"
          );
          symmetricKey = symmetricKey.toString("hex");
          let aes256 = require("aes256");
          var decryptedPrivKey = aes256.decrypt(
            symmetricKey,
            privateEncryptOld
          );
          var privateEncryptNew = aes256.encrypt(
            symmetricKey,
            decryptedPrivKey
          );

          db.query(
            "UPDATE patients SET Password=?, privateEncrypt=? WHERE PID=?",
            [newPassword, privateEncryptNew, result[0].PID]
          );
        }
      }
    }
  );
});

app.post("/loginDoctor", (req, res) => {
  const userid = req.body.userid;
  let password = req.body.password;
  const crypto = require("crypto");
  // password = crypto.createHmac("sha256", userid).update(password).digest("hex");
  db.query(
    "SELECT* FROM doctors where DID=? AND Password=?",
    [userid, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length !== 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong UserID/Password" });
        }
      }
    }
  );
});

app.get("/patients", (req, res) => {
  var eccryptoJS = require("eccrypto-js");

  db.query("SELECT* FROM patients", async (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (result) {
        for (let i = 0; i < result.length; i++) {
          const password = result[i].Password;
          let pbkdf2 = require("pbkdf2");
          let symmetricKey = pbkdf2.pbkdf2Sync(
            password,
            "salt",
            1,
            32,
            "sha256"
          );
          symmetricKey = symmetricKey.toString("hex");
          let aes256 = require("aes256");
          var decryptedPrivKey = aes256.decrypt(
            symmetricKey,
            result[i].privateEncrypt
          );
          if (result[i].iv != null) {
            const encrypted = {
              iv: Buffer.from(result[i].iv, "hex"),
              ephemPublicKey: Buffer.from(result[i].ephemPubKey, "hex"),
              ciphertext: Buffer.from(result[i].EHR, "hex"),
              mac: Buffer.from(result[i].mac, "hex"),
            };
            const decrypted = await eccryptoJS.decrypt(
              Buffer.from(decryptedPrivKey, "hex"),
              encrypted
            );
            result[i].EHR = decrypted.toString("utf8");
          }
        }
        res.send(result);
      } else {
        res.send({ message: "Can not retrieve the data right now" });
      }
    }
  });
});


app.get("/api/buy:Address", (req, res) => {

  const Address = req.params.Address;

  const sqlBuy = "SELECT * FROM image_data where address <> ?;"

  db.query(sqlBuy, [Address], (err, result) => {
    res.send(result);
  });
});


app.post("/api/transferToken:userImage", (req, res) => {

  const token_id = req.params.userImage;
  const newOwner = req.body.newOwner;
  const action = req.body.action;
  const txHash = req.body.txHash;

  var dt = new Date();

  var options = {
    year: "numeric",
    month: "2-digit",
    day: "numeric"
  };

  var date = dt.toLocaleDateString("en", options)

  // transfer token
  const sqlBuy = "UPDATE image_data SET address = ?, date = ? WHERE token_id = ?;"
  db.query(sqlBuy, [newOwner, date, token_id], (err, result) => {
  });

  // add tx to tx_data
  const sqlInsertTx = "INSERT INTO tx_data (tx_hash, token_id, action) VALUES (?,?,?);"

  db.query(sqlInsertTx, [txHash, token_id, action], (err, result) => {
    console.log(err);
  })
});


app.post("/api/buyToken:userImage", (req, res) => {

  const token_id = req.params.userImage;
  const newOwner = req.body.newOwner;
  const action = req.body.action;
  const txHash = req.body.txHash;

  // transfer token
  const sqlBuy = "UPDATE image_data SET address = ?, date = ? WHERE token_id = ?;"
  db.query(sqlBuy, [newOwner, date, token_id], (err, result) => {
  });

  // add tx to tx_data
  const sqlInsertTx = "INSERT INTO tx_data (tx_hash, token_id, action) VALUES (?,?,?);"

  db.query(sqlInsertTx, [txHash, token_id, action], (err, result) => {
    console.log(err);
  })

});

app.get("/api/oneItem:UserImage", (req, res) => {

  const UserImage = req.params.UserImage;
  const sqlGetItem = "SELECT * FROM image_data where token_id = ?;"

  db.query(sqlGetItem, [UserImage], (err, result) => {
    res.send(result);
  });
});

app.get("/api/getTx:UserImage", (req, res) => {

  const UserImage = req.params.UserImage;
  const sqlGetItem = "SELECT tx_hash, action FROM tx_data where token_id = ?;"

  db.query(sqlGetItem, [UserImage], (err, result) => {
    res.send(result);

    // console.log(result[0].tx_hash);
  });

});


app.get("/api/getCreator:creator", (req, res) => {

  const creatorAddress = req.params.creator;
  const sqlGetItemCreator = "SELECT * FROM user_data where public_address = ?;"

  db.query(sqlGetItemCreator, [creatorAddress.toString()], (err, result) => {
    // console.log(result);

    if(result[0]){
      res.send(result[0].user_name);
    }
  });
});


app.get("/api/getOwner:owner", (req, res) => {

  const ownerAddress = req.params.owner;
  const sqlGetItemOwner = "SELECT * FROM user_data where public_address = ?;"

  db.query(sqlGetItemOwner, [ownerAddress.toString()], (err, result) => {
    // console.log(result);

    if(result[0]){
      res.send(result[0].user_name);
    }
  });
});


app.get("/api/get:Address", (req, res) => {

  const address = req.params.Address;

  const sqlGet = "SELECT * FROM image_data where address=?;"

  db.query(sqlGet, [address], (err, result) => {
    res.send(result);
  });
});

app.post("/api/getBuyDetails", (req, res) => {

  const token_id = req.body.token_id;

  const sqlGetDetails = "SELECT address, price FROM image_data where token_id = ?;"

  db.query(sqlGetDetails, [token_id], (err, result) => {
    res.send(result[0]);
  });
});

app.get("/imgBuy/:id", async (req, res) => {

  const id = req.params.id;
  const img = await knex('image_data').where({ token_id: id }).first();

  if (img) {
    const contentType = await FileType.fromBuffer(img.low_res_image); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
    res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
    res.send(img.low_res_image);
  } else {
    res.send('No Img with that Id!');
  }
});


app.get("/imgMy/:id", async (req, res) => {

  const id = req.params.id;
  const img = await knex('image_data').where({ token_id: id }).first();

  if (img) {
    const contentType = await FileType.fromBuffer(img.image); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
    res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
    res.send(img.image);
  } else {
    res.send('No Img with that Id!');
  }
});

app.listen(3001, () => {
  console.log("running server");
});
