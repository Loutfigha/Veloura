const { neon } = require('@neondatabase/serverless');
const { hasValidSession, getFormFields } = require('./_auth');

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS offertes (
      id BIGINT PRIMARY KEY,
      offerte_nr TEXT,
      datum TEXT,
      klant_naam TEXT,
      totaal NUMERIC,
      status TEXT,
      saved_at TEXT,
      snapshot JSONB
    )
  `;
}

function rowToRecord(row) {
  return {
    id: Number(row.id),
    offerteNr: row.offerte_nr,
    datum: row.datum,
    klantNaam: row.klant_naam,
    totaal: row.totaal === null ? 0 : Number(row.totaal),
    status: row.status,
    savedAt: row.saved_at,
    snapshot: row.snapshot,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!process.env.DATABASE_URL) {
    res.status(500).json({ error: 'DATABASE_URL is niet geconfigureerd.' });
    return;
  }
  if (!hasValidSession(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM offertes ORDER BY id DESC`;
      res.status(200).json(rows.map(rowToRecord));
      return;
    }

    if (req.method === 'POST') {
      const body = getFormFields(req);
      const id = Number(body.id);
      if (!id || !Number.isFinite(id)) {
        res.status(400).json({ error: 'ongeldig id' });
        return;
      }
      await sql`
        INSERT INTO offertes (id, offerte_nr, datum, klant_naam, totaal, status, saved_at, snapshot)
        VALUES (${id}, ${body.offerteNr || ''}, ${body.datum || ''}, ${body.klantNaam || ''}, ${Number(body.totaal) || 0}, ${body.status || 'concept'}, ${body.savedAt || ''}, ${JSON.stringify(body.snapshot || {})})
        ON CONFLICT (id) DO UPDATE SET
          offerte_nr = EXCLUDED.offerte_nr,
          datum = EXCLUDED.datum,
          klant_naam = EXCLUDED.klant_naam,
          totaal = EXCLUDED.totaal,
          status = EXCLUDED.status,
          saved_at = EXCLUDED.saved_at,
          snapshot = EXCLUDED.snapshot
      `;
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      const body = getFormFields(req);
      const id = Number(body.id || (req.query && req.query.id));
      if (!id || !Number.isFinite(id)) {
        res.status(400).json({ error: 'ongeldig id' });
        return;
      }
      await sql`DELETE FROM offertes WHERE id = ${id}`;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    res.status(500).json({ error: 'serverfout', detail: String(err && err.message || err) });
  }
};
