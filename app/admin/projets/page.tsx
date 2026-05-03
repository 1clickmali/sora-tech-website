'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';

interface Projet {
  _id: string; title: string; description: string; category: string;
  client?: string; tech: string[]; results: string[];
  featured: boolean; order: number; image?: string; link?: string;
}

const CATEGORIES = ['web', 'mobile', 'erp', 'cybersecurite', 'ia', 'reseau'];
const EMPTY = { title: '', description: '', category: 'web', client: '', tech: [], results: [], featured: false, order: 0, image: '', link: '' };

export default function ProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('tous');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get<{ data: Projet[] }>(`/api/projets?t=${Date.now()}`).then(r => setProjets(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await api.upload('/api/upload/image', fd);
      setForm((p: any) => ({ ...p, image: result.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = async () => {
    setError('');
    try {
      if (editing) await api.patch(`/api/projets/${editing}`, form);
      else await api.post('/api/projets', form);
      setShowForm(false); setEditing(null); setForm(EMPTY); load();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await api.delete(`/api/projets/${id}`); load();
  };

  const startEdit = (p: Projet) => { setForm(p); setEditing(p._id); setTechInput(''); setError(''); setShowForm(true); };

  const filtered = projets.filter(p => {
    if (filterCat !== 'tous' && p.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.client || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-sm text-gray-500">{projets.length} projet{projets.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher titre, client..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button onClick={() => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={{ background: '#00E5FF', color: '#060D1F' }}>
            + Nouveau projet
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'tous', label: 'Tous', count: projets.length }, ...CATEGORIES.map(c => ({
          v: c, label: c.charAt(0).toUpperCase() + c.slice(1), count: projets.filter(p => p.category === c).length,
        }))].map(f => (
          <button key={f.v} onClick={() => setFilterCat(f.v)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              background: filterCat === f.v ? '#00E5FF' : '#1E2D4A',
              color: filterCat === f.v ? '#060D1F' : '#94A3B8',
            }}>
            {f.label}
            <span className="text-[10px] opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">🗂</div>
          <p className="text-sm">Aucun projet trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              {p.image && <img src={resolveMediaUrl(p.image)} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex justify-between mb-2">
                <div>
                  <div className="text-white font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{p.category}{p.client ? ` · ${p.client}` : ''}</div>
                </div>
                {p.featured && <span className="text-yellow-400 text-sm">★</span>}
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.tech.slice(0, 4).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-xs"
                    style={{ background: '#00E5FF22', color: '#00E5FF' }}>{t}</span>
                ))}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline block mb-3 truncate">
                  🔗 {p.link}
                </a>
              )}
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="flex-1 py-1.5 rounded text-xs font-medium"
                  style={{ background: '#1E2D4A', color: '#94A3B8' }}>Modifier</button>
                <button onClick={() => del(p._id)} className="flex-1 py-1.5 rounded text-xs font-medium"
                  style={{ background: '#EF444422', color: '#EF4444' }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} projet</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>
              )}

              {[
                { key: 'title', label: 'Titre *' },
                { key: 'client', label: 'Client' },
                { key: 'link', label: 'Lien du projet' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</label>
                  <input value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Catégorie</label>
                <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Description *</label>
                <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Technologies (Entrée pour ajouter)</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(form.tech || []).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs cursor-pointer"
                      style={{ background: '#00E5FF22', color: '#00E5FF' }}
                      onClick={() => setForm((p: any) => ({ ...p, tech: p.tech.filter((x: string) => x !== t) }))}>
                      {t} ✕
                    </span>
                  ))}
                </div>
                <input value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && techInput.trim()) {
                      setForm((p: any) => ({ ...p, tech: [...(p.tech || []), techInput.trim()] }));
                      setTechInput(''); e.preventDefault();
                    }
                  }}
                  placeholder="Ex: React, Node.js..."
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Photo du projet</label>
                <div className="flex gap-2 items-center">
                  <button type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2"
                    style={{ background: '#1E2D4A', color: uploading ? '#64748B' : '#94A3B8' }}>
                    {uploading ? (
                      <><span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" /> Upload...</>
                    ) : '📁 Choisir depuis ordinateur'}
                  </button>
                  <input
                    type="text"
                    placeholder="ou coller une URL"
                    value={form.image?.startsWith('/uploads') || form.image?.startsWith('http') ? form.image : ''}
                    onChange={e => setForm((p: any) => ({ ...p, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {form.image && (
                  <div className="mt-2 relative">
                    <img src={resolveMediaUrl(form.image)} alt="preview" className="h-32 rounded-lg object-cover w-full" />
                    <button onClick={() => setForm((p: any) => ({ ...p, image: '' }))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm((p: any) => ({ ...p, featured: e.target.checked }))} />
                  <span className="text-sm text-gray-300">À la une</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Ordre</label>
                  <input type="number" value={form.order || 0} onChange={e => setForm((p: any) => ({ ...p, order: Number(e.target.value) }))}
                    className="w-16 px-2 py-1 rounded text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              </div>

              <button onClick={save}
                className="w-full py-2.5 rounded-lg text-sm font-bold"
                style={{ background: '#00E5FF', color: '#060D1F' }}>
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
