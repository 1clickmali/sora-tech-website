'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Article {
  _id: string; title: string; slug: string; excerpt: string; category: string;
  published: boolean; featured: boolean; views: number; createdAt: string; image?: string;
}

const EMPTY = { title: '', excerpt: '', content: '', category: 'tech', published: false, featured: false, image: '' };

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Nouvel article
        </button>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0B1628' }}>
                {['Titre', 'Catégorie', 'Publié', 'À la une', 'Vues', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a._id} className="border-t" style={{ borderColor: '#1E2D4A', background: i % 2 === 0 ? '#060D1F' : '#0B1628' }}>
                  <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{a.category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(a._id, 'published', a.published)}
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: a.published ? '#10B98122' : '#1E2D4A', color: a.published ? '#10B981' : '#64748B' }}>
                      {a.published ? 'Oui' : 'Non'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(a._id, 'featured', a.featured)}
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: a.featured ? '#F59E0B22' : '#1E2D4A', color: a.featured ? '#F59E0B' : '#64748B' }}>
                      {a.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.views}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setForm(a); setEditing(a._id); setShowForm(true); }}
                        className="px-2 py-1 rounded text-xs" style={{ background: '#1E2D4A', color: '#94A3B8' }}>Modifier</button>
                      <button onClick={() => del(a._id)} className="px-2 py-1 rounded text-xs" style={{ background: '#EF444422', color: '#EF4444' }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-3 overflow-y-auto max-h-[90vh]" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouvel'} article</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            {[{ key: 'title', label: 'Titre' }, { key: 'excerpt', label: 'Résumé' }, { key: 'image', label: 'Image URL' }].map(f => (
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
                {['tech', 'business', 'cybersecurite', 'ia', 'actualite'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Contenu (Markdown)</label>
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
            <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: '#00E5FF', color: '#060D1F' }}>
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
