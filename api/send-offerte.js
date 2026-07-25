const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'info@louaraamdecoratie.nl';
const FROM_EMAIL = 'LOUA Raamdecoratie <offerte@louaraamdecoratie.nl>';

const TYPE_LABELS = {
  raamhor: 'Raamhor',
  inzethor: 'Inzethor',
  plisse: 'Plissé hordeur',
  shutters: 'Shutters',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      type, naam, email, telefoon,
      breedte, lengte, oppervlakte,
      typeGaas, ralKleur, prijsLabel,
      offerteNummer, pdfBase64,
    } = req.body || {};

    if (!naam || !email || !telefoon || !pdfBase64) {
      res.status(400).json({ error: 'Verplichte velden ontbreken.' });
      return;
    }

    const typeLabel = TYPE_LABELS[type] || 'Hor';

    const lines = [
      `Type hor: ${typeLabel}`,
      `Afmetingen: ${breedte} x ${lengte} cm`,
      `Oppervlakte: ${oppervlakte} m²`,
      typeGaas ? `Type gaas: ${typeGaas}` : null,
      ralKleur ? `RAL kleur: ${ralKleur}` : null,
      `Prijs: ${prijsLabel || '-'}`,
      '',
      `Naam: ${naam}`,
      `E-mail: ${email}`,
      `Telefoon: ${telefoon}`,
    ].filter(Boolean).join('\n');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `Nieuwe offerte-aanvraag - ${naam}`,
      text: lines,
      attachments: [
        {
          filename: `Offerte-LOUA-${offerteNummer || 'aanvraag'}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(502).json({ error: 'Kon e-mail niet versturen.' });
      return;
    }

    res.status(200).json({ ok: true, id: data && data.id });
  } catch (err) {
    console.error('send-offerte error:', err);
    res.status(500).json({ error: 'Interne serverfout.' });
  }
};
