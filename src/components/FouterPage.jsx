import { useState, useEffect } from "react";

const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#EFEFEF; --bg2:#E4E4E4; --bg3:#F8F8F8;
      --dark:#1E1E1E; --dark2:#2C2C2C;
      --txt:#3D3D3D; --txt2:#6E6E6E; --acc:#BDBDBD; --acc2:#9E9E9E;
      --line:rgba(61,61,61,.09); --line2:rgba(61,61,61,.17);
      --serif:'Cormorant Garamond',Georgia,serif;
      --ui:'Outfit',sans-serif;
    }
    html,body,#root{background:var(--bg);color:var(--txt);font-family:var(--ui);overflow-x:hidden}
    ::-webkit-scrollbar{width:1.5px}::-webkit-scrollbar-thumb{background:var(--acc)}

    /* reveal */
    .rv{opacity:0;transform:translateY(18px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
    .rv.in{opacity:1;transform:none}

    /* ── HERO ── */
    .ab-hero{
      position:relative; height:500px; overflow:hidden;
      background:var(--dark); display:flex; align-items:flex-end;
    }
    .ab-img{
      position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
      object-position:center 30%;
      filter:brightness(.24) saturate(.38);
      animation:kz 16s ease-in-out infinite alternate;
    }
    @keyframes kz{from{transform:scale(1.04)}to{transform:scale(1.09) translate(-1%,.5%)}}
    .ab-con{
      position:relative;z-index:2;width:100%;
      padding:0 52px 52px;
      display:flex;align-items:flex-end;justify-content:space-between;
    }
    .ab-eye{font-size:7.5px;font-weight:300;letter-spacing:.42em;text-transform:uppercase;color:rgba(239,239,239,.35);margin-bottom:10px}
    .ab-title{font-family:var(--serif);font-size:clamp(44px,6vw,84px);font-weight:300;color:#EFEFEF;line-height:1.04}
    .ab-yr{text-align:right}
    .ab-yr-n{font-family:var(--serif);font-size:clamp(60px,9vw,110px);font-weight:300;color:rgba(239,239,239,.06);line-height:1;letter-spacing:-.04em}
    .ab-yr-l{font-size:7.5px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:rgba(239,239,239,.26);margin-top:3px}

    /* ── STATS ── */
    .stats{display:grid;grid-template-columns:repeat(4,1fr);background:var(--bg3);border-bottom:1px solid var(--line)}
    .stat-c{padding:36px 38px;border-right:1px solid var(--line)}
    .stat-c:last-child{border-right:none}
    .stat-n{font-family:var(--serif);font-size:clamp(32px,4vw,52px);font-weight:300;color:var(--txt);line-height:1;margin-bottom:5px}
    .stat-l{font-size:7px;font-weight:400;letter-spacing:.32em;text-transform:uppercase;color:var(--acc2)}
    .stat-d{font-size:11.5px;font-weight:300;color:var(--txt2);margin-top:7px;line-height:1.7;max-width:180px}

    /* ── STORY ── */
    .story{display:grid;grid-template-columns:1fr 1fr;min-height:520px;background:var(--bg)}
    .story-l{
      display:flex;flex-direction:column;justify-content:center;
      padding:72px 56px 72px 52px;border-right:1px solid var(--line);
    }
    .s-tag{font-size:7px;font-weight:300;letter-spacing:.40em;text-transform:uppercase;color:var(--acc2);margin-bottom:18px}
    .s-title{font-family:var(--serif);font-size:clamp(26px,3vw,42px);font-weight:300;color:var(--txt);line-height:1.12;margin-bottom:22px}
    .s-title em{font-style:italic;color:var(--acc2)}
    .s-body{font-size:12.5px;font-weight:300;line-height:1.9;color:var(--txt2);max-width:390px}
    .s-body p+p{margin-top:14px}
    .s-sign{margin-top:36px;padding-top:26px;border-top:1px solid var(--line);display:flex;align-items:center;gap:14px}
    .s-ln{width:30px;height:1px;background:var(--acc)}
    .s-name{font-family:var(--serif);font-size:17px;font-weight:300;color:var(--txt)}
    .s-role{font-size:7px;font-weight:300;letter-spacing:.26em;text-transform:uppercase;color:var(--acc2);margin-top:2px}
    .story-r{position:relative;overflow:hidden;background:var(--bg2)}
    .story-img{width:100%;height:100%;object-fit:cover;filter:brightness(.86) saturate(.45);transition:transform .8s cubic-bezier(.16,1,.3,1)}
    .story-r:hover .story-img{transform:scale(1.04)}
    .story-caption{position:absolute;bottom:22px;left:22px;background:rgba(248,248,248,.94);backdrop-filter:blur(8px);padding:12px 16px;border-left:2px solid var(--dark)}
    .sc-l{font-size:7px;font-weight:300;letter-spacing:.28em;text-transform:uppercase;color:var(--acc2);margin-bottom:2px}
    .sc-v{font-family:var(--serif);font-size:14px;font-weight:300;color:var(--txt)}

    /* ── VALUES TRIO ── */
    .trio{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
    .trio-c{padding:38px 42px;border-right:1px solid var(--line);background:var(--bg3);position:relative;overflow:hidden;transition:background .28s}
    .trio-c:last-child{border-right:none}
    .trio-c:hover{background:var(--bg2)}
    .trio-c::before{content:'';position:absolute;top:0;left:0;width:0;height:1px;background:var(--dark);transition:width .44s cubic-bezier(.4,0,.2,1)}
    .trio-c:hover::before{width:100%}
    .ico-w{width:44px;height:44px;margin-bottom:16px}
    .ico-3d{width:44px;height:44px;animation:fl3 5s ease-in-out infinite}
    @keyframes fl3{0%,100%{transform:rotateX(10deg) rotateY(-10deg)}50%{transform:rotateX(-8deg) rotateY(10deg) translateY(-4px)}}
    .trio-ttl{font-family:var(--serif);font-size:17px;font-weight:300;color:var(--txt);margin-bottom:7px}
    .trio-txt{font-size:12px;font-weight:300;line-height:1.85;color:var(--txt2)}

    /* ── TEAM ── */
    .team{padding:64px 52px;background:var(--bg2);border-top:1px solid var(--line)}
    .team-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:36px}
    .team-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:7px}
    .team-ttl{font-family:var(--serif);font-size:clamp(22px,2.4vw,34px);font-weight:300;color:var(--txt)}
    .team-sub{font-size:11.5px;font-weight:300;color:var(--txt2);max-width:240px;text-align:right;line-height:1.7}
    .team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line)}
    .tm-c{cursor:pointer;background:var(--bg3);overflow:hidden}
    .tm-iw{position:relative;aspect-ratio:3/4;overflow:hidden}
    .tm-img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(.82) saturate(.38) contrast(1.06);transition:transform .7s cubic-bezier(.16,1,.3,1),filter .38s}
    .tm-c:hover .tm-img{transform:scale(1.06);filter:brightness(.72) saturate(.32)}
    .tm-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(30,30,30,.72) 0%,transparent 55%)}
    .tm-info{position:absolute;bottom:0;left:0;right:0;padding:14px 14px 16px}
    .tm-role{font-size:7px;font-weight:300;letter-spacing:.28em;text-transform:uppercase;color:rgba(239,239,239,.46);margin-bottom:3px}
    .tm-name{font-family:var(--serif);font-size:17px;font-weight:300;color:#EFEFEF}
    .tm-since{font-size:8.5px;font-weight:300;color:rgba(239,239,239,.3);margin-top:2px}
    .tm-det{padding:13px 14px 15px;background:var(--bg2);border-top:1px solid var(--line)}
    .tm-quote{font-family:var(--serif);font-size:12px;font-style:italic;font-weight:300;color:var(--txt2);line-height:1.6}

    /* ── TIMELINE ── */
    .tl{padding:64px 52px;background:var(--bg);border-top:1px solid var(--line)}
    .tl-hd{margin-bottom:44px}
    .tl-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:8px}
    .tl-ttl{font-family:var(--serif);font-size:clamp(22px,2.4vw,34px);font-weight:300;color:var(--txt)}
    .tl-list{position:relative}
    .tl-spine{position:absolute;left:100px;top:0;bottom:0;width:1px;background:var(--line2)}
    .tl-item{display:flex;align-items:flex-start;padding-bottom:36px;position:relative}
    .tl-item:last-child{padding-bottom:0}
    .tl-yr{font-family:var(--serif);font-size:19px;font-weight:300;color:var(--acc2);width:100px;flex-shrink:0;padding-top:2px}
    .tl-dot{width:7px;height:7px;border-radius:50%;background:var(--dark);flex-shrink:0;margin-top:8px;position:relative;z-index:1}
    .tl-body{padding-left:24px}
    .tl-ev{font-family:var(--serif);font-size:17px;font-weight:300;color:var(--txt);margin-bottom:5px}
    .tl-desc{font-size:11.5px;font-weight:300;color:var(--txt2);line-height:1.75;max-width:440px}

    /* ── HOURS ALL BRANCHES ── */
    .hours-all{padding:64px 52px;background:var(--bg3);border-top:1px solid var(--line)}
    .h-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:7px}
    .h-ttl{font-family:var(--serif);font-size:clamp(22px,2.4vw,34px);font-weight:300;color:var(--txt);margin-bottom:6px}
    .h-sub{font-size:12px;font-weight:300;color:var(--txt2)}
    .h-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px}
    .h-today{font-size:9px;font-weight:300;color:var(--acc2)}
    .h-today strong{color:var(--txt);font-weight:400}
    .h-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line)}
    .h-card{background:var(--bg2);padding:24px 22px}
    .hc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px}
    .hc-name{font-family:var(--serif);font-size:16px;font-weight:300;color:var(--txt)}
    .hc-badge{font-size:6.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;padding:2px 8px;font-family:var(--ui);margin-top:3px;flex-shrink:0}
    .hc-badge.op{background:#5A9E5A;color:#fff}
    .hc-badge.cl{background:#A05050;color:#fff}
    .hc-addr{font-size:8px;font-weight:300;color:var(--acc2);margin-bottom:16px;line-height:1.5}
    .dr{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--line)}
    .dr:last-child{border-bottom:none}
    .dr.td{background:rgba(61,61,61,.05);padding:5px 6px;margin:0 -6px;border-radius:1px}
    .dr-day{font-size:9.5px;font-weight:300;color:var(--txt2);display:flex;align-items:center;gap:5px}
    .dr-day.td{color:var(--dark);font-weight:400}
    .dr-time{font-size:9.5px;font-weight:300;color:var(--txt)}
    .dr-time.off{color:var(--acc2)}
    .today-lbl{font-size:6px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;background:var(--dark);color:#EFEFEF;padding:1px 5px;font-family:var(--ui)}

    /* ── ADDRESS ── */
    .addr{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line);min-height:420px;background:var(--bg)}
    .addr-l{padding:60px 52px;display:flex;flex-direction:column;justify-content:space-between}
    .addr-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:12px}
    .addr-ttl{font-family:var(--serif);font-size:clamp(22px,2.4vw,34px);font-weight:300;color:var(--txt);margin-bottom:32px}
    .addr-blocks{display:flex;flex-direction:column;gap:22px}
    .ab-lbl{font-size:7px;font-weight:400;letter-spacing:.26em;text-transform:uppercase;color:var(--acc2);margin-bottom:5px;display:flex;align-items:center;gap:5px}
    .ab-val{font-size:13px;font-weight:300;color:var(--txt2);line-height:1.6}
    .ab-val a{color:var(--txt);text-decoration:none;transition:color .2s}
    .ab-val a:hover{color:var(--acc2)}
    .addr-r{position:relative;overflow:hidden;background:var(--bg2)}
    .map-fr{width:100%;height:100%;border:none;filter:grayscale(1) contrast(1.1) brightness(.94)}
    .map-pin{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;pointer-events:none}
    .mp-d{width:10px;height:10px;border-radius:50%;background:var(--dark);border:2px solid var(--bg3);box-shadow:0 2px 8px rgba(0,0,0,.2)}
    .mp-s{width:1px;height:18px;background:var(--dark);margin-top:2px}
    .mp-l{margin-top:5px;background:var(--dark);color:rgba(239,239,239,.85);font-size:7px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;padding:4px 10px;white-space:nowrap;font-family:var(--ui)}

    /* ── FOOTER ── */
    .footer{background:var(--dark);border-top:1px solid rgba(255,255,255,.04)}
    .ft-top{
      padding:52px 52px 40px;
      display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
      gap:40px;border-bottom:1px solid rgba(255,255,255,.05);
    }
    .ft-brand{font-family:var(--serif);font-size:22px;font-weight:300;letter-spacing:.14em;color:#EFEFEF;margin-bottom:3px}
    .ft-sub{font-size:7px;font-weight:300;letter-spacing:.40em;text-transform:uppercase;color:rgba(239,239,239,.26);margin-bottom:17px}
    .ft-desc{font-size:11.5px;font-weight:300;line-height:1.85;color:rgba(239,239,239,.3);max-width:230px;margin-bottom:20px}
    .ft-soc{display:flex;gap:6px}
    .soc{width:30px;height:30px;border:1px solid rgba(239,239,239,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:9px;font-weight:300;color:rgba(239,239,239,.3);transition:border-color .2s,color .2s;font-family:var(--ui)}
    .soc:hover{border-color:rgba(239,239,239,.35);color:rgba(239,239,239,.8)}
    .ft-col-h{font-size:7.5px;font-weight:400;letter-spacing:.30em;text-transform:uppercase;color:rgba(239,239,239,.26);margin-bottom:16px;font-family:var(--ui)}
    .ft-lnk{display:block;font-size:11.5px;font-weight:300;color:rgba(239,239,239,.36);text-decoration:none;padding:4px 0;transition:color .2s;cursor:pointer}
    .ft-lnk:hover{color:rgba(239,239,239,.72)}
    .ft-mid{padding:24px 52px;display:grid;grid-template-columns:1fr 1fr;gap:22px;border-bottom:1px solid rgba(255,255,255,.05)}
    .nl-ttl{font-size:11.5px;font-weight:300;color:rgba(239,239,239,.45);margin-bottom:9px}
    .nl-row{display:flex}
    .nl-in{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-right:none;padding:9px 13px;font-size:11px;font-weight:300;color:#EFEFEF;font-family:var(--ui);outline:none;transition:border-color .2s}
    .nl-in::placeholder{color:rgba(239,239,239,.2)}
    .nl-in:focus{border-color:rgba(255,255,255,.25)}
    .nl-btn{background:rgba(239,239,239,.88);color:var(--dark);border:none;cursor:pointer;font-size:7.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:9px 16px;font-family:var(--ui);transition:background .2s;white-space:nowrap}
    .nl-btn:hover{background:#EFEFEF}
    .pay{display:flex;align-items:center;gap:5px;justify-content:flex-end;flex-wrap:wrap}
    .pay-b{border:1px solid rgba(255,255,255,.08);padding:5px 9px;font-size:7.5px;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:rgba(239,239,239,.26);font-family:var(--ui)}
    .ft-bot{padding:16px 52px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
    .ft-copy{font-size:9.5px;font-weight:300;letter-spacing:.1em;color:rgba(239,239,239,.18)}
    .ft-leg{display:flex;gap:18px}
    .ft-leglink{font-size:9.5px;font-weight:300;color:rgba(239,239,239,.18);cursor:pointer;transition:color .2s;text-decoration:none}
    .ft-leglink:hover{color:rgba(239,239,239,.45)}
    .bk-btn{width:30px;height:30px;border:1px solid rgba(255,255,255,.1);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(239,239,239,.3);transition:all .2s}
    .bk-btn:hover{border-color:rgba(255,255,255,.35);color:rgba(239,239,239,.75)}

    @media(max-width:1000px){
      .stats{grid-template-columns:1fr 1fr}
      .story{grid-template-columns:1fr}.story-r{height:380px}
      .team-grid{grid-template-columns:1fr 1fr}
      .h-grid{grid-template-columns:1fr 1fr}
      .addr{grid-template-columns:1fr}.addr-r{height:280px}
      .ft-top{grid-template-columns:1fr 1fr}
      .ft-mid{grid-template-columns:1fr}
      .trio{grid-template-columns:1fr}
      .trio-c{border-right:none;border-bottom:1px solid var(--line)}
    }
    @media(max-width:640px){
      .ab-con{padding:0 24px 36px;flex-direction:column;gap:8px}
      .story-l,.team,.tl,.hours-all,.addr-l,.ft-top,.ft-mid,.ft-bot{padding-left:24px;padding-right:24px}
      .ft-top{grid-template-columns:1fr}
      .h-grid{grid-template-columns:1fr}
      .stats{grid-template-columns:1fr 1fr}
    }
  `}</style>
);

/* 3D SVG icons */
const IcoStar = () => (
  <svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}>
    <defs>
      <linearGradient id="fts1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#C8C8C8"/></linearGradient>
      <linearGradient id="fts2" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#C0C0C0"/><stop offset="1" stopColor="#888"/></linearGradient>
    </defs>
    <polygon points="24,4 28.5,17 42,17 31.5,26 35,39 24,31 13,39 16.5,26 6,17 19.5,17" fill="url(#fts1)"/>
    <polygon points="24,31 13,39 16.5,26 6,17 19.5,17 24,4" fill="url(#fts2)" opacity=".5"/>
  </svg>
);
const IcoBox = () => (
  <svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}>
    <defs>
      <linearGradient id="ftb1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F8F8F8"/><stop offset="1" stopColor="#C4C4C4"/></linearGradient>
      <linearGradient id="ftb2" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#C0C0C0"/><stop offset="1" stopColor="#888"/></linearGradient>
      <linearGradient id="ftb3" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#D8D8D8"/><stop offset="1" stopColor="#A0A0A0"/></linearGradient>
    </defs>
    <polygon points="24,6 40,14 24,22 8,14" fill="url(#ftb1)"/>
    <polygon points="8,14 8,34 24,42 24,22" fill="url(#ftb2)"/>
    <polygon points="40,14 40,34 24,42 24,22" fill="url(#ftb3)"/>
    <line x1="24" y1="6" x2="24" y2="42" stroke="rgba(255,255,255,.5)" strokeWidth="1"/>
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}>
    <defs>
      <linearGradient id="ftsh1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#C8C8C8"/></linearGradient>
      <linearGradient id="ftsh2" x1="1" y1="0" x2="0" y2="1"><stop stopColor="#C0C0C0"/><stop offset="1" stopColor="#888"/></linearGradient>
    </defs>
    <path d="M24 4L40 10V22C40 32 24 44 24 44S8 32 8 22V10L24 4Z" fill="url(#ftsh1)"/>
    <path d="M24 4L40 10V22C40 32 24 44 24 44V4Z" fill="url(#ftsh2)" opacity=".45"/>
    <polyline points="17,24 22,29 31,20" stroke="rgba(61,61,61,.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

/* helpers */
const DAY_UZ = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
const todayName = () => DAY_UZ[new Date().getDay()];
const nowHour   = () => { const d = new Date(); return d.getHours() + d.getMinutes()/60; };
const checkOpen = (h) => {
  if (!h?.open) return false;
  const [oh,om] = h.open.split(":").map(Number);
  const [ch,cm] = h.close.split(":").map(Number);
  return nowHour() >= oh+om/60 && nowHour() < ch+cm/60;
};

const BRANCHES = [
  {
    id:"chilonzor", name:"Chilonzor", address:"Chilonzor ko'ch., 12-uy",
    hours:[
      {day:"Dushanba",  open:"09:00",close:"20:00"},
      {day:"Seshanba",  open:"09:00",close:"20:00"},
      {day:"Chorshanba",open:"09:00",close:"20:00"},
      {day:"Payshanba", open:"09:00",close:"20:00"},
      {day:"Juma",      open:"09:00",close:"21:00"},
      {day:"Shanba",    open:"10:00",close:"20:00"},
      {day:"Yakshanba", open:null,   close:null},
    ]
  },
  {
    id:"yunusobod", name:"Yunusobod", address:"Amir Temur shoh ko'ch., 15",
    hours:[
      {day:"Dushanba",  open:"09:00",close:"21:00"},
      {day:"Seshanba",  open:"09:00",close:"21:00"},
      {day:"Chorshanba",open:"09:00",close:"21:00"},
      {day:"Payshanba", open:"09:00",close:"21:00"},
      {day:"Juma",      open:"09:00",close:"22:00"},
      {day:"Shanba",    open:"10:00",close:"21:00"},
      {day:"Yakshanba", open:"11:00",close:"19:00"},
    ]
  },
  {
    id:"mirzo", name:"Mirzo Ulug'bek", address:"Mirzo Ulug'bek ko'ch., 8",
    hours:[
      {day:"Dushanba",  open:"09:00",close:"20:00"},
      {day:"Seshanba",  open:"09:00",close:"20:00"},
      {day:"Chorshanba",open:"09:00",close:"20:00"},
      {day:"Payshanba", open:"09:00",close:"20:00"},
      {day:"Juma",      open:"09:00",close:"20:00"},
      {day:"Shanba",    open:"10:00",close:"19:00"},
      {day:"Yakshanba", open:null,   close:null},
    ]
  },
  {
    id:"sergeli", name:"Sergeli", address:"Sergeli ko'ch., 24",
    hours:[
      {day:"Dushanba",  open:"10:00",close:"20:00"},
      {day:"Seshanba",  open:"10:00",close:"20:00"},
      {day:"Chorshanba",open:"10:00",close:"20:00"},
      {day:"Payshanba", open:"10:00",close:"20:00"},
      {day:"Juma",      open:"10:00",close:"21:00"},
      {day:"Shanba",    open:"10:00",close:"20:00"},
      {day:"Yakshanba", open:"11:00",close:"18:00"},
    ]
  },
];

const TEAM = [
  {name:"Jahongir Raximov",role:"Asoschisi",since:"2015",img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",quote:"«Har bir kiyim — o'z hissiyotini aytib berishi kerak.»"},
  {name:"Dilnoza Yusupova",role:"Bosh Dizayner",since:"2017",img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",quote:"«Uslub — bu tilsiz muloqot shakli.»"},
  {name:"Bekzod Toshmatov",role:"Savdo Menejeri",since:"2018",img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",quote:"«Mijozning qoniqishi — bizning g'ururumiz.»"},
  {name:"Malika Hasanova",role:"Brend Menejeri",since:"2020",img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",quote:"«Brend — bu faqat logo emas, bu his-tuyg'u.»"},
];

const TIMELINE = [
  {year:"2015",event:"Do'konning ochilishi",desc:"Toshkent shahrida birinchi Raffini showroom ochildi. 50 ta mahsulot bilan orzuli sayohat boshlandi."},
  {year:"2017",event:"Onlayn platforma",desc:"raffini.uz veb-saytimiz ishga tushdi. Foydalanuvchilar soni 3 barobar oshdi."},
  {year:"2019",event:"2-chi Filial",desc:"Yunusobod tumanida ikkinchi do'konimiz ochildi. Jamoa 12 mutaxassisga yetdi."},
  {year:"2022",event:"Premium Hamkorlik",desc:"Hugo Boss, Lacoste, Armani bilan rasmiy hamkorlik shartnomasi imzolandi."},
  {year:"2024",event:"3000+ Mijoz",desc:"Faol mijozlar soni 3 mingdan oshdi. Toshkent bo'ylab bepul yetkazib berish boshlandi."},
  {year:"2025",event:"4-chi Filial",desc:"Sergeli tumanida to'rtinchi filialimiz ochildi. Endi barcha tumanlarda xizmat ko'rsatamiz."},
];

/* reveal hook */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: .1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const ArrowUp = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;

export default function FouterPage() {
  useReveal();
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);
  const today = todayName();

  const handleSub = () => {
    if (!email.includes("@")) return;
    setSent(true); setTimeout(() => setSent(false), 3000); setEmail("");
  };

  return (
    <>
      <CSS/>

      {/* HERO */}
      <div className="ab-hero">
        <img className="ab-img" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85" alt="Raffini"/>
        <div className="ab-con">
          <div>
            <div className="ab-eye">Raffini Men's Collection — Biz haqimizda</div>
            <h1 className="ab-title">Uslub.<br/>Sifat.<br/>Ishonch.</h1>
          </div>
          <div className="ab-yr">
            <div className="ab-yr-n">2015</div>
            <div className="ab-yr-l">Tashkil etilgan</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {[
          {n:"10+",l:"Yillik Tajriba",d:"2015 yildan beri erkaklar modasi sohasida."},
          {n:"500+",l:"Mahsulot",d:"Hamma yo'nalish uchun keng assortiment."},
          {n:"12",l:"Premium Brend",d:"Hugo Boss, Lacoste, Armani va boshqalar."},
          {n:"3K+",l:"Mamnun Mijoz",d:"Toshkent bo'ylab ishonchli hamkorlar."},
        ].map((s,i) => (
          <div key={i} className="stat-c rv" style={{transitionDelay:`${i*.08}s`}}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
            <div className="stat-d">{s.d}</div>
          </div>
        ))}
      </div>

      {/* STORY */}
      <div className="story">
        <div className="story-l rv">
          <div className="s-tag">Bizning Hikoyamiz</div>
          <h2 className="s-title">Sifatli kiyim —<br/><em>hayot sifatini</em><br/>ko'taradi.</h2>
          <div className="s-body">
            <p>2015 yilda Toshkentda bitta showroom va katta orzu bilan boshlangan Raffini bugun O'zbekistoning eng ishonchli erkaklar kiyim brendiga aylandi.</p>
            <p>Biz faqat kiyim sotmaymiz — har bir mijozga o'ziga to'g'ri uslub topishda yordam beramiz. Premium brendlar, sertifikatlangan mahsulotlar, professional konsultatsiya.</p>
          </div>
          <div className="s-sign">
            <div className="s-ln"/>
            <div>
              <div className="s-name">Jahongir Raximov</div>
              <div className="s-role">Asoschisi — Raffini</div>
            </div>
          </div>
        </div>
        <div className="story-r rv" style={{transitionDelay:".1s"}}>
          <img className="story-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85" alt="Founder"/>
          <div className="story-caption">
            <div className="sc-l">Asoschisi</div>
            <div className="sc-v">Jahongir Raximov, 2015</div>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className="trio">
        {[
          {ico:<IcoStar/>,ttl:"Premium Sifat",txt:"Barcha mahsulotlar asl brend sertifikatiga ega. 100% original kafolat bilan."},
          {ico:<IcoBox/>,ttl:"Bepul Yetkazish",txt:"Toshkent bo'ylab 100 000 so'mdan yuqori xaridda bepul yetkazib beramiz."},
          {ico:<IcoShield/>,ttl:"Qaytarish",txt:"14 kun ichida to'liq qaytarish. Sizning qoniqishingiz — bizning maqsadimiz."},
        ].map((t,i) => (
          <div key={i} className="trio-c rv" style={{transitionDelay:`${i*.08}s`}}>
            <div className="ico-w"><div className="ico-3d" style={{animationDelay:`${i*1.5}s`}}>{t.ico}</div></div>
            <div className="trio-ttl">{t.ttl}</div>
            <div className="trio-txt">{t.txt}</div>
          </div>
        ))}
      </div>

      {/* TEAM */}
      <section className="team">
        <div className="team-hd rv">
          <div><div className="team-eye">Jamoa</div><h2 className="team-ttl">Bizning Jamoa</h2></div>
          <p className="team-sub">Har biri o'z sohasining mutaxassisi.</p>
        </div>
        <div className="team-grid">
          {TEAM.map((m,i) => (
            <div key={i} className="tm-c rv" style={{transitionDelay:`${i*.07}s`}}>
              <div className="tm-iw">
                <img className="tm-img" src={m.img} alt={m.name} loading="lazy"/>
                <div className="tm-ov"/>
                <div className="tm-info">
                  <div className="tm-role">{m.role}</div>
                  <div className="tm-name">{m.name}</div>
                  <div className="tm-since">{m.since} yildan</div>
                </div>
              </div>
              <div className="tm-det"><div className="tm-quote">{m.quote}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="tl">
        <div className="tl-hd rv">
          <div className="tl-eye">Tarix</div>
          <h2 className="tl-ttl">10 Yillik Yo'limiz</h2>
        </div>
        <div className="tl-list">
          <div className="tl-spine"/>
          {TIMELINE.map((t,i) => (
            <div key={i} className="tl-item rv" style={{transitionDelay:`${i*.08}s`}}>
              <div className="tl-yr">{t.year}</div>
              <div className="tl-dot"/>
              <div className="tl-body">
                <div className="tl-ev">{t.event}</div>
                <div className="tl-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALL BRANCHES HOURS */}
      <section className="hours-all">
        <div className="h-hd rv">
          <div>
            <div className="h-eye">Barcha Filiallar</div>
            <h2 className="h-ttl">Ish Vaqtlari</h2>
            <p className="h-sub">4 ta filial — barchasi sizni kutmoqda</p>
          </div>
          <div className="h-today">Bugun: <strong>{today}</strong></div>
        </div>
        <div className="h-grid">
          {BRANCHES.map(b => {
            const todayH = b.hours.find(h => h.day === today);
            const opened = checkOpen(todayH);
            return (
              <div key={b.id} className="h-card rv">
                <div className="hc-top">
                  <div className="hc-name">{b.name}</div>
                  {todayH?.open
                    ? <span className={`hc-badge ${opened?"op":"cl"}`}>{opened?"Ochiq":"Yopiq"}</span>
                    : <span className="hc-badge cl">Dam olish</span>
                  }
                </div>
                <div className="hc-addr">{b.address}</div>
                {b.hours.map((h,i) => {
                  const isT = h.day === today;
                  return (
                    <div key={i} className={`dr${isT?" td":""}`}>
                      <div className="dr-day" style={{display:"flex",alignItems:"center",gap:5}}>
                        <span className={isT?"dr-day td":"dr-day"}>{h.day}</span>
                        {isT && <span className="today-lbl">Bugun</span>}
                      </div>
                      <span className={`dr-time${!h.open?" off":""}`}>{h.open?`${h.open} – ${h.close}`:"Yopiq"}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      {/* ADDRESS */}
      <div className="addr">
        <div className="addr-l rv">
          <div>
            <div className="addr-eye">Manzil va Aloqa</div>
            <h2 className="addr-ttl">Bizni Toping</h2>
            <div className="addr-blocks">
              <div>
                <div className="ab-lbl">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Bosh Filial Manzili
                </div>
                <div className="ab-val">Toshkent sh., Yunusobod tumani,<br/>Amir Temur shoh ko'chasi, 15-uy</div>
              </div>
              <div>
                <div className="ab-lbl">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.66A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.62a16 16 0 006 6l1.94-1.94a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  Telefon
                </div>
                <div className="ab-val">
                  <a href="tel:+998971234567">+998 97 123 45 67</a><br/>
                  <a href="tel:+998711234567">+998 71 123 45 67</a>
                </div>
              </div>
              <div>
                <div className="ab-lbl">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email
                </div>
                <div className="ab-val">
                  <a href="mailto:info@raffini.uz">info@raffini.uz</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="addr-r rv" style={{transitionDelay:".1s"}}>
          <iframe className="map-fr" src="https://www.openstreetmap.org/export/embed.html?bbox=69.22%2C41.32%2C69.38%2C41.38&layer=mapnik&marker=41.3505%2C69.2892" title="Raffini manzili" loading="lazy"/>
          <div className="map-pin"><div className="mp-d"/><div className="mp-s"/><div className="mp-l">Raffini</div></div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="ft-top">
          <div>
            <div className="ft-brand">Raffini</div>
            <div className="ft-sub">Men's Collection</div>
            <p className="ft-desc">Toshkentdagi premium erkaklar kiyim do'koni. 2015 yildan beri uslub va sifatda ishonchli hamkoringiz.</p>
            <div className="ft-soc">{["TG","IG","FB","YT"].map(s=><div key={s} className="soc">{s}</div>)}</div>
          </div>
          <div>
            <div className="ft-col-h">Xizmatlar</div>
            {["Kolleksiyalar","Yangi Kelganlar","Aksiyalar","Brendlar","Sovg'a Kartasi"].map(l=><a key={l} className="ft-lnk">{l}</a>)}
          </div>
          <div>
            <div className="ft-col-h">Kompaniya</div>
            {["Biz Haqimizda","Jamoa","Karyera","Yangiliklar","Hamkorlik"].map(l=><a key={l} className="ft-lnk">{l}</a>)}
          </div>
          <div>
            <div className="ft-col-h">Yordam</div>
            {["Savol-Javob","Yetkazib Berish","Qaytarish","O'lcham Jadvali","Bog'lanish"].map(l=><a key={l} className="ft-lnk">{l}</a>)}
          </div>
        </div>
        <div className="ft-mid">
          <div>
            <div className="nl-ttl">Yangiliklar va Aksiyalarga Obuna Bo'ling</div>
            <div className="nl-row">
              <input className="nl-in" type="email" placeholder="email@manzil.uz" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSub()}/>
              <button className="nl-btn" onClick={handleSub}>{sent?"✓ Yuborildi":"Obuna"}</button>
            </div>
          </div>
          <div className="pay">
            {["UZCARD","HUMO","VISA","Click","Payme"].map(p=><div key={p} className="pay-b">{p}</div>)}
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© 2015 – 2025 Raffini Men's Collection</div>
          <div className="ft-leg">{["Maxfiylik","Shartlar","Cookie"].map(l=><a key={l} className="ft-leglink">{l}</a>)}</div>
          <button className="bk-btn" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><ArrowUp/></button>
        </div>
      </footer>
    </>
  );
}