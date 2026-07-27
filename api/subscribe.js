const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'info@louaraamdecoratie.nl';
const FROM_EMAIL = 'LOUA Raamdecoratie <nieuwsbrief@louaraamdecoratie.nl>';
const DISCOUNT_CODE = 'GRATISANTIPOLLEN';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body || {};

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Ongeldig e-mailadres.' });
      return;
    }

    const { error: notifyError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: 'Nieuwe nieuwsbrief-aanmelding',
      text: [
        'Nieuwe aanmelding voor de nieuwsbrief:',
        '',
        `E-mail: ${email}`,
        '',
        `Deze klant heeft recht op gratis anti-pollen gaas bij de volgende bestelling (code: ${DISCOUNT_CODE}).`,
      ].join('\n'),
    });

    if (notifyError) {
      console.error('Resend notify error:', notifyError);
      res.status(502).json({ error: 'Kon aanmelding niet verwerken.' });
      return;
    }

    resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Bedankt voor uw aanmelding - uw kortingscode',
      text: [
        'Bedankt voor uw aanmelding voor de nieuwsbrief van LOUA Raamdecoratie!',
        '',
        `Als welkomstcadeau ontvangt u gratis anti-pollen gaas (t.w.v. € 30,-) bij uw volgende bestelling. Vermeld hiervoor onderstaande code bij uw offerteaanvraag:`,
        '',
        DISCOUNT_CODE,
        '',
        'Tot snel!',
        'Team LOUA Raamdecoratie',
      ].join('\n'),
    }).catch(function (err) {
      console.error('Resend welcome-mail error (non-blocking):', err);
    });

    res.status(200).json({ ok: true, code: DISCOUNT_CODE });
  } catch (err) {
    console.error('subscribe error:', err);
    res.status(500).json({ error: 'Interne serverfout.' });
  }
};
