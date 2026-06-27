// ── SAMPLES ──
const S = {
  vars: `# বিভিন্ন ধরনের ভেরিয়েবল
name = "রাহেলা"
age = 10
height = 4.5
passed = True
city = "ঢাকা"
grade = None

print("নাম:", name)
print("বয়স:", age)
print("উচ্চতা:", height)
print("পাস:", passed)`,

  list: `# লিস্ট (অ্যারে)
fruits = ["আম", "কলা", "লিচু", "জাম", "পেয়ারা"]
marks = [90, 85, 92, 78, 95]

print("প্রথম ফল:", fruits[0])
print("শেষ নম্বর:", marks[4])
print("মোট নম্বর:", sum(marks))`,

  dict: `# ডিকশনারি
student = {
    "name": "সিফো",
    "age": 12,
    "class": 7,
    "score": 95.5
}
print("নাম:", student["name"])
print("বয়স:", student["age"])
print("স্কোর:", student["score"])`,

  func: `# ফাংশন
def add(a, b):
    result = a + b
    return result

def greet(name):
    return name

x = add(5, 3)
msg = greet("তানভীর")
print("যোগফল:", x)
print(msg)`,

  for: `# for লুপ
numbers = [1, 2, 3, 4, 5]
total = 0

for n in numbers:
    total = total + n
    print("যোগ হচ্ছে:", n, "→ মোট:", total)

print("চূড়ান্ত যোগফল:", total)`,

  while: `# while লুপ
count = 1
while count <= 5:
    print("গণনা:", count)
    count = count + 1

print("শেষ হয়েছে!")`,

  if: `# if / elif / else
score = 85

if score >= 90:
    grade = "A+"
    print("চমৎকার!")
elif score >= 80:
    grade = "A"
    print("খুব ভালো!")
elif score >= 70:
    grade = "B"
    print("ভালো!")
else:
    grade = "C"
    print("আরো পড়তে হবে!")

print("গ্রেড:", grade)

taka = 500
day ="Friday"

if (taka == 500) and (day == "Friday"):
    print("টাকা দান করো।")
else:
    print("টাকা দান করতে হবে না।")`,

  cls: `# ক্লাস
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.marks = []

    def add_mark(self, mark):
        self.marks.append(mark)

    def average(self):
        return sum(self.marks) / len(self.marks)

s = Student("নাহিদ", 11)
s.add_mark(90)
s.add_mark(85)
s.add_mark(92)
print("নাম:", s.name)
print("গড়:", s.average())`
};

function ls(k) { document.getElementById('code').value = S[k]; edit(); }

// ── SET DEFAULT CODE WITH 4-SPACE INDENT ──
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('code').value = S.vars;
  edit();
});

// ── EDITOR ──
function edit() { updateLN(); hl(); TRACE = []; stepIdx = -1; updateStepBar(); }

function updateLN() {
  const ta = document.getElementById('code');
  const n = ta.value.split('\n').length;
  document.getElementById('lnums').textContent = Array.from({length: n}, (_, i) => i + 1).join('\n');
}
function ss() {
  const ta = document.getElementById('code'), h = document.getElementById('hl');
  h.scrollTop = ta.scrollTop; h.scrollLeft = ta.scrollLeft;
  document.getElementById('lnums').scrollTop = ta.scrollTop;
}
function kd(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + '    ' + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 4; edit();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
}

// ── SYNTAX HIGHLIGHT ──
function he(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const KW_SET = new Set(['def','class','return','if','elif','else','for','while','in','not','and','or','is','import','from','as','pass','break','continue','lambda','with','try','except','finally','raise','del','global','yield','assert']);
const BI_SET = new Set(['print','len','range','sum','min','max','int','float','str','bool','list','dict','tuple','set','input','type','abs','round','sorted','enumerate','zip','map','filter','append','open','isinstance','self']);
const BO_SET = new Set(['True','False','None']);

function hl() {
  const raw = document.getElementById('code').value;
  const lines = raw.split('\n');
  const out = lines.map(line => {
    if (!line) return '';
    let code = line, com = '';
    let inq = false, qc = '', ci = -1;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if ((c === '"' || c === "'") && !inq) { inq = true; qc = c; continue; }
      if (inq && c === qc) { inq = false; continue; }
      if (!inq && c === '#') { ci = i; break; }
    }
    if (ci >= 0) { code = line.slice(0, ci); com = line.slice(ci); }
    let r = ''; let inStr = false; let sc = ''; let buf = '';
    for (let i = 0; i <= code.length; i++) {
      const c = code[i] || '';
      if (!inStr && (c === '"' || c === "'")) { r += applyNonStr(buf); buf = ''; inStr = true; sc = c; buf += c; continue; }
      if (inStr) { buf += c; if (c === sc) { r += `<span class="tk-st">${he(buf)}</span>`; buf = ''; inStr = false; sc = ''; } continue; }
      buf += c;
    }
    r += applyNonStr(buf);
    if (com) r += `<span class="tk-cm">${he(com)}</span>`;
    return r;
  }).join('\n');
  document.getElementById('hl').innerHTML = out;
}
function applyNonStr(s) {
  if (!s) return '';
  let out = '', prevWord = null;
  const re = /([A-Za-z_]\w*)|(\d+\.\d+|\d+)|([^\w]+)/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) {
      const w = m[1]; let cls = null;
      if (prevWord === 'def' || prevWord === 'class') cls = 'tk-fn';
      else if (BO_SET.has(w)) cls = 'tk-bo';
      else if (KW_SET.has(w)) cls = 'tk-kw';
      else if (BI_SET.has(w)) cls = 'tk-bi';
      out += cls ? `<span class="${cls}">${he(w)}</span>` : he(w);
      prevWord = w;
    } else if (m[2] !== undefined) {
      out += `<span class="tk-nm">${he(m[2])}</span>`; prevWord = null;
    } else {
      out += he(m[3]); if (/\S/.test(m[3])) prevWord = null;
    }
  }
  return out;
}
edit();

