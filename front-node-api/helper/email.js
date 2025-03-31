const nodemailer = require("nodemailer");
require("dotenv").config();

// send mail function
exports.SendMail = async (to, subject, data, type) => {
  // Type - 1 for verification mail
  // Type - 2 for forgot password mail
  // Type - 3 for 2fa mail

  if (type === 1) message = TwoFactorAuthMailTemplate(data);
  
  try {

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: message,
    });
    // console.log("info : ", info)
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const TwoFactorAuthMailTemplate = (data) => {
  // console.log("Otp : ", data)
  let logo = 'https://raw.githubusercontent.com/Kushal1402/LiveChat/develop/front-node-api/static_assets/vibe_chats.png';
  let otp = data;

  let emailBody = `
  <!DOCTYPE html>
    <html>

    <head>
        <title>Email verification OTP</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link
            href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet">
        <style>
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }

            img {
                -ms-interpolation-mode: bicubic;
            }

            /* RESET STYLES */
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }

            table {
                border-collapse: collapse !important;
            }

            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            @media screen and (max-width:600px) {
                h1 {
                    font-size: 30px !important;
                    line-height: 34px !important;
                }

                h2 {
                    font-size: 18px !important;
                    line-height: 26px !important;
                }

                .profile {
                    width: 180px;
                }
            }
        </style>
    </head>

    <body style="margin: 0 !important; padding: 0 !important; font-family: 'Rubik', sans-serif;">
        <div style="max-width: 900px; margin: 0 auto; padding: 0; width: 100%;">
            <table border="0" bgcolor="#566DCB" cellpadding="0" cellspacing="0" width="100%">

                <tr>
                    <td bgcolor="#f5f5f5" align="center" style="padding: 25px 0px;">
                        <img src=${logo} width="70px" />
                        <h1 style="font-family: 'Rubik', sans-serif; font-size:32px; line-height:48px; color: #11181d; margin: 0;">
                            Vibe Chats 
                        </h1>
                    </td>
                </tr> <!-- body content -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td bgcolor="#fff"
                                style="padding: 18px 33px 16px 33px; font-size: 20px; line-height: 28px;color: #11181d; text-align: center;">
                                <h2 style="margin: 0; ">EMAIL VERIFICATION!</h2>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                <p style="font-size:20px; line-height: 28px; margin: 0;">You are attempting to verify your
                                    email address for Vibe Chats login. Please copy the verification code and complete
                                    the verification.
                                    Note that two-factor authentication (2FA) is enabled for login.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f5f5f5"
                                style="padding: 0; margin-bottom: 28px; text-align: center; color: #11181d; ">
                                <h2 style="margin: 8px;">CODE: ${otp}</h2>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff" style="padding: 16px 33px 16px 33px; color: #200E32;">
                                <p style="font-size:20px; line-height: 28px; margin: 0;">Best Regards, <br>Vibe Chats</p>
                            </td>
                        </tr>
                    </tbody>
                </table> <!-- footer -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#f5f5f5" style="padding: 12px; color: #11181d;">
                                <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;">
                                  Sent by Vibe Chats | Copyright Vibe Chats, 2025 
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </table>
        </div>
    </body>

    </html>
  `;

  return emailBody;
}