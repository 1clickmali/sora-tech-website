'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Article {
  _id: string; title: string; slug: string; excerpt: string; category: string;
  published: boolean; featured: boolean; views: number; createdAt: string; image?: string;
}

const CATEGORIES = ['tech', 'business', 'cybersecurite', 'ia', 'actualite'];
const EMPTY = { title: '', excerpt: '', content: '', category: 'tech', published: false, featured: false, image: '' };

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('tous');
  const [search, setSearch] = useState('');

  const load = () => api.get<{ data: Article[] }>('/api/articles?published=').then(r => setArticles(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) await api.patch(`/api/articles/${editing}`, form);
    else await api.post('/api/articles', form);
    setShowForm(false); setEditing(null); setForm(EMPTY); load();
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/api/articles/${id}`); load();
  };

  const toggle = async (id: string, field: 'published' | 'featured', val: boolean) => {
    await api.patch(`/api/articles/${id}`, { [field]: !val });
    setArticles(a => a.map(x => x._id === id ? { ...x, [field]: !val } : x));
  };

  const filtered = articles.filter(a => {
    if (filterCat !== 'tous' && a.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-sm text-gray-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={{ background: '#00E5FF', color: '#060D1F' }}>
            + Nouvel article
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'tous', label: 'Tous', count: articles.length }, ...CATEGORIES.map(c => ({
          v: c, label: c.charAt(0).toUpperCase() + c.slice(1), count: articles.filter(a => a.category === c).length,
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
          <div className="text-5xl mb-4">📝</div>
          <p className="text-sm">Aucun article trouvé.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
              <tr>
                {['Titre', 'Catégorie', 'Publié', 'À la une', 'Vues', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a._id} className="transition-colors"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}>
                  <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs capitalize">{a.category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(a._id, 'published', a.published)}
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: a.published ? '#10B98122' : '#1E2D4A', color: a.published ? '#10B981' : '#64748B' }}>
                      {a.published ? 'Oui' : 'Non'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(a._id, 'featured', a.featured)}
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: a.featured ? '#F59E0B22' : '#1E2D4A', color: a.featured ? '#F59E0B' : '#64748B' }}>
                      {a.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.views}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setForm(a); setEditing(a._id); setShowForm(true); }}
                        className="px-2 py-1 rounded text-[10px] font-medium"
                        style={{ background: '#1E2D4A', color: '#94A3B8' }}>Modifier</button>
                      <button onClick={() => del(a._id)}
                        className="px-2 py-1 rounded text-[10px] font-medium"
                        style={{ background: '#EF444422', color: '#EF4444' }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouvel'} article</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[{ key: 'title', label: 'Titre' }, { key: 'excerpt', label: 'Résumé' }, { key: 'image', label: 'Image URL' }].map(f => (
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Contenu (Markdown)</label>
                <textarea value={form.content || ''} onChange={e => setForm((p: any) => ({ ...p, content: e.target.value }))}
                  rows={8} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none font-mono"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm((p: any) => ({ ...p, published: e.target.checked }))} />
                  <span className="text-sm text-gray-300">Publié</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm((p: any) => ({ ...p, featured: e.target.checked }))} />
                  <span className="text-sm text-gray-300">À la une</span>
                </label>
              </div>
              <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold"
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
