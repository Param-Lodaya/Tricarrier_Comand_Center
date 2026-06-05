import { db, auth, collection, getDocs, doc, setDoc, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase.js';

let activeIdx = 0;
let cases = [];

/*
========================================
DUAL-LOGIN SYSTEM
========================================
*/
async function doLogin(){
  const val = document.getElementById('auth-input').value.trim();

  // Route 1: Recruiter / Guest Mode (Read Only)
  if(val === 'param@2006'){
    toast('GUEST ACCESS GRANTED');
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main').classList.add('visible');
    
    // Hide Admin Controls from Guests
    document.getElementById('btn-new').style.display = 'none';
    document.getElementById('btn-save').style.display = 'none';
    
    await loadDatabase();
  } 
  // Route 2: Admin Mode (Read / Write)
  else {
    const email = prompt("Admin Email required for this token:");
    if(!email) return;

    toast('AUTHENTICATING...');
    try {
      await signInWithEmailAndPassword(auth, email, val);
      // onAuthStateChanged will handle the screen transition
    } catch (e) {
      toast('INVALID ADMIN CREDENTIALS');
    }
  }
}

async function doLogout(){
  await signOut(auth);
  location.reload();
}

// Automatically detect if Admin is already logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main').classList.add('visible');
    
    // Ensure Admin controls are visible
    document.getElementById('btn-new').style.display = 'block';
    document.getElementById('btn-save').style.display = 'block';
    
    toast('ADMIN SECURE SESSION RESTORED');
    await loadDatabase();
  }
});

/*
========================================
CLOUD DATABASE SYNC
========================================
*/
async function loadDatabase(){
  toast('SYNCING CLOUD DATA...');
  try {
    const querySnapshot = await getDocs(collection(db, "cases"));
    cases = [];
    querySnapshot.forEach((doc) => {
      cases.push(doc.data());
    });

    if (cases.length === 0) {
      if(auth.currentUser) newCase(); 
    } else {
      cases.sort((a, b) => a.createdAt - b.createdAt);
      renderList();
      selectCase(0);
      updateStats();
      toast('CLOUD SYNC COMPLETE');
    }
  } catch(e) {
    console.error(e);
    toast('DATABASE READ ERROR');
  }
}

async function persistCloud(c){
  if(!auth.currentUser) {
    toast("GUEST ACCOUNTS CANNOT SAVE");
    return;
  }
  try {
    await setDoc(doc(db, "cases", c.id), c);
  } catch(e) {
    toast("SYNC ERROR");
  }
}

/*
========================================
RENDER SIDEBAR CASES
========================================
*/
function renderList(){
  const el = document.getElementById('case-list');
  const q = document.getElementById('search-box').value.toLowerCase();
  el.innerHTML='';

  cases.forEach((c,i)=>{
    if(q && !c.title.toLowerCase().includes(q)) return;
    const sev = c.severity === 'High' ? 'badge-high' : c.severity === 'Medium' ? 'badge-medium' : 'badge-low';

    el.innerHTML += `
    <div class="case-item ${i===activeIdx?'active':''}" onclick="selectCase(${i})">
      <div class="case-item-id">${c.id}</div>
      <div class="case-item-title">${c.title}</div>
      <div style="margin-top:6px;">
        <span class="badge ${sev}">${c.severity}</span>
      </div>
    </div>
    `;
  });
}

/*
========================================
SELECT & SAVE CASE
========================================
*/
function selectCase(i){
  activeIdx = i;
  const c = cases[i];
  
  document.getElementById('f-title').value = c.title;
  document.getElementById('f-tactic').value = c.mitreTactic;
  document.getElementById('f-severity').value = c.severity;
  document.getElementById('f-status').value = c.status;
  document.getElementById('f-analyst').value = c.analyst;
  document.getElementById('f-summary').value = c.summary;
  document.getElementById('f-topology').value = c.topology;
  document.getElementById('f-timeline').value = c.timeline;
  document.getElementById('f-checklist').value = c.checklist;
  document.getElementById('f-logs').value = c.logs;
  
  renderList();
}

async function saveCase(){
  const c = cases[activeIdx];
  c.title = document.getElementById('f-title').value;
  c.mitreTactic = document.getElementById('f-tactic').value;
  c.severity = document.getElementById('f-severity').value;
  c.status = document.getElementById('f-status').value;
  c.analyst = document.getElementById('f-analyst').value;
  c.summary = document.getElementById('f-summary').value;
  c.topology = document.getElementById('f-topology').value;
  c.timeline = document.getElementById('f-timeline').value;
  c.checklist = document.getElementById('f-checklist').value;
  c.logs = document.getElementById('f-logs').value;

  toast('SAVING TO CLOUD...');
  await persistCloud(c);
  renderList();
  updateStats();
  toast('CASE SAVED');
}

/*
========================================
NEW CASE
========================================
*/
async function newCase(){
  const id = 'CASE-' + Date.now().toString().slice(-5);
  const newObj = {
    id, title:'New Incident', severity:'Medium', status:'Open', analyst:'',
    mitreTactic:'', summary:'', topology:'', timeline:'', checklist:'', logs:'', createdAt:Date.now()
  };

  cases.push(newObj);
  activeIdx = cases.length - 1;
  
  toast('CREATING IN CLOUD...');
  await persistCloud(newObj);
  renderList();
  selectCase(cases.length-1);
  updateStats();
  toast('NEW CASE CREATED');
}

/*
========================================
UPDATE STATS & EXPORT
========================================
*/
function updateStats(){
  document.getElementById('s-total').textContent = cases.length;
  document.getElementById('s-open').textContent = cases.filter(c=>c.status==='Open').length;
  document.getElementById('s-resolved').textContent = cases.filter(c=>c.status==='Resolved').length;
  document.getElementById('s-high').textContent = cases.filter(c=>c.severity==='High').length;
  document.getElementById('hdr-count').textContent = cases.length;
}

function exportCase(){
  const c = cases[activeIdx];
  const md = `# ${c.title}\n## Severity\n${c.severity}\n## Status\n${c.status}\n## Analyst\n${c.analyst}\n## MITRE\n${c.mitreTactic}\n## Summary\n${c.summary}\n## Timeline\n${c.timeline}\n## Checklist\n${c.checklist}\n## Network Topology\n${c.topology}\n## Logs\n${c.logs}`;
  const blob = new Blob([md], {type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${c.id}.md`;
  a.click();
  toast('REPORT EXPORTED');
}

function toast(msg){
  const toastBox = document.getElementById('toast');
  toastBox.innerText = msg;
  toastBox.style.display = 'block';
  setTimeout(()=>{ toastBox.style.display='none'; }, 2000);
}

/*
========================================
GLOBAL BINDINGS & INIT
========================================
*/
window.doLogin = doLogin;
window.doLogout = doLogout;
window.newCase = newCase;
window.saveCase = saveCase;
window.selectCase = selectCase;
window.exportCase = exportCase;
window.renderList = renderList;

document.getElementById('auth-input').addEventListener('keydown', function(e){
  if(e.key === 'Enter') doLogin();
});

document.getElementById('main').classList.remove('visible');