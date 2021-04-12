const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "EHR_database",
});

app.post("/register", (req, res) => {
  const userid = req.body.userid;
  const username = req.body.username;
  let password = req.body.newPassword;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", userid).update(password).digest("hex");
  db.query(
    "INSERT INTO users (Userid, Username, Password) VALUES (?,?,?)",
    [userid, username, password],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/loginAdmin", (req, res) => {
  const userid = req.body.userid;
  let password = req.body.password;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", userid).update(password).digest("hex");
  db.query(
    "SELECT* FROM users where Userid=? AND Password=?",
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

app.post("/loginPatient", (req, res) => {
  const userid = req.body.userid;
  let password = req.body.password;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", userid).update(password).digest("hex");
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
          console.log(result);
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
          console.log("126", privateEncryptOld);
          var decryptedPrivKey = aes256.decrypt(
            symmetricKey,
            privateEncryptOld
          );
          console.log("130", decryptedPrivKey);
          var privateEncryptNew = aes256.encrypt(
            symmetricKey,
            decryptedPrivKey
          );
          console.log("135", privateEncryptNew);

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
  password = crypto.createHmac("sha256", userid).update(password).digest("hex");
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
  // console.log("hfiefef");
  var eccryptoJS = require("eccrypto-js");

  db.query("SELECT* FROM patients", async (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (result) {
        console.log(result.length);
        for (let i = 0; i < result.length; i++) {
          console.log(result[i]);
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

app.get("/doctors", (req, res) => {
  db.query("SELECT* FROM doctors", (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (result) {
        res.send(result);
      } else {
        res.send({ message: "Can not retrieve the data right now" });
      }
    }
  });
});

app.post("/patient/add", async (req, res) => {
  var eccryptoJS = require("eccrypto-js");
  const pid = req.body.pid;
  const age = req.body.age;
  const first = req.body.firstName;
  const last = req.body.lastName;
  const address = req.body.address;
  let password = req.body.password;

  const crypto = require("crypto");
  password = crypto.createHmac("sha256", pid).update(password).digest("hex");
  let pbkdf2 = require("pbkdf2");
  let symmetricKey = pbkdf2.pbkdf2Sync(password, "salt", 1, 32, "sha256");

  const keyPair = eccryptoJS.generateKeyPair();

  const str = "test message to encrypt";
  var privKey = keyPair.privateKey;
  console.log("Buffer: ", privKey);
  var pubKey = keyPair.publicKey.toString("hex");

  console.log("Public Key is: ", pubKey);
  console.log("private key is: ", privKey);
  // console.log("Private Key is: ", privKey.toString("hex"));
  // pubKey = Buffer.from(pubKey, "hex").toString("base64");
  privKey = privKey.toString("hex");
  console.log("In palin format, pric ke", privKey);
  let aes256 = require("aes256");
  symmetricKey = symmetricKey.toString("hex");
  var encryptedPrivKey = aes256.encrypt(symmetricKey, privKey);
  db.query(
    "INSERT INTO patients (PID, FirstName, LastName, Address, Age, Password, privateEncrypt, publicKey) VALUES(?,?,?,?,?,?,?,?)",
    [pid, first, last, address, age, password, encryptedPrivKey, pubKey],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/patient/updateEHR", async (req, res) => {
  var eccryptoJS = require("eccrypto-js");
  const pid = req.body.PID;
  let EHR = req.body.EHR;
  let pubKey;
  db.query(
    "SELECT publicKey FROM patients WHERE PID=?",
    [pid],
    async (err, result) => {
      if (result) {
        pubKey = result[0].publicKey;
        console.log("This is the pubkey: ", pubKey);
        pubKey = Buffer.from(pubKey, "hex");
        console.log(pubKey);
        const encrypted = await eccryptoJS.encrypt(
          pubKey,
          eccryptoJS.utf8ToBuffer(EHR)
        );
        console.log(encrypted);

        db.query(
          "UPDATE patients SET EHR=?, iv=?, mac=?, ephemPubKey=?  WHERE PID=?",
          [
            encrypted.ciphertext.toString("hex"),
            encrypted.iv.toString("hex"),
            encrypted.mac.toString("hex"),
            encrypted.ephemPublicKey.toString("hex"),
            pid,
          ],
          (err, result) => {
            console.log(err);
          }
        );
      }
    }
  );
});

app.post("/doctor/add", (req, res) => {
  const did = req.body.did;
  const first = req.body.firstName;
  const last = req.body.lastName;
  const address = req.body.address;
  let password = req.body.password;
  const specialization = req.body.specialization;
  const crypto = require("crypto");
  password = crypto.createHmac("sha256", did).update(password).digest("hex");
  db.query(
    "INSERT INTO doctors (DID, FirstName, LastName, Address, Specialization, Password) VALUES(?,?,?,?,?,?)",
    [did, first, last, address, specialization, password],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/relatedDoctor/remove", (req, res) => {
  const pid = req.body.PID;
  const did = req.body.DID;
  db.query(
    "DELETE FROM relateddidtopid WHERE DID=?  AND PID=?",
    [did, pid],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/patient/remove", (req, res) => {
  const pid = req.body.pid;
  db.query("DELETE FROM patients WHERE PID=?", [pid], (err, result) => {
    console.log(err);
  });
});

app.post("/doctor/remove", (req, res) => {
  const did = req.body.DID;
  db.query("DELETE FROM doctors WHERE DID=?", [did], (err, result) => {
    console.log(err);
  });
});

app.post("/relatedDoctor/add", (req, res) => {
  const pid = req.body.PID;
  const did = req.body.DID;
  let EHR = req.body.EHR;
  const crypto = require("crypto");
  var sharedSecret = crypto.randomBytes(32); // 128-bits === 16-bytes
  var textSecret = sharedSecret.toString("base64");
  let aes256 = require("aes256");
  var encryptedEHR = aes256.encrypt(textSecret, EHR === "" ? "_" : EHR);
  db.query(
    "INSERT INTO relateddidtopid values(?,?,?,?,NOW())",
    [did, pid, encryptedEHR, textSecret],
    (err, result) => {
      console.log(err);
    }
  );
});

app.get("/patient/:PID", async (req, res) => {
  const path = req.url;
  const pid = path.slice(path.lastIndexOf("/")).slice(1);
  var eccryptoJS = require("eccrypto-js");
  db.query("SELECT * from patients WHERE PID=?", [pid], async (err, result) => {
    if (err) {
      res.send({ err: err });
    } else if (result) {
      const password = result[0].Password;
      let pbkdf2 = require("pbkdf2");
      let symmetricKey = pbkdf2.pbkdf2Sync(password, "salt", 1, 32, "sha256");
      symmetricKey = symmetricKey.toString("hex");
      let aes256 = require("aes256");
      var decryptedPrivKey = aes256.decrypt(
        symmetricKey,
        result[0].privateEncrypt
      );

      if (result[0].iv !== null) {
        const encrypted = {
          iv: Buffer.from(result[0].iv, "hex"),
          ephemPublicKey: Buffer.from(result[0].ephemPubKey, "hex"),
          ciphertext: Buffer.from(result[0].EHR, "hex"),
          mac: Buffer.from(result[0].mac, "hex"),
        };
        const decrypted = await eccryptoJS.decrypt(
          Buffer.from(decryptedPrivKey, "hex"),
          encrypted
        );
        result[0].EHR = decrypted.toString("utf8");
      } else {
        result[0].EHR = "";
      }
      res.send(result);
    }
  });
});

app.get("/doctor/:DID", (req, res) => {
  const path = req.url;
  const did = path.slice(path.lastIndexOf("/")).slice(1);
  db.query("SELECT * from doctors WHERE DID=?", [did], (err, result) => {
    if (err) {
      res.send({ err: err });
    } else if (result) {
      res.send(result);
    }
  });
});

app.get("/doctorRelatedToPatient/:DID", (req, res) => {
  const path = req.url;
  const did = path.slice(path.lastIndexOf("/")).slice(1);
  db.query(
    "SELECT PID from relateddidtopid WHERE DID=?",
    [did],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else if (result) {
        res.send(result);
      }
    }
  );
});

app.get("/getEHRRelated/:DID/:PID", (req, res) => {
  const path = req.url;
  const pid = path.slice(path.lastIndexOf("/")).slice(1);
  const temp = path.slice(0, path.lastIndexOf("/"));
  const did = temp.slice(temp.lastIndexOf("/")).slice(1);
  let aes256 = require("aes256");
  db.query(
    "SELECT EncryptedEHR, symm_key from relatedDidToPid WHERE DID=? AND PID=?",
    [did, pid],
    (err, result) => {
      console.log("452", result);
      if (err) {
        res.send({ err: err });
      } else if (result) {
        var EHR = aes256.decrypt(result[0].symm_key, result[0].EncryptedEHR);
        result[0].EncryptedEHR = EHR;
        res.send(result);
      }
    }
  );
});

app.get("/patientRelatedToDoctor/:PID", (req, res) => {
  const path = req.url;
  const pid = path.slice(path.lastIndexOf("/")).slice(1);
  db.query(
    "SELECT DID from relateddidtopid WHERE PID=?",
    [pid],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else if (result) {
        res.send(result);
      }
    }
  );
});

app.listen(3001, () => {
  console.log("running server");
});
