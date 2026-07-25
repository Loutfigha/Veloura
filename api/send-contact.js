const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'info@louaraamdecoratie.nl';
const FROM_EMAIL = 'LOUA Raamdecoratie <contact@louaraamdecoratie.nl>';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { naam, email, telefoon, postcode, bericht } = req.body || {};

    if (!naam || !email || !telefoon) {
      res.status(400).json({ error: 'Verplichte velden ontbreken.' });
      return;
    }

    const lines = [
      `Naam: ${naam}`,
      `Telefoon: ${telefoon}`,
      `E-mail: ${email}`,
      postcode ? `Postcode: ${postcode}` : null,
      '',
      'Bericht:',
      bericht || '(geen bericht ingevuld)',
    ].filter(Boolean).join('\n');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `Contactformulier website - ${naam}`,
      text: lines,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(502).json({ error: 'Kon e-mail niet versturen.' });
      return;
    }

    res.status(200).json({ ok: true, id: data && data.id });
  } catch (err) {
    console.error('send-contact error:', err);
    res.status(500).json({ error: 'Interne serverfout.' });
  }
};
