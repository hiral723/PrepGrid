import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../utils/api.js';
import { DashboardLayout } from '../components/Sidebar.jsx';

const LANGUAGES = [
  { id: 63, name: 'JavaScript', key: 'javascript' },
  { id: 71, name: 'Python',     key: 'python' },
  { id: 62, name: 'Java',       key: 'java' },
  { id: 54, name: 'C++',        key: 'cpp' },
];

const JUDGE0_HOST = import.meta.env.VITE_JUDGE0_HOST;
const JUDGE0_KEY  = import.meta.env.VITE_JUDGE0_KEY;

const safeB64Encode = (str) => btoa(unescape(encodeURIComponent(str)));
const safeB64Decode = (str) => { try { return decodeURIComponent(escape(atob(str))); } catch { return atob(str); } };

const runOnJudge0 = async (code, langId, stdin = '') => {
  const body = {
    source_code: safeB64Encode(code),
    language_id: langId,
    stdin: safeB64Encode(stdin),
  };
  const resp = await fetch(
    `https://${JUDGE0_HOST}/submissions?base64_encoded=true&wait=true`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_KEY,
        'X-RapidAPI-Host': JUDGE0_HOST,
      },
      body: JSON.stringify(body),
    }
  );
  const result = await resp.json();
  return {
    stdout:          result.stdout          ? safeB64Decode(result.stdout)          : '',
    stderr:          result.stderr          ? safeB64Decode(result.stderr)          : '',
    compile_output:  result.compile_output  ? safeB64Decode(result.compile_output)  : '',
    time:            result.time,
    memory:          result.memory,
    status:          result.status?.description || 'Unknown',
    status_id:       result.status?.id,
  };
};

// Wraps bare function code so Judge0 can actually call it
const buildRunnable = (code, langKey, input) => {
  const lines = input.trim().split('\n');
  if (langKey === 'javascript') {
    return `${code}

// Auto-runner
(function() {
  const lines = ${JSON.stringify(lines)};
  const parse = s => { try { return JSON.parse(s); } catch(e) { return s; } };
  const fnMatch = \`${code.replace(/`/g,'\\`')}\`.match(/function\\s+(\\w+)\\s*\\(/);
  if (!fnMatch) { console.log('No function found'); return; }
  const fn = eval(fnMatch[1]);
  const args = lines.map(parse);
  const result = fn(...args);
  console.log(JSON.stringify(result) !== undefined ? JSON.stringify(result) : result);
})();`;
  }
  if (langKey === 'python') {
    return `${code}

# Auto-runner
import ast, re, sys
_lines = ${JSON.stringify(lines)}
_src = '''${code.replace(/'/g, "\\'")}'''
_m = re.search(r'def (\\w+)\\s*\\(', _src)
if _m:
    _fn = locals().get(_m.group(1)) or globals().get(_m.group(1))
    if _fn:
        _args = []
        for l in _lines:
            try: _args.append(ast.literal_eval(l))
            except: _args.append(l)
        print(_fn(*_args))`;
  }
  // For Java/C++ return as-is (user must write complete program)
  return code;
};

