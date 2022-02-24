const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const nodeMailer = require("nodemailer");
const path = require("path");

const app = express();

// View engine setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", async (req, res) => {
  // ========================================= Message ===============================
  let output = `
        <p>New Message</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.message}</p>
    `;

  try {
    // ==================================== Create Transport ====================================
    // create reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ad1bf2dafb1935",
          pass: "909eb4eb33f46f"
        }
    });

    // ==================================== Send Mail ====================================
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ad1bf2dafb1935', // sender address
      to: "nokibul.mezba@intelli.global", // list of receivers
      subject: "Hello ✔", // Subject line
      html: output, // html body
    });

    res.render("contact", { msg: "Email has been sent" });
  } catch (err) {
    console.log(err);
  }
});

app.listen(9000, () => {
  console.log("Server is started...");
});
