const bcrypt = require("bcrypt");
const Vendor = require("../models/vendor");
const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken } = require("../utils/utilityFunction");

const signUpVendor = async (req, res) => {
  const { password, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, 8);
    await Vendor.create({ ...req.body, password: hash });

    const response = await fetch(
      process.env.EMAIL_AUTH_PROVIDER_URL + "/sendotp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    if (response.ok) {
      res.status(201).json({ response: "OK" });
      return;
    } else {
      sendResponseError(400, "Something wrong please try again", res);
      return;
    }
  } catch (err) {
    console.log("Error: ", err);
    sendResponseError(500, "Something wrong please try again", res);
    return;
  }
};

const verifyVendor = async (req, res) => {
  const { email, otp, chanegPassword } = req.body;
  let hash;
  if (chanegPassword) {
    hash = await bcrypt.hash(chanegPassword, 8);
  }
  try {
    const response = await fetch(
      process.env.EMAIL_AUTH_PROVIDER_URL + "/verifyotp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      }
    );
    if (response.ok) {
      // Find the vendor by email and update the verified field to true
      const vendor = await Vendor.findOneAndUpdate(
        { email: email },
        chanegPassword ? { verified: true, password: hash } : { verified: true },
        { new: true }
      );
      if (!vendor) {
        sendResponseError(404, "Vendor not found", res);
        return;
      }
      if (chanegPassword) {
        res.status(200).send({ status: "ok", message: "Password changed successfully" });
        return;
      }
      const token = newToken(vendor);
      const vendorId = vendor._id;
      let avatarurl = vendor.avatarurl || "";
      res.status(200).send({ status: "ok", token, vendorId, avatarurl });
      return;
    } else {
      sendResponseError(400, "Invalid OTP", res);
      return;
    }
  } catch (err) {
    console.log("Error: ", err);
    sendResponseError(500, "Something wrong please try again", res);
    return;
  }
};

const signInVendor = async (req, res) => {
  const { password, email } = req.body;
  try {
    let vendor;
    vendor = await Vendor.findOne({ email });
    if (!vendor) {
      sendResponseError(
        400,
        "No account found with the provided credentials. Please sign up first.",
        res
      );
      return;
    }
    if (!vendor.verified) {
      res.status(200).send({ status: "you are not verified" });
      return;
    }
    const same = await checkPassword(password, vendor.password);
    if (same) {
      let token = newToken(vendor);
      let vendorId = vendor._id;
      let avatarurl = vendor.avatarurl || "";
      res.status(200).send({ status: "ok", token, vendorId, avatarurl });
      return;
    }
    sendResponseError(400, "Invalid password!", res);
  } catch (err) {
    console.log("Error:", err);
    sendResponseError(500, `Error ${err}`, res);
  }
};

const forgotpassword = async (req, res) => {
  const { email } = req.body;
  try {
    let vendor;
    vendor = await Vendor.findOne({ email });
    if (!vendor) {
      sendResponseError(
        400,
        "No account found with the provided credentials. Please sign up first.",
        res
      );
      return;
    }
    if (!vendor.verified) {
      res.status(401).send({ status: "you are not verified" });
      return;
    }
    else {
      const response = await fetch(
        process.env.EMAIL_AUTH_PROVIDER_URL + "/sendotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      if (response.ok) {
        res.status(201).json({ response: "OK" });
        return;
      }
    }
  } catch (err) {
    console.log("Error:", err);
    sendResponseError(500, `Error ${err}`, res);
  }
};

module.exports = { signUpVendor, signInVendor, verifyVendor, forgotpassword };
