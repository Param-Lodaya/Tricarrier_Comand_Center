const TOKEN_KEY = 'sec_ops_token';

const TOKEN_VAL = 'session_active_2026';

const CASES_KEY = 'seops_cases_v3';

const PASSWORD = 'param@2006';

let activeIdx = 0;

/*
========================================
CASES DATA
========================================
*/

let cases = JSON.parse(
  localStorage.getItem(CASES_KEY)
) || [

{
  id:'CASE-01',

  title:'SSH Dictionary Attack Verification',

  severity:'High',

  status:'Investigating',

  analyst:'Param Lodaya',

  mitreTactic:'Credential Access (TA0006)',

  summary:'Wazuh detected brute-force SSH attempts.',

  topology:'Kali Linux --> Ubuntu Server',

  timeline:
`[12:01] SSH failures detected
[12:03] Wazuh alert triggered`,

  checklist:
`[✓] Logs collected
[ ] Block malicious IP`,

  logs:
`sshd failed login attempts...`,

  evidence:[],

  createdAt:Date.now()
}

];

/*
========================================
LOGIN
========================================
*/

function doLogin(){

  const val =
  document
  .getElementById('auth-input')
  .value
  .trim();

  if(val === PASSWORD){

    localStorage.setItem(
      TOKEN_KEY,
      TOKEN_VAL
    );

    boot();

    toast('ACCESS GRANTED');

  }else{

    toast('ACCESS DENIED');

  }

}

/*
========================================
LOGOUT
========================================
*/

function doLogout(){

  localStorage.removeItem(TOKEN_KEY);

  location.reload();

}

/*
========================================
BOOT APP
========================================
*/

function boot(){

  document
  .getElementById('auth-screen')
  .style.display = 'none';

  document
  .getElementById('main')
  .classList.add('visible');

  renderList();

  selectCase(0);

  updateStats();

}

/*
========================================
SAVE LOCAL STORAGE
========================================
*/

function persist(){

  localStorage.setItem(
    CASES_KEY,
    JSON.stringify(cases)
  );

}

/*
========================================
RENDER SIDEBAR CASES
========================================
*/

function renderList(){

  const el =
  document.getElementById('case-list');

  const q =
  document
  .getElementById('search-box')
  .value
  .toLowerCase();

  el.innerHTML='';

  cases.forEach((c,i)=>{

    if(
      q &&
      !c.title.toLowerCase().includes(q)
    ) return;

    const sev =
    c.severity === 'High'
    ? 'badge-high'
    : c.severity === 'Medium'
    ? 'badge-medium'
    : 'badge-low';

    el.innerHTML += `

    <div
      class="case-item ${i===activeIdx?'active':''}"
      onclick="selectCase(${i})"
    >

      <div class="case-item-id">
        ${c.id}
      </div>

      <div class="case-item-title">
        ${c.title}
      </div>

      <div style="margin-top:6px;">

        <span class="badge ${sev}">
          ${c.severity}
        </span>

      </div>

    </div>

    `;

  });

}

/*
========================================
SELECT CASE
========================================
*/

function selectCase(i){

  activeIdx = i;

  const c = cases[i];

  document.getElementById('f-title').value =
  c.title;

  document.getElementById('f-tactic').value =
  c.mitreTactic;

  document.getElementById('f-severity').value =
  c.severity;

  document.getElementById('f-status').value =
  c.status;

  document.getElementById('f-analyst').value =
  c.analyst;

  document.getElementById('f-summary').value =
  c.summary;

  document.getElementById('f-topology').value =
  c.topology;

  document.getElementById('f-timeline').value =
  c.timeline;

  document.getElementById('f-checklist').value =
  c.checklist;

  document.getElementById('f-logs').value =
  c.logs;

  renderList();

}

/*
========================================
SAVE CASE
========================================
*/

function saveCase(){

  const c = cases[activeIdx];

  c.title =
  document.getElementById('f-title').value;

  c.mitreTactic =
  document.getElementById('f-tactic').value;

  c.severity =
  document.getElementById('f-severity').value;

  c.status =
  document.getElementById('f-status').value;

  c.analyst =
  document.getElementById('f-analyst').value;

  c.summary =
  document.getElementById('f-summary').value;

  c.topology =
  document.getElementById('f-topology').value;

  c.timeline =
  document.getElementById('f-timeline').value;

  c.checklist =
  document.getElementById('f-checklist').value;

  c.logs =
  document.getElementById('f-logs').value;

  persist();

  renderList();

  updateStats();

  toast('CASE SAVED');

}

/*
========================================
NEW CASE
========================================
*/

function newCase(){

  const id =
  'CASE-' +
  Date.now().toString().slice(-5);

  cases.push({

    id,

    title:'New Incident',

    severity:'Medium',

    status:'Open',

    analyst:'',

    mitreTactic:'',

    summary:'',

    topology:'',

    timeline:'',

    checklist:'',

    logs:'',

    evidence:[],

    createdAt:Date.now()

  });

  persist();

  renderList();

  selectCase(cases.length-1);

  updateStats();

  toast('NEW CASE CREATED');

}

/*
========================================
UPDATE STATS
========================================
*/

function updateStats(){

  document.getElementById('s-total')
  .textContent = cases.length;

  document.getElementById('s-open')
  .textContent =
  cases.filter(
    c=>c.status==='Open'
  ).length;

  document.getElementById('s-resolved')
  .textContent =
  cases.filter(
    c=>c.status==='Resolved'
  ).length;

  document.getElementById('s-high')
  .textContent =
  cases.filter(
    c=>c.severity==='High'
  ).length;

  document.getElementById('hdr-count')
  .textContent = cases.length;

}

/*
========================================
EXPORT CASE
========================================
*/

function exportCase(){

  const c = cases[activeIdx];

  const md = `

# ${c.title}

## Severity
${c.severity}

## Status
${c.status}

## Analyst
${c.analyst}

## MITRE
${c.mitreTactic}

## Summary
${c.summary}

## Timeline
${c.timeline}

## Checklist
${c.checklist}

## Network Topology
${c.topology}

## Logs
${c.logs}

`;

  const blob =
  new Blob(
    [md],
    {type:'text/markdown'}
  );

  const a =
  document.createElement('a');

  a.href =
  URL.createObjectURL(blob);

  a.download =
  `${c.id}.md`;

  a.click();

  toast('REPORT EXPORTED');

}

/*
========================================
TOAST
========================================
*/

function toast(msg){

  const toastBox =
  document.getElementById('toast');

  toastBox.innerText = msg;

  toastBox.style.display = 'block';

  setTimeout(()=>{

    toastBox.style.display='none';

  },2000);

}

/*
========================================
ENTER KEY LOGIN
========================================
*/

document
.getElementById('auth-input')
.addEventListener('keydown', function(e){

  if(e.key === 'Enter'){

    doLogin();

  }

});

/*
========================================
FORCE LOGIN SCREEN
========================================
*/

document
.getElementById('main')
.classList.remove('visible');

/*
========================================
CLEAR OLD SESSION
(ONLY RUN ONCE)
========================================
*/

localStorage.removeItem(TOKEN_KEY);