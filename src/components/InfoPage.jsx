import { useState, useEffect, useRef, useCallback } from "react";

const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#EFEFEF;--bg2:#E4E4E4;--bg3:#F8F8F8;
      --dark:#1E1E1E;--dark2:#2C2C2C;
      --txt:#3D3D3D;--txt2:#6E6E6E;
      --acc:#BDBDBD;--acc2:#9E9E9E;
      --line:rgba(61,61,61,.09);--line2:rgba(61,61,61,.17);
      --serif:'Cormorant Garamond',Georgia,serif;
      --ui:'Outfit',sans-serif;
    }
    html,body,#root{background:var(--bg);color:var(--txt);font-family:var(--ui);overflow-x:hidden}
    ::-webkit-scrollbar{width:1.5px}
    ::-webkit-scrollbar-thumb{background:var(--acc)}

    /* ══ INTRO ══ */
    .intro{
      position:fixed;inset:0;z-index:9000;
      background:var(--dark);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:32px 16px;
      transition:opacity .9s ease,visibility .9s ease;
    }
    .intro.hide{opacity:0;visibility:hidden;pointer-events:none}

    .intro-logo{
      font-family:var(--serif);
      font-size:clamp(42px,9vw,96px);
      font-weight:300;letter-spacing:.32em;
      color:#EFEFEF;line-height:1;
      white-space:nowrap;text-align:center;
    }
    .intro-cursor{
      display:inline-block;width:2px;height:.72em;
      background:#BDBDBD;margin-left:4px;vertical-align:middle;
      animation:cur .8s step-end infinite;
    }
    @keyframes cur{0%,100%{opacity:1}50%{opacity:0}}

    .intro-tagline{
      font-size:clamp(6.5px,1.6vw,8.5px);font-weight:300;
      letter-spacing:.48em;text-transform:uppercase;
      color:rgba(239,239,239,.22);
      margin-top:12px;text-align:center;
      opacity:0;transition:opacity .7s;
    }
    .intro-tagline.show{opacity:1}

    .intro-divider{
      width:1px;height:clamp(36px,5vw,52px);
      background:rgba(239,239,239,.1);
      margin:clamp(28px,4vw,48px) 0;
      opacity:0;transition:opacity .5s .1s;
    }
    .intro-divider.show{opacity:1}

    .intro-stats{
      display:flex;align-items:stretch;
      opacity:0;transition:opacity .6s .1s;
    }
    .intro-stats.show{opacity:1}

    .istat{
      display:flex;flex-direction:column;align-items:center;
      padding:0 clamp(18px,4.5vw,48px);
      border-right:1px solid rgba(239,239,239,.07);
    }
    .istat:last-child{border-right:none}

    /* Fixed-width number cell — prevents layout from jumping on mobile */
    .istat-num{
      font-family:var(--serif);
      font-size:clamp(34px,6.5vw,64px);
      font-weight:300;line-height:1;color:#EFEFEF;
      display:block;text-align:center;
      /* hold width of final value so box never resizes */
      min-width:1.8ch;
    }
    .istat-suf{
      font-size:.52em;vertical-align:super;
      color:var(--acc);margin-left:1px;
    }
    .istat-lbl{
      font-size:clamp(6px,1.4vw,7.5px);font-weight:300;
      letter-spacing:.38em;text-transform:uppercase;
      color:rgba(239,239,239,.28);
      margin-top:8px;text-align:center;
    }

    /* ══ SCROLL PROGRESS ══ */
    .sp{position:fixed;top:0;left:0;height:1px;background:var(--txt);z-index:8999;pointer-events:none;transition:width .1s}

    /* ══ BRANCH STRIP ══ */
    .bstrip{
      position:fixed;top:0;left:0;right:0;z-index:700;
      background:var(--dark);height:38px;display:flex;align-items:stretch;
    }
    .btab{
      flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
      font-family:var(--ui);font-size:clamp(5.5px,1.3vw,7px);font-weight:300;
      letter-spacing:.16em;text-transform:uppercase;
      color:rgba(239,239,239,.3);
      border:none;background:none;cursor:pointer;
      border-right:1px solid rgba(255,255,255,.04);
      position:relative;transition:color .2s,background .2s;
      padding:0 3px;
    }
    .btab:last-child{border-right:none}
    .btab.on{color:rgba(239,239,239,.9);background:rgba(255,255,255,.05)}
    .btab.on::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px;background:var(--acc)}
    .btab-dot{width:4px;height:4px;border-radius:50%;background:rgba(239,239,239,.18);flex-shrink:0;transition:background .2s}
    .btab.on .btab-dot{background:var(--acc)}

    /* ══ HEADER ══ */
    .hdr{
      position:fixed;left:0;right:0;top:38px;z-index:600;height:54px;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 clamp(16px,4vw,52px);
      background:var(--bg3);border-bottom:1px solid var(--line);
      transition:box-shadow .3s,transform .38s;
    }
    .hdr.sc{box-shadow:0 2px 18px rgba(0,0,0,.06)}
    .hdr.dn{transform:translateY(-100%)}
    .logo{display:flex;align-items:center;gap:9px;text-decoration:none}
    .logo-sq{width:24px;height:24px;background:var(--dark);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:12px;color:#EFEFEF;flex-shrink:0}
    .logo-nm{font-family:var(--serif);font-size:14px;font-weight:400;letter-spacing:.16em;text-transform:uppercase;color:var(--txt)}
    .logo-dist{font-size:7px;font-weight:300;letter-spacing:.14em;text-transform:uppercase;color:var(--acc2);margin-left:2px;align-self:flex-end;padding-bottom:1px}
    .nav{display:flex;align-items:center;gap:24px}
    .nlink{font-size:7.5px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:var(--txt2);text-decoration:none;position:relative;padding-bottom:2px;transition:color .2s}
    .nlink::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--txt);transition:width .24s}
    .nlink:hover{color:var(--txt)}.nlink:hover::after{width:100%}
    .hdr-r{display:flex;align-items:center;gap:2px}
    .ib{background:none;border:none;cursor:pointer;padding:7px;color:var(--txt2);display:flex;transition:color .2s}
    .ib:hover{color:var(--txt)}
    .cw{position:relative}
    .cbadge{position:absolute;top:3px;right:3px;width:11px;height:11px;border-radius:50%;background:var(--dark);color:#EFEFEF;font-size:6px;font-weight:500;display:flex;align-items:center;justify-content:center;font-family:var(--ui)}

    /* ══ BRANCH INFO BAR ══ */
    .binfo{
      background:var(--bg2);border-bottom:1px solid var(--line);
      padding:7px clamp(16px,4vw,52px);
      display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;
    }
    .binfo-l{display:flex;align-items:center;gap:6px;font-size:8px;font-weight:300;color:var(--txt2)}
    .binfo-r{display:flex;align-items:center;gap:8px;font-size:8px;font-weight:300;color:var(--txt2)}
    .sbadge{font-size:6.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:2px 8px;font-family:var(--ui)}
    .sbadge.op{background:#5A9E5A;color:#fff}
    .sbadge.cl{background:#A05050;color:#fff}

    /* ══ HERO ══ */
    .hero{
      min-height:100vh;padding-top:92px;
      display:grid;grid-template-columns:52% 48%;
      background:var(--bg);
    }
    .hero-l{
      display:flex;flex-direction:column;justify-content:center;
      padding:clamp(36px,6vh,68px) clamp(18px,3.5vw,52px) clamp(36px,6vh,68px) clamp(16px,4vw,52px);
      border-right:1px solid var(--line);
      position:relative;overflow:hidden;
    }
    .hero-wm{
      position:absolute;right:-14px;bottom:-24px;
      font-family:var(--serif);font-size:clamp(100px,16vw,220px);font-weight:300;
      color:var(--acc);opacity:.055;line-height:1;letter-spacing:-.05em;
      user-select:none;pointer-events:none;
    }
    .branch-pill{
      display:inline-flex;align-items:center;gap:5px;
      background:var(--dark);color:rgba(239,239,239,.6);
      font-size:7px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;
      padding:5px 11px;margin-bottom:20px;width:fit-content;font-family:var(--ui);
    }
    .bp-dot{width:4px;height:4px;border-radius:50%;background:var(--acc);flex-shrink:0}
    .h-eye{display:flex;align-items:center;gap:9px;font-size:7.5px;font-weight:300;letter-spacing:.32em;text-transform:uppercase;color:var(--acc2);margin-bottom:14px}
    .eye-ln{width:16px;height:1px;background:var(--acc2);flex-shrink:0}
    .h-ttl{font-family:var(--serif);font-size:clamp(30px,4vw,60px);font-weight:300;line-height:1.07;color:var(--txt);margin-bottom:16px}
    .h-ttl i{font-style:italic;color:var(--acc2)}
    .h-p{font-size:clamp(11px,1.3vw,13px);font-weight:300;line-height:1.9;color:var(--txt2);max-width:310px;margin-bottom:30px}
    .h-btns{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:38px}
    .btn-f{font-family:var(--ui);font-size:7.5px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;padding:11px 22px;background:var(--dark);color:#EFEFEF;border:1.5px solid var(--dark);cursor:pointer;transition:background .2s,transform .15s}
    .btn-f:hover{background:var(--dark2);transform:translateY(-1px)}
    .btn-g{font-family:var(--ui);font-size:7.5px;font-weight:300;letter-spacing:.13em;text-transform:uppercase;padding:10px 18px;background:transparent;color:var(--txt2);border:1.5px solid var(--line2);cursor:pointer;transition:border-color .2s,color .2s}
    .btn-g:hover{border-color:var(--txt);color:var(--txt)}
    .h-stats{display:flex;gap:clamp(14px,2.5vw,26px);padding-top:18px;border-top:1px solid var(--line)}
    .hs-n{font-family:var(--serif);font-size:clamp(18px,2.2vw,26px);font-weight:400;color:var(--txt);margin-bottom:2px}
    .hs-n sup{font-size:.45em;vertical-align:super;color:var(--acc2)}
    .hs-l{font-size:7px;font-weight:300;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2)}

    /* HERO RIGHT */
    .hero-r{position:relative;overflow:hidden;background:var(--bg2);display:flex;flex-direction:column}
    .slides{flex:1;position:relative;overflow:hidden;min-height:360px}
    .sl{position:absolute;inset:0;opacity:0;transition:opacity 1.1s ease}
    .sl.on{opacity:1}
    .sl img{width:100%;height:100%;object-fit:cover;filter:brightness(.82) saturate(.4) contrast(1.06)}
    .sl-ov{position:absolute;inset:0;background:linear-gradient(148deg,rgba(239,239,239,.42) 0%,transparent 52%)}
    .corner{position:absolute;inset:18px;pointer-events:none}
    .corner::before,.corner::after{content:'';position:absolute;width:14px;height:14px}
    .corner::before{top:0;left:0;border-top:1px solid var(--txt);border-left:1px solid var(--txt)}
    .corner::after{bottom:0;right:0;border-bottom:1px solid var(--txt);border-right:1px solid var(--txt)}
    .sl-cap{position:absolute;bottom:20px;left:20px;background:rgba(248,248,248,.95);backdrop-filter:blur(8px);padding:11px 14px;border-left:2px solid var(--dark)}
    .sc-t{font-size:6.5px;font-weight:400;letter-spacing:.22em;text-transform:uppercase;color:var(--acc2);margin-bottom:2px}
    .sc-n{font-family:var(--serif);font-size:14px;font-weight:400;color:var(--txt)}
    .sc-p{font-size:10px;font-weight:300;color:var(--txt2);margin-top:2px}
    .sl-dots{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px}
    .sdot{width:3px;height:3px;border-radius:50%;background:var(--acc);cursor:pointer;transition:height .28s,border-radius .28s,background .28s}
    .sdot.on{height:11px;border-radius:1.5px;background:var(--dark)}
    .hero-strip{background:var(--dark);flex-shrink:0;display:flex;padding:10px 18px}
    .hsc{flex:1;padding:0 10px;border-right:1px solid rgba(239,239,239,.06)}
    .hsc:first-child{padding-left:0}.hsc:last-child{border-right:none}
    .hsc-l{font-size:6.5px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:rgba(239,239,239,.28);margin-bottom:2px}
    .hsc-v{font-size:10px;font-weight:400;color:rgba(239,239,239,.75)}

    /* ══ CATEGORIES ══ */
    .cats{padding:clamp(32px,5vw,56px) clamp(16px,4vw,52px);background:var(--bg3);border-top:1px solid var(--line)}
    .sec-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:8px}
    .sec-ey{font-size:7px;font-weight:300;letter-spacing:.32em;text-transform:uppercase;color:var(--acc2);margin-bottom:6px}
    .sec-ttl{font-family:var(--serif);font-size:clamp(18px,2.3vw,30px);font-weight:300;color:var(--txt)}
    .sec-lnk{font-size:7.5px;font-weight:300;letter-spacing:.15em;text-transform:uppercase;color:var(--txt2);text-decoration:none;position:relative;padding-bottom:2px;transition:color .2s;white-space:nowrap}
    .sec-lnk::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--txt);transition:width .24s}
    .sec-lnk:hover{color:var(--txt)}.sec-lnk:hover::after{width:100%}
    .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line)}
    .cat-c{position:relative;overflow:hidden;aspect-ratio:3/4;cursor:pointer;background:var(--bg2)}
    .cat-c img{width:100%;height:100%;object-fit:cover;filter:brightness(.8) saturate(.4) contrast(1.08);transition:transform .7s cubic-bezier(.4,0,.2,1),filter .4s}
    .cat-c:hover img{transform:scale(1.07);filter:brightness(.7) saturate(.35)}
    .cat-scan{position:absolute;top:0;left:0;right:0;height:1px;background:var(--dark);transform:scaleX(0);transform-origin:left;transition:transform .38s cubic-bezier(.4,0,.2,1)}
    .cat-c:hover .cat-scan{transform:scaleX(1)}
    .cat-info{position:absolute;bottom:0;left:0;right:0;padding:11px 13px 13px;background:linear-gradient(to top,rgba(236,236,236,.92) 0%,transparent 100%)}
    .cat-sub{font-size:6.5px;font-weight:300;letter-spacing:.24em;text-transform:uppercase;color:var(--acc2);margin-bottom:2px}
    .cat-nm{font-family:var(--serif);font-size:16px;font-weight:300;color:var(--txt)}
    .cat-cnt{font-size:8px;font-weight:300;color:var(--txt2);margin-top:2px}

    /* ══ FEATURED ══ */
    .feat{padding:clamp(32px,5vw,52px) clamp(16px,4vw,52px);background:var(--bg);border-top:1px solid var(--line)}
    .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line)}
    .feat-c{background:var(--bg3);padding:15px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;position:relative;overflow:hidden;transition:background .22s}
    .feat-c:hover{background:var(--bg2)}
    .feat-scan{position:absolute;top:0;left:0;right:0;height:1px;background:var(--dark);transform:scaleX(0);transform-origin:left;transition:transform .34s cubic-bezier(.4,0,.2,1)}
    .feat-c:hover .feat-scan{transform:scaleX(1)}
    .feat-iw{width:58px;height:78px;overflow:hidden;flex-shrink:0;background:var(--bg2)}
    .feat-iw img{width:100%;height:100%;object-fit:cover;filter:brightness(.84) saturate(.4);transition:transform .48s}
    .feat-c:hover .feat-iw img{transform:scale(1.07)}
    .feat-brand{font-size:7px;font-weight:400;letter-spacing:.22em;text-transform:uppercase;color:var(--acc2);margin-bottom:3px}
    .feat-nm{font-family:var(--serif);font-size:13px;font-weight:300;color:var(--txt);margin-bottom:4px;line-height:1.2}
    .feat-pr{font-size:11px;font-weight:300;color:var(--txt2)}
    .feat-old{font-size:9px;font-weight:300;color:var(--acc);text-decoration:line-through;margin-top:2px}

    /* ══ TRIO ══ */
    .trio{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
    .trio-c{padding:clamp(22px,3.5vw,36px) clamp(18px,3vw,40px);border-right:1px solid var(--line);background:var(--bg3);position:relative;overflow:hidden;transition:background .28s}
    .trio-c:last-child{border-right:none}
    .trio-c:hover{background:var(--bg2)}
    .trio-c::before{content:'';position:absolute;top:0;left:0;width:0;height:1px;background:var(--dark);transition:width .42s cubic-bezier(.4,0,.2,1)}
    .trio-c:hover::before{width:100%}
    .ico-w{width:44px;height:44px;margin-bottom:14px}
    .ico-3d{width:44px;height:44px;animation:fl3 5s ease-in-out infinite}
    @keyframes fl3{0%,100%{transform:rotateX(10deg) rotateY(-10deg)}50%{transform:rotateX(-8deg) rotateY(10deg) translateY(-4px)}}
    .trio-ttl{font-family:var(--serif);font-size:16px;font-weight:300;color:var(--txt);margin-bottom:6px}
    .trio-txt{font-size:12px;font-weight:300;line-height:1.85;color:var(--txt2)}

    /* ══ HOURS ══ */
    .hours{padding:clamp(32px,5vw,56px) clamp(16px,4vw,52px);background:var(--bg2);border-top:1px solid var(--line)}
    .hours-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);margin-top:24px}
    .hcard{background:var(--bg3);padding:20px 18px;border-top:2px solid transparent;transition:border-color .2s}
    .hcard.act{border-top-color:var(--dark)}
    .hcard-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:3px;gap:4px}
    .hcard-nm{font-family:var(--serif);font-size:14px;font-weight:300;color:var(--txt)}
    .hcard-addr{font-size:8px;font-weight:300;color:var(--acc2);margin-bottom:12px;line-height:1.5}
    .hbadge{font-size:6px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;padding:2px 6px;font-family:var(--ui);margin-top:2px;flex-shrink:0}
    .hbadge.op{background:#5A9E5A;color:#fff}
    .hbadge.cl{background:#A05050;color:#fff}
    .drow{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--line)}
    .drow:last-child{border-bottom:none}
    .drow.td{background:rgba(61,61,61,.05);padding:4px 6px;margin:0 -6px;border-radius:1px}
    .dname{font-size:9px;font-weight:300;color:var(--txt2);display:flex;align-items:center;gap:4px}
    .dname.td{color:var(--dark);font-weight:400}
    .dtime{font-size:9px;font-weight:300;color:var(--txt)}
    .dtime.off{color:var(--acc2)}
    .td-lbl{font-size:5.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;background:var(--dark);color:#EFEFEF;padding:1px 4px;font-family:var(--ui)}

    /* ══ RESPONSIVE ══ */
    @media(max-width:900px){
      .nav{display:none}
      .hero{grid-template-columns:1fr;min-height:auto}
      .hero-l{border-right:none;border-bottom:1px solid var(--line)}
      .slides{min-height:52vw}
      .cat-grid{grid-template-columns:repeat(2,1fr)}
      .feat-grid{grid-template-columns:1fr 1fr}
      .trio{grid-template-columns:1fr}
      .trio-c{border-right:none;border-bottom:1px solid var(--line)}
      .trio-c:last-child{border-bottom:none}
      .hours-grid{grid-template-columns:1fr 1fr}
    }
    @media(max-width:540px){
      .btab-dot{display:none}
      .feat-grid{grid-template-columns:1fr}
      .hours-grid{grid-template-columns:1fr}
    }
  `}</style>
);

/* 3D icons */
const IcoStar=()=>(<svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}><defs><linearGradient id="sa" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#C8C8C8"/></linearGradient><linearGradient id="sb" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#BDBDBD"/><stop offset="1" stopColor="#888"/></linearGradient></defs><polygon points="24,4 28.5,17 42,17 31.5,26 35,39 24,31 13,39 16.5,26 6,17 19.5,17" fill="url(#sa)"/><polygon points="24,31 13,39 16.5,26 6,17 19.5,17 24,4" fill="url(#sb)" opacity=".48"/></svg>);
const IcoBox=()=>(<svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}><defs><linearGradient id="ba" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F8F8F8"/><stop offset="1" stopColor="#C4C4C4"/></linearGradient><linearGradient id="bb" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#C0C0C0"/><stop offset="1" stopColor="#888"/></linearGradient><linearGradient id="bc" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#D8D8D8"/><stop offset="1" stopColor="#A0A0A0"/></linearGradient></defs><polygon points="24,6 40,14 24,22 8,14" fill="url(#ba)"/><polygon points="8,14 8,34 24,42 24,22" fill="url(#bb)"/><polygon points="40,14 40,34 24,42 24,22" fill="url(#bc)"/><line x1="24" y1="6" x2="24" y2="42" stroke="rgba(255,255,255,.5)" strokeWidth="1"/></svg>);
const IcoShield=()=>(<svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44,filter:'drop-shadow(1px 3px 5px rgba(0,0,0,.12))'}}><defs><linearGradient id="sha" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#C8C8C8"/></linearGradient><linearGradient id="shb" x1="1" y1="0" x2="0" y2="1"><stop stopColor="#C0C0C0"/><stop offset="1" stopColor="#888"/></linearGradient></defs><path d="M24 4L40 10V22C40 32 24 44 24 44S8 32 8 22V10L24 4Z" fill="url(#sha)"/><path d="M24 4L40 10V22C40 32 24 44 24 44V4Z" fill="url(#shb)" opacity=".44"/><polyline points="17,24 22,29 31,20" stroke="rgba(61,61,61,.44)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);

/* BRANCHES */
const BRANCHES=[{id:"chilonzor",name:"Chilonzor",short:"CHL",address:"Chilonzor ko'ch., 12-uy",district:"Chilonzor tumani",slides:[{img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=80",tag:"Yangi",name:"Premium Paltolar",price:"890 000 so'm dan"},{img:"https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=1400&q=80",tag:"Formal",name:"Klassik Kostyumlar",price:"1 250 000 so'm dan"},{img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80",tag:"Biznes",name:"Armani Kolleksiyasi",price:"2 100 000 so'm dan"}],cats:[{img:"https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=600&q=80",name:"Kostyumlar",sub:"Formal",count:"48 ta"},{img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",name:"Paltolar",sub:"Outerwear",count:"22 ta"},{img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",name:"Galstuklar",sub:"Accessories",count:"34 ta"},{img:"https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80",name:"Shimlar",sub:"Trousers",count:"40 ta"}],featured:[{img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",brand:"Hugo Boss",name:"Slim Fit Kostyum",price:"2 490 000",old:"3 100 000"},{img:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80",brand:"Armani",name:"Klassik Palto",price:"3 800 000",old:""},{img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",brand:"Hugo Boss",name:"Ipak Galstuk",price:"480 000",old:"620 000"}],hours:[{day:"Dushanba",open:"09:00",close:"20:00"},{day:"Seshanba",open:"09:00",close:"20:00"},{day:"Chorshanba",open:"09:00",close:"20:00"},{day:"Payshanba",open:"09:00",close:"20:00"},{day:"Juma",open:"09:00",close:"21:00"},{day:"Shanba",open:"10:00",close:"20:00"},{day:"Yakshanba",open:null,close:null}]},{id:"yunusobod",name:"Yunusobod",short:"YNS",address:"Amir Temur shoh ko'ch., 15",district:"Yunusobod tumani",slides:[{img:"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1400&q=80",tag:"Casual",name:"Kundalik Kiyimlar",price:"350 000 so'm dan"},{img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1400&q=80",tag:"Street",name:"Ko'ylaklar",price:"290 000 so'm dan"},{img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1400&q=80",tag:"Summer",name:"Polo Kolleksiyasi",price:"450 000 so'm dan"}],cats:[{img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",name:"Ko'ylaklar",sub:"Shirts",count:"94 ta"},{img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",name:"Polo",sub:"Casual",count:"38 ta"},{img:"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80",name:"Shimlar",sub:"Jeans",count:"56 ta"},{img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",name:"T-Shirt",sub:"Basics",count:"62 ta"}],featured:[{img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",brand:"Zara Man",name:"Oq Ko'ylak",price:"450 000",old:""},{img:"https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&q=80",brand:"Lacoste",name:"Polo Ko'ylak",price:"780 000",old:"950 000"},{img:"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&q=80",brand:"Levi's",name:"Slim Jeans",price:"520 000",old:""}],hours:[{day:"Dushanba",open:"09:00",close:"21:00"},{day:"Seshanba",open:"09:00",close:"21:00"},{day:"Chorshanba",open:"09:00",close:"21:00"},{day:"Payshanba",open:"09:00",close:"21:00"},{day:"Juma",open:"09:00",close:"22:00"},{day:"Shanba",open:"10:00",close:"21:00"},{day:"Yakshanba",open:"11:00",close:"19:00"}]},{id:"mirzo",name:"Mirzo Ulug'bek",short:"MRZ",address:"Mirzo Ulug'bek ko'ch., 8",district:"Mirzo Ulug'bek tumani",slides:[{img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1400&q=80",tag:"Active",name:"Sport Kolleksiyasi",price:"290 000 so'm dan"},{img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80",tag:"Trendy",name:"Casual Sport",price:"380 000 so'm dan"},{img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=1400&q=80",tag:"Premium",name:"Sport Brendlar",price:"520 000 so'm dan"}],cats:[{img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",name:"Tracksuit",sub:"Sport",count:"28 ta"},{img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",name:"Hoodie",sub:"Fleece",count:"44 ta"},{img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80",name:"Sport Polo",sub:"Active",count:"32 ta"},{img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",name:"Aksessuar",sub:"Sport",count:"18 ta"}],featured:[{img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",brand:"Pull&Bear",name:"Tracksuit",price:"680 000",old:"850 000"},{img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",brand:"H&M Sport",name:"Fleece Hoodie",price:"390 000",old:""},{img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80",brand:"Lacoste",name:"Sport Ko'ylak",price:"520 000",old:"640 000"}],hours:[{day:"Dushanba",open:"09:00",close:"20:00"},{day:"Seshanba",open:"09:00",close:"20:00"},{day:"Chorshanba",open:"09:00",close:"20:00"},{day:"Payshanba",open:"09:00",close:"20:00"},{day:"Juma",open:"09:00",close:"20:00"},{day:"Shanba",open:"10:00",close:"19:00"},{day:"Yakshanba",open:null,close:null}]},{id:"sergeli",name:"Sergeli",short:"SRG",address:"Sergeli ko'ch., 24",district:"Sergeli tumani",slides:[{img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=80",tag:"Premium",name:"Yangi Kolleksiya",price:"650 000 so'm dan"},{img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1400&q=80",tag:"Winter",name:"Qishki Kiyimlar",price:"890 000 so'm dan"},{img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80",tag:"Classic",name:"Klassik Uslub",price:"750 000 so'm dan"}],cats:[{img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",name:"Kurtka",sub:"Jackets",count:"36 ta"},{img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",name:"Paltolar",sub:"Coats",count:"24 ta"},{img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",name:"Smart",sub:"Charm",count:"30 ta"},{img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",name:"Ko'ylaklar",sub:"Shirts",count:"52 ta"}],featured:[{img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",brand:"Massimo Dutti",name:"Charm Kurtka",price:"890 000",old:""},{img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&q=80",brand:"Hugo Boss",name:"Premium Palto",price:"2 800 000",old:"3 500 000"},{img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",brand:"Reserved",name:"Oxford Ko'ylak",price:"450 000",old:"580 000"}],hours:[{day:"Dushanba",open:"10:00",close:"20:00"},{day:"Seshanba",open:"10:00",close:"20:00"},{day:"Chorshanba",open:"10:00",close:"20:00"},{day:"Payshanba",open:"10:00",close:"20:00"},{day:"Juma",open:"10:00",close:"21:00"},{day:"Shanba",open:"10:00",close:"20:00"},{day:"Yakshanba",open:"11:00",close:"18:00"}]}];

const DAY_UZ=["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
const todayName=()=>DAY_UZ[new Date().getDay()];
const nowH=()=>{const d=new Date();return d.getHours()+d.getMinutes()/60};
const chkOpen=(h)=>{if(!h?.open)return false;const[oh,om]=h.open.split(":").map(Number);const[ch,cm]=h.close.split(":").map(Number);return nowH()>=oh+om/60&&nowH()<ch+cm/60};

/* ══ INTRO ══
   Sequence (all automatic, no buttons):
   1. Type "RAFFINI" (120ms / letter, after 400ms delay)
   2. Tagline + divider appear
   3. Stats row fades in
   4. Counters count: Filial→4 (2.8s), Mijoz→3200 (4.2s), Mahsulot→500 (3.4s)
      Using setInterval — stable on mobile, no layout jump, fixed-width cells
   5. When slowest counter done → wait 1.2s → fade out overlay → reveal site
*/
const Intro = ({ onDone }) => {
  const WORD = "RAFFINI";
  const [typed,     setTyped]     = useState("");
  const [typeDone,  setTypeDone]  = useState(false);
  const [showSub,   setShowSub]   = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gone,      setGone]      = useState(false);

  const [vFilial, setVFilial] = useState(0);
  const [vMijoz,  setVMijoz]  = useState(0);
  const [vMahsul, setVMahsul] = useState(0);

  const doneRef   = useRef(0);          // counts finished counters
  const exitedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(()=>{ onDoneRef.current = onDone; },[onDone]);

  /* 1. Typing */
  useEffect(()=>{
    let i=0;
    const t=setTimeout(()=>{
      const iv=setInterval(()=>{
        i++;
        setTyped(WORD.slice(0,i));
        if(i>=WORD.length){clearInterval(iv);setTypeDone(true);}
      },120);
      return()=>clearInterval(iv);
    },400);
    return()=>clearTimeout(t);
  },[]);

  /* 2. Show sub + stats row */
  useEffect(()=>{
    if(!typeDone)return;
    const t1=setTimeout(()=>setShowSub(true),200);
    const t2=setTimeout(()=>setShowStats(true),520);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[typeDone]);

  /* Smooth counter via setInterval — each tick applies ease-out quadratic */
  const makeCounter=(target, totalMs, setter, onFinish)=>{
    const TICKS=90;
    const delay=totalMs/TICKS;
    let step=0;
    const iv=setInterval(()=>{
      step++;
      const p=step/TICKS;
      // ease-out quad: slow at end feels more deliberate
      const eased=p*(2-p);
      setter(Math.round(eased*target));
      if(step>=TICKS){
        clearInterval(iv);
        setter(target);
        onFinish();
      }
    },delay);
    return iv;
  };

  /* 3. Start counters when stats row is visible */
  useEffect(()=>{
    if(!showStats)return;
    const check=()=>{
      doneRef.current++;
      if(doneRef.current===3 && !exitedRef.current){
        exitedRef.current=true;
        // All done → pause 1.2s → fade out
        setTimeout(()=>{
          setGone(true);
          setTimeout(()=>onDoneRef.current(), 900);
        },1200);
      }
    };
    const iv1=makeCounter(4,    2800, setVFilial, check);
    const iv2=makeCounter(3200, 4200, setVMijoz,  check);
    const iv3=makeCounter(500,  3400, setVMahsul, check);
    return()=>{clearInterval(iv1);clearInterval(iv2);clearInterval(iv3);};
  },[showStats]);

  return (
    <div className={`intro${gone?" hide":""}`}>
      <div className="intro-logo">
        {typed}{!typeDone&&<span className="intro-cursor"/>}
      </div>

      <div className={`intro-tagline${showSub?" show":""}`}>
        Men's Collection — Toshkent, O'zbekiston
      </div>

      <div className={`intro-divider${showStats?" show":""}`}/>

      <div className={`intro-stats${showStats?" show":""}`}>
        {/* fixed min-width on each number cell = no horizontal jump */}
        <div className="istat">
          <span className="istat-num" style={{minWidth:"1ch"}}>{vFilial}</span>
          <span className="istat-lbl">Filial</span>
        </div>
        <div className="istat">
          <span className="istat-num" style={{minWidth:"4ch"}}>{vMijoz.toLocaleString()}<span className="istat-suf">+</span></span>
          <span className="istat-lbl">Mamnun Mijoz</span>
        </div>
        <div className="istat">
          <span className="istat-num" style={{minWidth:"3ch"}}>{vMahsul}<span className="istat-suf">+</span></span>
          <span className="istat-lbl">Mahsulot</span>
        </div>
      </div>
    </div>
  );
};

/* Scroll progress */
const SpBar=()=>{
  const[w,setW]=useState(0);
  useEffect(()=>{const fn=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setW(max>0?(window.scrollY/max)*100:0)};window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)},[]);
  return<div className="sp" style={{width:`${w}%`}}/>;
};

/* Header */
const Header=({branch})=>{
  const[sc,setSc]=useState(false);const[dn,setDn]=useState(false);const ly=useRef(0);
  useEffect(()=>{const fn=()=>{const y=window.scrollY;setSc(y>8);if(y>60){if(y>ly.current+5)setDn(true);else if(y<ly.current-5)setDn(false);}else setDn(false);ly.current=y;};window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)},[]);
  return(
    <header className={`hdr${sc?" sc":""}${dn?" dn":""}`}>
      <a href="#" className="logo"><div className="logo-sq">R</div><span className="logo-nm">Raffini</span><span className="logo-dist">/ {branch.name}</span></a>
      <nav className="nav">{["Yangi","Kolleksiya","Brendlar","Aksiya","Biz haqimizda"].map(l=><a key={l} href="#" className="nlink">{l}</a>)}</nav>
      <div className="hdr-r">
        <button className="ib"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg></button>
        <button className="ib"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
        <div className="cw"><button className="ib"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></button><span className="cbadge">3</span></div>
      </div>
    </header>
  );
};

/* Branch info */
const Binfo=({branch})=>{
  const today=todayName();const todayH=branch.hours.find(h=>h.day===today);const opened=chkOpen(todayH);
  return(
    <div className="binfo">
      <div className="binfo-l"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{branch.address} · {branch.district}</div>
      <div className="binfo-r"><span>{todayH?.open?`Bugun: ${todayH.open} – ${todayH.close}`:"Bugun: Yopiq"}</span><span className={`sbadge ${opened?"op":"cl"}`}>{opened?"Ochiq":"Yopiq"}</span></div>
    </div>
  );
};

/* Hero */
const Hero=({branch})=>{
  const[sl,setSl]=useState(0);
  useEffect(()=>{setSl(0);const t=setInterval(()=>setSl(p=>(p+1)%branch.slides.length),5500);return()=>clearInterval(t)},[branch.id]);
  const cur=branch.slides[sl];
  return(
    <section className="hero">
      <div className="hero-l">
        <div className="hero-wm">{branch.short}</div>
        <div className="branch-pill"><span className="bp-dot"/>{branch.name} · {branch.district}</div>
        <div className="h-eye"><div className="eye-ln"/>Bahor / Yoz — 2025</div>
        <h1 className="h-ttl">Zamonaviy<br/><i>Erkaklar</i><br/>Uslubi</h1>
        <p className="h-p">Premium sifat, mukammal kesim. {branch.name} filialida o'zingizga mos uslubni toping.</p>
        <div className="h-btns"><button className="btn-f">Kolleksiyani Ko'rish</button><button className="btn-g">Yangiliklar →</button></div>
        <div className="h-stats">
          {[["500","+","Mahsulot"],["12","","Brend"],["3K","+","Mijoz"]].map(([n,s,l])=>(
            <div key={l}><div className="hs-n">{n}<sup>{s}</sup></div><div className="hs-l">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="hero-r">
        <div className="slides">
          {branch.slides.map((s,i)=>(
            <div key={i} className={`sl${sl===i?" on":""}`}>
              <img src={s.img} alt={s.name} loading={i===0?"eager":"lazy"}/>
            </div>
          ))}
          <div className="sl-ov"/><div className="corner"/>
          <div className="sl-cap"><div className="sc-t">{cur.tag}</div><div className="sc-n">{cur.name}</div><div className="sc-p">{cur.price}</div></div>
          <div className="sl-dots">{branch.slides.map((_,i)=><div key={i} className={`sdot${sl===i?" on":""}`} onClick={()=>setSl(i)}/>)}</div>
        </div>
        <div className="hero-strip">
          {[["Yangi Keldi","Bahor 2025"],["Chegirma","−30% gacha"],["Yetkazish","Bepul · 1-3 kun"]].map(([l,v])=>(
            <div key={l} className="hsc"><div className="hsc-l">{l}</div><div className="hsc-v">{v}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* Categories */
const Cats=({branch})=>(
  <section className="cats">
    <div className="sec-hd"><div><div className="sec-ey">{branch.name} — Kategoriyalar</div><h2 className="sec-ttl">Kolleksiyamiz</h2></div><a href="#" className="sec-lnk">Hammasini ko'rish →</a></div>
    <div className="cat-grid">{branch.cats.map(c=>(<div key={c.name} className="cat-c"><div className="cat-scan"/><img src={c.img} alt={c.name} loading="lazy"/><div className="cat-info"><div className="cat-sub">{c.sub}</div><div className="cat-nm">{c.name}</div><div className="cat-cnt">{c.count}</div></div></div>))}</div>
  </section>
);

/* Featured */
const Featured=({branch})=>(
  <section className="feat">
    <div className="sec-hd" style={{marginBottom:20}}><div><div className="sec-ey">Ommabop</div><h2 className="sec-ttl">Eng Ko'p Sotilganlar</h2></div><a href="#" className="sec-lnk">Barchasi →</a></div>
    <div className="feat-grid">{branch.featured.map(f=>(<div key={f.name} className="feat-c"><div className="feat-scan"/><div className="feat-iw"><img src={f.img} alt={f.name} loading="lazy"/></div><div><div className="feat-brand">{f.brand}</div><div className="feat-nm">{f.name}</div><div className="feat-pr">{f.price} so'm</div>{f.old&&<div className="feat-old">{f.old} so'm</div>}</div></div>))}</div>
  </section>
);

/* Trio */
const Trio=()=>(
  <div className="trio">
    {[{ico:<IcoStar/>,t:"Premium Sifat",d:"Barcha mahsulotlar asl brend sertifikatiga ega. 100% original kafolat bilan."},{ico:<IcoBox/>,t:"Bepul Yetkazish",d:"Toshkent bo'ylab 100 000 so'mdan yuqori xaridda bepul yetkazib beramiz."},{ico:<IcoShield/>,t:"Qaytarish",d:"14 kun ichida to'liq qaytarish. Sizning qoniqishingiz — bizning maqsadimiz."}].map((x,i)=>(
      <div key={i} className="trio-c"><div className="ico-w"><div className="ico-3d" style={{animationDelay:`${i*1.5}s`}}>{x.ico}</div></div><div className="trio-ttl">{x.t}</div><div className="trio-txt">{x.d}</div></div>
    ))}
  </div>
);

/* Hours */
const Hours=({activeBranchId})=>{
  const today=todayName();
  return(
    <section className="hours">
      <div className="sec-hd"><div><div className="sec-ey">Barcha Filiallar</div><h2 className="sec-ttl">Ish Vaqtlari</h2></div><span style={{fontSize:9,fontWeight:300,color:"var(--acc2)"}}>Bugun: <strong style={{color:"var(--txt)"}}>{today}</strong></span></div>
      <div className="hours-grid">
        {BRANCHES.map(b=>{
          const todayH=b.hours.find(h=>h.day===today);const opened=chkOpen(todayH);
          return(
            <div key={b.id} className={`hcard${b.id===activeBranchId?" act":""}`}>
              <div className="hcard-top"><div className="hcard-nm">{b.name}</div>{todayH?.open?<span className={`hbadge ${opened?"op":"cl"}`}>{opened?"Ochiq":"Yopiq"}</span>:<span className="hbadge cl">Dam olish</span>}</div>
              <div className="hcard-addr">{b.address}</div>
              {b.hours.map((h,i)=>{const isT=h.day===today;return(
                <div key={i} className={`drow${isT?" td":""}`}>
                  <span className={`dname${isT?" td":""}`}>{h.day}{isT&&<span className="td-lbl">Bugun</span>}</span>
                  <span className={`dtime${!h.open?" off":""}`}>{h.open?`${h.open} – ${h.close}`:"Yopiq"}</span>
                </div>
              )})}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ROOT */
export default function InfoPage(){
  const[showIntro,setShowIntro]=useState(true);
  const[branchId,setBranchId]=useState("chilonzor");
  const branch=BRANCHES.find(b=>b.id===branchId);
  const done=useCallback(()=>setShowIntro(false),[]);
  return(
    <>
      <CSS/>
      <Intro onDone={done}/>
      <div style={{opacity:showIntro?0:1,transition:"opacity .6s ease",pointerEvents:showIntro?"none":"auto"}}>
        <SpBar/>
        <div className="bstrip">
          {BRANCHES.map(b=>(
            <button key={b.id} className={`btab${branchId===b.id?" on":""}`} onClick={()=>setBranchId(b.id)}>
              <span className="btab-dot"/>{b.name}
            </button>
          ))}
        </div>
        <Header branch={branch}/>
        <Binfo branch={branch}/>
        <Hero branch={branch}/>
        <Cats branch={branch}/>
        <Featured branch={branch}/>
        <Trio/>
        <Hours activeBranchId={branchId}/>
      </div>
    </>
  );
}