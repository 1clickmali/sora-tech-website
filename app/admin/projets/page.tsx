'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Projet {
  _id: string; title: string; description: string; category: string;
  client?: string; tech: string[]; results: string[];
  featured: boolean; order: number; image?: string; link?: string;
}

const EMPTY = { title: '', description: '', category: 'web', client: '', tech: [], results: [], featured: false, order: 0, image: '', link: '' };

export default function ProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => api.get<{ data: Projet[] }>('/api/projets').then(r => setProjets(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) await api.patch(`/api/projets/${editing}`, form);
    else await api.post('/api/projets', form);
    setShowForm(false); setEditing(null); setForm(EMPTY); load();
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await api.delete(`/api/projets/${id}`); load();
  };

  const startEdit = (p: Projet) => { setForm(p); setEditing(p._id); setTechInput(''); setResultInput(''); setShowForm(true); };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projets</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Nouveau projet
        </button>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projets.map(p => (
            <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
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
                  <span key={t} className="px-2 py-0.5 rounded text-xs" style={{ background: '#00E5FF22', color: '#00E5FF' }}>{t}</span>
                ))}
              </div>
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-3 overflow-y-auto max-h-[90vh]" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} projet</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            {[{ key: 'title', label: 'Titre' }, { key: 'client', label: 'Client' }, { key: 'image', label: 'Image URL' }, { key: 'link', label: 'Lien du projet' }].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                <input value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-white text-sm"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                {['web', 'mobile', 'erp', 'cybersecurite', 'ia', 'reseau'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Technologies (Entrée pour ajouter)</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {(form.tech || []).map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded text-xs cursor-pointer" style={{ background: '#00E5FF22', color: '#00E5FF' }}
                    onClick={() => setForm((p: any) => ({ ...p, tech: p.tech.filter((x: string) => x !== t) }))}>
                    {t} ✕
                  </span>
                ))}
              </div>
              <input value={techInput} onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && techInput.trim()) { setForm((p: any) => ({ ...p, tech: [...(p.tech || []), techInput.trim()] })); setTechInput(''); e.preventDefault(); } }}
                placeholder="Ex: React, Node.js..."
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
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
            <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: '#00E5FF', color: '#060D1F' }}>
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
