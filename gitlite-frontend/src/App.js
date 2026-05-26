import { useState, useEffect, useCallback } from 'react';

const API = 'https://gitlite-production.up.railway.app';

const C = {
  bg:       '#0a0c10',
  surface:  '#111318',
  surface2: '#181c24',
  border:   '#1e2330',
  border2:  '#252d3d',
  text:     '#cdd6f4',
  muted:    '#6c7a9c',
  accent:   '#89b4fa',
  green:    '#a6e3a1',
  greenDim: '#1e3a2f',
  red:      '#f38ba8',
  redDim:   '#3a1e24',
  mauve:    '#cba6f7',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 2px; }
  input, select, button, textarea { font-family: 'Outfit', sans-serif; }
  input:focus, select:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accent}18; }
  button:active { transform: scale(0.97); }
  @keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  .repo-card:hover  { border-color: ${C.border2} !important; background: ${C.surface2} !important; transform: translateY(-1px); }
  .branch-row:hover { background: ${C.surface2} !important; }
  .nav-item:hover   { color: ${C.text} !important; background: ${C.surface2} !important; }
`;

/* ─── PRIMITIVES ─────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const err = type === 'error';
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      background: err ? C.redDim : C.greenDim,
      border: `1px solid ${err ? C.red : C.green}`,
      borderRadius:10, padding:'12px 18px',
      color: err ? C.red : C.green,
      fontFamily:'Space Mono,monospace', fontSize:12,
      display:'flex', alignItems:'center', gap:10,
      animation:'slideIn .2s ease', maxWidth:340,
    }}>
      <span>{err ? '✗' : '✓'}</span>
      <span>{msg}</span>
      <span onClick={onClose} style={{marginLeft:'auto',cursor:'pointer',opacity:.6}}>✕</span>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {label && <label style={{fontSize:11,color:C.muted,fontWeight:500,letterSpacing:.6,textTransform:'uppercase'}}>{label}</label>}
      <input {...props} style={{
        background:C.bg, border:`1px solid ${C.border}`,
        borderRadius:8, padding:'9px 13px',
        color:C.text, fontSize:14, width:'100%', transition:'all .15s',
        ...props.style,
      }} />
    </div>
  );
}

function Btn({ children, variant='primary', style={}, ...props }) {
  const base = { borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:500, cursor:'pointer', border:'1px solid', transition:'all .15s', display:'inline-flex', alignItems:'center', gap:7, whiteSpace:'nowrap' };
  const v = {
    primary: { background:C.accent+'22', borderColor:C.accent+'66', color:C.accent },
    green:   { background:C.greenDim,    borderColor:C.green+'66',  color:C.green  },
    ghost:   { background:'transparent', borderColor:C.border,      color:C.muted  },
    danger:  { background:C.redDim,      borderColor:C.red+'66',    color:C.red    },
  };
  return <button {...props} style={{...base,...v[variant],...style}}>{children}</button>;
}

function Badge({ children, color=C.accent }) {
  return <span style={{fontSize:11,background:color+'18',border:`1px solid ${color}44`,borderRadius:20,padding:'2px 9px',color,fontFamily:'Space Mono,monospace'}}>{children}</span>;
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{padding:'64px 32px',textAlign:'center',animation:'fadeIn .3s ease'}}>
      <div style={{fontSize:36,marginBottom:14}}>{icon}</div>
      <div style={{fontSize:16,fontWeight:600,color:C.text,marginBottom:6}}>{title}</div>
      <div style={{fontSize:13,color:C.muted}}>{subtitle}</div>
    </div>
  );
}
function CommitFilePanel({ commit }) {
  const [blob,    setBlob]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`${API}/blobs/${commit.blobHash}`)
      .then(r => r.json())
      .then(d => setBlob(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [commit.blobHash]);

  function handleDownload() {
    const fileBlob = new Blob([blob.content], { type: 'text/plain' });
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${commit.hash.slice(0,7)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div onClick={e => e.stopPropagation()}
      style={{margin:'0 24px 12px 50px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden',animation:'slideIn .2s ease'}}>
      <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:14}}>📄</span>
          <span style={{fontSize:12,color:C.muted,fontFamily:'Space Mono,monospace'}}>blob: {commit.blobHash?.slice(0,7)}</span>
        </div>
        {blob && <Btn variant="primary" style={{fontSize:11,padding:'4px 12px'}} onClick={handleDownload}>⬇ Download</Btn>}
      </div>

      {loading && <div style={{padding:20,textAlign:'center',color:C.muted,fontSize:12}}>Loading...</div>}
      {error   && <div style={{padding:20,textAlign:'center',color:C.red,fontSize:12}}>Failed to load blob</div>}
      {blob && (
        <pre style={{
          margin:0, padding:16,
          fontSize:12, lineHeight:1.6,
          color:C.text, fontFamily:'Space Mono,monospace',
          overflowX:'auto', maxHeight:300, overflowY:'auto',
          whiteSpace:'pre-wrap', wordBreak:'break-all',
        }}>
          {blob.content}
        </pre>
      )}
    </div>
  );
}
function CommitFilePanel({ commit }) {
  const [blob,    setBlob]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`${API}/blobs/${commit.blobHash}`)
      .then(r => r.json())
      .then(d => setBlob(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [commit.blobHash]);

  function handleDownload() {
    const fileBlob = new Blob([blob.content], { type: 'text/plain' });
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${commit.hash.slice(0,7)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div onClick={e => e.stopPropagation()}
      style={{margin:'0 24px 12px 50px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden',animation:'slideIn .2s ease'}}>
      <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:14}}>📄</span>
          <span style={{fontSize:12,color:C.muted,fontFamily:'Space Mono,monospace'}}>blob: {commit.blobHash?.slice(0,7)}</span>
        </div>
        {blob && <Btn variant="primary" style={{fontSize:11,padding:'4px 12px'}} onClick={handleDownload}>⬇ Download</Btn>}
      </div>

      {loading && <div style={{padding:20,textAlign:'center',color:C.muted,fontSize:12}}>Loading...</div>}
      {error   && <div style={{padding:20,textAlign:'center',color:C.red,fontSize:12}}>Failed to load blob</div>}
      {blob && (
        <pre style={{
          margin:0, padding:16,
          fontSize:12, lineHeight:1.6,
          color:C.text, fontFamily:'Space Mono,monospace',
          overflowX:'auto', maxHeight:300, overflowY:'auto',
          whiteSpace:'pre-wrap', wordBreak:'break-all',
        }}>
          {blob.content}
        </pre>
      )}
    </div>
  );
}
function CommitTimeline({ commits, loading, onCommitClick }) {
  if (loading) return <div style={{padding:28,textAlign:'center',color:C.muted,fontSize:13}}>Loading...</div>;
  if (!commits.length) return <EmptyState icon="◌" title="No commits yet" subtitle="Make the first commit on this branch" />;
  return (
    <div style={{padding:'8px 0'}}>
      {commits.map((c, i) => c && (
        <div key={c.hash||i}>
          <div
            onClick={() => onCommitClick(c)}
            style={{display:'flex',gap:16,padding:'14px 24px',borderBottom:`1px solid ${C.border}`,
              animation:`slideIn .2s ease ${i*0.04}s both`, cursor:'pointer', transition:'background .15s'}}
            onMouseEnter={e => e.currentTarget.style.background = C.surface2}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:C.green,border:`2px solid ${C.greenDim}`,flexShrink:0,marginTop:4}} />
              {i < commits.length-1 && <div style={{width:1,flex:1,background:C.border,marginTop:4,minHeight:16}} />}
            </div>
            <div style={{flex:1,paddingBottom:4}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontFamily:'Space Mono,monospace',fontSize:12,color:C.accent,background:C.accent+'12',border:`1px solid ${C.accent}33`,borderRadius:5,padding:'2px 7px'}}>
                  {c.hash?.slice(0,7)||'???????'}
                </span>
                <span style={{fontSize:13,color:C.text,fontWeight:500}}>{c.message}</span>
                <span style={{marginLeft:'auto',fontSize:11,color:C.muted}}>click to view file ↓</span>
              </div>
              {c.time && <div style={{fontSize:11,color:C.muted}}>{new Date(c.time).toLocaleString()}</div>}
            </div>
          </div>

          {/* Inline file panel — rendered right below the clicked commit */}
          {c._expanded && (
            <CommitFilePanel commit={c} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────── */
function Sidebar({ view, setView, selectedRepo, selectedBranch }) {
  return (
    <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',minHeight:'calc(100vh - 52px)',flexShrink:0}}>
      <div style={{padding:'20px 12px 8px'}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:'uppercase',fontWeight:600,padding:'0 8px',marginBottom:8}}>Menu</div>
        {[{id:'repos',label:'Repositories',icon:'▣'},{id:'commit',label:'Simulate Commit',icon:'⬡'}].map(item => (
          <div key={item.id} className="nav-item" onClick={() => setView(item.id)}
            style={{padding:'9px 12px',borderRadius:7,cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:13,marginBottom:2,transition:'all .15s',
              color:      view===item.id ? C.accent : C.muted,
              background: view===item.id ? C.accent+'12' : 'transparent',
              fontWeight: view===item.id ? 500 : 400,
            }}>
            <span style={{fontSize:15}}>{item.icon}</span>{item.label}
          </div>
        ))}
      </div>

      {selectedRepo && (
        <div style={{padding:'16px 12px 8px',borderTop:`1px solid ${C.border}`,marginTop:8}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:'uppercase',fontWeight:600,padding:'0 8px',marginBottom:10}}>Context</div>
          <div style={{padding:'10px 12px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:8}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:3}}>REPOSITORY</div>
            <div style={{fontSize:13,color:C.text,fontWeight:500,display:'flex',alignItems:'center',gap:6}}>
              <span style={{color:C.mauve}}>▣</span>{selectedRepo.name}
            </div>
          </div>
          {selectedBranch && (
            <div style={{padding:'10px 12px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:3}}>BRANCH</div>
              <div style={{fontSize:13,color:C.text,fontWeight:500,display:'flex',alignItems:'center',gap:6}}>
                <span style={{color:C.green}}>⎇</span>{selectedBranch.name}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── REPOS VIEW ─────────────────────────────────────────────── */
function ReposView({ repos, newRepoName, setNewRepoName, createRepo, onSelectRepo }) {
  return (
    <div style={{padding:32,animation:'fadeIn .25s ease'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:16}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:600,color:C.text,marginBottom:4}}>Repositories</h1>
          <p style={{fontSize:13,color:C.muted}}>{repos.length} {repos.length===1?'repository':'repositories'}</p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <Input placeholder="new-repo-name" value={newRepoName}
            onChange={e => setNewRepoName(e.target.value)}
            onKeyDown={e => e.key==='Enter' && createRepo()}
            style={{width:200}} />
          <Btn variant="green" onClick={createRepo}>+ New Repo</Btn>
        </div>
      </div>

      {repos.length === 0
        ? <EmptyState icon="▣" title="No repositories yet" subtitle="Create your first repo using the input above" />
        : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
            {repos.map((r,i) => (
              <div key={r.id} className="repo-card" onClick={() => onSelectRepo(r)}
                style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20,cursor:'pointer',
                  transition:'all .2s',animation:`slideIn .25s ease ${i*0.06}s both`}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <div style={{width:34,height:34,borderRadius:8,background:C.mauve+'18',border:`1px solid ${C.mauve}33`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:C.mauve}}>▣</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,color:C.text}}>{r.name}</div>
                    <div style={{fontSize:11,color:C.muted,fontFamily:'Space Mono,monospace'}}>id:{r.id}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.muted,display:'flex',alignItems:'center',gap:6}}>
                  <span style={{color:C.accent}}>→</span> Click to open
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

/* ─── REPO DETAIL VIEW ───────────────────────────────────────── */
function RepoDetailView({
  selectedRepo, setSelectedRepo, setRepos,
  branches, setBranches,
  selectedBranch, setSelectedBranch,
  history, histLoading,
  setView, notify,
}) {
  const [renaming,      setRenaming]      = useState(false);
  const [repoNameEdit,  setRepoNameEdit]  = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [expandedHash, setExpandedHash] = useState(null);

  function handleCommitClick(commit) {
    setExpandedHash(prev => prev === commit.hash ? null : commit.hash);
  }

  function saveRename() {
    if (!repoNameEdit.trim()) return notify('Name cannot be empty', 'error');
    setRepos(p => p.map(r => r.id===selectedRepo.id ? {...r,name:repoNameEdit.trim()} : r));
    setSelectedRepo(r => ({...r,name:repoNameEdit.trim()}));
    setRenaming(false);
    notify('Repository renamed');
  }

  function createBranch() {
    if (!newBranchName.trim()) return notify('Enter a branch name', 'error');
    fetch(`${API}/branches`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:newBranchName.trim(), headCommitHash:'', repositoryId:selectedRepo.id }),
    }).then(r => r.json()).then(d => {
      setBranches(p => [...p, d]);
      setNewBranchName('');
      setShowNewBranch(false);
      notify(`Branch "${d.name}" created`);
    }).catch(() => notify('Failed to create branch', 'error'));
  }

  return (
    <div style={{padding:32,animation:'fadeIn .25s ease',maxWidth:800}}>
      {/* Breadcrumb */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24,fontSize:13,color:C.muted}}>
        <span onClick={()=>setView('repos')} style={{cursor:'pointer',color:C.accent}}>Repositories</span>
        <span>/</span>
        <span style={{color:C.text,fontWeight:500}}>{selectedRepo?.name}</span>
      </div>

      {/* Repo header */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          {renaming ? (
            <div style={{display:'flex',gap:10,alignItems:'center',flex:1}}>
              <Input value={repoNameEdit} onChange={e=>setRepoNameEdit(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&saveRename()} style={{maxWidth:280}} />
              <Btn variant="green" onClick={saveRename}>Save</Btn>
              <Btn variant="ghost" onClick={()=>setRenaming(false)}>Cancel</Btn>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.mauve+'18',border:`1px solid ${C.mauve}33`,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:C.mauve}}>▣</div>
              <div>
                <h2 style={{fontSize:20,fontWeight:600,color:C.text}}>{selectedRepo?.name}</h2>
                <div style={{fontSize:12,color:C.muted,fontFamily:'Space Mono,monospace'}}>id: {selectedRepo?.id}</div>
              </div>
            </div>
          )}
          {!renaming && (
            <Btn variant="ghost" onClick={()=>{setRenaming(true);setRepoNameEdit(selectedRepo?.name);}}>✎ Rename</Btn>
          )}
        </div>
      </div>

      {/* Branches */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'16px 24px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:16,color:C.green}}>⎇</span>
            <span style={{fontSize:15,fontWeight:600,color:C.text}}>Branches</span>
            <Badge color={C.green}>{branches.length}</Badge>
          </div>
          <Btn variant="green" onClick={()=>setShowNewBranch(p=>!p)}>
            {showNewBranch ? '✕ Cancel' : '+ New Branch'}
          </Btn>
        </div>

        {showNewBranch && (
          <div style={{padding:'16px 24px',borderBottom:`1px solid ${C.border}`,background:C.bg,display:'flex',gap:10,alignItems:'flex-end'}}>
            <Input label="Branch name" placeholder="e.g. feature/auth" value={newBranchName}
              onChange={e=>setNewBranchName(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&createBranch()}
              style={{maxWidth:280}} />
            <Btn variant="green" onClick={createBranch}>Create</Btn>
          </div>
        )}

        {branches.length === 0
          ? <EmptyState icon="⎇" title="No branches yet" subtitle="Create the first branch for this repository" />
          : branches.map((b,i) => (
            <div key={b.id} className="branch-row"
              onClick={() => setSelectedBranch(prev => prev?.id===b.id ? null : b)}
              style={{padding:'14px 24px',borderBottom:`1px solid ${C.border}`,cursor:'pointer',
                background: selectedBranch?.id===b.id ? C.accent+'08' : 'transparent',
                transition:'background .15s', animation:`slideIn .2s ease ${i*0.05}s both`}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{color:C.green,fontSize:14}}>⎇</span>
                  <span style={{fontSize:14,fontWeight:500,color:selectedBranch?.id===b.id?C.accent:C.text}}>{b.name}</span>
                  {selectedBranch?.id===b.id && <Badge color={C.accent}>selected</Badge>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  {b.headCommitHash
                    ? <span style={{fontFamily:'Space Mono,monospace',fontSize:11,color:C.muted}}>{b.headCommitHash.slice(0,7)}</span>
                    : <span style={{fontSize:11,color:C.muted}}>no commits</span>
                  }
                  <span style={{color:C.muted,fontSize:12}}>{selectedBranch?.id===b.id?'▲':'▼'}</span>
                </div>
              </div>

              {selectedBranch?.id===b.id && (
                <div onClick={e=>e.stopPropagation()}
                  style={{marginTop:16,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
                  <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:12,color:C.muted,fontWeight:500}}>COMMIT HISTORY</span>
                    <Btn variant="primary" style={{fontSize:12,padding:'5px 12px'}} onClick={()=>setView('commit')}>
                      + Commit here
                    </Btn>
                  </div>
                  <CommitTimeline
                    commits={history.map(c => ({ ...c, _expanded: c.hash === expandedHash }))}
                    loading={histLoading}
                    onCommitClick={handleCommitClick}
                  />
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ─── COMMIT VIEW ────────────────────────────────────────────── */
function CommitView({ selectedRepo, selectedBranch, setView, notify, onCommitSuccess }) {
  const [commitMsg, setCommitMsg] = useState('');
  const [file,      setFile]      = useState(null);
  const [loading,   setLoading]   = useState(false);

  function handleCommit() {
    if (!selectedBranch) return notify('Select a branch first', 'error');
    if (!commitMsg.trim()) return notify('Enter a commit message', 'error');
    if (!file) return notify('Choose a file', 'error');
    setLoading(true);
    const fd = new FormData();
    fd.append('branch', selectedBranch.name);
    fd.append('message', commitMsg.trim());
    fd.append('file', file);
    fd.append('repositoryId', selectedRepo.id); 
    fetch(`${API}/git/simulate-commit`, { method:'POST', body:fd })
      .then(r => r.json())
      .then(d => {
        console.log('raw response:', JSON.stringify(d));
        const commit = d?.commit ?? d;
        onCommitSuccess(d);
        setCommitMsg('');
        setFile(null);
        notify(`Committed ${commit?.hash?.slice(0,7) ?? 'success'}`);
      })
      .catch(() => notify('Commit failed', 'error'))
      .finally(() => setLoading(false));
  }

  return (
    <div style={{padding:32,animation:'fadeIn .25s ease',maxWidth:640}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24,fontSize:13,color:C.muted}}>
        {selectedRepo && <>
          <span onClick={()=>setView('repos')} style={{cursor:'pointer',color:C.accent}}>Repositories</span>
          <span>/</span>
          <span onClick={()=>setView('repo-detail')} style={{cursor:'pointer',color:C.accent}}>{selectedRepo.name}</span>
          <span>/</span>
        </>}
        <span style={{color:C.text}}>Simulate Commit</span>
      </div>

      <h1 style={{fontSize:22,fontWeight:600,color:C.text,marginBottom:4}}>Simulate Commit</h1>
      <p style={{fontSize:13,color:C.muted,marginBottom:28}}>Stage a file and push a commit to the selected branch</p>

      {!selectedRepo || !selectedBranch ? (
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:32,textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:12}}>⎇</div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:8}}>No branch selected</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Go to a repository, select a branch, then click "Commit here"</div>
          <Btn variant="primary" onClick={()=>setView('repos')}>→ Go to Repositories</Btn>
        </div>
      ) : (
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'16px 24px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <Badge color={C.mauve}>▣ {selectedRepo.name}</Badge>
            <span style={{color:C.muted}}>on</span>
            <Badge color={C.green}>⎇ {selectedBranch.name}</Badge>
          </div>
          <div style={{padding:24,display:'flex',flexDirection:'column',gap:20}}>
            <Input label="Commit message" placeholder="feat: add authentication module"
              value={commitMsg} onChange={e=>setCommitMsg(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleCommit()} />

            <div>
              <div style={{fontSize:11,color:C.muted,letterSpacing:.6,textTransform:'uppercase',fontWeight:500,marginBottom:6}}>File to commit</div>
              <label style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',
                background:C.bg, border:`1px solid ${file?C.green+'66':C.border}`,
                borderRadius:8, cursor:'pointer', color:file?C.green:C.muted, fontSize:13, transition:'all .15s'}}>
                <span style={{fontSize:16}}>📄</span>
                <span>{file ? file.name : 'Choose file...'}</span>
                <input type="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])} />
              </label>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <Btn variant="green" onClick={handleCommit}
                style={{opacity:loading?0.6:1,padding:'10px 24px',fontSize:14}}
                disabled={loading}>
                {loading ? '◌ Committing...' : '⬡ Simulate Commit'}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function App() {
  const [view,           setView]           = useState('repos');
  const [selectedRepo,   setSelectedRepo]   = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [repos,          setRepos]          = useState([]);
  const [branches,       setBranches]       = useState([]);
  const [history,        setHistory]        = useState([]);
  const [histLoading,    setHistLoading]    = useState(false);
  const [newRepoName,    setNewRepoName]    = useState('');
  const [toast,          setToast]          = useState(null);

  const notify = useCallback((msg, type='success') => setToast({ msg, type }), []);

  // Load repos
  useEffect(() => {
    fetch(`${API}/repositories`)
      .then(r => r.json())
      .then(d => setRepos(Array.isArray(d) ? d : []))
      .catch(() => notify('Cannot reach backend', 'error'));
  }, [notify]);

  // Load branches when repo changes
  useEffect(() => {
    if (!selectedRepo) return;
    setBranches([]);
    setSelectedBranch(null);
    setHistory([]);
    fetch(`${API}/branches?repositoryId=${selectedRepo.id}`)
      .then(r => r.json())
      .then(d => setBranches(Array.isArray(d) ? d : []))
      .catch(() => notify('Failed to load branches', 'error'));
  }, [selectedRepo, notify]);

  // Load history when branch changes
  useEffect(() => {
    if (!selectedBranch?.headCommitHash) { setHistory([]); return; }
    setHistLoading(true);
    fetch(`${API}/commits/${selectedBranch.headCommitHash}`)
      .then(r => r.json())
      .then(d => setHistory(Array.isArray(d) ? d : d ? [d] : []))
      .catch(() => setHistory([]))
      .finally(() => setHistLoading(false));
  }, [selectedBranch]);

  function createRepo() {
    if (!newRepoName.trim()) return notify('Enter a name', 'error');
    fetch(`${API}/repositories`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: newRepoName.trim() }),
    }).then(r => r.json()).then(d => {
      setRepos(p => [...p, d]);
      setNewRepoName('');
      notify(`"${d.name}" created`);
    }).catch(() => notify('Failed to create repo', 'error'));
  }

  function handleSelectRepo(repo) {
    setSelectedRepo(repo);
    setSelectedBranch(null);
    setHistory([]);
    setView('repo-detail');
  }

  function handleCommitSuccess(data) {
    const commit = data?.commit ?? data;
    if (!commit?.hash) return;
    setHistory(p => [commit, ...p]);
    setBranches(p => p.map(b => b.id === selectedBranch?.id ? {...b, headCommitHash: commit.hash} : b));
    setSelectedBranch(prev => prev ? {...prev, headCommitHash: commit.hash} : prev);
  }


  return (
    <div style={{minHeight:'100vh',background:C.bg}}>
      <style>{css}</style>

      {/* Topbar */}
      <div style={{height:52,background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:'flex',alignItems:'center',padding:'0 24px',gap:12,position:'sticky',top:0,zIndex:100}}>
        <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#a6e3a1,#89b4fa)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>⬡</div>
        <span style={{fontFamily:'Space Mono,monospace',fontWeight:700,fontSize:16,color:C.text,letterSpacing:-.5}}>GitLite</span>
        <span style={{fontSize:11,background:C.border,borderRadius:20,padding:'2px 8px',color:C.muted,fontFamily:'Space Mono,monospace'}}>v1.0</span>
        <div style={{flex:1}} />
        <span style={{fontSize:12,color:C.muted,fontFamily:'Space Mono,monospace'}}>Spring Boot · MySQL · React</span>
      </div>

      <div style={{display:'flex'}}>
        <Sidebar view={view} setView={setView} selectedRepo={selectedRepo} selectedBranch={selectedBranch} />

        <div style={{flex:1,overflowY:'auto',maxHeight:'calc(100vh - 52px)'}}>
          {view==='repos' && (
            <ReposView
              repos={repos} newRepoName={newRepoName}
              setNewRepoName={setNewRepoName}
              createRepo={createRepo} onSelectRepo={handleSelectRepo}
            />
          )}
          {view==='repo-detail' && selectedRepo && (
            <RepoDetailView
              selectedRepo={selectedRepo} setSelectedRepo={setSelectedRepo} setRepos={setRepos}
              branches={branches} setBranches={setBranches}
              selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}
              history={history} histLoading={histLoading}
              setView={setView} notify={notify}
            />
          )}
          {view==='commit' && (
            <CommitView
              selectedRepo={selectedRepo} selectedBranch={selectedBranch}
              setView={setView} notify={notify} onCommitSuccess={handleCommitSuccess}
            />
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}