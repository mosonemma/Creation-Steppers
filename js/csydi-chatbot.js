(function(){
"use strict";

// ---- Styles ----
var CSS = ""
+":root{--csydi-green-dark:#0F3D2E;--csydi-green:#14532D;--csydi-lime:#8CC63F;--csydi-orange:#E8871E;--csydi-black:#111311;--csydi-cream:#F6F5EF;}"
+"#csydi-launcher{position:fixed;bottom:24px;right:24px;z-index:999998;width:60px;height:60px;border-radius:50%;background:var(--csydi-green-dark);border:2px solid var(--csydi-lime);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,0.35);font-family:'Segoe UI',Arial,sans-serif;transition:transform .18s ease;}"
+"#csydi-launcher:hover{transform:scale(1.06);}"
+"#csydi-launcher svg{width:28px;height:28px;}"
+"#csydi-badge{position:absolute;top:-4px;right:-4px;background:var(--csydi-orange);color:#fff;font-size:10px;font-weight:700;line-height:1;padding:4px 5px;border-radius:10px;font-family:'Segoe UI',Arial,sans-serif;}"
+"#csydi-window{position:fixed;bottom:96px;right:24px;z-index:999999;width:360px;max-width:92vw;height:520px;max-height:78vh;background:var(--csydi-cream);border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.4);display:none;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;border:1px solid rgba(0,0,0,0.08);}"
+"#csydi-window.open{display:flex;}"
+"#csydi-header{background:linear-gradient(135deg,var(--csydi-green-dark),var(--csydi-green));color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:3px solid var(--csydi-lime);}"
+"#csydi-header .avatar{width:36px;height:36px;border-radius:50%;background:var(--csydi-lime);color:var(--csydi-green-dark);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;}"
+"#csydi-header .titles{flex:1;min-width:0;}"
+"#csydi-header .titles .name{font-weight:700;font-size:14.5px;}"
+"#csydi-header .titles .status{font-size:11.5px;color:var(--csydi-lime);display:flex;align-items:center;gap:5px;}"
+"#csydi-header .status .dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;}"
+"#csydi-close{background:transparent;border:none;color:#fff;cursor:pointer;font-size:20px;line-height:1;padding:4px 6px;opacity:.85;}"
+"#csydi-close:hover{opacity:1;}"
+"#csydi-body{flex:1;overflow-y:auto;padding:14px;background:var(--csydi-cream);display:flex;flex-direction:column;gap:10px;}"
+".csydi-msg{max-width:84%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.45;}"
+".csydi-msg.bot{background:#fff;color:var(--csydi-black);border:1px solid rgba(0,0,0,0.07);border-bottom-left-radius:4px;align-self:flex-start;}"
+".csydi-msg.bot a{color:var(--csydi-green);font-weight:600;}"
+".csydi-msg.user{background:var(--csydi-green-dark);color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}"
+"#csydi-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;background:var(--csydi-cream);}"
+".csydi-chip{background:#fff;border:1px solid var(--csydi-green);color:var(--csydi-green-dark);font-size:12px;font-weight:600;padding:6px 10px;border-radius:16px;cursor:pointer;transition:background .15s;}"
+".csydi-chip:hover{background:#eef6e6;}"
+"#csydi-inputbar{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid rgba(0,0,0,0.08);}"
+"#csydi-input{flex:1;border:1px solid #ccc;border-radius:20px;padding:9px 14px;font-size:13.5px;outline:none;}"
+"#csydi-input:focus{border-color:var(--csydi-green);}"
+"#csydi-send{background:var(--csydi-orange);border:none;color:#fff;width:38px;height:38px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}"
+"#csydi-send:hover{filter:brightness(1.05);}"
+"#csydi-footer{text-align:center;font-size:10.5px;color:#8a8a83;padding:5px 0 8px;background:#fff;}"
+"@media (max-width:480px){#csydi-window{width:94vw;right:3vw;bottom:90px;height:72vh;}}";

// ---- Markup ----
var HTML = ""
+"<div id='csydi-launcher'>"
+"<span id='csydi-badge'>1</span>"
+"<svg viewBox='0 0 24 24' fill='none' stroke='#8CC63F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>"
+"<path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'/>"
+"</svg></div>"
+"<div id='csydi-window'>"
+"<div id='csydi-header'>"
+"<div class='avatar'>AS</div>"
+"<div class='titles'><div class='name'>Akiror Seraphina (CSYDI Assistant)</div><div class='status'><span class=\"dot\"></span>Usually replies instantly</div></div>"
+"<button id='csydi-close'>&times;</button>"
+"</div>"
+"<div id='csydi-body'></div>"
+"<div id='csydi-quick'></div>"
+"<div id='csydi-inputbar'>"
+"<input id='csydi-input' type='text' placeholder='Ask about CSYDI...'>"
+"<button id='csydi-send'><svg width='16' height='16' viewBox='0 0 24 24' fill='#fff'><path d='M2 21l21-9L2 3v7l15 2-15 2z'/></svg></button>"
+"</div>"
+"<div id='csydi-footer'>Creation Steppers Youth Development Initiative</div>"
+"</div>";

// ---- Knowledge base sourced from every page of creation-steppers.netlify.app ----
var CSYDI_KB = [
  { keys:["mission","what is csydi","what does csydi do","purpose of csydi"],
    a:"CSYDI's mission is to efficiently and effectively provide, support, promote and implement community development interventions that build youth knowledge, skills and rights, so they can sustainably access resources, services and technology to improve their socioeconomic status." },
  { keys:["vision"],
    a:"Our vision: an empowered youth for change." },
  { keys:["core value","values","integrity","teamwork"],
    a:"Our core values are Integrity, Innovation, Teamwork, Empowerment and Inclusiveness." },
  { keys:["mandate","christ","ephesians","faith"],
    a:"Our mandate: \"Created for a life of good deeds through Christ Jesus\" (Ephesians 2:10)." },
  { keys:["about","who are you","who is csydi","tell me about"],
    a:"Creation Steppers Youth Development Initiative (CSYDI) is a community-based organization in Uganda building skills, creativity and empowerment among young people through art, education and social action. Read more on our <a href='https://csydi.netlify.app/about' target='_blank'>Our Story page</a>." },
  { keys:["history","started","founded","origin","journey","timeline","milestone"],
    a:"CSYDI began in 2011 as Creation Steppers Music Empire (CSME), a music/dance/drama group. In 2015 it expanded into drama and dance projects on FGM and early marriage. In 2018 it was officially registered as CSYDI. 2023 brought digital-skills projects, 2024 saw a music studio expansion, 2025 strengthened the Annual River Carnival, and 2026 launched the Annual Excursion Initiative." },
  { keys:["objective","core objective","what do you focus on"],
    a:"Our core objectives: Education & Child Rights, Health & Hygiene (incl. HIV/AIDS prevention), Girl Child Advocacy, Economic Empowerment, Environmental Protection (tree planting), and Governance & Peace (civic education, reconciliation)." },
  { keys:["program","project","training","what do you do","skills","fgm","gbv","hiv","drug","marriage","harmful practice"],
    a:"Our key program areas are <b>Girl Empowerment</b>, <b>Youth Skills Training</b> and <b>Community Advocacy</b> (FGM, HIV/AIDS, child marriage). Concretely we run: Simama! Say NO to Harmful Practices, the Annual Kanyangareng River Carnival, a Kalya FM radio talk show, and the Youth Tech & Innovation Lab. See <a href='https://creation-steppers.netlify.app/project' target='_blank'>Our Projects</a> for details." },
  { keys:["simama","amudat","student","harmful traditional"],
    a:"Simama! Say NO to Harmful Practices is CSYDI's flagship project — a student-led initiative ending child/forced marriage, FGM and GBV in Amudat District. It works through school drama clubs, leadership training, peer-to-peer education and community radio, running with support from ActionAid and the European Union." },
  { keys:["river carnival","kanyangareng","festival"],
    a:"The Annual Kanyangareng River Carnival is our flagship community celebration — arts, sports and entertainment promoting culture, unity and health/social awareness, drawing thousands of youth participants each year." },
  { keys:["kalya fm","radio"],
    a:"We partner with Kalya FM (since 2019) to run radio talk shows that spread health information and community sensitization across borders — Kalya FM even operates from within CSYDI's offices." },
  { keys:["tech lab","ict","coding","innovation lab","digital skills"],
    a:"Our Youth Tech & Innovation Lab is a digital hub teaching coding, digital literacy and innovation skills through mentorship, helping bridge the digital divide for youth." },
  { keys:["girl","girls","menstrual","female","girlh"],
    a:"Yes — we run girl-centered programs on menstrual health, FGM prevention, leadership and livelihoods, including the Mercy Corps-funded GIRLH project (Girls Improving Resilience through Livelihoods and Health, 2021–2023) among the Pokot of Amudat District." },
  { keys:["volunteer"],
    a:"You can volunteer by filling the Volunteer Application on our <a href='https://csydi.netlify.app/apply' target='_blank'>Apply Now page</a> — choose your area of interest (Youth Programs, Community Outreach, Advocacy, Events & Activities, or Other) and tell us why you'd like to join." },
  { keys:["job","career","employment","hiring","vacancy","staff position"],
    a:"For staff positions, use the Employment Application on our <a href='https://csydi.netlify.app/apply' target='_blank'>Apply Now page</a>. You'll submit your name, email, phone, the position (Program Officer, Field Coordinator, Communications Officer, Project Manager, or Other), and a shareable CV/cover letter link (Google Drive, Dropbox or WeTransfer)." },
  { keys:["apply","application","sign up","register","join"],
    a:"You can apply as staff or as a volunteer on our <a href='https://csydi.netlify.app/apply' target='_blank'>Apply Now page</a>." },
  { keys:["donate","donation","fund","give money","sponsor","how much","payment method","mobile money"],
    a:"You can donate one-time or monthly via card (Visa/Mastercard), MTN Mobile Money or Airtel Money on our <a href='https://csydi.netlify.app/donate' target='_blank'>Support Us page</a>. Suggested amounts are $10, $25, $50 or $100, or you can enter a custom amount. Donations fund Youth Education Programs, ICT Training, Community Arts & Campaigns, and Sustainability Projects." },
  { keys:["support","help out","get involved"],
    a:"You can get involved by volunteering, applying for a job, donating, or partnering with us — check <a href='https://csydi.netlify.app/apply' target='_blank'>Apply Now</a> or <a href='https://csydi.netlify.app/donate' target='_blank'>Support Us</a>." },
  { keys:["contact","phone","email","reach you","number","whatsapp"],
    a:"You can reach CSYDI at:<br>📞 0393 254 319 (also WhatsApp)<br>✉️ creationsteppersinitiative@gmail.com<br>🌐 www.csydi.org<br>Or visit our <a href='https://csydi.netlify.app/contact' target='_blank'>Contact page</a>." },
  { keys:["location","where","based","address","office","amudat","kampala"],
    a:"CSYDI's offices are in Amudat District, Uganda, with program activities across several districts (including Loroo and Abiliyep Sub-counties). Our contact page also lists a Kampala, Uganda address." },
  { keys:["team","who runs","leadership","ceo","director","founder"],
    a:"Our team: Etapukan Moses Isura (a.k.a Mozerox) — CEO; Loduk Samuel — Programs Manager; Ikoojo Michael Isura — M&E; Chepkemoi Brenda — Project Officer; Chemutai Elizabeth — Operations Officer; Akiror Seraphina — Office Assistant; Moson Emmanuel — Information & Technology. See <a href='https://creation-steppers.netlify.app/staff' target='_blank'>Our Team page</a>." },
  { keys:["staff"],
    a:"Meet the CSYDI staff on our <a href='https://csydi.netlify.app/staff' target='_blank'>Our Team page</a> — it includes our CEO, Programs Manager, M&E lead, Project Officer, Operations Officer, Office Assistant and IT lead." },
  { keys:["partner","partners","sponsor","actionaid","mercy corps","brac","taso","cecore","khh","defenders","defenddefenders"],
    a:"Our partners include: <b>Mercy Corps</b> (2021–2023, GIRLH project), <b>BRAC</b> (2019–2020, youth skilling), <b>TASO</b> (2021–2022, HIV/AIDS prevention), <b>Kalya FM</b> (2019–present, radio), <b>CECORE</b> (2021–2022, peace/Youth Peace Champions), <b>KHH</b> (2024–2025, peace, gender equality & climate resilience), <b>DefendDefenders</b> (2023–recent, digital/physical security capacity building), and <b>ActionAid with the EU</b> (2026, ongoing, Simama! project)." },
  { keys:["gallery","photo","photos","pictures","moments"],
    a:"Check out photos from our events and programs on <a href='https://csydi.netlify.app/photo' target='_blank'>Our Moments gallery</a>." },
  { keys:["policy","policies","governance","safeguarding","hr policy","finance policy","procurement","travel policy"],
    a:"Our Governance & Policies cover: Human Resource Policy (fair, inclusive practices), Finance Policy (accountability & transparency), Procurement Policy (fair, ethical sourcing), Travel Policy (cost-effective, accountable travel), and Safeguarding & Community Protection (protecting children/youth from harm, incl. eliminating FGM). Full documents are available on request — see <a href='https://creation-steppers.netlify.app/policies' target='_blank'>Governance & Policies</a>." },
  { keys:["social","facebook","instagram","tiktok","twitter","x.com","youtube","linkedin"],
    a:"Follow CSYDI on Facebook, Instagram, X, LinkedIn, TikTok and YouTube — links are in the footer of our website, or just search \"Creation Steppers\" / \"CSYDI\"." },
  { keys:["computer","digital literacy","cyber","alert program","web basics"],
    a:"Our Computer Session Alert Program teaches youth aged 16–26 digital literacy, cyber safety, online campaign strategies and web basics, closely tied to our Youth Tech & Innovation Lab. Reach out via our Contact page for the next intake." },
  { keys:["impact","how many","beneficiaries","reach","numbers","stats"],
    a:"Since 2018 CSYDI has trained 200+ youth annually, completed multiple community projects, and works with 5+ strategic partners — reaching communities across Amudat District and beyond through advocacy, skills training and radio outreach." },
  { keys:["hello","hi","hey","good morning","good afternoon"],
    a:"Hey there! 👋 Welcome to CSYDI. I can tell you about our programs, team, how to volunteer, donate, or get in touch. What would you like to know?" },
  { keys:["thank","thanks","thank you"],
    a:"You're very welcome! Feel free to ask me anything else about CSYDI. 🌱" }
];

var FALLBACK = "I don't have that exact answer yet, but our team can help directly — email creationsteppersinitiative@gmail.com, call 0393 254 319, or use the <a href='https://csydi.netlify.app/contact' target='_blank'>Contact page</a>. You can also ask me about our mission, projects, team, volunteering, donating, or applying.";
var QUICK_REPLIES = ["Our programs", "How to volunteer", "How to donate", "Contact info"];
var opened = false;

function match(text){
  var t = text.toLowerCase(), best = null, bestScore = 0;
  for (var i=0;i<CSYDI_KB.length;i++){
    var entry = CSYDI_KB[i];
    for (var j=0;j<entry.keys.length;j++){
      var k = entry.keys[j];
      if (t.indexOf(k) !== -1 && k.length > bestScore){ bestScore = k.length; best = entry; }
    }
  }
  return best ? best.a : FALLBACK;
}

function botSay(html){
  var body = document.getElementById('csydi-body');
  var div = document.createElement('div');
  div.className = 'csydi-msg bot';
  div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function userSay(text){
  var body = document.getElementById('csydi-body');
  var div = document.createElement('div');
  div.className = 'csydi-msg user';
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function respond(text){
  setTimeout(function(){ botSay(match(text)); }, 380);
}

function renderQuickReplies(){
  var box = document.getElementById('csydi-quick');
  box.innerHTML = '';
  QUICK_REPLIES.forEach(function(q){
    var chip = document.createElement('div');
    chip.className = 'csydi-chip';
    chip.textContent = q;
    chip.onclick = function(){ userSay(q); respond(q); };
    box.appendChild(chip);
  });
}

function toggle(){
  var win = document.getElementById('csydi-window');
  win.classList.toggle('open');
  if (win.classList.contains('open') && !opened){
    opened = true;
    var badge = document.getElementById('csydi-badge');
    if (badge) badge.style.display = 'none';
    botSay("Hey! 👋 I'm the CSYDI assistant. Ask me about our programs, how to volunteer, donate, or get in touch.");
    renderQuickReplies();
  }
}

function init(){
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var wrapper = document.createElement('div');
  wrapper.id = 'csydi-chatbot-root';
  wrapper.innerHTML = HTML;
  document.body.appendChild(wrapper);

  document.getElementById('csydi-launcher').addEventListener('click', toggle);
  document.getElementById('csydi-close').addEventListener('click', toggle);
  document.getElementById('csydi-send').addEventListener('click', send);
  document.getElementById('csydi-input').addEventListener('keypress', function(e){
    if (e.key === 'Enter') send();
  });
}

function send(){
  var input = document.getElementById('csydi-input');
  var text = input.value.trim();
  if (!text) return;
  userSay(text);
  input.value = '';
  respond(text);
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
