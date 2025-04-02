const nodemailer = require("nodemailer");
require("dotenv").config();

// send mail function
exports.SendMail = async (to, subject, data, type) => {
    // Type - 1 for verification mail
    // Type - 2 for forgot password mail
    // Type - 3 for 2fa mail

    if (type === 1) message = RegisterMailTemplate(data);

    if (type === 2 || type === 5) message = ForgerPasswordMailTemplate(data);

    if (type === 3) message = TwoFactorAuthMailTemplate(data);

    if (type === 4) message = ChangeEMailTemplate(data);

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

const RegisterMailTemplate = (data) => {
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
                                style="padding: 18px 33px 8px 33px; font-size: 20px; line-height: 28px;color: #11181d; text-align: center;">
                                <h3 style="margin: 0; ">Verify Your E-mail Address</h3>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                <p style="font-size:20px; line-height: 28px; margin: 0;">
                                  Hi, we are happy to see you signed up for Vibe Chats. Are you ready to boost your chat experience!
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                <p style="font-size:20px; line-height: 28px; margin: 0;">
                                  To start chatting on Vibe Chats platform please confirm your e-mail address by entering the verification code.
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
                              <td bgcolor="#fff" style="padding: 16px 33px 12px 33px; color: #200E32;">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Best Regards, <br>Vibe Chats</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0px 33px 16px 33px; color: #200E32;">
                                  <p style="font-size:12px; margin: 0;">
                                    This is an automatically generated email, please do not reply.
                                    If you need to contact Vibe Chats team you can <a href="mailto:kushal.doshi@saturncube.com" target="_blank">email</a> us.
                                  </p>
                              </td>
                          </tr>
                    </tbody>
                </table> <!-- footer -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#f5f5f5" style="padding: 12px; color: #11181d;">
                                <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;">
                                  Sent by Vibe Chats | © Vibe Chats, 2025 
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

const ForgerPasswordMailTemplate = (data) => {
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
                                  <h3 style="margin: 0; ">Password Reset - Email Verification!</h3>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    Hello user,
                                  </p>
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    DON’T WORRY! Everyone forgets sometimes but we’ve got you covered. Please find below the verification code to complete your password reset on <a href="https://vibe-chats.vercel.app" target="_blank">Vibe Chats</a>.
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
                              <td bgcolor="#fff" style="padding: 16px 33px 12px 33px; color: #200E32;">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Best Regards, <br>Vibe Chats</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0px 33px 16px 33px; color: #200E32;">
                                  <p style="font-size:12px; margin: 0;">
                                    This is an automatically generated email, please do not reply.
                                    If you need to contact Vibe Chats team you can <a href="mailto:kushal.doshi@saturncube.com" target="_blank">email</a> us.
                                  </p>
                              </td>
                          </tr>
                      </tbody>
                  </table> <!-- footer -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td align="center" bgcolor="#f5f5f5" style="padding: 12px; color: #11181d;">
                                  <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;">
                                    Sent by Vibe Chats | © Vibe Chats, 2025 
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
                                  style="padding: 18px 33px 8px 33px; font-size: 20px; line-height: 28px;color: #11181d; text-align: center;">
                                  <h3 style="margin: 0; ">2FA - Email Verification!</h3>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    Hello user,
                                  </p>
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    You recently attempted to login to your Vibe Chats account. In order to complete your login, please use the below code & complete the verification on <a href="https://vibe-chats.vercel.app" target="_blank">Vibe Chats</a>.
                                  </p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 8px 33px; color: #000; ">
                                  <p style="font-size:16px; line-height: 28px; margin: 0;">
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
                              <td bgcolor="#fff" style="padding: 16px 33px 12px 33px; color: #200E32;">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Best Regards, <br>Vibe Chats</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0px 33px 16px 33px; color: #200E32;">
                                  <p style="font-size:12px; margin: 0;">
                                    This is an automatically generated email, please do not reply.
                                    If you need to contact Vibe Chats team you can <a href="mailto:kushal.doshi@saturncube.com" target="_blank">email</a> us.
                                  </p>
                              </td>
                          </tr>
                      </tbody>
                  </table> <!-- footer -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td align="center" bgcolor="#f5f5f5" style="padding: 12px; color: #11181d;">
                                  <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;">
                                    Sent by Vibe Chats | © Vibe Chats, 2025 
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

const ChangeEMailTemplate = (data) => {
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
                                  style="padding: 18px 33px 8px 33px; font-size: 20px; line-height: 28px;color: #11181d; text-align: center;">
                                  <h3 style="margin: 0; ">New Email Verification!</h3>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 18px 33px; color: #000; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    Hello user,
                                  </p>
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">
                                    You recently attempted to change email address to your Vibe Chats account. In order to complete your new email verification, please use the below code & complete the verification on <a href="https://vibe-chats.vercel.app" target="_blank">Vibe Chats</a>.
                                  </p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 8px 33px; color: #000; ">
                                  <p style="font-size:16px; line-height: 28px; margin: 0;">
                                    Note that old email will be replaced and you can only login with this email.
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
                              <td bgcolor="#fff" style="padding: 16px 33px 12px 33px; color: #200E32;">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Best Regards, <br>Vibe Chats</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0px 33px 16px 33px; color: #200E32;">
                                  <p style="font-size:12px; margin: 0;">
                                    This is an automatically generated email, please do not reply.
                                    If you need to contact Vibe Chats team you can <a href="mailto:kushal.doshi@saturncube.com" target="_blank">email</a> us.
                                  </p>
                              </td>
                          </tr>
                      </tbody>
                  </table> <!-- footer -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td align="center" bgcolor="#f5f5f5" style="padding: 12px; color: #11181d;">
                                  <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;">
                                    Sent by Vibe Chats | © Vibe Chats, 2025 
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