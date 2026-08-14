const crypto = require('crypto');

const CALCULATOR_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>LOUA · Interne prijscalculator</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  :root{
    --cream:#FAFAF8; --surface:#FFFFFF; --ink:#201E1A; --ink-soft:#3A352E;
    --sand:#A98C63; --sand-tint:#A98C6314; --line:#E7E2D9; --line-soft:#EEEAE2;
    --muted:#78716c;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--cream);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .display{font-family:'Cormorant Garamond',Georgia,serif}
  .wrap{max-width:1024px;margin:0 auto;padding:24px 16px 64px}
  @media(min-width:640px){.wrap{padding:40px 24px 80px}}

  /* Kop */
  header.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--line);padding-bottom:24px;margin-bottom:32px}
  .brand{display:flex;align-items:center;gap:16px}
  .brand img{height:40px;width:auto}
  .brand .sep{width:1px;height:36px;background:var(--line)}
  .eyebrow{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:var(--sand);display:flex;align-items:center;gap:8px;margin:0}
  .brand h1{font-size:24px;font-weight:600;margin:2px 0 0;line-height:1.1}
  @media(max-width:639px){.brand .sep,.brand .subtitle{display:none}}

  .grid{display:grid;gap:24px}
  @media(min-width:1024px){.grid{grid-template-columns:1fr 340px}}
  .col{display:flex;flex-direction:column;gap:24px}

  .card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px;box-shadow:0 1px 2px rgba(32,30,26,.04)}
  @media(min-width:640px){.card{padding:20px}}
  .card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .hint{font-size:12px;color:#a8a29e}

  label.veld{display:block}
  label.veld .lab{display:block;font-size:12px;font-weight:500;color:var(--muted);margin-bottom:4px}
  input,select{width:100%;border:1px solid #E4DFD6;background:#fff;border-radius:8px;padding:8px 12px;font-size:14px;color:var(--ink);font-family:inherit;outline:none;transition:border .15s,box-shadow .15s}
  input::placeholder{color:#a8a29e}
  input:focus,select:focus{border-color:var(--sand);box-shadow:0 0 0 3px rgba(169,140,99,.22)}
  .grid2{display:grid;gap:8px;grid-template-columns:1fr}
  @media(min-width:640px){.grid2{grid-template-columns:1fr 1fr}}
  .grid3{display:grid;gap:8px;grid-template-columns:1fr 1fr 1fr}
  .grid4{display:grid;gap:8px;grid-template-columns:1fr 1fr}
  @media(min-width:640px){.grid4{grid-template-columns:repeat(4,1fr)}}

  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:opacity .15s,background .15s,color .15s}
  .btn-ink{background:var(--ink);color:#fff}
  .btn-ink:hover{opacity:.9}
  .btn-outline{background:transparent;border:2px solid var(--ink);color:var(--ink);width:100%}
  .btn-outline:hover{background:var(--ink);color:#fff}
  .btn-dashed{width:100%;background:transparent;border:1px dashed var(--line);color:var(--muted);border-radius:12px;padding:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px}
  .btn-dashed:hover{color:var(--sand)}
  .linkbtn{background:none;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;color:var(--muted);display:inline-flex;align-items:center;gap:6px}
  .linkbtn:hover{color:var(--sand)}
  .iconbtn{background:none;border:none;cursor:pointer;color:#d6d3d1;padding:2px;line-height:0}
  .iconbtn:hover{color:#ef4444}
  .iconbtn:disabled{opacity:.3;cursor:not-allowed}

  /* Profiel chips */
  .chips{display:grid;gap:8px;grid-template-columns:1fr}
  @media(min-width:640px){.chips{grid-template-columns:1fr 1fr 1fr}}
  .chip{text-align:left;border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;font-family:inherit}
  .chip.sel{border-color:var(--sand);background:var(--sand-tint)}
  .chip .n{display:block;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .chip .p{font-size:12px;font-weight:500;color:var(--sand)}
  .chip .p.zero{color:#a8a29e}
  .beheerrow{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .beheerrow input:first-child{flex:1}
  .pctwrap{position:relative;width:96px;flex:0 0 auto}
  .pctwrap span{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#a8a29e;font-size:14px;pointer-events:none}
  .pctwrap input{text-align:right;padding-right:26px}

  /* Regel */
  .regel{border:1px solid var(--line);background:#FCFBF9;border-radius:12px;padding:12px}
  @media(min-width:640px){.regel{padding:16px}}
  .regel-in{display:flex;align-items:flex-start;gap:12px}
  .num{margin-top:4px;flex:0 0 auto;width:24px;height:24px;border-radius:999px;background:var(--ink);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center}
  .regel-body{min-width:0;flex:1}
  .mb2{margin-bottom:8px}
  .mt3{margin-top:12px}
  .euro-in{position:relative}
  .euro-in span{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#a8a29e;font-size:14px;pointer-events:none}
  .euro-in input{padding-left:24px}
  .rij-onder{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}
  .rall{display:flex;align-items:center;gap:8px;font-size:14px;color:#57534e;cursor:pointer}
  .rall input{width:16px;height:16px;accent-color:var(--ink)}
  .rall .sub{color:#a8a29e}
  .regel-tot{display:flex;align-items:center;gap:16px}
  .m2{font-size:12px;color:#a8a29e}
  .lt{min-width:80px;text-align:right;font-size:14px;font-weight:600}
  .reset{margin-top:8px;display:none;align-items:center;gap:4px;color:var(--sand);font-size:12px;font-weight:500;background:none;border:none;cursor:pointer;font-family:inherit}
  .reset:hover{opacity:.7}

  /* Opties */
  .opt-row{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--line)}
  .opt-l{display:flex;align-items:center;gap:12px}
  .opt-ic{width:36px;height:36px;border-radius:8px;background:var(--sand-tint);color:var(--muted);display:flex;align-items:center;justify-content:center}
  .opt-t{font-size:14px;font-weight:500}
  .opt-s{font-size:12px;color:#a8a29e}
  .toggle{position:relative;width:44px;height:24px;border-radius:999px;border:none;cursor:pointer;background:#D6D3D1;transition:background .15s}
  .toggle.on{background:var(--ink)}
  .toggle .knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:999px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .15s}
  .toggle.on .knob{left:22px}
  .transport-grid{display:grid;gap:8px;grid-template-columns:1fr 1fr 1fr}
  .topt{text-align:left;border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;font-family:inherit}
  .topt.sel{border-color:var(--sand);background:var(--sand-tint)}
  .topt .n{display:block;font-size:14px;font-weight:500}
  .topt .s{font-size:12px;color:#a8a29e}

  /* Overzicht */
  .sticky{position:relative}
  @media(min-width:1024px){.sticky{position:sticky;top:24px}}
  .panel{background:var(--ink);border-radius:16px;overflow:hidden;box-shadow:0 10px 24px rgba(32,30,26,.18)}
  .panel-in{padding:20px}
  .panel h2{font-size:20px;font-weight:600;color:#fff;margin:0}
  .ovrow{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px;margin-top:10px}
  .ovrow .l{color:rgba(255,255,255,.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ovrow .v{color:rgba(255,255,255,.9);font-weight:500;flex:0 0 auto}
  .panel-tot{padding:20px;border-top:1px solid var(--sand);background:rgba(0,0,0,.13);display:flex;align-items:flex-end;justify-content:space-between}
  .panel-tot .l{font-size:14px;color:rgba(255,255,255,.6)}
  .panel-tot .v{font-size:30px;font-weight:600;color:#F1E9DC}
  .note{margin-top:12px;display:flex;gap:8px;background:var(--sand-tint);color:var(--ink-soft);border-radius:12px;padding:12px;font-size:12px}
  .note svg{color:var(--sand);flex:0 0 auto;margin-top:2px}

  /* Offerte modal */
  .overlay{position:fixed;inset:0;z-index:50;display:none;overflow-y:auto;padding:16px;background:rgba(32,30,26,.55)}
  @media(min-width:640px){.overlay{padding:32px}}
  .overlay.open{display:flex;justify-content:center;align-items:flex-start}
  .modal{width:100%;max-width:768px}
  .toolbar{background:#fff;border-radius:12px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .toolbar h2{font-size:20px;font-weight:600;margin:0}
  .panel-edit{background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 12px rgba(0,0,0,.08);margin-bottom:12px;display:flex;flex-direction:column;gap:16px}
  .subhead{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:0 0 8px;display:flex;align-items:center;gap:8px}
  .subhead .soft{font-weight:400;text-transform:none;color:#a8a29e}

  /* Offerte document */
  .doc{background:#fff;border:1px solid var(--line);border-radius:12px;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,.08);color:var(--ink)}
  @media(min-width:640px){.doc{padding:40px}}
  .doc-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:2px solid var(--ink);padding-bottom:20px}
  .doc-head img{height:44px;width:auto}
  .doc-brandname{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px}
  .doc-contact{margin-top:8px;font-size:12px;line-height:1.6;color:var(--muted);white-space:pre-line}
  .doc-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;text-align:right;margin:0}
  .doc-meta{font-size:12px;color:var(--muted);text-align:right;margin:2px 0 0}
  .doc-parties{margin-top:20px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px}
  .doc-lab{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--sand);margin:0}
  .doc-to-name{font-size:14px;font-weight:500;margin:4px 0 0}
  .doc-to{font-size:14px;color:#57534e;white-space:pre-line;margin:0}
  table{width:100%;border-collapse:collapse;margin-top:24px;font-size:14px}
  thead th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding-bottom:8px;border-bottom:1px solid #CFC8BC}
  thead th.c{text-align:center}thead th.r{text-align:right}
  tbody td{padding:10px 0;border-bottom:1px solid var(--line);vertical-align:top}
  tbody td.c{text-align:center;color:#57534e}
  tbody td.r{text-align:right}
  .om{font-weight:500}
  .om-sub{display:block;font-size:12px;color:#a8a29e}
  .totalen{margin-top:16px;display:flex;justify-content:flex-end}
  .totalen .box{width:100%;max-width:280px}
  .totalen .t{display:flex;justify-content:space-between;font-size:14px;color:#57534e;margin-bottom:6px}
  .totalen .grand{display:flex;justify-content:space-between;font-size:16px;font-weight:600;border-top:2px solid var(--ink);padding-top:8px;margin-top:4px}
  .doc-foot{margin-top:32px;border-top:1px solid var(--line);padding-top:16px;font-size:12px;line-height:1.6;color:var(--muted)}

  /* Login */
  .login{position:fixed;inset:0;z-index:100;background:var(--cream);display:flex;align-items:center;justify-content:center;padding:24px}
  .login .box{width:100%;max-width:360px;text-align:center}
  .login img{height:44px;margin-bottom:24px}
  .login h2{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin:0 0 4px}
  .login p{color:var(--muted);font-size:14px;margin:0 0 20px}
  .login .err{color:#b91c1c;font-size:13px;margin-top:10px;min-height:18px}

  @media print{
    body{background:#fff}
    .app,.no-print{display:none !important}
    .overlay{position:static !important;background:#fff !important;padding:0 !important;display:block !important;overflow:visible !important}
    .modal{max-width:none !important;width:100% !important}
    .doc{box-shadow:none !important;border:none !important;border-radius:0 !important}
    @page{margin:16mm}
  }

  /* ====== Next-level additions ====== */
  .hdr-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
  .btn-ghost-sm{background:transparent;border:1.5px solid var(--line);color:var(--ink);border-radius:12px;padding:9px 16px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;transition:border-color .15s,background .15s}
  .btn-ghost-sm:hover{border-color:var(--sand);background:var(--sand-tint)}

  .autosave{font-size:12px;color:#a8a29e;display:flex;align-items:center;gap:6px;opacity:0;transition:opacity .3s;white-space:nowrap}
  .autosave.show{opacity:1}
  .autosave svg{width:14px;height:14px;color:#1a7a4c;flex:0 0 auto}

  .toast-container{position:fixed;bottom:20px;right:20px;z-index:200;display:flex;flex-direction:column;gap:10px;max-width:340px;pointer-events:none}
  .toast{background:var(--ink);color:#fff;border-radius:12px;padding:13px 16px;font-size:13px;line-height:1.4;box-shadow:0 10px 28px rgba(0,0,0,.20);opacity:0;transform:translateY(10px) scale(.98);transition:opacity .25s,transform .25s}
  .toast.show{opacity:1;transform:translateY(0) scale(1)}
  .toast.error{background:#b91c1c}
  .toast.success{background:#15803d}

  @keyframes pulseVal{0%{transform:scale(1)}35%{transform:scale(1.06)}100%{transform:scale(1)}}
  .pulse{animation:pulseVal .35s ease}

  .hist-toolbar{display:flex;gap:12px;align-items:center;margin-bottom:16px}
  .hist-search{flex:1}
  .hist-table{width:100%;border-collapse:collapse;font-size:13px}
  .hist-table th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding:0 10px 10px}
  .hist-table th:last-child,.hist-table td:last-child{text-align:right}
  .hist-table td{padding:12px 10px;border-top:1px solid var(--line);vertical-align:middle}
  .hist-klant{font-weight:500;font-size:14px}
  .hist-nr{color:#a8a29e;font-size:12px;margin-top:2px}
  .status-select{border:1.5px solid transparent;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;-webkit-appearance:none;appearance:none;background-position:right 8px center}
  .status-concept{background:#F1EFEA;color:#78716c}
  .status-verzonden{background:#EAF1FC;color:#1d4ed8}
  .status-geaccepteerd{background:#E6F6ED;color:#15803d}
  .status-geweigerd{background:#FCEAEA;color:#b91c1c}
  .hist-actions{display:flex;gap:6px;justify-content:flex-end}
  .hist-actions button{background:none;border:1px solid var(--line);border-radius:8px;padding:6px 10px;font-size:12px;font-family:inherit;cursor:pointer;color:var(--muted);white-space:nowrap}
  .hist-actions button:hover{border-color:var(--sand);color:var(--sand)}
  .hist-actions button.danger:hover{border-color:#b91c1c;color:#b91c1c}
  .hist-empty{text-align:center;padding:60px 20px;color:#a8a29e}
  .hist-empty svg{margin:0 auto 12px;opacity:.5;display:block}

  .euro-in.inline{display:inline-block;width:110px;flex:0 0 auto}

  /* ====== Mobiel ====== */
  @media(max-width:639px){
    header.top{flex-wrap:wrap}
    .hdr-actions{width:100%;flex-wrap:wrap}
    .hdr-actions .autosave{order:-1;width:100%;justify-content:center;margin-bottom:2px}
    .hdr-actions .btn-ghost-sm{flex:1 1 0;justify-content:center}
    .hdr-actions .btn-ink{flex:1 1 100%;justify-content:center;order:1}

    .hist-table thead{display:none}
    .hist-table,.hist-table tbody{display:block;width:100%}
    .hist-table tr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:14px 0;border-top:1px solid var(--line)}
    .hist-table tr:first-child{border-top:none}
    .hist-table td{display:block;border:none;padding:0;text-align:left}
    .hist-table td:first-child{flex:1 1 100%}
    .hist-table td:last-child{flex:1 1 100%;text-align:left}
    .hist-actions{justify-content:flex-start;flex-wrap:wrap}
    .hist-actions button{flex:1 1 auto}

    .toast-container{left:16px;right:16px;max-width:none}
  }
  @media(max-width:479px){
    .beheerrow{flex-wrap:wrap}
    .beheerrow input:first-child{flex:1 1 100%}
  }
</style>
</head>
<body>

<!-- ====== APP ====== -->
<div class="app" id="app">
<div class="wrap">
  <header class="top">
    <div class="brand">
      <img src="https://www.louaraamdecoratie.nl/images/logo-loua-dark-on-transparent.png" alt="LOUA Raamdecoratie" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'display',style:'font-size:22px;font-weight:600',textContent:'LOUA Raamdecoratie'}))" />
      <div class="sep"></div>
      <div class="subtitle">
        <p class="eyebrow">Prijscalculator</p>
        <h1 class="display">Horren op maat</h1>
      </div>
    </div>
    <div class="hdr-actions">
      <span class="autosave" id="autosaveIndicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Concept opgeslagen</span>
      <button class="btn-ghost-sm" id="btnNieuw">🗋 Nieuw</button>
      <button class="btn-ghost-sm" id="btnHistorie">🕘 Geschiedenis</button>
      <button class="btn btn-ink" id="btnOfferteTop">📄&nbsp; Offerte maken</button>
    </div>
  </header>

  <div class="grid">
    <div class="col">
      <!-- Klant -->
      <section class="card">
        <div class="card-head">
          <p class="eyebrow">Klant</p>
          <span class="hint">Voor wie is deze calculatie?</span>
        </div>
        <div class="grid2">
          <label class="veld"><span class="lab">Naam</span><input id="k_naam" placeholder="Naam klant" /></label>
          <label class="veld"><span class="lab">E-mail / telefoon</span><input id="k_email" placeholder="Contactgegevens" /></label>
          <label class="veld"><span class="lab">Adres</span><input id="k_adres" placeholder="Straat en huisnummer" /></label>
          <label class="veld"><span class="lab">Postcode + plaats</span><input id="k_pcplaats" placeholder="1234 AB Plaats" /></label>
        </div>
        <label class="veld" style="margin-top:8px"><span class="lab">Kenmerk / omschrijving (optioneel)</span><input id="k_kenmerk" placeholder="Bijv. Horren woonkamer + slaapkamers" /></label>
      </section>

      <!-- Type opdracht -->
      <section class="card">
        <div class="card-head">
          <p class="eyebrow">Type opdracht</p>
          <button class="linkbtn" id="btnBeheer">⚙ Beheer</button>
        </div>
        <div id="profielArea"></div>
      </section>

      <!-- Producten -->
      <section class="card">
        <div class="card-head">
          <p class="eyebrow">Producten</p>
          <div style="display:flex;align-items:center;gap:14px">
            <span class="hint" id="ramenTeller">0 ramen</span>
            <button class="linkbtn" id="btnBeheerProd">⚙ Beheer</button>
          </div>
        </div>
        <div id="prodBeheerArea" style="display:none;margin-bottom:12px"></div>
        <div id="regels" style="display:flex;flex-direction:column;gap:12px"></div>
        <button class="btn-dashed" id="btnAddRegel" style="margin-top:12px">＋ Product toevoegen</button>
      </section>

      <!-- Opties -->
      <section class="card">
        <p class="eyebrow" style="margin-bottom:16px">Opties</p>
        <div class="opt-row">
          <div class="opt-l">
            <div class="opt-ic">🔧</div>
            <div><div class="opt-t">Montage</div><div class="opt-s" id="montageSub">€ 25,00 per raam</div></div>
          </div>
          <button class="toggle on" id="montageToggle"><span class="knob"></span></button>
        </div>
        <div style="padding-top:16px">
          <div class="opt-l" style="margin-bottom:12px"><div class="opt-ic">🚚</div><div class="opt-t">Transport</div></div>
          <div class="transport-grid" id="transportGrid"></div>
          <label class="veld" id="opleveringWrap" style="display:none;margin-top:12px">
            <span class="lab">Aantal opleveringen</span>
            <input type="number" min="1" id="aantalOpleveringen" value="2" style="max-width:120px" />
          </label>
        </div>
      </section>
    </div>

    <!-- Overzicht -->
    <div>
      <div class="sticky">
        <div class="panel">
          <div class="panel-in">
            <h2 class="display">Overzicht</h2>
            <div class="ovrow"><span class="l">Producten</span><span class="v" id="ovProducten">€ 0,00</span></div>
            <div class="ovrow" id="ovProfielRow" style="display:none"><span class="l" id="ovProfielLabel"></span><span class="v" id="ovProfielVal"></span></div>
            <div class="ovrow" id="ovMontageRow" style="display:none"><span class="l">Montage</span><span class="v" id="ovMontageVal"></span></div>
            <div class="ovrow" id="ovTransportRow" style="display:none"><span class="l">Transport</span><span class="v" id="ovTransportVal"></span></div>
          </div>
          <div class="panel-tot"><span class="l">Totaal (excl. BTW)</span><span class="v" id="ovTotaal">€ 0,00</span></div>
        </div>
        <button class="btn btn-outline" id="btnOfferteSide" style="margin-top:12px">📄&nbsp; Offerte maken</button>
        <div class="note"><span>ⓘ</span><p>Het prijsprofiel past alleen de productprijzen aan. Controleer minimale maten handmatig.</p></div>
      </div>
    </div>
  </div>
</div>
</div>

<!-- ====== GESCHIEDENIS MODAL ====== -->
<div class="overlay" id="histOverlay">
  <div class="modal" style="max-width:920px;">
    <div class="toolbar no-print">
      <h2 class="display">Geschiedenis</h2>
      <button class="iconbtn" id="btnHistClose" style="color:#78716c;font-size:20px;padding:0 6px">✕</button>
    </div>
    <div class="panel-edit no-print" style="padding:18px">
      <div class="hist-toolbar">
        <input id="histSearch" class="hist-search" placeholder="Zoek op klant of offertenummer..." />
      </div>
      <div id="histTableWrap"></div>
    </div>
  </div>
</div>

<div class="toast-container" id="toastContainer"></div>

<!-- ====== OFFERTE MODAL ====== -->
<div class="overlay" id="overlay">
  <div class="modal">
    <div class="toolbar no-print">
      <h2 class="display">Offerte</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ink" id="btnPdf">⬇ Download PDF</button>
        <button class="iconbtn" id="btnClose" style="color:#78716c;font-size:20px;padding:0 6px">✕</button>
      </div>
    </div>
    <div class="panel-edit no-print">
      <div>
        <p class="subhead">🏢 Jouw bedrijf <span class="soft">· wordt bewaard</span></p>
        <div class="grid2">
          <input id="b_naam" placeholder="Bedrijfsnaam" />
          <input id="b_tel" placeholder="Telefoon" />
          <input id="b_adres" placeholder="Adres" />
          <input id="b_pcplaats" placeholder="Postcode + plaats" />
          <input id="b_email" placeholder="E-mail" />
          <input id="b_iban" placeholder="IBAN" />
          <input id="b_kvk" placeholder="KvK-nummer" />
          <input id="b_btwnr" placeholder="BTW-nummer" />
        </div>
      </div>
      <div>
        <p class="subhead">Klant</p>
        <div class="grid2">
          <input id="ob_knaam" placeholder="Naam klant" />
          <input id="ob_kemail" placeholder="E-mail" />
          <input id="ob_kadres" placeholder="Adres" />
          <input id="ob_kpc" placeholder="Postcode + plaats" />
        </div>
      </div>
      <div class="grid4">
        <label class="veld"><span class="lab">Offertenr.</span><input id="o_nr" /></label>
        <label class="veld"><span class="lab">Datum</span><input type="date" id="o_datum" /></label>
        <label class="veld"><span class="lab">BTW %</span><input type="number" id="o_btw" value="21" /></label>
        <label class="veld"><span class="lab">Geldig (dagen)</span><input type="number" id="o_geldig" value="30" /></label>
      </div>
      <label class="veld"><span class="lab">Kenmerk / omschrijving (optioneel)</span><input id="o_kenmerk" placeholder="Bijv. Horren woonkamer + slaapkamers" /></label>
    </div>
    <div class="doc" id="offerteDoc"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js"></script>
<script>
"use strict";
/* ---------- Gegevens ---------- */
var DEFAULT_PRODUCTEN = [
  { naam:"Standaard Hor", prijs:97 },
  { naam:"Standaard Hor met Magneet", prijs:107 },
  { naam:"Standaard Hor met Magneet en antipol", prijs:117 },
  { naam:"Hor dubbelkant bedienbaar standaard magneet", prijs:117 },
  { naam:"Hor dubbelkant bedienbaar standaard magneet en antipol", prijs:121 },
  { naam:"Honeycomb (plisse) verduisterend", prijs:147 },
  { naam:"Honeycomb (plisse) incl. hor verduisterend", prijs:151 },
  { naam:"Honeycomb (plisse) niet verduisterend", prijs:127 },
  { naam:"Honeycomb (plisse) incl. hor niet verduisterend 80%", prijs:130 },
];
var RALL=2, MONTAGE=25, TRANSPORT_1=80, TRANSPORT_MEER=40;
var LOCATIE_SUGGESTIES=["Openslaande deuren woonkamer","Woonkamer","Keuken","Badkamer","Slaapkamer 1","Slaapkamer 2","Slaapkamer 3","Zolder","Schuifpui","Voordeur"];
var LOGO="https://www.louaraamdecoratie.nl/images/logo-loua-dark-on-transparent.png";
var LOGO_PDF_BASE64 = 'data:image/jpeg;base64,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TxBgfNI4ukkO3e5ziST3klfhj2L2fEaKSjslqo7RSSTSVL4KGBsLHSvPM95a0Aczj1J7yUGUREQVamrqrhtxynv2FZZbMy0yqL4ymixuXklqqd1VWFk0dBVRO+6ls0rndlI0kNjeObcdLSLSqDRPALXlf5JaPDLHS37tHTC4Q0EbZRI74UgIHR58XDqdz1W7IKt6W4dqBfrvqNU47qLHjVuOaXVoonY9BWcjhI0E9o94J38tui3fguZNFw0YYypnFTUNbViSYMDOd3pk27uUdBv5DuUw2+0UNpFQKKjgpBUzvqZuwjDO0ld1c923e47dSepXjZbJb8ctkNutVDT22gg37KlpYhHGzclx2aOg3JJ+MlBEmb1NPa+KHTeetnjpY6yyXaipnSuDRLPz00nZtP6bka523iGnyXjglZFd+KPU2ejmZUwUNls9BO+Jwc2KoD6qQxkj74MewkeAcFKOW4XYc8tJtmRWehvdBziQU9fA2VjXjueAR0cNzsR1CYnhlhwS0NteO2eislvDzJ6PQwNiYXnvcQB1cfEnqUGZcNx86hzhRgMGlUzT4367n/8AfzKZF6lstNFZaX0a30kFFT875Oyp4wxvM5xc52w8SSST4koPYla10bg4BzduoKhvhr9Z+qxO3TPbpt/ewqZ+9eja7Hb7J6X730NPRel1D6uo9HiDO2mftzyO273HYbk9Tsgweqm/5WmV7f2JrOnn9weoU4XMczqm0+0zuFdqfQXHHnWCgc2xDH4IZRE6lZ2cJqBMXbt3b63L15e7qrIVVLDW00tPURMnglYY5IpGhzXtI2IIPeCCQtFtOgGmlhuVLcLdgON0FdSytmp6imtcLJIpGndrmkN3BBAIIQb87u+cLr+xHH7/AHTTnTW0ZhkwGkGV3KpoaumobdFFPT1QuMktLTTVJLnCCaSNzS9oB5i1u4Dt12BLAy4Hjc+NHHpLDbX2E7b211Kw0/R/aD7nty/D9bu7+vegzoHT2lVhy2afQG1ZxnmAZnaLri0d1qLjecUub2PiZXSTD0uOnq43c8EznncQva8c7tgG7qzwAA28FpVVolgFblzMpnw2xy5C2UTi4uoYzMZR8GQnbq8b9HHqPNBuNLP6TTRS9m+LnaHckg2c3cb7Eea/VEQEREBERAREQEREBERAREQEREBERAREQEREBERAWPv9kpckstba61rnUlXE6GVrTsS09/VZBFExFUZSmJmJzh+NFSR0FHBTRAiKGNsbATudgNh1+ZfsiKdyBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH/2Q==';
var LOGO_WATERMARK_BASE64 = 'data:image/jpeg;base64,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';

var STD_BEDRIJF={naam:"LOUA Raamdecoratie",adres:"",pcplaats:"",tel:"+31 6 57 81 52 02",email:"info@louaraamdecoratie.nl",kvk:"",btwnr:"",iban:""};

/* ---------- Helpers ---------- */
var fmt=new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'});
function euro(n){return fmt.format(isFinite(n)?n:0);}
function datumNL(iso){var d=new Date(iso);if(isNaN(d))return iso;return d.toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'});}
function el(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function LS_get(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function LS_set(k,v){try{localStorage.setItem(k,v);}catch(e){}}

/* ---------- State ---------- */
var _id=1;
function nieuwRegel(){var _p=(typeof state!=="undefined"&&state&&state.producten&&state.producten[0])?state.producten[0]:DEFAULT_PRODUCTEN[0];return {id:_id++,locatie:"",productIdx:0,prijs:String(_p.prijs),breedte:"",hoogte:"",aantal:"1",rall:false};}
var state={
  regels:[nieuwRegel()],
  montage:true,
  transport:"geen",
  aantalOpleveringen:"2",
  profielen:[{id:1,naam:"Standaard",pct:"0"},{id:2,naam:"Zakelijk / aannemer",pct:"-10"},{id:3,naam:"Spoed / meerwerk",pct:"15"}],
  actiefProfiel:1,
  beheer:false,
  producten: DEFAULT_PRODUCTEN.map(function(p,i){return {id:i+1,naam:p.naam,prijs:p.prijs};}),
  beheerProd:false,
  bedrijf:Object.assign({},STD_BEDRIJF),
  klant:{naam:"",adres:"",pcplaats:"",email:""},
  kenmerk:"",
  offerteNr:"",
  offerteDatum:new Date().toISOString().slice(0,10),
  btwPct:"21",
  geldigheid:"30"
};
var _pid=100;
var _prodId=1000;

/* ---------- Opslag laden ---------- */
(function(){
  var p=LS_get("loua_profielen");
  if(p){try{var arr=JSON.parse(p);if(Array.isArray(arr)&&arr.length){state.profielen=arr;_pid=Math.max.apply(null,arr.map(function(x){return x.id+1;}).concat([100]));state.actiefProfiel=arr[0].id;}}catch(e){}}
  var b=LS_get("loua_bedrijf");
  if(b){try{state.bedrijf=Object.assign({},STD_BEDRIJF,JSON.parse(b));}catch(e){}}
  var pr=LS_get("loua_producten");
  if(pr){try{var arrpr=JSON.parse(pr);if(Array.isArray(arrpr)&&arrpr.length){state.producten=arrpr;_prodId=Math.max.apply(null,arrpr.map(function(x){return x.id+1;}).concat([1000]));}}catch(e){}}
})();
function saveProfielen(){LS_set("loua_profielen",JSON.stringify(state.profielen));}
function saveBedrijf(){LS_set("loua_bedrijf",JSON.stringify(state.bedrijf));}
function saveProducten(){LS_set("loua_producten",JSON.stringify(state.producten));}

/* ---------- Berekening ---------- */
function bereken(){
  var rows=state.regels.map(function(r){
    var b=parseFloat(r.breedte)||0, h=parseFloat(r.hoogte)||0;
    var aantal=Math.max(0,parseInt(r.aantal)||0);
    var m2=(b/100)*(h/100);
    var basis=parseFloat(r.prijs)||0;
    var effect=basis+(r.rall?RALL:0);
    return {r:r,b:b,h:h,aantal:aantal,m2:m2,basis:basis,effect:effect,totaal:effect*m2*aantal};
  });
  var productSom=rows.reduce(function(s,x){return s+x.totaal;},0);
  var totaalRamen=rows.reduce(function(s,x){return s+x.aantal;},0);
  var profiel=state.profielen.filter(function(p){return p.id===state.actiefProfiel;})[0]||state.profielen[0];
  var pct=parseFloat(profiel?profiel.pct:0)||0;
  var factor=1+pct/100;
  var profielBedrag=productSom*(pct/100);
  var productNa=productSom+profielBedrag;
  var montageK=state.montage?MONTAGE*totaalRamen:0;
  var transportK=0, transportLabel="";
  if(state.transport==="een"){transportK=TRANSPORT_1;transportLabel="Transport (1 oplevering)";}
  else if(state.transport==="meer"){var n=Math.max(1,parseInt(state.aantalOpleveringen)||0);transportK=TRANSPORT_MEER*n;transportLabel="Transport ("+n+" opleveringen)";}
  var eind=productNa+montageK+transportK;
  return {rows:rows,productSom:productSom,totaalRamen:totaalRamen,profiel:profiel,pct:pct,factor:factor,profielBedrag:profielBedrag,productNa:productNa,montageK:montageK,transportK:transportK,transportLabel:transportLabel,eind:eind};
}

/* ---------- Render: profielen ---------- */
function renderProfielen(){
  var area=el("profielArea"); area.innerHTML="";
  if(!state.beheer){
    var wrap=document.createElement("div"); wrap.className="chips";
    state.profielen.forEach(function(p){
      var pct=parseFloat(p.pct)||0;
      var b=document.createElement("button"); b.className="chip"+(p.id===state.actiefProfiel?" sel":"");
      b.innerHTML='<span class="n">'+esc(p.naam||"Naamloos")+'</span><span class="p'+(pct===0?' zero':'')+'">'+(pct===0?"Lijstprijs":(pct>0?"+":"")+pct+"%")+'</span>';
      b.onclick=function(){state.actiefProfiel=p.id;renderProfielen();recompute();renderDoc();};
      wrap.appendChild(b);
    });
    area.appendChild(wrap);
  } else {
    state.profielen.forEach(function(p){
      var row=document.createElement("div"); row.className="beheerrow";
      var ni=document.createElement("input"); ni.value=p.naam; ni.placeholder="Naam";
      ni.oninput=function(){p.naam=ni.value;saveProfielen();recompute();renderDoc();};
      var pw=document.createElement("div"); pw.className="pctwrap";
      var pi=document.createElement("input"); pi.type="number"; pi.value=p.pct;
      pi.oninput=function(){p.pct=pi.value;saveProfielen();recompute();renderDoc();};
      var ps=document.createElement("span"); ps.textContent="%";
      pw.appendChild(pi); pw.appendChild(ps);
      var del=document.createElement("button"); del.className="iconbtn"; del.innerHTML="🗑"; del.disabled=state.profielen.length===1;
      del.onclick=function(){
        state.profielen=state.profielen.filter(function(x){return x.id!==p.id;});
        if(state.actiefProfiel===p.id&&state.profielen.length)state.actiefProfiel=state.profielen[0].id;
        saveProfielen();renderProfielen();recompute();renderDoc();
      };
      row.appendChild(ni);row.appendChild(pw);row.appendChild(del);
      area.appendChild(row);
    });
    var add=document.createElement("button"); add.className="btn-dashed"; add.innerHTML="＋ Profiel toevoegen";
    add.onclick=function(){state.profielen.push({id:_pid++,naam:"",pct:"0"});saveProfielen();renderProfielen();};
    area.appendChild(add);
    var hint=document.createElement("p"); hint.className="hint"; hint.style.paddingTop="4px";
    hint.textContent="Plus is opslag, min is korting op de productprijzen. Profielen worden bewaard.";
    area.appendChild(hint);
  }
}

/* ---------- Render: regels ---------- */
function optionsHTML(sel){return state.producten.map(function(p,i){return '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+esc(p.naam)+'</option>';}).join("");}
function renderRegels(){
  var cont=el("regels"); cont.innerHTML="";
  state.regels.forEach(function(r,i){
    var d=document.createElement("div"); d.className="regel";
    d.innerHTML=
      '<div class="regel-in"><div class="num">'+(i+1)+'</div><div class="regel-body">'+
      '<input class="mb2" list="loclist" placeholder="Plaats / locatie (bijv. Openslaande deuren woonkamer)" />'+
      '<select class="prod" style="font-weight:500">'+optionsHTML(r.productIdx)+'</select>'+
      '<div class="grid4 mt3">'+
        '<label class="veld"><span class="lab">Breedte (cm)</span><input type="number" min="0" class="br" placeholder="0"/></label>'+
        '<label class="veld"><span class="lab">Hoogte (cm)</span><input type="number" min="0" class="ho" placeholder="0"/></label>'+
        '<label class="veld"><span class="lab">Aantal</span><input type="number" min="1" class="aa"/></label>'+
        '<label class="veld"><span class="lab">Prijs / m²</span><span class="euro-in"><span>€</span><input type="number" min="0" class="pr"/></span></label>'+
      '</div>'+
      '<button class="reset">↺ Afwijkende prijs</button>'+
      '<div class="rij-onder">'+
        '<label class="rall"><input type="checkbox" class="ra"/> Speciale RAL-kleur <span class="sub">+'+euro(RALL)+'/m²</span></label>'+
        '<div class="regel-tot"><span class="m2">— m²</span><span class="lt">€ 0,00</span><button class="iconbtn del" '+(state.regels.length===1?'disabled':'')+'>🗑</button></div>'+
      '</div></div></div>';
    var loc=d.querySelector('input[list=loclist]'); loc.value=r.locatie; loc.oninput=function(){r.locatie=loc.value;renderDoc();};
    var prod=d.querySelector('.prod'); prod.onchange=function(){r.productIdx=parseInt(prod.value);r.prijs=String(state.producten[r.productIdx]?state.producten[r.productIdx].prijs:0);pr.value=r.prijs;recompute();renderDoc();};
    var br=d.querySelector('.br'); br.value=r.breedte; br.oninput=function(){r.breedte=br.value;recompute();renderDoc();};
    var ho=d.querySelector('.ho'); ho.value=r.hoogte; ho.oninput=function(){r.hoogte=ho.value;recompute();renderDoc();};
    var aa=d.querySelector('.aa'); aa.value=r.aantal; aa.oninput=function(){r.aantal=aa.value;recompute();renderDoc();};
    var pr=d.querySelector('.pr'); pr.value=r.prijs; pr.oninput=function(){r.prijs=pr.value;recompute();renderDoc();};
    var ra=d.querySelector('.ra'); ra.checked=r.rall; ra.onchange=function(){r.rall=ra.checked;recompute();renderDoc();};
    var reset=d.querySelector('.reset'); reset.onclick=function(){r.prijs=String(state.producten[r.productIdx]?state.producten[r.productIdx].prijs:0);pr.value=r.prijs;recompute();renderDoc();};
    var del=d.querySelector('.del'); del.onclick=function(){if(state.regels.length>1){state.regels=state.regels.filter(function(x){return x.id!==r.id;});renderRegels();recompute();renderDoc();}};
    r._m2=d.querySelector('.m2'); r._lt=d.querySelector('.lt'); r._reset=reset;
    cont.appendChild(d);
  });
}

/* ---------- Render: productbeheer ---------- */
function renderProductBeheer(){
  var area=el("prodBeheerArea");
  if(!state.beheerProd){ area.style.display="none"; area.innerHTML=""; return; }
  area.style.display="block";
  area.innerHTML="";
  state.producten.forEach(function(p){
    var row=document.createElement("div"); row.className="beheerrow";
    var ni=document.createElement("input"); ni.value=p.naam; ni.placeholder="Productnaam";
    ni.oninput=function(){p.naam=ni.value;saveProducten();renderRegels();recompute();renderDoc();};
    var pw=document.createElement("span"); pw.className="euro-in inline";
    var euroLab=document.createElement("span"); euroLab.textContent="€";
    var pi=document.createElement("input"); pi.type="number"; pi.min="0"; pi.value=p.prijs;
    pi.oninput=function(){p.prijs=parseFloat(pi.value)||0;saveProducten();renderRegels();recompute();renderDoc();};
    pw.appendChild(euroLab); pw.appendChild(pi);
    var del=document.createElement("button"); del.className="iconbtn"; del.innerHTML="🗑"; del.disabled=state.producten.length===1;
    del.onclick=function(){
      state.producten=state.producten.filter(function(x){return x.id!==p.id;});
      saveProducten();renderProductBeheer();renderRegels();recompute();renderDoc();
      toast("Product verwijderd");
    };
    row.appendChild(ni);row.appendChild(pw);row.appendChild(del);
    area.appendChild(row);
  });
  var add=document.createElement("button"); add.className="btn-dashed"; add.innerHTML="＋ Product toevoegen"; add.style.marginTop="4px";
  add.onclick=function(){
    state.producten.push({id:_prodId++,naam:"Nieuw product",prijs:0});
    saveProducten();renderProductBeheer();renderRegels();
    toast("Product toegevoegd");
  };
  area.appendChild(add);
  var hint=document.createElement("p"); hint.className="hint"; hint.style.paddingTop="4px";
  hint.textContent="Wijzigingen gelden voor nieuw gekozen regels; bestaande regels behouden hun ingevulde prijs.";
  area.appendChild(hint);
}

/* ---------- Meldingen (toasts) ---------- */
function toast(msg, type){
  var container=el("toastContainer");
  if(!container) return;
  var t=document.createElement("div");
  t.className="toast"+(type?(" "+type):"");
  t.textContent=msg;
  container.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add("show"); });
  setTimeout(function(){
    t.classList.remove("show");
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
  }, 2800);
}

/* ---------- Concept: autosave & herstel ---------- */
var AUTOSAVE_KEY="loua_calc_draft";
var _autosaveTimer=null;
function serializeState(){
  return {
    regels: state.regels.map(function(r){return {locatie:r.locatie,productIdx:r.productIdx,prijs:r.prijs,breedte:r.breedte,hoogte:r.hoogte,aantal:r.aantal,rall:r.rall};}),
    montage: state.montage,
    transport: state.transport,
    aantalOpleveringen: state.aantalOpleveringen,
    actiefProfiel: state.actiefProfiel,
    klant: Object.assign({},state.klant),
    kenmerk: state.kenmerk,
    offerteNr: state.offerteNr,
    offerteDatum: state.offerteDatum,
    btwPct: state.btwPct,
    geldigheid: state.geldigheid
  };
}
function scheduleAutosave(){
  if(_autosaveTimer) clearTimeout(_autosaveTimer);
  _autosaveTimer=setTimeout(function(){
    LS_set(AUTOSAVE_KEY, JSON.stringify(serializeState()));
    var ind=el("autosaveIndicator");
    if(ind){
      ind.classList.add("show");
      clearTimeout(ind._hideTimer);
      ind._hideTimer=setTimeout(function(){ ind.classList.remove("show"); }, 1800);
    }
  }, 500);
}
function restoreDraft(){
  var raw=LS_get(AUTOSAVE_KEY);
  if(!raw) return false;
  try{
    var d=JSON.parse(raw);
    if(!d || !Array.isArray(d.regels) || !d.regels.length) return false;
    applySnapshot(d);
    return true;
  }catch(e){ return false; }
}
function applySnapshot(d){
  state.regels = d.regels.map(function(r){ var nr=nieuwRegel(); return Object.assign(nr, r, {id:nr.id}); });
  state.montage = d.montage!==undefined ? d.montage : true;
  state.transport = d.transport || "geen";
  state.aantalOpleveringen = d.aantalOpleveringen || "2";
  if(d.actiefProfiel!==undefined) state.actiefProfiel = d.actiefProfiel;
  state.klant = d.klant ? Object.assign({naam:"",adres:"",pcplaats:"",email:""}, d.klant) : state.klant;
  state.kenmerk = d.kenmerk || "";
  state.offerteNr = d.offerteNr || "";
  state.offerteDatum = d.offerteDatum || state.offerteDatum;
  state.btwPct = d.btwPct || "21";
  state.geldigheid = d.geldigheid || "30";
}
function pushStateIntoFields(){
  el("k_naam").value=state.klant.naam||""; el("k_email").value=state.klant.email||"";
  el("k_adres").value=state.klant.adres||""; el("k_pcplaats").value=state.klant.pcplaats||"";
  el("k_kenmerk").value=state.kenmerk||"";
  el("montageToggle").className="toggle"+(state.montage?" on":"");
  el("aantalOpleveringen").value=state.aantalOpleveringen;
  el("opleveringWrap").style.display = state.transport==="meer" ? "block":"none";
}

/* ---------- Geschiedenis ---------- */
var HISTORY_KEY="loua_geschiedenis";
var offertesHistorie=[];
(function(){
  var h=LS_get(HISTORY_KEY);
  if(h){ try{ var arr=JSON.parse(h); if(Array.isArray(arr)) offertesHistorie=arr; }catch(e){} }
})();
function saveHistory(){ LS_set(HISTORY_KEY, JSON.stringify(offertesHistorie)); }
function saveToHistory(){
  var o=offerteData();
  var idx=offertesHistorie.findIndex(function(h){return h.offerteNr===state.offerteNr;});
  var record={
    id: idx!==-1 ? offertesHistorie[idx].id : Date.now(),
    offerteNr: state.offerteNr,
    datum: state.offerteDatum,
    klantNaam: state.klant.naam || "Naamloos",
    totaal: o.totaalIncl,
    status: idx!==-1 ? offertesHistorie[idx].status : "concept",
    savedAt: new Date().toISOString(),
    snapshot: serializeState()
  };
  if(idx!==-1){ offertesHistorie[idx]=record; } else { offertesHistorie.unshift(record); }
  saveHistory();
}
var STATUS_LABELS={concept:"Concept",verzonden:"Verzonden",geaccepteerd:"Geaccepteerd",geweigerd:"Geweigerd"};
function renderHistorie(filter){
  var wrap=el("histTableWrap");
  var list=offertesHistorie;
  if(filter){
    var f=filter.toLowerCase();
    list=offertesHistorie.filter(function(h){
      return (h.klantNaam||"").toLowerCase().indexOf(f)!==-1 || (h.offerteNr||"").toLowerCase().indexOf(f)!==-1;
    });
  }
  if(!list.length){
    wrap.innerHTML='<div class="hist-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" width="40" height="40"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M9 4v18"/></svg><p>'+(offertesHistorie.length?"Geen offertes gevonden.":"Nog geen offertes opgeslagen. Maak uw eerste offerte om deze hier terug te zien.")+'</p></div>';
    return;
  }
  var rows=list.map(function(h){
    var st=STATUS_LABELS[h.status]?h.status:"concept";
    return '<tr>'+
      '<td><div class="hist-klant">'+esc(h.klantNaam)+'</div><div class="hist-nr">'+esc(h.offerteNr||"—")+' · '+esc(datumNL(h.datum))+'</div></td>'+
      '<td>'+euro(h.totaal)+'</td>'+
      '<td><select class="status-select status-'+st+'" data-id="'+h.id+'">'+
        Object.keys(STATUS_LABELS).map(function(k){return '<option value="'+k+'"'+(k===st?' selected':'')+'>'+STATUS_LABELS[k]+'</option>';}).join('')+
      '</select></td>'+
      '<td><div class="hist-actions">'+
        '<button data-act="open" data-id="'+h.id+'">Openen</button>'+
        '<button data-act="dup" data-id="'+h.id+'">Dupliceren</button>'+
        '<button data-act="del" data-id="'+h.id+'" class="danger">Verwijderen</button>'+
      '</div></td>'+
    '</tr>';
  }).join('');
  wrap.innerHTML='<table class="hist-table"><thead><tr><th>Klant</th><th>Totaal</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table>';

  wrap.querySelectorAll(".status-select").forEach(function(sel){
    sel.onchange=function(){
      var id=parseFloat(sel.dataset.id);
      var rec=offertesHistorie.find(function(h){return h.id===id;});
      if(rec){ rec.status=sel.value; saveHistory(); sel.className="status-select status-"+sel.value; toast("Status bijgewerkt naar '"+STATUS_LABELS[sel.value]+"'"); }
    };
  });
  wrap.querySelectorAll("[data-act]").forEach(function(btn){
    btn.onclick=function(){
      var id=parseFloat(btn.dataset.id);
      var rec=offertesHistorie.find(function(h){return h.id===id;});
      if(!rec) return;
      if(btn.dataset.act==="open"){
        applySnapshot(rec.snapshot); pushStateIntoFields();
        renderProfielen();renderRegels();renderTransport();recompute();renderDoc();
        el("histOverlay").classList.remove("open");
        openOfferte();
        toast("Offerte "+(rec.offerteNr||"")+" geopend");
      } else if(btn.dataset.act==="dup"){
        var snap=Object.assign({},rec.snapshot,{offerteNr:"",offerteDatum:new Date().toISOString().slice(0,10)});
        applySnapshot(snap); pushStateIntoFields();
        renderProfielen();renderRegels();renderTransport();recompute();renderDoc();
        el("histOverlay").classList.remove("open");
        toast("Gedupliceerd naar nieuw concept");
      } else if(btn.dataset.act==="del"){
        if(btn.textContent==="Zeker weten?"){
          offertesHistorie=offertesHistorie.filter(function(h){return h.id!==id;});
          saveHistory(); renderHistorie(el("histSearch").value);
          toast("Offerte verwijderd");
        } else {
          btn.textContent="Zeker weten?";
          setTimeout(function(){ if(btn && btn.isConnected) btn.textContent="Verwijderen"; }, 3000);
        }
      }
    };
  });
}

/* ---------- Render: transport ---------- */
function renderTransport(){
  var g=el("transportGrid"); g.innerHTML="";
  [{k:"geen",l:"Geen transport",s:euro(0)},{k:"een",l:"1 oplevering",s:euro(TRANSPORT_1)},{k:"meer",l:"Meerdere",s:euro(TRANSPORT_MEER)+" p/st"}].forEach(function(o){
    var b=document.createElement("button"); b.className="topt"+(state.transport===o.k?" sel":"");
    b.innerHTML='<span class="n">'+o.l+'</span><span class="s">'+o.s+'</span>';
    b.onclick=function(){state.transport=o.k;el("opleveringWrap").style.display=(o.k==="meer")?"block":"none";renderTransport();recompute();renderDoc();};
    g.appendChild(b);
  });
}

/* ---------- Recompute (alleen uitkomsten) ---------- */
function recompute(){
  var c=bereken();
  c.rows.forEach(function(x){
    if(x.r._m2) x.r._m2.textContent = x.m2>0 ? x.m2.toFixed(2).replace(".",",")+" m² p/st" : "— m²";
    if(x.r._lt) x.r._lt.textContent = euro(x.totaal);
    if(x.r._reset) x.r._reset.style.display = (state.producten[x.r.productIdx]&&x.basis!==state.producten[x.r.productIdx].prijs)?"inline-flex":"none";
  });
  el("ramenTeller").textContent=c.totaalRamen+" raam"+(c.totaalRamen===1?"":"en");
  el("montageSub").textContent=euro(MONTAGE)+" per raam · "+c.totaalRamen+" ramen";
  el("montageToggle").className="toggle"+(state.montage?" on":"");
  el("ovProducten").textContent=euro(c.productSom);
  var pr=el("ovProfielRow");
  if(c.pct!==0){pr.style.display="flex";el("ovProfielLabel").textContent=(c.profiel.naam||"Profiel")+" ("+(c.pct>0?"+":"")+c.pct+"%)";el("ovProfielVal").textContent=euro(c.profielBedrag);}else pr.style.display="none";
  var mr=el("ovMontageRow"); if(c.montageK>0){mr.style.display="flex";el("ovMontageVal").textContent=euro(c.montageK);}else mr.style.display="none";
  var tr=el("ovTransportRow"); if(c.transportK>0){tr.style.display="flex";el("ovTransportVal").textContent=euro(c.transportK);}else tr.style.display="none";
  var _newTotaalTxt=euro(c.eind);
  var _totEl=el("ovTotaal");
  if(_totEl.textContent && _totEl.textContent!==_newTotaalTxt){
    _totEl.classList.remove("pulse"); void _totEl.offsetWidth; _totEl.classList.add("pulse");
  }
  _totEl.textContent=_newTotaalTxt;
}

/* ---------- Offerte document ---------- */
function offerteData(){
  var c=bereken(); var lijnen=[];
  c.rows.forEach(function(x){
    if(x.aantal<=0||x.m2<=0)return;
    var stuk=x.effect*x.m2*c.factor;
    var loc=(x.r.locatie||"").trim();
    var naam=(state.producten[x.r.productIdx]?state.producten[x.r.productIdx].naam:"Product")+(x.r.rall?" · speciale RAL-kleur":"");
    var maat=(x.b||0)+" × "+(x.h||0)+" cm · "+x.m2.toFixed(2).replace(".",",")+" m²";
    lijnen.push({om:loc||naam,detail:(loc?naam+" · ":"")+maat,aantal:x.aantal,stuk:stuk,totaal:stuk*x.aantal});
  });
  if(c.montageK>0)lijnen.push({om:"Montage",detail:euro(MONTAGE)+" per raam",aantal:c.totaalRamen,stuk:MONTAGE,totaal:c.montageK});
  if(c.transportK>0)lijnen.push({om:c.transportLabel,detail:"",aantal:1,stuk:c.transportK,totaal:c.transportK});
  var subtotaal=c.eind, pct=parseFloat(state.btwPct)||0, btw=subtotaal*(pct/100);
  return {lijnen:lijnen,subtotaal:subtotaal,btwPct:pct,btw:btw,totaalIncl:subtotaal+btw};
}
function renderDoc(){
  var b=state.bedrijf, k=state.klant, o=offerteData();
  var contact=[b.adres,b.pcplaats].filter(Boolean).join("\\n")+((b.tel||b.email)?"\\n":"")+[b.tel,b.email].filter(Boolean).join(" · ");
  var rijen = o.lijnen.length ? o.lijnen.map(function(l){
    return '<tr><td><span class="om">'+esc(l.om)+'</span>'+(l.detail?'<span class="om-sub">'+esc(l.detail)+'</span>':'')+'</td><td class="c">'+l.aantal+'</td><td class="r">'+euro(l.stuk)+'</td><td class="r" style="font-weight:500">'+euro(l.totaal)+'</td></tr>';
  }).join("") : '<tr><td colspan="4" style="text-align:center;color:#a8a29e;padding:16px 0">Nog geen regels — vul afmetingen in de calculator in.</td></tr>';
  var voet=[b.kvk&&("KvK "+b.kvk),b.btwnr&&("BTW "+b.btwnr),b.iban&&("IBAN "+b.iban)].filter(Boolean).join("  ·  ");
  el("offerteDoc").innerHTML=
    '<div class="doc-head"><div>'+
      '<img src="'+LOGO+'" alt="LOUA" onerror="this.replaceWith(Object.assign(document.createElement(\\'div\\'),{className:\\'doc-brandname\\',textContent:\\''+esc(b.naam||"LOUA Raamdecoratie")+'\\'}))"/>'+
      '<div class="doc-contact">'+esc(contact)+'</div>'+
    '</div><div><p class="doc-title">Offerte</p><p class="doc-meta">Nummer: '+esc(state.offerteNr||"—")+'</p><p class="doc-meta">Datum: '+esc(datumNL(state.offerteDatum))+'</p></div></div>'+
    '<div class="doc-parties"><div><p class="doc-lab">Aan</p><p class="doc-to-name">'+esc(k.naam||"—")+'</p><p class="doc-to">'+esc([k.adres,k.pcplaats].filter(Boolean).join("\\n"))+'</p>'+(k.email?'<p class="doc-to">'+esc(k.email)+'</p>':'')+'</div>'+
      (state.kenmerk?'<div style="max-width:50%"><p class="doc-lab">Kenmerk</p><p class="doc-to" style="color:#44403c">'+esc(state.kenmerk)+'</p></div>':'')+'</div>'+
    '<table><thead><tr><th>Omschrijving</th><th class="c">Aantal</th><th class="r">Stukprijs</th><th class="r">Totaal</th></tr></thead><tbody>'+rijen+'</tbody></table>'+
    '<div class="totalen"><div class="box">'+
      '<div class="t"><span>Subtotaal (excl. BTW)</span><span>'+euro(o.subtotaal)+'</span></div>'+
      '<div class="t"><span>BTW '+o.btwPct+'%</span><span>'+euro(o.btw)+'</span></div>'+
      '<div class="grand"><span>Totaal</span><span>'+euro(o.totaalIncl)+'</span></div>'+
    '</div></div>'+
    '<div class="doc-foot"><p>Deze offerte is '+esc(state.geldigheid||"30")+' dagen geldig vanaf de offertedatum. Genoemde bedragen zijn onder voorbehoud van definitieve inmeting.</p>'+(voet?'<p style="margin-top:4px">'+esc(voet)+'</p>':'')+'</div>';
  scheduleAutosave();
}

/* ---------- PDF-export ---------- */
function genereerPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){
    toast('De PDF-module wordt nog geladen. Probeer het over een moment opnieuw.', 'error');
    return;
  }
  if(!state.offerteNr){
    var teller=1; var t=LS_get("loua_teller"); if(t)teller=parseInt(t)||1;
    state.offerteNr=(new Date().getFullYear())+"-"+String(teller).padStart(3,"0");
    LS_set("loua_teller",String(teller+1));
    vulOfferteVelden();
  }

  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'mm', format:'a4'});
  var pageW = 210, pageH = 297;
  var marginX = 15, bottomLimit = 272;
  var anthracite = [32,30,26];
  var gold = [169,140,99];
  var muted = [120,113,108];
  var lineCol = [223,216,202];

  var b = state.bedrijf, k = state.klant, o = offerteData();

  function watermark(){
    var wmW = 140, wmH = wmW * (541/1600);
    try{ doc.addImage(LOGO_WATERMARK_BASE64, 'JPEG', (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH); }catch(e){}
  }

  function header(vervolg){
    watermark();
    doc.setFillColor(255,255,255);
    doc.rect(0, 0, pageW, 30, 'F');
    var logoW = 38, logoH = logoW * (304/900);
    try{ doc.addImage(LOGO_PDF_BASE64, 'JPEG', marginX, 8, logoW, logoH); }catch(e){}

    doc.setFont('helvetica','normal'); doc.setFontSize(8);
    doc.setTextColor(muted[0],muted[1],muted[2]);
    var contactLines = [b.adres, b.pcplaats, [b.tel,b.email].filter(Boolean).join('  ·  ')].filter(function(s){return s;});
    var cy = 8 + logoH + 4.5;
    contactLines.forEach(function(line){ doc.text(line, marginX, cy); cy += 3.8; });

    doc.setFont('helvetica','bold'); doc.setFontSize(18);
    doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
    doc.text((vervolg?'OFFERTE (VERVOLG)':'OFFERTE'), pageW - marginX, 15, {align:'right'});
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
    doc.setTextColor(muted[0],muted[1],muted[2]);
    doc.text('Nummer: ' + (state.offerteNr||'—'), pageW - marginX, 21, {align:'right'});
    doc.text('Datum: ' + datumNL(state.offerteDatum), pageW - marginX, 25.5, {align:'right'});

    doc.setDrawColor(lineCol[0],lineCol[1],lineCol[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, 33, pageW - marginX, 33);
    return 33;
  }

  var y = header(false);

  /* ---- Partijen: aan / kenmerk ---- */
  y += 12;
  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.setTextColor(gold[0],gold[1],gold[2]);
  doc.text('AAN', marginX, y);
  if(state.kenmerk){ doc.text('KENMERK', pageW/2 + 5, y); }

  y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
  doc.text(k.naam || '—', marginX, y);
  var kenmerkStartY = y;

  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(80,76,70);
  var toLines = [[k.adres,k.pcplaats].filter(Boolean).join(', '), k.email].filter(function(s){return s;});
  var ty = y + 5;
  toLines.forEach(function(line){
    doc.text(doc.splitTextToSize(line, pageW/2 - marginX - 10), marginX, ty);
    ty += 4.6;
  });

  if(state.kenmerk){
    doc.setFont('helvetica','normal'); doc.setFontSize(9);
    doc.setTextColor(80,76,70);
    var kenmerkLines = doc.splitTextToSize(state.kenmerk, pageW/2 - marginX - 10);
    doc.text(kenmerkLines, pageW/2 + 5, kenmerkStartY + 5);
    ty = Math.max(ty, kenmerkStartY + 5 + kenmerkLines.length * 4.6);
  }
  y = Math.max(ty, y + 10) + 6;

  /* ---- Tabel ---- */
  function tableHeader(){
    doc.setFillColor(248,246,241);
    doc.rect(marginX, y - 4.5, pageW - marginX*2, 8, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(7.8);
    doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
    doc.text('OMSCHRIJVING', marginX + 2, y);
    doc.text('AANTAL', pageW/2 + 30, y, {align:'center'});
    doc.text('STUKPRIJS', pageW - marginX - 32, y, {align:'right'});
    doc.text('TOTAAL', pageW - marginX - 2, y, {align:'right'});
    y += 7;
  }
  tableHeader();

  doc.setDrawColor(lineCol[0],lineCol[1],lineCol[2]);
  doc.setLineWidth(0.3);

  var lijnen = o.lijnen.length ? o.lijnen : [{om:'Nog geen regels ingevuld', detail:'', aantal:'', stuk:null, totaal:null}];

  lijnen.forEach(function(l){
    var detailLines = l.detail ? doc.splitTextToSize(l.detail, pageW/2 + 10) : [];
    var rowH = 6 + (detailLines.length * 3.8);

    if(y + rowH > bottomLimit){
      doc.addPage();
      y = header(true) + 12;
      tableHeader();
    }

    doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
    doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
    doc.text(l.om, marginX + 2, y);
    if(l.aantal !== '' && l.aantal !== undefined){
      doc.setTextColor(80,76,70);
      doc.text(String(l.aantal), pageW/2 + 30, y, {align:'center'});
    }
    if(l.stuk !== null && l.stuk !== undefined){
      doc.setTextColor(80,76,70);
      doc.text(euro(l.stuk), pageW - marginX - 32, y, {align:'right'});
    }
    if(l.totaal !== null && l.totaal !== undefined){
      doc.setFont('helvetica','bold');
      doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
      doc.text(euro(l.totaal), pageW - marginX - 2, y, {align:'right'});
    }
    if(detailLines.length){
      doc.setFont('helvetica','normal'); doc.setFontSize(7.8);
      doc.setTextColor(muted[0],muted[1],muted[2]);
      doc.text(detailLines, marginX + 2, y + 4);
    }
    y += rowH;
    doc.setDrawColor(lineCol[0],lineCol[1],lineCol[2]);
    doc.line(marginX, y - 2, pageW - marginX, y - 2);
  });

  /* ---- Totalen ---- */
  y += 8;
  if(y + 30 > bottomLimit){ doc.addPage(); y = header(true) + 20; }

  var boxX = pageW - marginX - 75;
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
  doc.setTextColor(80,76,70);
  doc.text('Subtotaal (excl. BTW)', boxX, y);
  doc.text(euro(o.subtotaal), pageW - marginX, y, {align:'right'});
  y += 6;
  doc.text('BTW ' + o.btwPct + '%', boxX, y);
  doc.text(euro(o.btw), pageW - marginX, y, {align:'right'});
  y += 4;
  doc.setDrawColor(anthracite[0],anthracite[1],anthracite[2]);
  doc.setLineWidth(0.6);
  doc.line(boxX, y, pageW - marginX, y);
  y += 6;
  doc.setFont('helvetica','bold'); doc.setFontSize(12);
  doc.setTextColor(anthracite[0],anthracite[1],anthracite[2]);
  doc.text('Totaal', boxX, y);
  doc.text(euro(o.totaalIncl), pageW - marginX, y, {align:'right'});

  /* ---- Voettekst ---- */
  y += 14;
  if(y + 20 > bottomLimit){ doc.addPage(); y = header(true) + 20; }
  doc.setDrawColor(lineCol[0],lineCol[1],lineCol[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, pageW - marginX, y);
  y += 6;
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(muted[0],muted[1],muted[2]);
  var geldigTekst = 'Deze offerte is ' + (state.geldigheid||'30') + ' dagen geldig vanaf de offertedatum. Genoemde bedragen zijn onder voorbehoud van definitieve inmeting.';
  var geldigLines = doc.splitTextToSize(geldigTekst, pageW - marginX*2);
  doc.text(geldigLines, marginX, y);
  y += geldigLines.length * 3.8 + 2;
  var voet=[b.kvk&&("KvK "+b.kvk),b.btwnr&&("BTW "+b.btwnr),b.iban&&("IBAN "+b.iban)].filter(Boolean).join('   ·   ');
  if(voet){ doc.text(voet, marginX, y); }

  doc.save('Offerte-' + (state.offerteNr||'concept') + '.pdf');
  saveToHistory();
  toast('Offerte ' + (state.offerteNr||'') + ' opgeslagen en gedownload.', 'success');
}

/* ---------- Bindingen ---------- */
function bindKlant(){
  el("k_naam").oninput=function(){state.klant.naam=this.value;el("ob_knaam").value=this.value;renderDoc();};
  el("k_email").oninput=function(){state.klant.email=this.value;el("ob_kemail").value=this.value;renderDoc();};
  el("k_adres").oninput=function(){state.klant.adres=this.value;el("ob_kadres").value=this.value;renderDoc();};
  el("k_pcplaats").oninput=function(){state.klant.pcplaats=this.value;el("ob_kpc").value=this.value;renderDoc();};
  el("k_kenmerk").oninput=function(){state.kenmerk=this.value;el("o_kenmerk").value=this.value;renderDoc();};
}
function bindOfferteVelden(){
  function b(id){return el(id);}
  b("b_naam").oninput=function(){state.bedrijf.naam=this.value;saveBedrijf();renderDoc();};
  b("b_tel").oninput=function(){state.bedrijf.tel=this.value;saveBedrijf();renderDoc();};
  b("b_adres").oninput=function(){state.bedrijf.adres=this.value;saveBedrijf();renderDoc();};
  b("b_pcplaats").oninput=function(){state.bedrijf.pcplaats=this.value;saveBedrijf();renderDoc();};
  b("b_email").oninput=function(){state.bedrijf.email=this.value;saveBedrijf();renderDoc();};
  b("b_iban").oninput=function(){state.bedrijf.iban=this.value;saveBedrijf();renderDoc();};
  b("b_kvk").oninput=function(){state.bedrijf.kvk=this.value;saveBedrijf();renderDoc();};
  b("b_btwnr").oninput=function(){state.bedrijf.btwnr=this.value;saveBedrijf();renderDoc();};
  b("ob_knaam").oninput=function(){state.klant.naam=this.value;el("k_naam").value=this.value;renderDoc();};
  b("ob_kemail").oninput=function(){state.klant.email=this.value;el("k_email").value=this.value;renderDoc();};
  b("ob_kadres").oninput=function(){state.klant.adres=this.value;el("k_adres").value=this.value;renderDoc();};
  b("ob_kpc").oninput=function(){state.klant.pcplaats=this.value;el("k_pcplaats").value=this.value;renderDoc();};
  b("o_nr").oninput=function(){state.offerteNr=this.value;renderDoc();};
  b("o_datum").oninput=function(){state.offerteDatum=this.value;renderDoc();};
  b("o_btw").oninput=function(){state.btwPct=this.value;renderDoc();};
  b("o_geldig").oninput=function(){state.geldigheid=this.value;renderDoc();};
  b("o_kenmerk").oninput=function(){state.kenmerk=this.value;el("k_kenmerk").value=this.value;renderDoc();};
}
function vulOfferteVelden(){
  var b=state.bedrijf;
  el("b_naam").value=b.naam;el("b_tel").value=b.tel;el("b_adres").value=b.adres;el("b_pcplaats").value=b.pcplaats;
  el("b_email").value=b.email;el("b_iban").value=b.iban;el("b_kvk").value=b.kvk;el("b_btwnr").value=b.btwnr;
  el("ob_knaam").value=state.klant.naam;el("ob_kemail").value=state.klant.email;el("ob_kadres").value=state.klant.adres;el("ob_kpc").value=state.klant.pcplaats;
  el("o_nr").value=state.offerteNr;el("o_datum").value=state.offerteDatum;el("o_btw").value=state.btwPct;el("o_geldig").value=state.geldigheid;el("o_kenmerk").value=state.kenmerk;
}
function openOfferte(){
  if(!state.offerteNr){
    var teller=1; var t=LS_get("loua_teller"); if(t)teller=parseInt(t)||1;
    state.offerteNr=(new Date().getFullYear())+"-"+String(teller).padStart(3,"0");
    LS_set("loua_teller",String(teller+1));
  }
  vulOfferteVelden(); renderDoc();
  el("overlay").classList.add("open");
}

/* ---------- Init app ---------- */
function initApp(){
  // datalist voor locatie
  var dl=document.createElement("datalist"); dl.id="loclist";
  LOCATIE_SUGGESTIES.forEach(function(s){var o=document.createElement("option");o.value=s;dl.appendChild(o);});
  document.body.appendChild(dl);

  var hersteld=restoreDraft();
  if(hersteld) pushStateIntoFields();

  renderProfielen(); renderRegels(); renderTransport(); renderProductBeheer(); bindKlant(); bindOfferteVelden(); recompute();
  if(hersteld) toast("Vorig concept hersteld");

  el("btnBeheer").onclick=function(){state.beheer=!state.beheer;el("btnBeheer").textContent=state.beheer?"✓ Klaar":"⚙ Beheer";renderProfielen();};
  el("btnAddRegel").onclick=function(){state.regels.push(nieuwRegel());renderRegels();recompute();renderDoc();};
  el("montageToggle").onclick=function(){state.montage=!state.montage;recompute();renderDoc();};
  el("aantalOpleveringen").oninput=function(){state.aantalOpleveringen=this.value;recompute();renderDoc();};
  el("btnOfferteTop").onclick=openOfferte;
  el("btnOfferteSide").onclick=openOfferte;
  el("btnClose").onclick=function(){el("overlay").classList.remove("open");};
  el("btnPdf").onclick=function(){
    var btn=el("btnPdf"); var origHtml=btn.innerHTML;
    btn.innerHTML="Bezig..."; btn.disabled=true;
    setTimeout(function(){
      try{ genereerPDF(); } finally { btn.innerHTML=origHtml; btn.disabled=false; }
    }, 50);
  };
  el("overlay").addEventListener("click",function(e){if(e.target===el("overlay"))el("overlay").classList.remove("open");});

  el("btnBeheerProd").onclick=function(){state.beheerProd=!state.beheerProd;el("btnBeheerProd").textContent=state.beheerProd?"✓ Klaar":"⚙ Beheer";renderProductBeheer();};

  el("btnNieuw").onclick=function(){
    if(state.regels.length>1 || state.klant.naam || state.regels.some(function(r){return r.breedte||r.hoogte;})){
      if(!confirm("Nieuw concept starten? Niet-opgeslagen wijzigingen aan het huidige concept gaan verloren.")) return;
    }
    state.regels=[nieuwRegel()];
    state.klant={naam:"",adres:"",pcplaats:"",email:""};
    state.kenmerk=""; state.offerteNr=""; state.montage=true; state.transport="geen";
    state.offerteDatum=new Date().toISOString().slice(0,10);
    pushStateIntoFields();
    renderRegels(); renderTransport(); recompute(); renderDoc();
    LS_set(AUTOSAVE_KEY,"");
    toast("Nieuw concept gestart");
  };

  el("btnHistorie").onclick=function(){ renderHistorie(""); el("histSearch").value=""; el("histOverlay").classList.add("open"); };
  el("btnHistClose").onclick=function(){ el("histOverlay").classList.remove("open"); };
  el("histOverlay").addEventListener("click",function(e){if(e.target===el("histOverlay"))el("histOverlay").classList.remove("open");});
  el("histSearch").oninput=function(){ renderHistorie(this.value); };
}

/* ---------- Init ---------- */
initApp();
</script>
</body>
</html>
`;

const COOKIE_NAME = 'loua_calc_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dagen

function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function getSecret() {
  return (process.env.CALC_USER || '') + ':' + (process.env.CALC_PASS || '');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function createSessionCookie() {
  var payload = 'ok.' + Date.now();
  var value = encodeURIComponent(payload + '.' + signPayload(payload));
  return COOKIE_NAME + '=' + value + '; HttpOnly; Secure; SameSite=Lax; Path=/intern/calculator; Max-Age=' + MAX_AGE_SECONDS;
}

function clearSessionCookie() {
  return COOKIE_NAME + '=; HttpOnly; Secure; SameSite=Lax; Path=/intern/calculator; Max-Age=0';
}

function parseCookies(header) {
  var out = {};
  (header || '').split(';').forEach(function (part) {
    var idx = part.indexOf('=');
    if (idx === -1) return;
    var k = part.slice(0, idx).trim();
    var v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function hasValidSession(req) {
  var cookies = parseCookies(req.headers['cookie']);
  var raw = cookies[COOKIE_NAME];
  if (!raw) return false;
  var lastDot = raw.lastIndexOf('.');
  if (lastDot === -1) return false;
  var payload = raw.slice(0, lastDot);
  var sig = raw.slice(lastDot + 1);
  if (!timingSafeStringEqual(sig, signPayload(payload))) return false;
  var m = /^ok\.(\d+)$/.exec(payload);
  if (!m) return false;
  var issuedAt = parseInt(m[1], 10);
  if (!issuedAt || Date.now() - issuedAt > MAX_AGE_SECONDS * 1000) return false;
  return true;
}

function getFormFields(req) {
  var body = req.body;
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string' && body.length) {
    var params = new URLSearchParams(body);
    return { username: params.get('username'), password: params.get('password') };
  }
  return {};
}

function loginPageHtml(errorMsg) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>LOUA · Intern inloggen</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  :root{ --cream:#FAFAF8; --surface:#FFFFFF; --ink:#201E1A; --sand:#A98C63; --sand-tint:#A98C6314; --line:#E7E2D9; --muted:#78716c; }
  *{box-sizing:border-box}
  body{margin:0;background:var(--cream);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .display{font-family:'Cormorant Garamond',Georgia,serif}
  .login{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .login .box{width:100%;max-width:360px;text-align:center;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:36px 30px;box-shadow:0 12px 32px rgba(32,30,26,.10)}
  .login img{height:40px;margin-bottom:20px}
  .login .eyebrow{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:var(--sand);margin:0 0 8px}
  .login h2{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin:0 0 4px}
  .login p.sub{color:var(--muted);font-size:14px;margin:0 0 26px}
  label.veld{display:block;text-align:left;margin-bottom:14px}
  label.veld .lab{display:block;font-size:12px;font-weight:500;color:var(--muted);margin-bottom:4px}
  input{width:100%;border:1px solid #E4DFD6;background:#fff;border-radius:8px;padding:10px 12px;font-size:14px;color:var(--ink);font-family:inherit;outline:none;transition:border .15s,box-shadow .15s}
  input:focus{border-color:var(--sand);box-shadow:0 0 0 3px rgba(169,140,99,.22)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:12px;padding:11px 18px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;width:100%;margin-top:8px;background:var(--ink);color:#fff;transition:opacity .15s}
  .btn:hover{opacity:.9}
  .err{color:#b91c1c;font-size:13px;margin-top:16px;min-height:18px}
</style>
</head>
<body>
  <div class="login">
    <div class="box">
      <img src="https://www.louaraamdecoratie.nl/images/logo-loua-dark-on-transparent.png" alt="LOUA Raamdecoratie" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'display',style:'font-size:20px;font-weight:600;margin-bottom:20px',textContent:'LOUA Raamdecoratie'}))" />
      <p class="eyebrow">Interne tool</p>
      <h2 class="display">Prijscalculator</h2>
      <p class="sub">Log in om verder te gaan.</p>
      <form method="POST" action="/intern/calculator">
        <label class="veld"><span class="lab">Gebruikersnaam</span><input type="text" name="username" autocomplete="username" required autofocus /></label>
        <label class="veld"><span class="lab">Wachtwoord</span><input type="password" name="password" autocomplete="current-password" required /></label>
        <button class="btn" type="submit">Inloggen</button>
      </form>
      <p class="err">${errorMsg || ''}</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  var user = process.env.CALC_USER;
  var pass = process.env.CALC_PASS;
  if (!user || !pass) {
    res.status(500).send('Basic Auth is niet geconfigureerd. Zet CALC_USER en CALC_PASS als environment variables in Vercel.');
    return;
  }

  if (req.method === 'POST') {
    var fields = getFormFields(req);
    var u = typeof fields.username === 'string' ? fields.username : '';
    var p = typeof fields.password === 'string' ? fields.password : '';
    var valid = timingSafeStringEqual(u, user) && timingSafeStringEqual(p, pass);
    if (valid) {
      res.setHeader('Set-Cookie', createSessionCookie());
      res.status(200).send(CALCULATOR_HTML);
      return;
    }
    res.status(401).send(loginPageHtml('Onjuiste gebruikersnaam of wachtwoord.'));
    return;
  }

  if (hasValidSession(req)) {
    res.status(200).send(CALCULATOR_HTML);
    return;
  }

  res.status(401).send(loginPageHtml(''));
};