export default function CodeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [tab, setTab] = useState('description');
  const [runOutput, setRunOutput] = useState(null);
  const [running, setRunning] = useState(false);

  const { data: question, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => api.get(`/questions/${id}`).then(r => r.data),
    onSuccess: (q) => setCode(q.starterCode?.[lang.key] || '// Write your solution here\n'),
  });

  const handleLangChange = (e) => {
    const l = LANGUAGES.find(l => l.key === e.target.value);
    setLang(l);
    setCode(question?.starterCode?.[l.key] || '// Write your solution here\n');
    setRunOutput(null);
  };

  const handleRun = async () => {
    if (!code.trim()) return toast.error('Write some code first');
    if (!JUDGE0_KEY || JUDGE0_KEY === 'your_judge0_key') {
      toast.error('Judge0 API key not configured');
      return;
    }
    setRunning(true);
    setRunOutput(null);
    try {
      const tc = question?.testCases?.[0];
      const input = tc?.input || '';
      const runnable = buildRunnable(code, lang.key, input);
      const result = await runOnJudge0(runnable, lang.id, input);
      setRunOutput({ ...result, expectedOutput: tc?.expectedOutput });
    } catch (err) {
      toast.error('Code execution failed — check your Judge0 API key');
      console.error(err);
    } finally { setRunning(false); }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!code.trim()) throw new Error('Write some code first');
      const visibleTCs = question?.testCases?.slice(0, 3) || [];
      const results = [];

      for (const tc of visibleTCs) {
        const runnable = buildRunnable(code, lang.key, tc.input);
        const result = await runOnJudge0(runnable, lang.id, tc.input);
        const actual = (result.stdout || '').trim();
        const expected = (tc.expectedOutput || '').trim();
        results.push({
          input: tc.input, expected, actual,
          passed: actual === expected,
          status: result.status,
          time: result.time,
          stderr: result.stderr,
          compile_output: result.compile_output,
        });
      }

      const allPassed = results.every(r => r.passed);
      const hasError = results.some(r => r.stderr || r.compile_output);
      const verdict = allPassed ? 'Accepted'
        : hasError ? 'Runtime Error'
        : results.some(r => r.status?.includes('Time')) ? 'Time Limit Exceeded'
        : 'Wrong Answer';

      await api.post('/submissions', {
        questionId: id, code, language: lang.key, verdict,
        testCasesPassed: results.filter(r => r.passed).length,
        totalTestCases: results.length,
        runtime: results[0]?.time ? Math.round(results[0].time * 1000) : 0,
      });

      queryClient.invalidateQueries(['dashboard']);
      return { results, verdict };
    },
    onSuccess: ({ verdict }) => {
      if (verdict === 'Accepted') toast.success('Accepted! ✅');
      else toast.error(verdict);
    },
    onError: (err) => toast.error(err.message),
  });

  const outputText = (r) => r.stdout || r.stderr || r.compile_output || '(no output)';
  const isAccepted = (r) => r.status === 'Accepted' || r.status_id === 3;

  if (isLoading) return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a1a1a', marginLeft: 220, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#707070', fontSize: 14 }}>Loading problem...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a1a1a', marginLeft: 220 }}>
      {/* Left — Problem */}
      <div style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <button onClick={() => navigate('/practice')} style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#707070', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
            <ChevronLeft size={15} /> Back
          </button>
          {['description', 'hints'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textTransform: 'capitalize',
              color: tab === t ? '#f0f0f0' : '#707070',
              borderBottom: tab === t ? '2px solid #60a5fa' : '2px solid transparent',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
          {tab === 'description' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <h1 style={{ fontSize: 17, fontWeight: 600, color: '#f0f0f0', flex: 1 }}>{question?.title}</h1>
                <span className={`badge-${question?.difficulty?.toLowerCase()}`}>{question?.difficulty}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(217,119,6,0.1)', color: '#60a5fa', borderRadius: 5, padding: '2px 8px', fontSize: 12 }}>{question?.topic}</span>
                {question?.tags?.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.05)', color: '#707070', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>{t}</span>)}
              </div>
              <p style={{ fontSize: 13, color: '#b0b0b0', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 20 }}>{question?.description}</p>
              {question?.examples?.map((ex, i) => (
                <div key={i} style={{ background: '#212121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#909090', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Example {i + 1}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#b0b0b0' }}>
                    <div><span style={{ color: '#707070' }}>Input: </span>{ex.input}</div>
                    <div><span style={{ color: '#707070' }}>Output: </span>{ex.output}</div>
                    {ex.explanation && <div style={{ color: '#707070', marginTop: 6, fontFamily: 'inherit' }}>{ex.explanation}</div>}
                  </div>
                </div>
              ))}
              {question?.constraints?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#909090', marginBottom: 8 }}>Constraints</div>
                  {question.constraints.map((c, i) => <div key={i} style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#b0b0b0', marginBottom: 4 }}>• {c}</div>)}
                </div>
              )}
            </div>
          )}
          {tab === 'hints' && (
            <div>
              {question?.hints?.length > 0
                ? question.hints.map((h, i) => (
                  <details key={i} style={{ background: '#212121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px', marginBottom: 8, cursor: 'pointer' }}>
                    <summary style={{ fontSize: 13, fontWeight: 500, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Lightbulb size={14} />Hint {i + 1}
                    </summary>
                    <p style={{ fontSize: 13, color: '#909090', marginTop: 10, lineHeight: 1.6 }}>{h}</p>
                  </details>
                ))
                : <p style={{ fontSize: 13, color: '#555' }}>No hints available for this problem.</p>
              }
            </div>
          )}
        </div>
      </div>

      {/* Right — Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#191919', flexShrink: 0 }}>
          <select value={lang.key} onChange={handleLangChange}
            style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 10px', color: '#e0e0e0', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
            {LANGUAGES.map(l => <option key={l.key} value={l.key}>{l.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleRun} disabled={running}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d0d0d0', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', opacity: running ? 0.5 : 1 }}>
              <Play size={13} />{running ? 'Running...' : 'Run'}
            </button>
            <button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, background: '#60a5fa', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: submitMutation.isPending ? 0.5 : 1 }}>
              <Send size={13} />{submitMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Monaco */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Editor
            height="100%"
            language={lang.key === 'cpp' ? 'cpp' : lang.key}
            value={code}
            onChange={v => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6,
              minimap: { enabled: false }, scrollBeyondLastLine: false,
              padding: { top: 16 }, tabSize: 2, wordWrap: 'on',
            }}
          />
        </div>

        {/* Output panel */}
        {(runOutput || submitMutation.data) && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#191919', padding: '14px 16px', maxHeight: 220, overflowY: 'auto', flexShrink: 0 }}>
            {/* Run output */}
            {runOutput && !submitMutation.data && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace',
                    background: isAccepted(runOutput) ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: isAccepted(runOutput) ? '#4ade80' : '#f87171'
                  }}>{runOutput.status}</span>
                  {runOutput.time && <span style={{ fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{Math.round(runOutput.time * 1000)}ms</span>}
                </div>
                {runOutput.expectedOutput && (
                  <div style={{ fontSize: 12, color: '#707070', marginBottom: 6 }}>
                    Expected: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#b0b0b0' }}>{runOutput.expectedOutput}</span>
                  </div>
                )}
                <pre style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#b0b0b0', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {outputText(runOutput)}
                </pre>
              </div>
            )}

            {/* Submit output */}
            {submitMutation.data && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14, fontWeight: 600,
                  color: submitMutation.data.verdict === 'Accepted' ? '#4ade80' : '#f87171' }}>
                  {submitMutation.data.verdict === 'Accepted' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {submitMutation.data.verdict}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {submitMutation.data.results?.map((r, i) => (
                    <div key={i} style={{ background: r.passed ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${r.passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 7, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: r.passed ? 0 : 6, fontSize: 12, fontWeight: 500 }}>
                        {r.passed ? <CheckCircle size={13} color="#4ade80" /> : <XCircle size={13} color="#f87171" />}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: r.passed ? '#4ade80' : '#f87171' }}>Test case {i + 1} — {r.passed ? 'Passed' : 'Failed'}</span>
                      </div>
                      {!r.passed && (
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                          <div style={{ color: '#707070' }}>Expected: <span style={{ color: '#b0b0b0' }}>{r.expected}</span></div>
                          <div style={{ color: '#707070' }}>Got: <span style={{ color: '#f87171' }}>{r.actual || r.stderr || r.compile_output || 'no output'}</span></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}