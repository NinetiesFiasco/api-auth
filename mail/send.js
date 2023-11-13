const {google} = require('googleapis')
const nodemailer = require('nodemailer')

const CLIENT_ID = process.env.GMAIL_CLIENT_ID
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
const BIG_PROBLEM_EMAIL = process.env.BIG_PROBLEM_EMAIL
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URL
const TO = process.env.GMAIL_TEST_TO

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const send = async () => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: BIG_PROBLEM_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  //EMAIL OPTIONS
  const from = BIG_PROBLEM_EMAIL
  const to = TO
  const subject = "Привет из приложения big problem"
  const html = `
<div>
  <h3>Здравствуй</h3>
  <p>Сегодня ты стал чутка взрослее</p>
</div>
`

  try {
    const info = await transport.sendMail({ from, subject, to, html})
    return info
  } catch (err) {
    return err
  }
};

module.exports = send