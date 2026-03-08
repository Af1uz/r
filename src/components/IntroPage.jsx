import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════
   RAFFINI — intro.jsx  (Mahsulotlar sahifasi)
   · Responsive to'liq tuzatildi
   · Mobile touch support (hover → tap)
   · Sidebar mobile collapse
   · ListCard mobile cart button
   · Slider CSS fix
══════════════════════════════════════════════ */

const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#EFEFEF; --bg2:#E4E4E4; --bg3:#F8F8F8;
      --dark:#1E1E1E; --dark2:#2C2C2C;
      --txt:#3D3D3D; --txt2:#6E6E6E; --txt3:#9E9E9E;
      --acc:#BDBDBD; --acc2:#9E9E9E;
      --line:rgba(61,61,61,.09); --line2:rgba(61,61,61,.17);
      --serif:'Cormorant Garamond',Georgia,serif;
      --ui:'Outfit',sans-serif;
      --strip-h:40px;
    }
    html,body,#root{background:var(--bg);color:var(--txt);font-family:var(--ui);overflow-x:hidden}
    ::-webkit-scrollbar{width:1.5px}
    ::-webkit-scrollbar-thumb{background:var(--acc)}

    /* ─ TOAST ─ */
    .toast{
      position:fixed; bottom:28px; left:50%;
      transform:translateX(-50%) translateY(60px);
      background:var(--dark); color:rgba(239,239,239,.82);
      font-size:8px; font-weight:300; letter-spacing:.2em; text-transform:uppercase;
      padding:11px 28px; z-index:9000; pointer-events:none; white-space:nowrap;
      font-family:var(--ui);
      transition:transform .32s cubic-bezier(.4,0,.2,1);
    }
    .toast.up{transform:translateX(-50%) translateY(0)}

    /* ─ BRANCH SWITCHER ─ */
    .bsw{
      position:sticky; top:0; z-index:200;
      background:var(--dark); display:flex; align-items:stretch;
      height:var(--strip-h);
      overflow-x:auto; overflow-y:hidden;
      scrollbar-width:none;
    }
    .bsw::-webkit-scrollbar{display:none}
    .bsw-btn{
      flex:1; min-width:max-content;
      display:flex; align-items:center; justify-content:center; gap:6px;
      font-family:var(--ui); font-size:7.5px; font-weight:300;
      letter-spacing:.18em; text-transform:uppercase;
      color:rgba(239,239,239,.3); border:none; background:none; cursor:pointer;
      padding:13px 14px; position:relative;
      border-right:1px solid rgba(255,255,255,.04);
      transition:color .2s, background .2s;
      white-space:nowrap;
    }
    .bsw-btn:last-child{border-right:none}
    .bsw-btn.on{color:rgba(239,239,239,.88); background:rgba(255,255,255,.05)}
    .bsw-btn.on::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px;background:var(--acc)}
    .bsw-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.18);flex-shrink:0;transition:background .2s}
    .bsw-btn.on .bsw-dot{background:var(--acc)}
    .bsw-cnt{font-size:7px;font-weight:300;color:rgba(255,255,255,.22)}

    /* ─ PAGE LAYOUT ─ */
    .page{display:grid;grid-template-columns:220px 1fr;min-height:100vh;background:var(--bg);align-items:start}
    /* second column must not overflow */
    .page > div:last-child{min-width:0;overflow:hidden;}

    /* ─ SIDEBAR ─ */
    .sidebar{
      background:var(--bg3); border-right:1px solid var(--line);
      position:sticky; top:var(--strip-h); height:calc(100vh - var(--strip-h));
      overflow-y:auto; padding:28px 0;
      display:flex; flex-direction:column;
    }
    .sidebar::-webkit-scrollbar{width:0}
    .sb-section{padding:0 22px; margin-bottom:28px}
    .sb-label{
      font-size:6.5px; font-weight:400; letter-spacing:.36em; text-transform:uppercase;
      color:var(--acc2); margin-bottom:12px;
    }
    .sb-cat{
      display:flex; align-items:center; justify-content:space-between;
      padding:7px 10px; cursor:pointer;
      font-size:11px; font-weight:300; color:var(--txt2);
      border-radius:1px;
      transition:background .15s, color .15s;
    }
    .sb-cat:hover{background:var(--bg2); color:var(--txt)}
    .sb-cat.on{background:var(--dark); color:#EFEFEF}
    .sb-cnt{font-size:8.5px; font-weight:300; color:rgba(255,255,255,.35)}
    .sb-cat:not(.on) .sb-cnt{color:var(--acc2)}
    .sb-divider{height:1px; background:var(--line); margin:0 22px 28px}

    /* sort */
    .sb-sort{display:flex;flex-direction:column;gap:2px}
    .sb-sort-item{
      padding:7px 10px; cursor:pointer;
      font-size:11px; font-weight:300; color:var(--txt2);
      transition:background .15s, color .15s; border-radius:1px;
    }
    .sb-sort-item:hover{background:var(--bg2); color:var(--txt)}
    .sb-sort-item.on{background:var(--bg2); color:var(--dark); font-weight:400}

    /* branch hours in sidebar */
    .sb-hours{display:flex;flex-direction:column;gap:2px}
    .sbh-row{
      display:flex;justify-content:space-between;align-items:center;
      padding:5px 10px; font-size:9.5px; font-weight:300;
      border-radius:1px;
    }
    .sbh-row.today{background:rgba(61,61,61,.06)}
    .sbh-day{color:var(--txt2)}
    .sbh-day.td{color:var(--dark);font-weight:400}
    .sbh-time{color:var(--txt)}
    .sbh-time.off{color:var(--acc2)}
    .today-tag{
      font-size:6px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
      background:var(--dark);color:#EFEFEF;padding:1px 5px;margin-left:4px;
      font-family:var(--ui);
    }
    .open-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
    .open-dot.green{background:#5A9E5A}
    .open-dot.red{background:#A05050}

    /* ─ MOBILE SIDEBAR TOGGLE ─ */
    .sb-toggle{
      display:none;
      width:100%; padding:12px 20px;
      background:var(--bg3); border:none; border-bottom:1px solid var(--line);
      font-family:var(--ui); font-size:8px; font-weight:400;
      letter-spacing:.22em; text-transform:uppercase;
      color:var(--txt2); cursor:pointer;
      align-items:center; justify-content:space-between;
    }
    .sb-toggle-arrow{transition:transform .25s}
    .sb-toggle.open .sb-toggle-arrow{transform:rotate(180deg)}
    .sb-mobile-body{overflow:hidden; transition:max-height .38s cubic-bezier(.4,0,.2,1)}

    /* ─ MAIN CONTENT ─ */
    .main-content{padding:32px 36px; min-width:0; overflow:hidden;}
    .content-head{
      display:flex;align-items:flex-end;justify-content:space-between;
      margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--line);
    }
    .ch-title-row{display:flex;align-items:baseline;gap:12px}
    .ch-branch{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:6px}
    .ch-title{font-family:var(--serif);font-size:clamp(22px,2.2vw,32px);font-weight:300;color:var(--txt)}
    .ch-count{font-size:11px;font-weight:300;color:var(--acc2)}
    .view-btns{display:flex;gap:1px}
    .vbtn{
      width:30px;height:30px;border:1px solid var(--line2);background:none;
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      color:var(--acc2);transition:all .18s;
    }
    .vbtn:hover{color:var(--txt)}
    .vbtn.on{background:var(--dark);border-color:var(--dark);color:#EFEFEF}

    /* ─ PRODUCT GRID ─ */
    .pgrid{
      display:grid;
      gap:0;
      border-top:1px solid var(--line2);
      border-left:1px solid var(--line2);
    }
    .pgrid.g3{grid-template-columns:repeat(3,1fr)}
    .pgrid.g4{grid-template-columns:repeat(4,1fr)}
    .pgrid.gl{grid-template-columns:1fr}

    /* ─ CARD (Grid view) ─ */
    .pcard{
      background:var(--bg3); cursor:pointer;
      position:relative;
      /* overflow only on img-wrap, not whole card */
      overflow:visible;
      transition:background .22s;
      border-right:1px solid var(--line2);
      border-bottom:1px solid var(--line2);
      /* ensure card never overflows its grid cell */
      min-width:0; width:100%;
    }
    .pcard:hover{background:var(--bg2)}

    .pcard-img-wrap{
      position:relative; padding-top:120%; overflow:hidden; background:var(--bg2);
      /* overflow:hidden only on the image area, not info */
    }
    .pcard-img,.pcard-img2{
      position:absolute;inset:0;width:100%;height:100%;
      object-fit:cover; object-position:center top;
      display:block;
    }
    .pcard-img{
      filter:brightness(.83) saturate(.4) contrast(1.07);
      transition:transform .65s cubic-bezier(.4,0,.2,1);
    }
    .pcard-img2{opacity:0;transition:opacity .35s;filter:brightness(.76) saturate(.36)}
    .pcard:hover .pcard-img{transform:scale(1.07)}
    .pcard:hover .pcard-img2{opacity:1}

    /* top scan line */
    .pcard-scan{
      position:absolute;top:0;left:0;right:0;height:1px;
      background:var(--dark);transform:scaleX(0);transform-origin:left;
      transition:transform .36s cubic-bezier(.4,0,.2,1);z-index:3;
    }
    .pcard:hover .pcard-scan{transform:scaleX(1)}
    /* touch active state */
    .pcard.touched .pcard-scan{transform:scaleX(1)}

    /* badges */
    .pcards-badge{position:absolute;top:10px;left:10px;display:flex;flex-direction:column;gap:3px;z-index:4}
    .badge-tag{
      font-size:6.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
      padding:2px 8px;font-family:var(--ui);
    }
    .badge-tag.new{background:var(--dark);color:#EFEFEF}
    .badge-tag.sale{background:#A05050;color:#EFEFEF}
    .badge-tag.hit{background:var(--acc);color:var(--dark)}
    .badge-tag.lim{background:var(--bg3);color:var(--txt);border:1px solid var(--line2)}

    /* action buttons — relative to img-wrap */
    .pcard-actions{
      position:absolute;bottom:46px;right:8px;
      display:flex;flex-direction:column;gap:3px;z-index:5;
      opacity:0;transform:translateX(8px);
      transition:opacity .2s,transform .2s;
    }
    .pcard:hover .pcard-actions,
    .pcard.touched .pcard-actions{opacity:1;transform:translateX(0)}
    .pact{
      width:28px;height:28px;border:none;
      background:rgba(248,248,248,.94);backdrop-filter:blur(6px);
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      color:var(--txt2);transition:background .18s,color .18s;
    }
    .pact:hover,.pact.wl{background:var(--dark);color:#EFEFEF}

    /* add to cart */
    .pcard-add{
      position:absolute;bottom:0;left:0;right:0;
      background:var(--dark);color:#EFEFEF;
      font-size:7px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;
      padding:9px;text-align:center;border:none;cursor:pointer;width:100%;
      font-family:var(--ui);
      transform:translateY(100%);transition:transform .26s cubic-bezier(.4,0,.2,1);
    }
    .pcard:hover .pcard-add,
    .pcard.touched .pcard-add{transform:translateY(0)}

    /* card info */
    .pcard-info{
      padding:11px 13px 14px;
      /* critical: prevent text from overflowing grid cell */
      min-width:0; overflow:hidden; width:100%;
    }
    .pcard-brand{
      font-size:6.5px;font-weight:400;letter-spacing:.26em;text-transform:uppercase;
      color:var(--acc2);margin-bottom:3px;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .pcard-name{
      font-family:var(--serif);font-size:14px;font-weight:300;color:var(--txt);
      line-height:1.2;margin-bottom:5px;
      /* allow wrap on small cards */
      overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
    }
    .pcard-prices{display:flex;align-items:baseline;gap:4px;flex-wrap:wrap;min-width:0}
    .pcard-price{font-size:12px;font-weight:300;color:var(--txt);white-space:nowrap}
    .pcard-old{font-size:9px;font-weight:300;color:var(--acc);text-decoration:line-through;white-space:nowrap}
    .pcard-disc{font-size:8px;font-weight:500;color:#A05050;white-space:nowrap}
    .pcard-sizes{display:flex;gap:2px;margin-top:7px;flex-wrap:wrap;min-width:0}
    .sz{
      font-size:7px;font-weight:300;padding:2px 6px;
      border:1px solid var(--line2);color:var(--acc2);cursor:pointer;
      transition:all .15s; font-family:var(--ui);
    }
    .sz:hover{border-color:var(--txt);color:var(--txt)}
    .sz.on{border-color:var(--dark);background:var(--dark);color:#EFEFEF}

    /* ─ LIST CARD ─ */
    .lcard{
      background:var(--bg3); display:flex; align-items:stretch;
      cursor:pointer; position:relative; overflow:hidden;
      transition:background .22s;
    }
    .lcard:hover{background:var(--bg2)}
    .lcard-scan{
      position:absolute;top:0;left:0;right:0;height:1px;
      background:var(--dark);transform:scaleX(0);transform-origin:left;
      transition:transform .34s cubic-bezier(.4,0,.2,1);
    }
    .lcard:hover .lcard-scan{transform:scaleX(1)}
    .lcard-img{width:100px;height:130px;flex-shrink:0;overflow:hidden;background:var(--bg2)}
    .lcard-img img{
      width:100%;height:100%;object-fit:cover;object-position:center top;
      filter:brightness(.84) saturate(.4);
      transition:transform .5s;
    }
    .lcard:hover .lcard-img img{transform:scale(1.06)}
    .lcard-body{flex:1;padding:16px 20px;display:flex;flex-direction:column;justify-content:center;min-width:0}
    .lcard-brand{font-size:7px;font-weight:400;letter-spacing:.24em;text-transform:uppercase;color:var(--acc2);margin-bottom:3px}
    .lcard-name{font-family:var(--serif);font-size:17px;font-weight:300;color:var(--txt);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .lcard-cat{font-size:9.5px;font-weight:300;color:var(--txt2);margin-bottom:10px}
    .lcard-pr{font-size:13px;font-weight:300;color:var(--txt)}
    .lcard-old{font-size:10px;font-weight:300;color:var(--acc);text-decoration:line-through;margin-left:8px}
    .lcard-right{width:180px;flex-shrink:0;border-left:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px}
    .lcard-badges{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;margin-bottom:4px}
    .lcard-sizes{display:flex;gap:2px;flex-wrap:wrap;justify-content:center}
    .lcard-btns{display:flex;gap:4px;width:100%}
    .lbtn{
      width:32px;height:32px;flex-shrink:0;border:none;background:var(--bg2);
      cursor:pointer;display:flex;align-items:center;justify-content:center;
      color:var(--txt2);transition:all .18s;
    }
    .lbtn:hover,.lbtn.wl{background:var(--dark);color:#EFEFEF}
    .lbtn-cart{
      flex:1;font-family:var(--ui);font-size:7.5px;font-weight:500;
      letter-spacing:.16em;text-transform:uppercase;
      padding:9px;background:var(--dark);color:#EFEFEF;
      border:none;cursor:pointer;transition:background .22s;
    }
    .lbtn-cart:hover{background:var(--dark2)}

    /* Mobile list card - cart inside body */
    .lcard-mobile-foot{
      display:none;
      padding:10px 16px 14px;
      gap:6px;
      border-top:1px solid var(--line);
    }
    .lcard-mobile-foot .lbtn{height:34px;width:34px}
    .lcard-mobile-foot .lbtn-cart{height:34px;flex:1;font-size:7px}

    /* ─ LOAD MORE ─ */
    .loadmore{
      padding:40px 36px;
      background:var(--bg);
      display:flex;flex-direction:column;align-items:center;gap:10px;
    }
    .lm-bar{width:360px;max-width:90%;height:1px;background:var(--line2);position:relative}
    .lm-fill{position:absolute;top:0;left:0;height:1px;background:var(--dark);transition:width .4s}
    .lm-txt{font-size:8.5px;font-weight:300;letter-spacing:.14em;color:var(--acc2)}
    .lm-btn{
      font-family:var(--ui);font-size:8px;font-weight:400;letter-spacing:.22em;text-transform:uppercase;
      padding:10px 38px;border:1.5px solid var(--line2);background:transparent;
      color:var(--txt2);cursor:pointer;transition:border-color .22s,color .22s;
    }
    .lm-btn:hover{border-color:var(--txt);color:var(--txt)}

    /* ─ PROMO ─ */
    .promo{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--line)}
    .promo-c{padding:40px 36px;position:relative;overflow:hidden;transition:filter .25s}
    .promo-c:hover{filter:brightness(.97)}
    .promo-c.dk{background:var(--dark)}
    .promo-c.lt{background:var(--bg3);border-left:1px solid var(--line);border-right:1px solid var(--line)}
    .promo-c.md{background:var(--bg2)}
    .promo-eyebrow{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;margin-bottom:7px}
    .promo-c.dk .promo-eyebrow{color:rgba(239,239,239,.32)}
    .promo-c.lt .promo-eyebrow,.promo-c.md .promo-eyebrow{color:var(--acc2)}
    .promo-title{font-family:var(--serif);font-size:20px;font-weight:300;line-height:1.2;margin-bottom:18px}
    .promo-c.dk .promo-title{color:rgba(239,239,239,.84)}
    .promo-c.lt .promo-title,.promo-c.md .promo-title{color:var(--txt)}
    .promo-btn{font-family:var(--ui);font-size:7.5px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;padding:9px 20px;cursor:pointer;transition:all .22s}
    .promo-c.dk .promo-btn{background:transparent;color:rgba(239,239,239,.55);border:1px solid rgba(239,239,239,.14)}
    .promo-c.dk .promo-btn:hover{border-color:rgba(239,239,239,.45);color:#EFEFEF}
    .promo-c.lt .promo-btn,.promo-c.md .promo-btn{background:var(--dark);color:#EFEFEF;border:none}

    /* ─ PRICING ─ */
    .pricing{padding:64px 52px;background:var(--bg3);border-top:1px solid var(--line)}
    .pricing-top{text-align:center;margin-bottom:36px}
    .pricing-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:7px}
    .pricing-title{font-family:var(--serif);font-size:clamp(22px,2.4vw,34px);font-weight:300;color:var(--txt)}
    .pricing-desc{font-size:12px;font-weight:300;color:var(--txt2);max-width:300px;margin:8px auto 0;line-height:1.9;text-align:center}
    .price-toggle{display:flex;align-items:center;justify-content:center;gap:14px;margin:22px 0 36px}
    .pt-lbl{font-size:8.5px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--acc2);cursor:pointer;transition:color .2s}
    .pt-lbl.on{color:var(--txt)}
    .pt-sw{width:36px;height:18px;border-radius:99px;position:relative;cursor:pointer;flex-shrink:0;transition:background .22s}
    .pt-sw.yr{background:var(--dark)}.pt-sw.mo{background:var(--acc)}
    .pt-knob{width:12px;height:12px;background:#EFEFEF;border-radius:50%;position:absolute;top:3px;transition:left .24s cubic-bezier(.4,0,.2,1)}
    .pt-sw.mo .pt-knob{left:3px}.pt-sw.yr .pt-knob{left:21px}
    .save-tag{font-size:7px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;background:var(--dark);color:#EFEFEF;padding:3px 9px;font-family:var(--ui)}
    .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;max-width:900px;margin:0 auto;background:var(--line)}
    .plan{background:var(--bg2);padding:30px 26px 26px;position:relative;transition:transform .28s}
    .plan.pop{background:var(--dark);transform:translateY(-6px)}
    .plan-badge{position:absolute;top:0;left:24px;font-size:7px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;padding:4px 10px;background:var(--acc);color:var(--dark);font-family:var(--ui)}
    .plan-name{font-size:7.5px;font-weight:400;letter-spacing:.32em;text-transform:uppercase;margin-bottom:13px;font-family:var(--ui)}
    .plan:not(.pop) .plan-name{color:var(--acc2)}.plan.pop .plan-name{color:rgba(239,239,239,.38)}
    .plan-price{font-family:var(--serif);font-size:clamp(26px,3vw,42px);font-weight:300;line-height:1;margin-bottom:3px}
    .plan:not(.pop) .plan-price{color:var(--txt)}.plan.pop .plan-price{color:rgba(239,239,239,.88)}
    .plan-per{font-size:10px;font-weight:300;margin-bottom:20px;font-family:var(--ui)}
    .plan:not(.pop) .plan-per{color:var(--acc2)}.plan.pop .plan-per{color:rgba(239,239,239,.3)}
    .plan-div{height:1px;margin-bottom:16px}
    .plan:not(.pop) .plan-div{background:var(--line)}.plan.pop .plan-div{background:rgba(239,239,239,.08)}
    .plan-feats{display:flex;flex-direction:column;gap:8px;margin-bottom:22px}
    .pf{display:flex;align-items:flex-start;gap:7px;font-size:11px;font-weight:300;line-height:1.5;font-family:var(--ui)}
    .plan:not(.pop) .pf{color:var(--acc2)}.plan.pop .pf{color:rgba(239,239,239,.3)}
    .plan:not(.pop) .pf.y{color:var(--txt)}.plan.pop .pf.y{color:rgba(239,239,239,.78)}
    .pf-ico{width:11px;height:11px;flex-shrink:0;margin-top:2px}
    .pf-ico.y path,.pf-ico.y polyline{stroke:var(--acc2)}
    .plan.pop .pf-ico.y path,.plan.pop .pf-ico.y polyline{stroke:rgba(239,239,239,.55)}
    .pf-ico.n{opacity:.3}
    .plan-btn{width:100%;font-family:var(--ui);font-size:8px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:11px;cursor:pointer;transition:all .22s}
    .plan:not(.pop) .plan-btn{background:transparent;color:var(--txt);border:1.5px solid var(--line2)}
    .plan:not(.pop) .plan-btn:hover{border-color:var(--txt)}
    .plan.pop .plan-btn{background:rgba(239,239,239,.1);color:rgba(239,239,239,.82);border:1px solid rgba(239,239,239,.14)}
    .plan.pop .plan-btn:hover{background:rgba(239,239,239,.18)}

    /* ─ FAQ ─ */
    .faq{padding:64px 52px;background:var(--bg);border-top:1px solid var(--line)}
    .faq-wrap{display:grid;grid-template-columns:1fr 1.6fr;gap:72px;align-items:start}
    .faq-eye{font-size:7px;font-weight:300;letter-spacing:.36em;text-transform:uppercase;color:var(--acc2);margin-bottom:7px}
    .faq-title{font-family:var(--serif);font-size:clamp(20px,2.4vw,32px);font-weight:300;color:var(--txt);margin-bottom:14px}
    .faq-note{font-size:12px;font-weight:300;color:var(--txt2);line-height:1.9}
    .faq-note a{color:var(--txt);text-decoration:none;border-bottom:1px solid var(--line2)}
    .faq-list{display:flex;flex-direction:column}
    .fi{border-top:1px solid var(--line)}
    .fi:last-child{border-bottom:1px solid var(--line)}
    .fi-q{
      width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;
      padding:16px 0;background:none;border:none;cursor:pointer;text-align:left;font-family:var(--ui);
    }
    .fi-qt{font-family:var(--serif);font-size:15px;font-weight:300;color:var(--txt);line-height:1.3}
    .fi-ic{
      width:20px;height:20px;border:1px solid var(--line2);flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      color:var(--acc2);transition:background .2s,border-color .2s,color .2s,transform .28s;
    }
    .fi.open .fi-ic{background:var(--dark);border-color:var(--dark);color:#EFEFEF;transform:rotate(45deg)}
    .fi-a{max-height:0;overflow:hidden;transition:max-height .38s cubic-bezier(.4,0,.2,1)}
    .fi.open .fi-a{max-height:120px}
    .fi-at{font-size:12px;font-weight:300;color:var(--txt2);line-height:1.85;padding-bottom:16px}

    /* ══════════════════════════════════
       RESPONSIVE BREAKPOINTS
    ══════════════════════════════════ */

    /* Large: sidebar + 4 col works */
    @media(min-width:1400px){.pgrid.g4{grid-template-columns:repeat(4,1fr)}}

    /* Medium-large: sidebar + 3 col */
    @media(max-width:1399px) and (min-width:901px){
      .pgrid.g4{grid-template-columns:repeat(3,1fr)}
    }

    /* Tablet: sidebar hidden, full width 3 col */
    @media(max-width:900px){
      .page{grid-template-columns:1fr}

      /* Sidebar becomes collapsible panel */
      .sidebar{
        position:static; height:auto;
        flex-direction:column;
        padding:0; top:0;
        border-right:none; border-bottom:1px solid var(--line);
      }
      .sb-toggle{display:flex}
      .sb-mobile-body{
        display:flex; flex-direction:row; flex-wrap:wrap;
        max-height:0;
        background:var(--bg3);
      }
      .sb-mobile-body.open{max-height:800px}
      .sb-section{padding:16px 20px; margin-bottom:0; flex:1; min-width:160px}
      .sb-divider{display:none}

      .pgrid.g4,.pgrid.g3{grid-template-columns:repeat(3,1fr)}
      .main-content{padding:20px 16px}
      .content-head{margin-bottom:16px;padding-bottom:14px}

      .promo{grid-template-columns:1fr}
      .promo-c.lt{border-left:none;border-right:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}

      .plans{grid-template-columns:1fr;max-width:360px}
      .plan.pop{transform:none}

      .faq-wrap{grid-template-columns:1fr;gap:32px}
      .pricing,.faq{padding-left:28px;padding-right:28px}
    }

    /* Small tablet / large phone */
    @media(max-width:680px){
      .pgrid.g4,.pgrid.g3{grid-template-columns:repeat(2,1fr)}

      /* List card: hide right panel, show mobile footer */
      .lcard-right{display:none}
      .lcard{flex-wrap:wrap}
      .lcard-body{padding:12px 14px}
      .lcard-name{font-size:14px}
      .lcard-mobile-foot{display:flex}
    }

    /* Phone */
    @media(max-width:420px){
      .pgrid.g4,.pgrid.g3{grid-template-columns:1fr 1fr}
      .pcard-name{font-size:12px}
      .pcard-brand{font-size:6px}
      .bsw-btn{font-size:6.5px;letter-spacing:.1em;padding:10px 10px}
      .main-content{padding:14px 12px}
      .loadmore{padding:28px 16px}
      .pricing,.faq{padding-left:16px;padding-right:16px}
      .promo-c{padding:28px 20px}
    }
  `}</style>
);

/* ── HELPERS ── */
const DAY_UZ = ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
const todayName = () => DAY_UZ[new Date().getDay()];
const nowHour   = () => { const d = new Date(); return d.getHours() + d.getMinutes()/60; };
const checkOpen = (h) => {
  if (!h?.open) return false;
  const [oh,om] = h.open.split(":").map(Number);
  const [ch,cm] = h.close.split(":").map(Number);
  return nowHour() >= oh+om/60 && nowHour() < ch+cm/60;
};
const fmt = (n) => Number(n).toLocaleString("uz-UZ") + " so'm";

const Heart = ({on}) => <svg width="12" height="12" viewBox="0 0 24 24" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const EyeI  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const GridI = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>;
const ListI = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1"><line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="1" y1="12" x2="15" y2="12"/></svg>;
const PlusI = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ChevDown = () => <svg className="sb-toggle-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;

const ChkI = () => (
  <svg className="pf-ico y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XcI = () => (
  <svg className="pf-ico n" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── BRANCH DATA ── */
const BRANCHES = [
  {
    id:"chilonzor", name:"Chilonzor", address:"Chilonzor ko'ch., 12",
    cats:["Barchasi","Kostyum","Palto","Shim","Galstuk","Ko'ylak","Aksessuar"],
    hours:[
      {day:"Dushanba",  open:"09:00",close:"20:00"},
      {day:"Seshanba",  open:"09:00",close:"20:00"},
      {day:"Chorshanba",open:"09:00",close:"20:00"},
      {day:"Payshanba", open:"09:00",close:"20:00"},
      {day:"Juma",      open:"09:00",close:"21:00"},
      {day:"Shanba",    open:"10:00",close:"20:00"},
      {day:"Yakshanba", open:null,   close:null},
    ],
  },
  {
    id:"yunusobod", name:"Yunusobod", address:"Amir Temur shoh ko'ch., 15",
    cats:["Barchasi","Ko'ylak","Polo","Shim","T-Shirt","Kurtka"],
    hours:[
      {day:"Dushanba",  open:"09:00",close:"21:00"},
      {day:"Seshanba",  open:"09:00",close:"21:00"},
      {day:"Chorshanba",open:"09:00",close:"21:00"},
      {day:"Payshanba", open:"09:00",close:"21:00"},
      {day:"Juma",      open:"09:00",close:"22:00"},
      {day:"Shanba",    open:"10:00",close:"21:00"},
      {day:"Yakshanba", open:"11:00",close:"19:00"},
    ],
  },
  {
    id:"mirzo", name:"Mirzo Ulug'bek", address:"Mirzo Ulug'bek ko'ch., 8",
    cats:["Barchasi","Sport","Hoodie","Tracksuit","Polo","Aksessuar"],
    hours:[
      {day:"Dushanba",  open:"09:00",close:"20:00"},
      {day:"Seshanba",  open:"09:00",close:"20:00"},
      {day:"Chorshanba",open:"09:00",close:"20:00"},
      {day:"Payshanba", open:"09:00",close:"20:00"},
      {day:"Juma",      open:"09:00",close:"20:00"},
      {day:"Shanba",    open:"10:00",close:"19:00"},
      {day:"Yakshanba", open:null,   close:null},
    ],
  },
  {
    id:"sergeli", name:"Sergeli", address:"Sergeli ko'ch., 24",
    cats:["Barchasi","Kurtka","Palto","Smart","Ko'ylak","Aksessuar"],
    hours:[
      {day:"Dushanba",  open:"10:00",close:"20:00"},
      {day:"Seshanba",  open:"10:00",close:"20:00"},
      {day:"Chorshanba",open:"10:00",close:"20:00"},
      {day:"Payshanba", open:"10:00",close:"20:00"},
      {day:"Juma",      open:"10:00",close:"21:00"},
      {day:"Shanba",    open:"10:00",close:"20:00"},
      {day:"Yakshanba", open:"11:00",close:"18:00"},
    ],
  },
];

/* ── PRODUCTS DATA ── */
const ALL_PRODUCTS = {
  chilonzor:[
    {id:1,cat:"Kostyum",brand:"Hugo Boss",name:"Slim Fit Kostyum",price:2490000,old:3100000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=600&q=80",img2:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80"},
    {id:2,cat:"Kostyum",brand:"Armani",name:"Qora Kostyum",price:4200000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",img2:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80"},
    {id:3,cat:"Kostyum",brand:"Massimo Dutti",name:"Kulrang Kostyum",price:1980000,old:2400000,badges:["sale"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80",img2:"https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80"},
    {id:4,cat:"Kostyum",brand:"Zara Man",name:"Navy Kostyum",price:1650000,old:null,badges:[],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=600&q=80"},
    {id:5,cat:"Kostyum",brand:"Reserved",name:"Zamonaviy Kostyum",price:890000,old:1200000,badges:["sale","hit"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",img2:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"},
    {id:6,cat:"Palto",brand:"Hugo Boss",name:"Premium Palto",price:2800000,old:3500000,badges:["sale"],sizes:["M","L"],img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",img2:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"},
    {id:7,cat:"Palto",brand:"Armani",name:"Wool Blend Palto",price:3200000,old:null,badges:["new"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",img2:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"},
    {id:8,cat:"Palto",brand:"Massimo Dutti",name:"Charm Palto",price:2100000,old:2600000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",img2:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80"},
    {id:9,cat:"Shim",brand:"Hugo Boss",name:"Biznes Shim",price:680000,old:null,badges:[],sizes:["30","32","34","36"],img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",img2:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"},
    {id:10,cat:"Shim",brand:"Zara Man",name:"Slim Chino",price:480000,old:620000,badges:["sale"],sizes:["30","32","34"],img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",img2:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"},
    {id:11,cat:"Galstuk",brand:"Hugo Boss",name:"Ipak Galstuk",price:480000,old:620000,badges:["sale"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80",img2:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"},
    {id:12,cat:"Galstuk",brand:"Armani",name:"Rasmi Galstuk",price:390000,old:null,badges:[],sizes:["Standart"],img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80"},
    {id:13,cat:"Ko'ylak",brand:"Massimo Dutti",name:"Oxford Ko'ylak",price:620000,old:null,badges:["new"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"},
    {id:14,cat:"Ko'ylak",brand:"Hugo Boss",name:"Formal Ko'ylak",price:780000,old:950000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"},
    {id:15,cat:"Aksessuar",name:"Armani Soat",brand:"Armani",price:2100000,old:null,badges:["new","lim"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",img2:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"},
    {id:16,cat:"Aksessuar",name:"Charm Kamar",brand:"Hugo Boss",price:340000,old:480000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",img2:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80"},
    {id:17,cat:"Kostyum",brand:"Canali",name:"Italyan Kostyum",price:5800000,old:null,badges:["new","lim"],sizes:["M","L"],img:"https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80",img2:"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80"},
    {id:18,cat:"Palto",brand:"Zara Man",name:"Trench Coat",price:1450000,old:1850000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",img2:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"},
    {id:19,cat:"Shim",brand:"Armani",name:"Premium Shim",price:1200000,old:null,badges:[],sizes:["32","34","36"],img:"https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80",img2:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"},
    {id:20,cat:"Ko'ylak",brand:"Reserved",name:"Casual Ko'ylak",price:320000,old:420000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",img2:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"},
    {id:21,cat:"Aksessuar",name:"Ipak Yayliq",brand:"Armani",price:280000,old:null,badges:[],sizes:["Standart"],img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",img2:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80"},
    {id:22,cat:"Galstuk",brand:"Massimo Dutti",name:"Ipak Bants",price:240000,old:320000,badges:["sale"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"},
  ],
  yunusobod:[
    {id:1,cat:"Ko'ylak",brand:"Zara Man",name:"Oq Ko'ylak",price:450000,old:null,badges:["new"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",img2:"https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&q=80"},
    {id:2,cat:"Ko'ylak",brand:"Mango Man",name:"Linen Ko'ylak",price:290000,old:380000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"},
    {id:3,cat:"Ko'ylak",brand:"Calvin Klein",name:"Slim Fit Ko'ylak",price:320000,old:420000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",img2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"},
    {id:4,cat:"Ko'ylak",brand:"H&M",name:"Rangli Ko'ylak",price:190000,old:250000,badges:["sale","hit"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",img2:"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80"},
    {id:5,cat:"Ko'ylak",brand:"Tommy H.",name:"Classic Ko'ylak",price:580000,old:null,badges:["new"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&q=80",img2:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"},
    {id:6,cat:"Polo",brand:"Lacoste",name:"Polo Ko'ylak",price:780000,old:950000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80",img2:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"},
    {id:7,cat:"Polo",brand:"Tommy H.",name:"Rangli Polo",price:560000,old:null,badges:["hit"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",img2:"https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80"},
    {id:8,cat:"Polo",brand:"Ralph Lauren",name:"RL Polo",price:960000,old:null,badges:["new","lim"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1612337498517-a394a487e9e6?w=600&q=80",img2:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"},
    {id:9,cat:"Shim",brand:"Levi's",name:"Slim Jeans",price:490000,old:null,badges:["new"],sizes:["30","32","34"],img:"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80",img2:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"},
    {id:10,cat:"Shim",brand:"Zara Man",name:"Chino Shim",price:380000,old:520000,badges:["sale"],sizes:["30","32","34","36"],img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",img2:"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80"},
    {id:11,cat:"Shim",brand:"Diesel",name:"Regular Jeans",price:720000,old:890000,badges:["sale"],sizes:["30","32","34"],img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",img2:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"},
    {id:12,cat:"T-Shirt",brand:"Calvin Klein",name:"Basic T-Shirt",price:180000,old:240000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",img2:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"},
    {id:13,cat:"T-Shirt",brand:"Lacoste",name:"Polo T-Shirt",price:420000,old:null,badges:[],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",img2:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"},
    {id:14,cat:"T-Shirt",brand:"Hugo Boss",name:"Boss T-Shirt",price:380000,old:490000,badges:["sale","hit"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",img2:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"},
    {id:15,cat:"Kurtka",brand:"Zara Man",name:"Denim Kurtka",price:680000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",img2:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"},
    {id:16,cat:"Kurtka",brand:"H&M",name:"Bomber Kurtka",price:490000,old:650000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",img2:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"},
    {id:17,cat:"Polo",brand:"Crocodile",name:"Essential Polo",price:340000,old:440000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",img2:"https://images.unsplash.com/photo-1612337498517-a394a487e9e6?w=600&q=80"},
    {id:18,cat:"Ko'ylak",brand:"Reserved",name:"Flannel Ko'ylak",price:250000,old:330000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"},
    {id:19,cat:"T-Shirt",brand:"Tommy H.",name:"Graphic Tee",price:290000,old:null,badges:[],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",img2:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"},
    {id:20,cat:"Shim",brand:"H&M",name:"Jogger Shim",price:280000,old:360000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",img2:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"},
    {id:21,cat:"Ko'ylak",name:"Denim Ko'ylak",brand:"Levi's",price:420000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80"},
    {id:22,cat:"Polo",brand:"Lacoste",name:"Sport Polo",price:680000,old:840000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",img2:"https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80"},
  ],
  mirzo:[
    {id:1,cat:"Tracksuit",brand:"Pull&Bear",name:"Tracksuit To'plam",price:680000,old:850000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",img2:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80"},
    {id:2,cat:"Tracksuit",brand:"Adidas",name:"Classic Track",price:580000,old:null,badges:["new"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",img2:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"},
    {id:3,cat:"Tracksuit",brand:"Nike",name:"Jogger Set",price:720000,old:900000,badges:["sale","hit"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",img2:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"},
    {id:4,cat:"Hoodie",brand:"H&M Sport",name:"Fleece Hoodie",price:390000,old:null,badges:["new"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",img2:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"},
    {id:5,cat:"Hoodie",brand:"Pull&Bear",name:"Oversize Hoodie",price:440000,old:560000,badges:["sale"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",img2:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"},
    {id:6,cat:"Hoodie",brand:"Champion",name:"Logo Hoodie",price:520000,old:null,badges:["new","lim"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",img2:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"},
    {id:7,cat:"Sport",brand:"Lacoste",name:"Sport Ko'ylak",price:520000,old:640000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80"},
    {id:8,cat:"Sport",brand:"Puma",name:"Training T-Shirt",price:240000,old:null,badges:["hit"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80",img2:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80"},
    {id:9,cat:"Sport",brand:"Under Armour",name:"Compression Shirt",price:320000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",img2:"https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80"},
    {id:10,cat:"Sport",brand:"Adidas",name:"Sport Shim",price:280000,old:360000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",img2:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80"},
    {id:11,cat:"Polo",brand:"Lacoste",name:"Sport Polo",price:680000,old:840000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",img2:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"},
    {id:12,cat:"Polo",brand:"Nike",name:"Dri-Fit Polo",price:540000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",img2:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"},
    {id:13,cat:"Aksessuar",brand:"Nike",name:"Sport Sumka",price:280000,old:null,badges:[],sizes:["Standart"],img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",img2:"https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80"},
    {id:14,cat:"Aksessuar",brand:"Adidas",name:"Sport Kamar Belt",price:180000,old:240000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80",img2:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"},
    {id:15,cat:"Aksessuar",brand:"Puma",name:"Sport Shapka",price:120000,old:160000,badges:["sale"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",img2:"https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80"},
    {id:16,cat:"Tracksuit",brand:"Fila",name:"Retro Tracksuit",price:640000,old:800000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",img2:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80"},
    {id:17,cat:"Hoodie",brand:"Puma",name:"Essential Hoodie",price:360000,old:460000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",img2:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"},
    {id:18,cat:"Sport",brand:"Nike",name:"Running Shim",price:340000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"},
    {id:19,cat:"Polo",brand:"Adidas",name:"Club Polo",price:420000,old:520000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",img2:"https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80"},
    {id:20,cat:"Aksessuar",brand:"Under Armour",name:"Sport Kaptarcha",price:95000,old:130000,badges:["sale"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",img2:"https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80"},
  ],
  sergeli:[
    {id:1,cat:"Kurtka",brand:"Massimo Dutti",name:"Charm Kurtka",price:890000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",img2:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"},
    {id:2,cat:"Kurtka",brand:"Zara Man",name:"Denim Kurtka",price:680000,old:850000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",img2:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"},
    {id:3,cat:"Kurtka",brand:"Reserved",name:"Harrington",price:540000,old:680000,badges:["sale","hit"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",img2:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"},
    {id:4,cat:"Kurtka",brand:"H&M",name:"Utility Kurtka",price:380000,old:500000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",img2:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"},
    {id:5,cat:"Palto",brand:"Hugo Boss",name:"Premium Palto",price:2800000,old:3500000,badges:["sale"],sizes:["M","L"],img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",img2:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"},
    {id:6,cat:"Palto",brand:"Massimo Dutti",name:"Camel Palto",price:2200000,old:null,badges:["new"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",img2:"https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80"},
    {id:7,cat:"Palto",brand:"Reserved",name:"Check Palto",price:1400000,old:1800000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",img2:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"},
    {id:8,cat:"Smart",brand:"Massimo Dutti",name:"Smart Blazer",price:1600000,old:null,badges:["new","lim"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",img2:"https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=600&q=80"},
    {id:9,cat:"Smart",brand:"Zara Man",name:"Smart Casual Set",price:1200000,old:1500000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",img2:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"},
    {id:10,cat:"Smart",brand:"Hugo Boss",name:"Business Casual",price:1900000,old:null,badges:["new"],sizes:["M","L","XL"],img:"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80",img2:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80"},
    {id:11,cat:"Ko'ylak",brand:"Reserved",name:"Oxford Ko'ylak",price:450000,old:580000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",img2:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"},
    {id:12,cat:"Ko'ylak",brand:"Massimo Dutti",name:"Linen Ko'ylak",price:640000,old:null,badges:["new"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",img2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"},
    {id:13,cat:"Ko'ylak",brand:"Hugo Boss",name:"Business Ko'ylak",price:780000,old:960000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",img2:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"},
    {id:14,cat:"Aksessuar",brand:"Hugo Boss",name:"Ipak Galstuk",price:480000,old:620000,badges:["sale"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80",img2:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"},
    {id:15,cat:"Aksessuar",brand:"Massimo Dutti",name:"Kamar Belt",price:340000,old:null,badges:[],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",img2:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80"},
    {id:16,cat:"Kurtka",brand:"Tommy H.",name:"Spring Kurtka",price:760000,old:960000,badges:["sale","hit"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",img2:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"},
    {id:17,cat:"Smart",brand:"Reserved",name:"Evening Blazer",price:980000,old:1200000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1619603364863-ae1de2c4f49d?w=600&q=80",img2:"https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80"},
    {id:18,cat:"Ko'ylak",brand:"Zara Man",name:"Casual Oxford",price:320000,old:420000,badges:["sale"],sizes:["S","M","L","XL"],img:"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",img2:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"},
    {id:19,cat:"Palto",brand:"Zara Man",name:"Trench Coat",price:1450000,old:1850000,badges:["sale"],sizes:["S","M","L"],img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",img2:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"},
    {id:20,cat:"Aksessuar",brand:"Hugo Boss",name:"Charm Soat",price:2100000,old:null,badges:["new","lim"],sizes:["Standart"],img:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",img2:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"},
  ],
};

const SORTS = ["Tavsiya etilgan","Narx: Past","Narx: Yuqori","Yangilar","Chegirmalar"];
const PLANS = [
  {name:"Standart",pop:false,mo:490000,feats:[{t:"Bepul yetkazish",y:true},{t:"Qaytarish (14 kun)",y:true},{t:"Asosiy chegirmalar",y:true},{t:"VIP chegirmalar",y:false},{t:"Shaxsiy stilist",y:false}]},
  {name:"Professional",pop:true,mo:990000,feats:[{t:"Bepul yetkazish",y:true},{t:"Qaytarish (30 kun)",y:true},{t:"Barcha chegirmalar",y:true},{t:"VIP chegirmalar",y:true},{t:"Shaxsiy stilist",y:false}]},
  {name:"Premium",pop:false,mo:1490000,feats:[{t:"Bepul yetkazish",y:true},{t:"Qaytarish (60 kun)",y:true},{t:"Barcha chegirmalar",y:true},{t:"VIP chegirmalar",y:true},{t:"Shaxsiy stilist",y:true}]},
];
const FAQS = [
  {q:"Yetkazib berish necha kunda?",a:"Toshkent bo'ylab 1-3 ish kuni. 100 000 so'mdan yuqori xaridda bepul."},
  {q:"Mahsulot qaytarish mumkinmi?",a:"Ha, 14-60 kun (tarifga qarab). Mahsulot etiketkalari yechilmagan bo'lishi kerak."},
  {q:"Mahsulotlar original brendlarmi?",a:"100% original. Barcha mahsulotlar asl brend sertifikatiga ega."},
  {q:"O'lcham to'g'ri kelmasa?",a:"Bepul o'lcham almashtirish — bir marta yetkazib berish va qaytarish bizdan."},
  {q:"To'lov usullari?",a:"Click, Payme, UzCard, Humo, Visa, Mastercard. Muddatli to'lov (2-12 oy) ham mavjud."},
];

/* ── TOAST ── */
const useToast = () => {
  const [msg, setMsg] = useState("");
  const [vis, setVis] = useState(false);
  const t = useRef(null);
  const show = useCallback((m) => {
    setMsg(m); setVis(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setVis(false), 2200);
  }, []);
  return { msg, vis, show };
};

/* ── TOUCH DETECTION ── */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
};

/* ── GRID CARD ── */
const GridCard = ({ p, toast }) => {
  const [wl, setWl] = useState(false);
  const [sz, setSz] = useState(null);
  const [touched, setTouched] = useState(false);
  const disc = p.old ? Math.round((1 - p.price / p.old) * 100) : null;

  const handleTouch = (e) => {
    // First tap: reveal actions. Second tap on card body: proceed normally
    if (!touched) {
      e.preventDefault();
      setTouched(true);
      // Auto-hide after 3s of no interaction
      setTimeout(() => setTouched(false), 3000);
    }
  };

  return (
    <div
      className={`pcard${touched ? " touched" : ""}`}
      onTouchStart={handleTouch}
    >
      <div className="pcard-img-wrap">
        <img className="pcard-img" src={p.img} alt={p.name} loading="lazy"/>
        <img className="pcard-img2" src={p.img2} alt={p.name} loading="lazy"/>
        <div className="pcard-scan"/>
        <div className="pcards-badge">
          {p.badges.map(b => (
            <span key={b} className={`badge-tag ${b}`}>
              {b==="new"?"Yangi":b==="sale"?"Aksiya":b==="hit"?"Hit":"Limit"}
            </span>
          ))}
        </div>
        <div className="pcard-actions">
          <button
            className={`pact${wl?" wl":""}`}
            onClick={e => {
              e.stopPropagation();
              setWl(v => !v);
              toast.show(wl ? "Olib tashlandi" : `"${p.name}" sevimlilarga qo'shildi`);
            }}
          >
            <Heart on={wl}/>
          </button>
          <button className="pact"><EyeI/></button>
        </div>
        <button
          className="pcard-add"
          onClick={e => {
            e.stopPropagation();
            toast.show(`"${p.name}" savatga qo'shildi`);
          }}
        >
          + Savatga
        </button>
      </div>
      <div className="pcard-info">
        <div className="pcard-brand">{p.brand}</div>
        <div className="pcard-name">{p.name}</div>
        <div className="pcard-prices">
          <span className="pcard-price">{fmt(p.price)}</span>
          {p.old && <span className="pcard-old">{fmt(p.old)}</span>}
          {disc  && <span className="pcard-disc">−{disc}%</span>}
        </div>
        <div className="pcard-sizes">
          {p.sizes.map(s => (
            <span
              key={s}
              className={`sz${sz===s?" on":""}`}
              onClick={e => { e.stopPropagation(); setSz(s); }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── LIST CARD ── */
const ListCard = ({ p, toast }) => {
  const [wl, setWl] = useState(false);
  const disc = p.old ? Math.round((1 - p.price / p.old) * 100) : null;

  const toggleWl = (e) => {
    e.stopPropagation();
    setWl(v => !v);
    toast.show(wl ? "Olib tashlandi" : `"${p.name}" sevimlilarga qo'shildi`);
  };
  const addCart = (e) => {
    e.stopPropagation();
    toast.show(`"${p.name}" savatga qo'shildi`);
  };

  return (
    <div className="lcard">
      <div className="lcard-scan"/>
      <div className="lcard-img"><img src={p.img} alt={p.name} loading="lazy"/></div>
      <div className="lcard-body">
        <div className="lcard-brand">{p.brand}</div>
        <div className="lcard-name">{p.name}</div>
        <div className="lcard-cat">{p.cat}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span className="lcard-pr">{fmt(p.price)}</span>
          {p.old && <span className="lcard-old">{fmt(p.old)}</span>}
          {disc  && <span className="pcard-disc" style={{fontSize:9}}>−{disc}%</span>}
        </div>
      </div>

      {/* Desktop right panel */}
      <div className="lcard-right">
        <div className="lcard-badges">
          {p.badges.map(b => (
            <span key={b} className={`badge-tag ${b}`}>
              {b==="new"?"Yangi":b==="sale"?"Aksiya":b==="hit"?"Hit":"Limit"}
            </span>
          ))}
        </div>
        <div className="lcard-sizes">
          {p.sizes.slice(0,4).map(s => <span key={s} className="sz">{s}</span>)}
        </div>
        <div className="lcard-btns">
          <button className={`lbtn${wl?" wl":""}`} onClick={toggleWl}><Heart on={wl}/></button>
          <button className="lbtn-cart" onClick={addCart}>+ Savat</button>
        </div>
      </div>

      {/* Mobile footer (shown on small screens) */}
      <div className="lcard-mobile-foot">
        <button className={`lbtn${wl?" wl":""}`} onClick={toggleWl}><Heart on={wl}/></button>
        <button className="lbtn-cart" onClick={addCart}>+ Savatga</button>
      </div>
    </div>
  );
};

/* ── SIDEBAR ── */
const Sidebar = ({ branch, cat, setCat, sort, setSort }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = todayName();
  const todayH = branch.hours.find(h => h.day === today);
  const opened = checkOpen(todayH);
  const products = ALL_PRODUCTS[branch.id] || [];
  const getCatCount = (c) => c === "Barchasi" ? products.length : products.filter(p => p.cat === c).length;

  return (
    <div className="sidebar">
      {/* Mobile toggle button */}
      <button
        className={`sb-toggle${mobileOpen?" open":""}`}
        onClick={() => setMobileOpen(v => !v)}
      >
        <span>Filter & Saralash</span>
        <ChevDown/>
      </button>

      {/* Content wrapper - always visible on desktop, collapsible on mobile */}
      <div className={`sb-mobile-body${mobileOpen?" open":""}`}>
        <div className="sb-section">
          <div className="sb-label">Kategoriyalar</div>
          {branch.cats.map(c => (
            <div
              key={c}
              className={`sb-cat${cat===c?" on":""}`}
              onClick={() => { setCat(c); setMobileOpen(false); }}
            >
              <span>{c}</span>
              <span className="sb-cnt">{getCatCount(c)}</span>
            </div>
          ))}
        </div>

        <div className="sb-divider"/>

        <div className="sb-section">
          <div className="sb-label">Saralash</div>
          <div className="sb-sort">
            {SORTS.map(s => (
              <div
                key={s}
                className={`sb-sort-item${sort===s?" on":""}`}
                onClick={() => { setSort(s); setMobileOpen(false); }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="sb-divider"/>

        <div className="sb-section">
          <div className="sb-label" style={{display:"flex",alignItems:"center",gap:6}}>
            Bugungi Ish Vaqti
            <span className={`open-dot ${opened?"green":"red"}`}/>
          </div>
          <div className="sb-hours">
            {branch.hours.map((h, i) => {
              const isTd = h.day === today;
              return (
                <div key={i} className={`sbh-row${isTd?" today":""}`}>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <span className={`sbh-day${isTd?" td":""}`}>{h.day}</span>
                    {isTd && <span className="today-tag">Bugun</span>}
                  </div>
                  <span className={`sbh-time${!h.open?" off":""}`}>
                    {h.open ? `${h.open}–${h.close}` : "Yopiq"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop-only content (always visible) */}
      <style>{`
        @media(min-width:901px){
          .sb-toggle{display:none!important}
          .sb-mobile-body{
            display:flex!important;
            flex-direction:column!important;
            max-height:none!important;
            overflow:visible!important;
          }
        }
      `}</style>
    </div>
  );
};

/* ── ROOT ── */
export default function IntroPage() {
  const toast = useToast();
  const [branchId, setBranchId] = useState("chilonzor");
  const branch = BRANCHES.find(b => b.id === branchId);
  const [cat, setCat] = useState("Barchasi");
  const [sort, setSort] = useState("Tavsiya etilgan");
  const [view, setView] = useState("grid");
  const [shown, setShown] = useState(12);
  const [yr, setYr] = useState(false);
  const [fopen, setFopen] = useState(null);

  const handleBranch = (id) => { setBranchId(id); setCat("Barchasi"); setShown(12); };

  const products = ALL_PRODUCTS[branchId] || [];
  const filtered = products
    .filter(p => cat === "Barchasi" || p.cat === cat)
    .sort((a,b) => {
      if (sort === "Narx: Past")    return a.price - b.price;
      if (sort === "Narx: Yuqori") return b.price - a.price;
      if (sort === "Yangilar")     return b.id - a.id;
      if (sort === "Chegirmalar")  return (b.old?1:0) - (a.old?1:0);
      return 0;
    });
  const visible = filtered.slice(0, shown);
  const prog = Math.min((shown / Math.max(filtered.length, 1)) * 100, 100);

  const priceDisp = (mo) => {
    const v = yr ? Math.round(mo * 12 * 0.75) : mo;
    return v.toLocaleString("uz-UZ") + " so'm";
  };

  return (
    <>
      <CSS/>
      <div className={`toast${toast.vis?" up":""}`}>{toast.msg}</div>

      {/* branch strip */}
      <div className="bsw">
        {BRANCHES.map(b => (
          <button
            key={b.id}
            className={`bsw-btn${branchId===b.id?" on":""}`}
            onClick={() => handleBranch(b.id)}
          >
            <span className="bsw-dot"/>
            {b.name}
            <span className="bsw-cnt">({(ALL_PRODUCTS[b.id]||[]).length})</span>
          </button>
        ))}
      </div>

      {/* sidebar + products */}
      <div className="page">
        <Sidebar
          branch={branch}
          cat={cat}
          setCat={c => { setCat(c); setShown(12); }}
          sort={sort}
          setSort={setSort}
        />
        <div>
          <div className="main-content">
            <div className="content-head">
              <div>
                <div className="ch-branch">{branch.name} filiali</div>
                <div className="ch-title-row">
                  <h2 className="ch-title">Mahsulotlar</h2>
                  <span className="ch-count">{filtered.length} ta</span>
                </div>
              </div>
              <div className="view-btns">
                <button className={`vbtn${view==="grid"?" on":""}`} onClick={() => setView("grid")}><GridI/></button>
                <button className={`vbtn${view==="list"?" on":""}`} onClick={() => setView("list")}><ListI/></button>
              </div>
            </div>

            {view === "grid" ? (
              <div className="pgrid g4">
                {visible.map(p => (
                  <GridCard key={`${branchId}-${p.id}`} p={p} toast={toast}/>
                ))}
              </div>
            ) : (
              <div className="pgrid gl">
                {visible.map(p => (
                  <ListCard key={`${branchId}-${p.id}`} p={p} toast={toast}/>
                ))}
              </div>
            )}
          </div>

          {/* load more */}
          <div className="loadmore">
            <div className="lm-bar"><div className="lm-fill" style={{width:`${prog}%`}}/></div>
            <div className="lm-txt">{Math.min(shown,filtered.length)} / {filtered.length} mahsulot ko'rsatilmoqda</div>
            {shown < filtered.length && (
              <button className="lm-btn" onClick={() => setShown(v => v + 8)}>Ko'proq Ko'rsatish</button>
            )}
          </div>
        </div>
      </div>

      {/* promo */}
      <div className="promo">
        <div className="promo-c dk">
          <div className="promo-eyebrow">Maxsus taklif</div>
          <div className="promo-title">Yangi Kolleksiya<br/>−20% chegirma</div>
          <button className="promo-btn" onClick={() => toast.show("Aksiya sahifasi")}>Batafsil →</button>
        </div>
        <div className="promo-c lt">
          <div className="promo-eyebrow">Bepul xizmat</div>
          <div className="promo-title">Shaxsiy<br/>Stilist</div>
          <button className="promo-btn" onClick={() => toast.show("Ro'yxatdan o'tildi")}>Ro'yxatdan O'tish →</button>
        </div>
        <div className="promo-c md">
          <div className="promo-eyebrow">Yozgi chegirma</div>
          <div className="promo-title">−30% gacha<br/>Yozgi Kolleksiya</div>
          <button className="promo-btn" onClick={() => toast.show("Yozgi kolleksiya")}>Xarid Qilish →</button>
        </div>
      </div>

      {/* pricing */}
      <section className="pricing">
        <div className="pricing-top">
          <div className="pricing-eye">Obuna</div>
          <h2 className="pricing-title">Sizga mos tarifni tanlang</h2>
          <p className="pricing-desc">Yillik obunada 25% tejang. Istalgan vaqt bekor qilish mumkin.</p>
        </div>
        <div className="price-toggle">
          <span className={`pt-lbl${!yr?" on":""}`} onClick={() => setYr(false)}>Oylik</span>
          <div className={`pt-sw${yr?" yr":" mo"}`} onClick={() => setYr(v => !v)}>
            <div className="pt-knob"/>
          </div>
          <span className={`pt-lbl${yr?" on":""}`} onClick={() => setYr(true)}>Yillik</span>
          {yr && <span className="save-tag">−25%</span>}
        </div>
        <div className="plans">
          {PLANS.map((plan, i) => (
            <div key={i} className={`plan${plan.pop?" pop":""}`}>
              {plan.pop && <div className="plan-badge">Mashhur</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{priceDisp(plan.mo)}</div>
              <div className="plan-per">{yr?"/ yil":"/ oy"}</div>
              <div className="plan-div"/>
              <div className="plan-feats">
                {plan.feats.map((f,j) => (
                  <div key={j} className={`pf${f.y?" y":""}`}>
                    {f.y ? <ChkI/> : <XcI/>}
                    <span>{f.t}</span>
                  </div>
                ))}
              </div>
              <button className="plan-btn">{plan.pop?"Hozir Boshlash":"Tanlash"}</button>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="faq">
        <div className="faq-wrap">
          <div>
            <div className="faq-eye">Savollar</div>
            <h2 className="faq-title">Ko'p so'raladigan savollar</h2>
            <p className="faq-note">
              Javob topa olmadingizmi?<br/>
              <a href="tel:+998971234567">+998 97 123 45 67</a>
            </p>
          </div>
          <div className="faq-list">
            {FAQS.map((f,i) => (
              <div key={i} className={`fi${fopen===i?" open":""}`}>
                <button className="fi-q" onClick={() => setFopen(fopen===i?null:i)}>
                  <span className="fi-qt">{f.q}</span>
                  <div className="fi-ic"><PlusI/></div>
                </button>
                <div className="fi-a"><p className="fi-at">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}