// ── STATUS ──
function setSt(c, t) { document.getElementById('dot').className = 'dot ' + c; document.getElementById('stxt').textContent = t; }

// ── STEP NAVIGATOR ──
const LINEH = 23.22, PADTOP = 14;
let TRACE = [], stepIdx = -1;
function setLineHighlight(num) {
  const el = document.getElementById('linehl');
  if (num == null) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.style.top = (PADTOP + (num - 1) * LINEH) + 'px';
}
function updateStepBar() {
  const bar = document.getElementById('stepbar');
  if (!TRACE.length) { bar.style.display = 'none'; setLineHighlight(null); return; }
  bar.style.display = 'flex';
  document.getElementById('stepinfo').textContent = `ধাপ ${stepIdx + 1}/${TRACE.length}`;
  document.getElementById('stepdesc').textContent = TRACE[stepIdx] ? TRACE[stepIdx].label : '';
  document.getElementById('prevBtn').disabled = stepIdx <= 0;
  document.getElementById('nextBtn').disabled = stepIdx >= TRACE.length - 1;
  setLineHighlight(TRACE[stepIdx] ? TRACE[stepIdx].num : null);
}
function stepPrev() { if (stepIdx > 0) { stepIdx--; updateStepBar(); } }
function stepNext() { if (stepIdx < TRACE.length - 1) { stepIdx++; updateStepBar(); } }

