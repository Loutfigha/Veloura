const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'info@louaraamdecoratie.nl';
const FROM_EMAIL = 'LOUA Raamdecoratie <nieuwsbrief@louaraamdecoratie.nl>';
const DISCOUNT_CODE = 'GRATISANTIPOLLEN';
const FOLLOWUP_DELAY_MS = 5 * 24 * 60 * 60 * 1000;

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

    const followUpDate = new Date(Date.now() + FOLLOWUP_DELAY_MS).toISOString();

    resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Nog niet vergeten? Uw gratis anti-pollen gaas staat klaar',
      scheduledAt: followUpDate,
      text: [
        `Een paar dagen geleden meldde u zich aan voor onze nieuwsbrief en ontving u de code ${DISCOUNT_CODE} voor een gratis upgrade naar anti-pollen gaas (t.w.v. € 30,-).`,
        '',
        'Nu de warmere dagen eraan komen, is dit een mooi moment om uw ramen en deuren insectenvrij te maken - en met anti-pollen gaas houdt u meteen ook het meeste stuifmeel buiten.',
        '',
        'Vraag vrijblijvend een offerte aan via https://louaraamdecoratie.nl/offerte.html en vermeld de code bij uw aanvraag. Wij meten kosteloos bij u thuis in en denken graag mee over de beste oplossing voor uw situatie.',
        '',
        'Vragen? Antwoord gewoon op deze e-mail of bel ons via +31 6 57 81 52 02.',
        '',
        'Tot snel!',
        'Team LOUA Raamdecoratie',
      ].join('\n'),
    }).catch(function (err) {
      console.error('Resend follow-up-mail error (non-blocking):', err);
    });

    res.status(200).json({ ok: true, code: DISCOUNT_CODE });
  } catch (err) {
    console.error('subscribe error:', err);
    res.status(500).json({ error: 'Interne serverfout.' });
  }
};
