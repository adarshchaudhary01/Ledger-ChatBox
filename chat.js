const entriesEl = document.getElementById('entries');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');
const countEl = document.getElementById('entryCount');

let entryNo = 0;
let posted = 0;
const history = [
  {
    role: "system",
    content: "You are Ledger, a calm, precise AI assistant who occasionally uses light bookkeeping and accounting metaphors (entries, balances, records) but always gives clear, genuinely helpful answers. Keep responses concise and well organized."
  }
];

function stamp(no){
  return no.toString().padStart(3, '0');
}

function addEntry(role, text){
  entryNo++;
  const div = document.createElement('div');
  div.className = 'entry ' + (role === 'user' ? 'user' : 'ai');
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const tagClass = role === 'user' ? 'dr' : 'cr';
  const tagText = role === 'user' ? 'DR' : 'CR';
  div.innerHTML = `
    <div class="entry-meta">
      <span class="entry-no">No. ${stamp(entryNo)}</span>
      <span class="tag ${tagClass}">${tagText}</span>
      <span>${time}</span>
    </div>
    <div class="entry-body">${escapeHtml(text)}</div>
  `;
  entriesEl.appendChild(div);
  entriesEl.scrollTop = entriesEl.scrollHeight;
  if(role !== 'user'){
    posted++;
    countEl.textContent = posted;
  }
  return div;
}

function addThinking(){
  entryNo++;
  const div = document.createElement('div');
  div.className = 'entry thinking';
  div.innerHTML = `
    <div class="entry-meta">
      <span class="entry-no">No. ${stamp(entryNo)}</span>
      <span class="tag cr">CR</span>
    </div>
    <div class="entry-body"><span class="stamp">LEDGER</span>recording<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  `;
  entriesEl.appendChild(div);
  entriesEl.scrollTop = entriesEl.scrollHeight;
  return div;
}

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

async function send(){
  const text = inputEl.value.trim();
  if(!text) return;
  inputEl.value = '';
  sendBtn.disabled = true;

  addEntry('user', text);
  history.push({ role: 'user', content: text });

  const thinkingDiv = addThinking();

  try{
    const response = await puter.ai.chat(history, { model: 'gpt-5-nano' });
    const reply = (response && response.message && response.message.content)
      ? response.message.content
      : (typeof response === 'string' ? response : String(response));

    thinkingDiv.remove();
    addEntry('assistant', reply);
    history.push({ role: 'assistant', content: reply });
  }catch(err){
    thinkingDiv.remove();
    addEntry('assistant', 'Entry could not be recorded — the account is temporarily unreachable. Please try again.');
    console.error(err);
  }finally{
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

sendBtn.addEventListener('click', send);
inputEl.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') send();
});

addEntry('assistant', "Ledger is open for the day. State your first entry — a question, a task, a figure to reckon with.");