// ─────────────────────────────────────────────────────────────────────────────
// INTERPRETER — full rewrite to fix dict, class, OOP, if/elif/else
// ─────────────────────────────────────────────────────────────────────────────
function run() {
  const code = document.getElementById('code').value;
  const rbtn = document.getElementById('rbtn');
  rbtn.textContent = '▶   চালাও';
  setSt('run', 'চলছে...');
  document.getElementById('vb').innerHTML = `<div class="vempty"><div class="wave"><div class="wd"></div><div class="wd"></div><div class="wd"></div></div><div class="vet" style="color:var(--muted)">বিশ্লেষণ হচ্ছে...</div></div>`;

  // Use setTimeout so the UI actually updates before we block
  setTimeout(() => {
    try {
      const result = interpret(code);
      renderOut(result.prints, null);
      renderViz(result);
      TRACE = result.trace || [];
      stepIdx = TRACE.length ? TRACE.length - 1 : -1;
      updateStepBar();
      setSt('ok', 'সম্পন্ন ✓');
    } catch (e) {
      TRACE = []; stepIdx = -1; updateStepBar();
      renderOut([], e.message || String(e));
      document.getElementById('vb').innerHTML = `<div class="vempty"><div class="vei">⚠️</div><div class="vet" style="color:var(--pink)">${he(e.message || String(e))}</div></div>`;
      setSt('err', 'ত্রুটি');
    }
    // ALWAYS restore button — no matter what
    rbtn.textContent = '▶  চালাও';
  }, 60);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKENIZER / PARSER HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getIndent(raw) { return raw.match(/^(\s*)/)[1].length; }

// Parse argument list respecting nested parens/brackets/quotes
function splitArgs(s) {
  if (!s || !s.trim()) return [];
  const args = []; let cur = '', d = 0, inq = false, qc = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!inq && (c === '"' || c === "'")) { inq = true; qc = c; cur += c; continue; }
    if (inq && c === qc) { inq = false; cur += c; continue; }
    if (inq) { cur += c; continue; }
    if ('([{'.includes(c)) d++;
    if (')]}'.includes(c)) d--;
    if (c === ',' && d === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

// Extract block by indentation
function getBlock(lns, startI, baseIndent) {
  const block = []; let i = startI;
  while (i < lns.length) {
    const raw = lns[i].raw; const t = raw.trim();
    if (!t || t.startsWith('#')) { block.push(lns[i]); i++; continue; }
    const ind = getIndent(raw);
    if (ind <= baseIndent) break;
    block.push(lns[i]); i++;
  }
  return { block, next: i };
}

function pyStr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (Array.isArray(v)) return '[' + v.map(pyStr).join(', ') + ']';
  if (typeof v === 'object' && v.__type === 'dict') {
    const pairs = Object.entries(v.__data).map(([k, vv]) => `${k}: ${pyStr(vv)}`).join(', ');
    return '{' + pairs + '}';
  }
  if (typeof v === 'object' && v.__type === 'instance') return `<${v.__class}:instance>`;
  return String(v);
}

// ─────────────────────────────────────────────────────────────────────────────
// EVAL EXPRESSION — handles dict literals, class constructors, method calls
// ─────────────────────────────────────────────────────────────────────────────
function evalExpr(expr, env) {
  const e = (expr || '').trim();
  if (!e) return undefined;

  // Literals
  if (e === 'True') return true;
  if (e === 'False') return false;
  if (e === 'None') return null;

  // String literal (single or double quoted)
  if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) {
    return e.slice(1, -1);
  }

  // Number
  if (/^-?\d+$/.test(e)) return parseInt(e);
  if (/^-?\d*\.\d+$/.test(e)) return parseFloat(e);

  // List literal
  if (e.startsWith('[') && e.endsWith(']')) return parseListLit(e, env);

  // Dict literal
  if (e.startsWith('{') && e.endsWith('}')) return parseDictLit(e, env);

  // Dict/list subscript: obj["key"] or arr[0]
  const subMatch = e.match(/^(.+)\[(.+)\]$/);
  if (subMatch) {
    const obj = evalExpr(subMatch[1].trim(), env);
    const key = evalExpr(subMatch[2].trim(), env);
    if (obj && obj.__type === 'dict') return obj.__data[key] ?? null;
    if (Array.isArray(obj)) {
      const idx = typeof key === 'number' ? (key < 0 ? obj.length + key : key) : parseInt(key);
      return obj[idx] ?? null;
    }
    if (typeof obj === 'string') return obj[key] ?? null;
    return null;
  }

  // Attribute access: obj.attr
  const dotMatch = e.match(/^(\w+)\.(\w+)$/);
  if (dotMatch) {
    const obj = env[dotMatch[1]];
    if (obj && obj.__type === 'instance') return obj.__attrs[dotMatch[2]] ?? null;
    if (obj && typeof obj === 'object' && obj.__type === 'dict') return obj.__data[dotMatch[2]] ?? null;
    return null;
  }

  // Method call: obj.method(args) or func(args)
  const callMatch = e.match(/^([\w.]+)\s*\(([^]*)\)$/);
  if (callMatch) {
    const callee = callMatch[1].trim();
    const argsStr = callMatch[2];
    const args = splitArgs(argsStr).map(a => evalExpr(a, env));

    // Method call on object
    if (callee.includes('.')) {
      const [objName, methodName] = callee.split('.');
      const obj = env[objName];
      // Built-in list methods
      if (Array.isArray(obj)) {
        if (methodName === 'append') { obj.push(args[0]); return null; }
        if (methodName === 'pop') { return obj.pop(); }
        if (methodName === 'remove') { const idx = obj.indexOf(args[0]); if (idx >= 0) obj.splice(idx, 1); return null; }
        if (methodName === 'sort') { obj.sort((a, b) => a - b); return null; }
        if (methodName === 'reverse') { obj.reverse(); return null; }
        if (methodName === 'index') return obj.indexOf(args[0]);
        if (methodName === 'count') return obj.filter(x => x === args[0]).length;
      }
      // Instance method call
      if (obj && obj.__type === 'instance') {
        const cls = env[obj.__class];
        if (cls && cls.__type === 'class') {
          const method = cls.__methods[methodName];
          if (method) {
            return callMethod(method, obj, args, env);
          }
        }
      }
      return null;
    }

    // Built-in functions
    if (callee === 'len') {
      if (Array.isArray(args[0])) return args[0].length;
      if (typeof args[0] === 'string') return args[0].length;
      if (args[0] && args[0].__type === 'dict') return Object.keys(args[0].__data).length;
      return 0;
    }
    if (callee === 'sum') {
      if (Array.isArray(args[0])) return args[0].reduce((a, b) => a + (Number(b) || 0), 0);
      return 0;
    }
    if (callee === 'range') {
      const start = args[1] !== undefined ? args[0] : 0;
      const end = args[1] !== undefined ? args[1] : args[0];
      const step = args[2] !== undefined ? args[2] : 1;
      const r = [];
      for (let i = start; i < end; i += step) r.push(i);
      return r;
    }
    if (callee === 'str') return String(args[0] ?? '');
    if (callee === 'int') return Math.trunc(Number(args[0]) || 0);
    if (callee === 'float') return Number(args[0]) || 0;
    if (callee === 'abs') return Math.abs(args[0]);
    if (callee === 'round') return Math.round(args[0]);
    if (callee === 'min') return Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args);
    if (callee === 'max') return Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args);
    if (callee === 'list') return Array.isArray(args[0]) ? [...args[0]] : [];
    if (callee === 'print') { /* handled in execLines */ return null; }

    // User-defined function or class constructor
    const fn = env[callee];
    if (fn) {
      if (fn.__type === 'class') return createInstance(fn, callee, args, env);
      if (fn.__type === 'function') return callFn(fn, args, env);
    }
    return null;
  }

  // Simple variable lookup
  if (/^[a-zA-Z_]\w*$/.test(e)) return env[e] ?? null;

  // Arithmetic / comparison with safe eval
  try {
    let js = e;
    js = js.replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false').replace(/\bNone\b/g,'null');
    // Replace known variables (safe subset)
    js = js.replace(/\b([a-zA-Z_]\w*)\b/g, (m) => {
      if (env[m] !== undefined) {
        const v = env[m];
        if (typeof v === 'string') return JSON.stringify(v);
        if (typeof v === 'number' || typeof v === 'boolean' || v === null) return JSON.stringify(v);
        return m;
      }
      return m;
    });
    // Allow only safe characters
    if (/[^0-9+\-*\/%().,<>=!&| "'\[\]true false null]/.test(js) === false) {
      return Function('"use strict"; return (' + js + ')')();
    }
    return Function('"use strict"; return (' + js + ')')();
  } catch (_) { return null; }
}

