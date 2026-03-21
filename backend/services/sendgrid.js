// Sendgrid wrapper disabled — newsletter emails removed
async function sendConfirmationEmail() {
  console.warn('sendConfirmationEmail called but newsletter feature is disabled.');
  return;
}

module.exports = { sendConfirmationEmail };
