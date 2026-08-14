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
    <button class="btn btn-ink" id="btnOfferteTop">📄&nbsp; Offerte maken</button>
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
          <span class="hint" id="ramenTeller">0 ramen</span>
        </div>
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

<script>
"use strict";
/* ---------- Gegevens ---------- */
var PRODUCTEN = [
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
function nieuwRegel(){return {id:_id++,locatie:"",productIdx:0,prijs:String(PRODUCTEN[0].prijs),breedte:"",hoogte:"",aantal:"1",rall:false};}
var state={
  regels:[nieuwRegel()],
  montage:true,
  transport:"geen",
  aantalOpleveringen:"2",
  profielen:[{id:1,naam:"Standaard",pct:"0"},{id:2,naam:"Zakelijk / aannemer",pct:"-10"},{id:3,naam:"Spoed / meerwerk",pct:"15"}],
  actiefProfiel:1,
  beheer:false,
  bedrijf:Object.assign({},STD_BEDRIJF),
  klant:{naam:"",adres:"",pcplaats:"",email:""},
  kenmerk:"",
  offerteNr:"",
  offerteDatum:new Date().toISOString().slice(0,10),
  btwPct:"21",
  geldigheid:"30"
};
var _pid=100;

/* ---------- Opslag laden ---------- */
(function(){
  var p=LS_get("loua_profielen");
  if(p){try{var arr=JSON.parse(p);if(Array.isArray(arr)&&arr.length){state.profielen=arr;_pid=Math.max.apply(null,arr.map(function(x){return x.id+1;}).concat([100]));state.actiefProfiel=arr[0].id;}}catch(e){}}
  var b=LS_get("loua_bedrijf");
  if(b){try{state.bedrijf=Object.assign({},STD_BEDRIJF,JSON.parse(b));}catch(e){}}
})();
function saveProfielen(){LS_set("loua_profielen",JSON.stringify(state.profielen));}
function saveBedrijf(){LS_set("loua_bedrijf",JSON.stringify(state.bedrijf));}

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
      var ni=document.createElement("input"); ni.value=p.naam; ni.placeholder="Naam"; ni.style.flex="1";
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
function optionsHTML(sel){return PRODUCTEN.map(function(p,i){return '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+esc(p.naam)+'</option>';}).join("");}
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
    var prod=d.querySelector('.prod'); prod.onchange=function(){r.productIdx=parseInt(prod.value);r.prijs=String(PRODUCTEN[r.productIdx].prijs);pr.value=r.prijs;recompute();renderDoc();};
    var br=d.querySelector('.br'); br.value=r.breedte; br.oninput=function(){r.breedte=br.value;recompute();renderDoc();};
    var ho=d.querySelector('.ho'); ho.value=r.hoogte; ho.oninput=function(){r.hoogte=ho.value;recompute();renderDoc();};
    var aa=d.querySelector('.aa'); aa.value=r.aantal; aa.oninput=function(){r.aantal=aa.value;recompute();renderDoc();};
    var pr=d.querySelector('.pr'); pr.value=r.prijs; pr.oninput=function(){r.prijs=pr.value;recompute();renderDoc();};
    var ra=d.querySelector('.ra'); ra.checked=r.rall; ra.onchange=function(){r.rall=ra.checked;recompute();renderDoc();};
    var reset=d.querySelector('.reset'); reset.onclick=function(){r.prijs=String(PRODUCTEN[r.productIdx].prijs);pr.value=r.prijs;recompute();renderDoc();};
    var del=d.querySelector('.del'); del.onclick=function(){if(state.regels.length>1){state.regels=state.regels.filter(function(x){return x.id!==r.id;});renderRegels();recompute();renderDoc();}};
    r._m2=d.querySelector('.m2'); r._lt=d.querySelector('.lt'); r._reset=reset;
    cont.appendChild(d);
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
    if(x.r._reset) x.r._reset.style.display = (x.basis!==PRODUCTEN[x.r.productIdx].prijs)?"inline-flex":"none";
  });
  el("ramenTeller").textContent=c.totaalRamen+" raam"+(c.totaalRamen===1?"":"en");
  el("montageSub").textContent=euro(MONTAGE)+" per raam · "+c.totaalRamen+" ramen";
  el("montageToggle").className="toggle"+(state.montage?" on":"");
  el("ovProducten").textContent=euro(c.productSom);
  var pr=el("ovProfielRow");
  if(c.pct!==0){pr.style.display="flex";el("ovProfielLabel").textContent=(c.profiel.naam||"Profiel")+" ("+(c.pct>0?"+":"")+c.pct+"%)";el("ovProfielVal").textContent=euro(c.profielBedrag);}else pr.style.display="none";
  var mr=el("ovMontageRow"); if(c.montageK>0){mr.style.display="flex";el("ovMontageVal").textContent=euro(c.montageK);}else mr.style.display="none";
  var tr=el("ovTransportRow"); if(c.transportK>0){tr.style.display="flex";el("ovTransportVal").textContent=euro(c.transportK);}else tr.style.display="none";
  el("ovTotaal").textContent=euro(c.eind);
}

/* ---------- Offerte document ---------- */
function offerteData(){
  var c=bereken(); var lijnen=[];
  c.rows.forEach(function(x){
    if(x.aantal<=0||x.m2<=0)return;
    var stuk=x.effect*x.m2*c.factor;
    var loc=(x.r.locatie||"").trim();
    var naam=PRODUCTEN[x.r.productIdx].naam+(x.r.rall?" · speciale RAL-kleur":"");
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
  var contact=[b.adres,b.pcplaats].filter(Boolean).join("\n")+((b.tel||b.email)?"\n":"")+[b.tel,b.email].filter(Boolean).join(" · ");
  var rijen = o.lijnen.length ? o.lijnen.map(function(l){
    return '<tr><td><span class="om">'+esc(l.om)+'</span>'+(l.detail?'<span class="om-sub">'+esc(l.detail)+'</span>':'')+'</td><td class="c">'+l.aantal+'</td><td class="r">'+euro(l.stuk)+'</td><td class="r" style="font-weight:500">'+euro(l.totaal)+'</td></tr>';
  }).join("") : '<tr><td colspan="4" style="text-align:center;color:#a8a29e;padding:16px 0">Nog geen regels — vul afmetingen in de calculator in.</td></tr>';
  var voet=[b.kvk&&("KvK "+b.kvk),b.btwnr&&("BTW "+b.btwnr),b.iban&&("IBAN "+b.iban)].filter(Boolean).join("  ·  ");
  el("offerteDoc").innerHTML=
    '<div class="doc-head"><div>'+
      '<img src="'+LOGO+'" alt="LOUA" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'doc-brandname\',textContent:\''+esc(b.naam||"LOUA Raamdecoratie")+'\'}))"/>'+
      '<div class="doc-contact">'+esc(contact)+'</div>'+
    '</div><div><p class="doc-title">Offerte</p><p class="doc-meta">Nummer: '+esc(state.offerteNr||"—")+'</p><p class="doc-meta">Datum: '+esc(datumNL(state.offerteDatum))+'</p></div></div>'+
    '<div class="doc-parties"><div><p class="doc-lab">Aan</p><p class="doc-to-name">'+esc(k.naam||"—")+'</p><p class="doc-to">'+esc([k.adres,k.pcplaats].filter(Boolean).join("\n"))+'</p>'+(k.email?'<p class="doc-to">'+esc(k.email)+'</p>':'')+'</div>'+
      (state.kenmerk?'<div style="max-width:50%"><p class="doc-lab">Kenmerk</p><p class="doc-to" style="color:#44403c">'+esc(state.kenmerk)+'</p></div>':'')+'</div>'+
    '<table><thead><tr><th>Omschrijving</th><th class="c">Aantal</th><th class="r">Stukprijs</th><th class="r">Totaal</th></tr></thead><tbody>'+rijen+'</tbody></table>'+
    '<div class="totalen"><div class="box">'+
      '<div class="t"><span>Subtotaal (excl. BTW)</span><span>'+euro(o.subtotaal)+'</span></div>'+
      '<div class="t"><span>BTW '+o.btwPct+'%</span><span>'+euro(o.btw)+'</span></div>'+
      '<div class="grand"><span>Totaal</span><span>'+euro(o.totaalIncl)+'</span></div>'+
    '</div></div>'+
    '<div class="doc-foot"><p>Deze offerte is '+esc(state.geldigheid||"30")+' dagen geldig vanaf de offertedatum. Genoemde bedragen zijn onder voorbehoud van definitieve inmeting.</p>'+(voet?'<p style="margin-top:4px">'+esc(voet)+'</p>':'')+'</div>';
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

  renderProfielen(); renderRegels(); renderTransport(); bindKlant(); bindOfferteVelden(); recompute();

  el("btnBeheer").onclick=function(){state.beheer=!state.beheer;el("btnBeheer").textContent=state.beheer?"✓ Klaar":"⚙ Beheer";renderProfielen();};
  el("btnAddRegel").onclick=function(){state.regels.push(nieuwRegel());renderRegels();recompute();renderDoc();};
  el("montageToggle").onclick=function(){state.montage=!state.montage;recompute();renderDoc();};
  el("aantalOpleveringen").oninput=function(){state.aantalOpleveringen=this.value;recompute();renderDoc();};
  el("btnOfferteTop").onclick=openOfferte;
  el("btnOfferteSide").onclick=openOfferte;
  el("btnClose").onclick=function(){el("overlay").classList.remove("open");};
  el("btnPdf").onclick=function(){window.print();};
  el("overlay").addEventListener("click",function(e){if(e.target===el("overlay"))el("overlay").classList.remove("open");});
}

/* ---------- Init ---------- */
initApp();
</script>
</body>
</html>
`;

function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function isAuthorized(req) {
  var user = process.env.CALC_USER;
  var pass = process.env.CALC_PASS;
  if (!user || !pass) return null; // not configured

  var auth = req.headers['authorization'] || '';
  if (auth.slice(0, 6) !== 'Basic ') return false;

  var decoded;
  try {
    decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  } catch (e) {
    return false;
  }
  var sepIndex = decoded.indexOf(':');
  if (sepIndex === -1) return false;
  var u = decoded.slice(0, sepIndex);
  var p = decoded.slice(sepIndex + 1);

  return timingSafeStringEqual(u, user) && timingSafeStringEqual(p, pass);
}

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  var authorized = isAuthorized(req);

  if (authorized === null) {
    res.status(500).send('Basic Auth is niet geconfigureerd. Zet CALC_USER en CALC_PASS als environment variables in Vercel.');
    return;
  }

  if (!authorized) {
    res.setHeader('WWW-Authenticate', 'Basic realm="LOUA intern"');
    res.status(401).send('Authenticatie vereist');
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(CALCULATOR_HTML);
};