function evalBool(expr, env) {
  // Handle compound conditions: and, or, not
  const e = expr.trim();
  // not
  const notM = e.match(/^not\s+(.+)$/);
  if (notM) return !evalBool(notM[1], env);
  // and / or (simple split — no nested parens for now)
  if (e.includes(' and ')) {
    return e.split(' and ').every(p => evalBool(p.trim(), env));
  }
  if (e.includes(' or ')) {
    return e.split(' or ').some(p => evalBool(p.trim(), env));
  }
  const v = evalExpr(e, env);
  if (v === null || v === undefined || v === false || v === 0 || v === '') return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// DICT / LIST LITERAL PARSERS
// ─────────────────────────────────────────────────────────────────────────────
function parseListLit(expr, env) {
  const inner = expr.slice(1, -1).trim();
  if (!inner) return [];
  return splitArgs(inner).map(it => evalExpr(it, env));
}

function parseDictLit(expr, env) {
  const inner = expr.slice(1, -1).trim();
  const data = {};
  if (inner) {
    splitArgs(inner).forEach(item => {
      // Find ':' not inside quotes
      let ci = -1, inq = false, qc = '';
      for (let i = 0; i < item.length; i++) {
        const c = item[i];
        if (!inq && (c === '"' || c === "'")) { inq = true; qc = c; continue; }
        if (inq && c === qc) { inq = false; continue; }
        if (!inq && c === ':') { ci = i; break; }
      }
      if (ci < 0) return;
      const k = evalExpr(item.slice(0, ci).trim(), env);
      const v = evalExpr(item.slice(ci + 1).trim(), env);
      data[String(k)] = v;
    });
  }
  return { __type: 'dict', __data: data };
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASS / INSTANCE / METHOD HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function createInstance(cls, className, args, env) {
  const inst = { __type: 'instance', __class: className, __attrs: {} };
  // Call __init__ if it exists
  const initMethod = cls.__methods['__init__'];
  if (initMethod) callMethod(initMethod, inst, args, env);
  return inst;
}

function callMethod(method, inst, args, env) {
  const localEnv = { ...env, self: inst };
  // bind params (skip self)
  method.params.slice(1).forEach((p, i) => { localEnv[p] = args[i]; });
  let retVal = null;
  execBlock(method.body, localEnv);
  // Copy self.__attrs back to instance
  if (localEnv.self && localEnv.self.__attrs) {
    inst.__attrs = localEnv.self.__attrs;
  }
  return localEnv.__return__;
}

function callFn(fn, args, env) {
  const localEnv = { ...env };
  fn.params.forEach((p, i) => { localEnv[p] = args[i]; });
  execBlock(fn.body, localEnv);
  return localEnv.__return__;
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK EXECUTOR — handles assignment to self.x properly
// ─────────────────────────────────────────────────────────────────────────────
function execBlock(lns, env) {
  let j = 0;
  while (j < lns.length) {
    const lo = lns[j]; const raw = lo.raw; const s = raw.trim();
    if (!s || s.startsWith('#')) { j++; continue; }
    const ind = getIndent(raw);

    // return statement
    const retM = s.match(/^return\s*(.*)$/);
    if (retM) {
      env.__return__ = retM[1] ? evalExpr(retM[1], env) : null;
      return; // stop this block
    }

    // FOR
    const fm = s.match(/^for\s+(\w+)\s+in\s+(.+)\s*:$/);
    if (fm) {
      const { block, next } = getBlock(lns, j + 1, ind); j = next;
      const items = resolveIterable(fm[2].trim(), env);
      items.forEach(item => { env[fm[1]] = item; execBlock(block, env); });
      continue;
    }

    // WHILE
    const wm = s.match(/^while\s+(.+)\s*:$/);
    if (wm) {
      const { block, next } = getBlock(lns, j + 1, ind); j = next;
      for (let wi = 0; wi < 2000; wi++) { if (!evalBool(wm[1], env)) break; execBlock(block, env); }
      continue;
    }

    // IF / ELIF / ELSE
    if (s.match(/^if\s+.+:$/) || s.match(/^elif\s+.+:$/) || s.match(/^else\s*:$/)) {
      // collect all branches at this indent level
      let branches = [];
      let k = j;
      while (k < lns.length) {
        const rs = lns[k].raw.trim();
        if (!rs || rs.startsWith('#')) { k++; continue; }
        const ri = getIndent(lns[k].raw);
        if (ri < ind) break;
        if (ri > ind) { k++; continue; } // inside a block, skip
        const ifM = rs.match(/^if\s+(.+):$/);
        const elifM = rs.match(/^elif\s+(.+):$/);
        const elseM = rs.match(/^else\s*:$/);
        if (ifM && branches.length === 0) {
          const { block, next } = getBlock(lns, k + 1, ri);
          branches.push({ kw: 'if', cond: ifM[1], block }); k = next;
        } else if (elifM && branches.length > 0) {
          const { block, next } = getBlock(lns, k + 1, ri);
          branches.push({ kw: 'elif', cond: elifM[1], block }); k = next;
        } else if (elseM && branches.length > 0) {
          const { block, next } = getBlock(lns, k + 1, ri);
          branches.push({ kw: 'else', cond: null, block }); k = next;
        } else break;
      }
      j = k;
      // Execute the first matching branch
      for (const br of branches) {
        const cond = br.kw === 'else' ? true : evalBool(br.cond, env);
        if (cond) { execBlock(br.block, env); break; }
      }
      continue;
    }

    // DEF (inside class or func)
    const dm = s.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:$/);
    if (dm) {
      const { block, next } = getBlock(lns, j + 1, ind); j = next;
      const params = dm[2].split(',').map(p => p.trim()).filter(Boolean);
      env[dm[1]] = { __type: 'function', name: dm[1], params, body: block };
      continue;
    }

    // Assignment to self.attr
    const selfM = s.match(/^self\.(\w+)\s*([+\-*\/]?=)\s*(.+)$/);
    if (selfM && env.self) {
      let val = evalExpr(selfM[3], env);
      if (selfM[2] !== '=') {
        const cur = env.self.__attrs[selfM[1]] ?? 0;
        if (selfM[2] === '+=') val = cur + val;
        else if (selfM[2] === '-=') val = cur - val;
        else if (selfM[2] === '*=') val = cur * val;
        else if (selfM[2] === '/=') val = cur / val;
      }
      env.self.__attrs[selfM[1]] = val;
      j++; continue;
    }

    // Method call on self: self.method(args)
    const selfCall = s.match(/^self\.(\w+)\s*\(([^)]*)\)$/);
    if (selfCall && env.self) {
      const inst = env.self;
      const cls = env[inst.__class] || Object.values(env).find(v => v && v.__type === 'class' && v.__name === inst.__class);
      if (cls && cls.__methods && cls.__methods[selfCall[1]]) {
        const args = splitArgs(selfCall[2]).map(a => evalExpr(a, env));
        callMethod(cls.__methods[selfCall[1]], inst, args, env);
      }
      j++; continue;
    }

    // obj.method(args)
    const mCall = s.match(/^(\w+)\.(\w+)\s*\(([^)]*)\)$/);
    if (mCall) {
      evalExpr(s, env); // handles instance method calls via evalExpr
      j++; continue;
    }

    // Variable assignment (simple or augmented)
    const am = s.match(/^([a-zA-Z_]\w*(?:\[.+\])?)\s*([+\-*\/]?=)\s*(.+)$/);
    if (am && !s.startsWith('=') && !s.includes('==')) {
      const lhs = am[1], op = am[2], rhs = am[3];
      // Subscript assignment: arr[i] = val
      const subLhs = lhs.match(/^(\w+)\[(.+)\]$/);
      if (subLhs) {
        const arrName = subLhs[1], idx = evalExpr(subLhs[2], env);
        let val = evalExpr(rhs, env);
        if (op !== '=') {
          const cur = Array.isArray(env[arrName]) ? env[arrName][idx] : 0;
          if (op === '+=') val = cur + val;
          else if (op === '-=') val = cur - val;
          else if (op === '*=') val = cur * val;
          else if (op === '/=') val = cur / val;
        }
        if (Array.isArray(env[arrName])) env[arrName][idx] = val;
        else if (env[arrName] && env[arrName].__type === 'dict') env[arrName].__data[idx] = val;
        j++; continue;
      }
      let val = evalExpr(rhs, env);
      if (op !== '=') {
        const cur = env[lhs] ?? 0;
        if (op === '+=') val = (typeof cur === 'string' ? cur : (cur || 0)) + val;
        else if (op === '-=') val = (cur || 0) - val;
        else if (op === '*=') val = (cur || 0) * val;
        else if (op === '/=') val = val ? (cur || 0) / val : 0;
      }
      env[lhs] = val;
      j++; continue;
    }

    // print(...)
    // handled in main interpret below
    j++;
  }
}

function resolveIterable(expr, env) {
  const v = evalExpr(expr, env);
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INTERPRETER
// ─────────────────────────────────────────────────────────────────────────────
function interpret(src) {
  const linesRaw = src.split('\n');
  const lns = linesRaw.map((raw, i) => ({ raw, num: i + 1 }));

  const env = {};
  const prints = [], vars = [], lists = [], dicts = [];
  const funcs = [], calls = [], forLoops = [], whileLoops = [];
  const conditions = [], classes = [], instances = [];
  const traceArr = [];

  function pushTrace(num, label) { traceArr.push({ num, label }); }

  function execMain(lns2) {
    let j = 0;
    while (j < lns2.length) {
      const lo = lns2[j]; const raw = lo.raw; const s = raw.trim();
      if (!s || s.startsWith('#')) { j++; continue; }
      const ind = getIndent(raw);

      // CLASS definition
      const cm2 = s.match(/^class\s+(\w+)\s*(?:\([^)]*\))?\s*:$/);
      if (cm2) {
        const cname = cm2[1];
        const { block, next } = getBlock(lns2, j + 1, ind); j = next;
        const methods = {}, attrs = [], methodNames = [];
        // Parse methods inside class
        let bi = 0;
        while (bi < block.length) {
          const bs = block[bi].raw.trim();
          if (!bs || bs.startsWith('#')) { bi++; continue; }
          const mInd = getIndent(block[bi].raw);
          const mm = bs.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:$/);
          if (mm) {
            const { block: mb, next: mn } = getBlock(block, bi + 1, mInd); bi = mn;
            const params = mm[2].split(',').map(p => p.trim()).filter(Boolean);
            methods[mm[1]] = { __type: 'function', name: mm[1], params, body: mb };
            methodNames.push(mm[1]);
            // Extract self.attr from body
            mb.forEach(bl => {
              const sa = bl.raw.trim().match(/^self\.(\w+)\s*=/);
              if (sa && !attrs.includes(sa[1])) attrs.push(sa[1]);
            });
          } else bi++;
        }
        env[cname] = { __type: 'class', __name: cname, __methods: methods, __attrs: attrs, __methodNames: methodNames };
        pushTrace(lo.num, `ক্লাস সংজ্ঞায়িত হলো: ${cname}`);
        classes.push({ name: cname, attrs, methods: methodNames });
        continue;
      }

      // DEF
      const dm = s.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:$/);
      if (dm) {
        const { block, next } = getBlock(lns2, j + 1, ind); j = next;
        const params = dm[2].split(',').map(p => p.trim()).filter(Boolean);
        const bodyLines = block.map(b => b.raw.trim()).filter(l => l && !l.startsWith('#'));
        env[dm[1]] = { __type: 'function', name: dm[1], params, body: block };
        pushTrace(lo.num, `ফাংশন সংজ্ঞায়িত হলো: ${dm[1]}(${params.join(', ')})`);
        funcs.push({ name: dm[1], params, body: bodyLines.slice(0, 4), retval: bodyLines.find(l => l.startsWith('return'))?.replace('return ', '') || '' });
        continue;
      }

      // FOR
      const fm = s.match(/^for\s+(\w+)\s+in\s+(.+)\s*:$/);
      if (fm) {
        const ivar = fm[1], iterExpr = fm[2].trim();
        const { block, next } = getBlock(lns2, j + 1, ind); j = next;
        const items = resolveIterable(iterExpr, env);
        const iterations = [];
        pushTrace(lo.num, `for ${ivar} in ${iterExpr} শুরু (${items.length} বার)`);
        items.forEach((item, idx) => {
          env[ivar] = item;
          pushTrace(lo.num, `লুপ ধাপ ${idx + 1}: ${ivar} = ${pyStr(item)}`);
          execMainBlock(block);
          iterations.push({ index: idx, val: item, snap: { ...env } });
        });
        forLoops.push({ ivar, iterExpr, items, iterations });
        continue;
      }

      // WHILE
      const wm = s.match(/^while\s+(.+)\s*:$/);
      if (wm) {
        const { block, next } = getBlock(lns2, j + 1, ind); j = next;
        const iters = [];
        pushTrace(lo.num, `while ${wm[1]} শুরু`);
        for (let wi = 0; wi < 2000; wi++) {
          if (!evalBool(wm[1], env)) break;
          pushTrace(lo.num, `while ধাপ ${wi + 1}: শর্ত সত্য`);
          execMainBlock(block);
          iters.push({ num: wi + 1, snap: { ...env } });
        }
        whileLoops.push({ cond: wm[1], iterations: iters });
        continue;
      }

      // IF / ELIF / ELSE chains
      if (s.match(/^if\s+.+:$/) || s.match(/^elif\s+.+:$/) || s.match(/^else\s*:$/)) {
        let branches = [];
        let k = j;
        while (k < lns2.length) {
          const rs = lns2[k].raw.trim();
          if (!rs || rs.startsWith('#')) { k++; continue; }
          const ri = getIndent(lns2[k].raw);
          if (ri < ind) break;
          if (ri > ind) { k++; continue; }
          const ifM = rs.match(/^if\s+(.+):$/);
          const elifM = rs.match(/^elif\s+(.+):$/);
          const elseM = rs.match(/^else\s*:$/);
          if (ifM && branches.length === 0) {
            const { block, next } = getBlock(lns2, k + 1, ri);
            branches.push({ kw: 'if', cond: ifM[1], block }); k = next;
          } else if (elifM && branches.length > 0) {
            const { block, next } = getBlock(lns2, k + 1, ri);
            branches.push({ kw: 'elif', cond: elifM[1], block }); k = next;
          } else if (elseM && branches.length > 0) {
            const { block, next } = getBlock(lns2, k + 1, ri);
            branches.push({ kw: 'else', cond: null, block }); k = next;
          } else break;
        }
        j = k;
        // Evaluate and track all branches for visualization
        const vizBranches = [];
        let executed = false;
        for (const br of branches) {
          const cond = br.kw === 'else' ? !executed : evalBool(br.cond, env);
          const result = br.kw === 'else' ? !executed : evalBool(br.cond, env);
          vizBranches.push({ kw: br.kw, cond: br.cond || '', result, body: br.block.map(b => b.raw.trim()).filter(Boolean) });
          if (result && !executed) {
            pushTrace(lo.num, `${br.kw} ${br.cond || ''} → সত্য`);
            execMainBlock(br.block);
            executed = true;
          } else if (!result && !executed) {
            pushTrace(lo.num, `${br.kw} ${br.cond || ''} → মিথ্যা`);
          }
        }
        conditions.push({ branches: vizBranches });
        continue;
      }

      // PRINT
      const pm = s.match(/^print\s*\((.*)?\)\s*$/);
      if (pm) {
        const argStr = pm[1] || '';
        const args = splitArgs(argStr);
        const vals = args.map(a => {
          const v = evalExpr(a, env);
          return pyStr(v);
        });
        const out = vals.join(' ');
        prints.push(out);
        pushTrace(lo.num, `print → ${out}`);
        j++; continue;
      }

      // Method call: obj.method(args)
      const mCall = s.match(/^(\w+)\.(\w+)\s*\(([^)]*)\)$/);
      if (mCall) {
        const [, objName, methodName, argsStr] = mCall;
        const obj = env[objName];
        if (obj && obj.__type === 'instance') {
          const cls = env[obj.__class];
          if (cls && cls.__methods && cls.__methods[methodName]) {
            const args = splitArgs(argsStr).map(a => evalExpr(a, env));
            pushTrace(lo.num, `${objName}.${methodName}(${argsStr}) কল`);
            callMethod(cls.__methods[methodName], obj, args, env);
          }
        }
        j++; continue;
      }

      // ASSIGNMENT
      const am = s.match(/^([a-zA-Z_]\w*(?:\[.+\])?)\s*([+\-*\/]?=)\s*(.+)$/);
      if (am && !s.startsWith('=') && !s.includes('==')) {
        const lhs = am[1], op = am[2], rhs = am[3];
        let val = evalExpr(rhs, env);
        if (op !== '=') {
          const cur = env[lhs] ?? 0;
          if (op === '+=') val = (typeof cur === 'string' ? cur : (cur || 0)) + val;
          else if (op === '-=') val = (cur || 0) - val;
          else if (op === '*=') val = (cur || 0) * val;
          else if (op === '/=') val = val ? (cur || 0) / val : 0;
        }
        env[lhs] = val;
        pushTrace(lo.num, `${lhs} ${op} ${pyStr(val)}`);
        // Track function calls for visualization
        const callM = rhs.match(/^(\w+)\s*\(([^)]*)\)$/);
        if (callM && env[callM[1]] && env[callM[1]].__type === 'function') {
          calls.push({ fn: callM[1], args: splitArgs(callM[2]), result: pyStr(val) });
        }
        j++; continue;
      }

      j++;
    }
  }

  // execMainBlock runs a sub-block sharing global env
  function execMainBlock(block) {
    execMain(block);
  }

  execMain(lns);

  // Collect variables, lists, dicts, instances for display
  Object.entries(env).forEach(([k, v]) => {
    if (k.startsWith('__')) return;
    if (v === null || v === undefined) { vars.push({ name: k, value: 'None', type: 'none' }); return; }
    if (v.__type === 'function' || v.__type === 'class') return;
    if (v.__type === 'instance') {
      instances.push({ name: k, className: v.__class, attrs: v.__attrs });
      return;
    }
    if (v.__type === 'dict') {
      dicts.push({ name: k, pairs: Object.entries(v.__data).map(([kk, vv]) => ({ key: String(kk), value: pyStr(vv) })) });
      return;
    }
    if (Array.isArray(v)) { lists.push({ name: k, items: v.map(pyStr) }); return; }
    if (typeof v === 'boolean') { vars.push({ name: k, value: String(v), type: 'bool' }); return; }
    if (typeof v === 'number') { vars.push({ name: k, value: v, type: Number.isInteger(v) ? 'int' : 'float' }); return; }
    if (typeof v === 'string') { vars.push({ name: k, value: v, type: 'str' }); return; }
  });

  return { prints, vars, lists, dicts, funcs, calls, forLoops, whileLoops, conditions, classes, instances, trace: traceArr };
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER OUTPUT
// ─────────────────────────────────────────────────────────────────────────────
function renderOut(prints, err) {
  const ob = document.getElementById('ob');
  if (err) { ob.innerHTML = `<div class="oe">${he(err)}</div>`; return; }
  if (!prints.length) { ob.innerHTML = '<span class="oempty">কোনো print() নেই</span>'; return; }
  ob.innerHTML = prints.map(p => `<div class="ol">→ ${he(p)}</div>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER VISUALIZER
// ─────────────────────────────────────────────────────────────────────────────
function sec(t) { return `<div class="sec-lbl">${t}</div>`; }

function renderViz(d) {
  let h = '';

  // VARIABLES
  const sv = d.vars;
  if (sv.length) {
    h += sec('📦 ভেরিয়েবল');
    h += '<div class="vgrid">';
    sv.forEach(v => {
      const tc = v.type === 'str' ? 'ts' : v.type === 'float' ? 'tf' : v.type === 'bool' ? 'tb' : v.type === 'none' ? 'tn' : '';
      const dv = v.type === 'str' ? '"' + he(v.value) + '"' : he(String(v.value));
      h += `<div class="vcard ${tc}"><div class="vname">${he(v.name)}</div><div class="vval">${dv}</div><div class="vtag">${he(v.type)}</div></div>`;
    });
    h += '</div>';
  }

  // LISTS
  d.lists.forEach(lst => {
    h += sec('🗂️ লিস্ট: <code style="font-size:11px">' + he(lst.name) + '</code>');
    h += `<div class="lblock"><div class="lname">${he(lst.name)} = [${lst.items.length} items]</div><div class="lcells">`;
    lst.items.forEach((it, i) => {
      const isS = isNaN(Number(it)) && it !== 'None' && it !== 'True' && it !== 'False';
      h += `<div class="lcell ${isS ? 'sc' : ''}"><div class="lidx">[${i}]</div><div class="lval">${he(String(it))}</div></div>`;
    });
    h += '</div></div>';
  });

  // DICTS
  d.dicts.forEach(dt => {
    h += sec('📖 ডিকশনারি: <code style="font-size:11px">' + he(dt.name) + '</code>');
    h += `<div class="dblock"><div class="dname">${he(dt.name)}</div><div class="dtable">`;
    dt.pairs.forEach(p => { h += `<div class="drow"><div class="dkey">${he(p.key)}</div><div class="dval">${he(p.value)}</div></div>`; });
    h += '</div></div>';
  });

  // CLASSES
  d.classes.forEach(cls => {
    h += sec('🏗️ ক্লাস: <code style="font-size:11px">' + he(cls.name) + '</code>');
    h += `<div class="clsblock"><div class="clscard">
      <div class="clstitle">class ${he(cls.name)}</div>
      ${cls.attrs.length ? `<div class="clssec">গুণাবলী<div class="chips">${cls.attrs.map(a => `<span class="chip ca">${he(a)}</span>`).join('')}</div></div>` : ''}
      ${cls.methods.length ? `<div class="clssec">মেথড<div class="chips">${cls.methods.map(m => `<span class="chip cm2">${he(m)}()</span>`).join('')}</div></div>` : ''}
    </div></div>`;
  });

  // INSTANCES
  d.instances.forEach(inst => {
    h += sec('🧩 অবজেক্ট: <code style="font-size:11px">' + he(inst.name) + '</code>');
    h += `<div class="instcard"><div class="insttitle">${he(inst.name)} = ${he(inst.className)}()</div><div class="instrow">`;
    Object.entries(inst.attrs).forEach(([k, v]) => {
      h += `<div class="instattr"><span class="iattrk">${he(k)}</span><span style="color:var(--muted)"> = </span><span class="iattrv">${he(pyStr(v))}</span></div>`;
    });
    if (!Object.keys(inst.attrs).length) h += '<span style="color:var(--muted);font-size:12px;font-family:var(--font-code)">কোনো attribute নেই</span>';
    h += '</div></div>';
  });

  // FUNCTIONS
  d.funcs.forEach(fn => {
    h += sec('🔧 ফাংশন: <code style="font-size:11px">' + he(fn.name) + '</code>');
    h += `<div class="fblock"><div class="fcard">
      <div class="ftitle">➕ ${he(fn.name)}(${fn.params.map(he).join(', ')})</div>
      <div class="fparams">${fn.params.map(p => `<span class="fparam">${he(p)}</span>`).join('')}</div>
      ${fn.body.length ? `<div class="fbody">${fn.body.slice(0, 3).map(he).join('\n')}</div>` : ''}
      ${fn.retval ? `<div class="fret"><span>🔑</span><span class="fret-t">return ${he(fn.retval)}</span></div>` : ''}
    </div></div>`;
  });

  // FUNCTION CALLS
  if (d.calls.length) {
    h += sec('📞 ফাংশন কল');
    h += '<div class="cblock">';
    d.calls.forEach(c => {
      h += `<div class="crow"><span class="cexpr">${he(c.fn)}(${c.args.map(he).join(', ')})</span><span class="carr">→</span><span class="cres">${he(c.result)}</span></div>`;
    });
    h += '</div>';
  }

  // IF/ELIF/ELSE — show ALL branches with correct true/false
  d.conditions.forEach(cg => {
    h += sec('🔀 শর্ত (if / elif / else)');
    h += '<div class="ifblock"><div class="iftree">';
    cg.branches.forEach(br => {
      let bcls = '', bbc = '';
      if (br.kw === 'if') bcls = 'bi';
      else if (br.kw === 'elif') bcls = 'bei';
      else bcls = 'bel';
      if (br.result === true) bbc = 'bt';
      else if (br.result === false) bbc = 'bf';
      const rT = br.result === true
        ? '<span class="badge bT">✓ সত্য</span>'
        : '<span class="badge bF">✗ মিথ্যা</span>';
      const condDisplay = br.kw === 'else' ? '' : he(br.cond);
      h += `<div class="ifbranch ${bbc}"><span class="badge ${bcls}">${he(br.kw)}</span><span class="ifexpr">${condDisplay}</span><span class="ifres">${rT}</span></div>`;
      if (br.result === true && br.body.length) {
        h += `<div class="ibody">${br.body.slice(0, 3).map(l => `<div class="ibodyline">▸ ${he(l)}</div>`).join('')}</div>`;
      }
    });
    h += '</div></div>';
  });

  // FOR LOOPS
  d.forLoops.forEach(lp => {
    h += sec('🔁 for লুপ');
    h += `<div class="forblock"><div class="forinfo">for <b>${he(lp.ivar)}</b> in ${he(lp.iterExpr)} — মোট ${lp.items.length} বার</div><div class="fortrack">`;
    lp.items.forEach(it => {
      h += `<div class="fstep done" title="${he(pyStr(it))}">${he(pyStr(it)).slice(0, 5)}</div>`;
    });
    h += '</div>';
    if (lp.iterations.length) {
      const last = lp.iterations[lp.iterations.length - 1];
      h += '<div class="livars">';
      Object.entries(last.snap).forEach(([k, v]) => {
        if (k.startsWith('__') || typeof v === 'object' && v && v.__type) return;
        h += `<div class="livc"><span class="lick">${he(k)}</span><span style="color:var(--muted)"> = </span><span class="licv">${he(pyStr(v))}</span></div>`;
      });
      h += '</div>';
    }
    h += '</div>';
  });

  // WHILE LOOPS
  d.whileLoops.forEach(wl => {
    h += sec('⏱ while লুপ');
    h += `<div class="wblock"><div class="wcard"><div class="wtitle">while ${he(wl.cond)}:</div><div class="witers">`;
    wl.iterations.forEach(it => {
      const vals = Object.entries(it.snap).filter(([k, v]) => !k.startsWith('__') && typeof v !== 'object').map(([k, v]) => `${k} = ${pyStr(v)}`).join(', ');
      h += `<div class="witer"><span class="winum">#${it.num}</span><span class="wivals">${he(vals)}</span></div>`;
    });
    h += '</div></div></div>';
  });

  // PRINT VISUALIZATION
  if (d.prints.length) {
    h += sec('🖨️ আউটপুট');
    h += '<div class="pblock"><div class="plines">';
    d.prints.forEach(p => { h += `<div class="pline"><span class="parr">▷</span><span class="ptxt">${he(p)}</span></div>`; });
    h += '</div></div>';
  }

  // MEMORY MAP
  const allM = [];
  d.vars.forEach(v => allM.push({ name: v.name, val: v.value, kind: v.type }));
  d.lists.forEach(l => allM.push({ name: l.name, val: `[${l.items.slice(0, 3).join(',')}]`, kind: 'list' }));
  d.dicts.forEach(dt => allM.push({ name: dt.name, val: '{...}', kind: 'dict' }));
  d.instances.forEach(inst => allM.push({ name: inst.name, val: inst.className + '()', kind: 'obj' }));
  d.funcs.forEach(f => allM.push({ name: f.name + '()', val: 'fn', kind: 'fn' }));
  d.classes.forEach(c => allM.push({ name: c.name, val: 'class', kind: 'fn' }));

  if (allM.length) {
    h += sec('🧠 মেমরি ম্যাপ');
    h += `<div class="mblock"><div class="mlegend">
      <div class="mli"><div class="mld" style="background:var(--green)"></div>int/float</div>
      <div class="mli"><div class="mld" style="background:var(--pink)"></div>str</div>
      <div class="mli"><div class="mld" style="background:var(--blue)"></div>list</div>
      <div class="mli"><div class="mld" style="background:var(--fn-color)"></div>fn/class/obj</div>
    </div><div class="mgrid">`;
    let addr = 0x100;
    allM.forEach(m => {
      const mc = m.kind === 'int' ? 'mi' : m.kind === 'float' ? 'mf' : m.kind === 'str' ? 'ms' : m.kind === 'list' || m.kind === 'dict' || m.kind === 'obj' ? 'ml2' : m.kind === 'fn' ? 'mfn' : m.kind === 'bool' ? 'mb2' : 'mi';
      h += `<div class="mcell ${mc}"><div class="maddr">0x${addr.toString(16).toUpperCase()}</div><div class="mv">${he(String(m.val))}</div><div class="mtag">${he(m.name)}</div></div>`;
      addr += 4;
    });
    for (let e = 0; e < 3; e++) {
      h += `<div class="mcell me"><div class="maddr">0x${addr.toString(16).toUpperCase()}</div><div class="mv">—</div><div class="mtag"></div></div>`;
      addr += 4;
    }
    h += '</div></div>';
  }

  if (!h) h = `<div class="vempty"><div class="vei">🤔</div><div class="vet">ভিজুয়ালাইজ করার কিছু পাওয়া গেল না।<br>ভেরিয়েবল বা print() যোগ করো!</div></div>`;
  document.getElementById('vb').innerHTML = h;
}
