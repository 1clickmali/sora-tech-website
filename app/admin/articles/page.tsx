'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { BLOG_CATEGORIES } from '@/lib/blog';
import { resolveMediaUrl } from '@/lib/media';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  image?: string;
  author?: string;
}

type ArticleForm = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  featured: boolean;
  image: string;
  author: string;
};

const EMPTY: ArticleForm = {
  title: '',
  excerpt: '',
  content: '',
  category: BLOG_CATEGORIES[0],
  published: false,
  featured: false,
  image: '',
  author: 'SORA TECH',
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue';
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<ArticleForm>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('tous');
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api
      .get<{ data: Article[] }>(`/api/articles?limit=100&t=${Date.now()}`)
      .then((r) => setArticles(r.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    let active = true;

    api
      .get<{ data: Article[] }>(`/api/articles?limit=100&t=${Date.now()}`)
      .then((r) => {
        if (active) setArticles(r.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    setError('');
  };

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setError('');
    setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, image: (ev.target?.result as string) || '' }));
    reader.readAsDataURL(file);
  };

  const startEdit = async (article: Article) => {
    setError('');
    try {
      const res = await api.get<{ data: Article }>(`/api/articles/${article.slug || article._id}?t=${Date.now()}`);
      setForm({ ...EMPTY, ...res.data });
      setEditing(article._id);
      setShowForm(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Impossible d'ouvrir cet article");
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        title: form.title?.trim(),
        excerpt: form.excerpt?.trim(),
        content: form.content?.trim(),
        image: form.image?.trim?.() || form.image || '',
        author: form.author?.trim() || 'SORA TECH',
      };

      if (editing) await api.patch(`/api/articles/${editing}`, payload);
      else await api.post('/api/articles', payload);

      closeForm();
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/api/articles/${id}`);
    load();
  };

  const toggle = async (id: string, field: 'published' | 'featured', value: boolean) => {
    await api.patch(`/api/articles/${id}`, { [field]: !value });
    setArticles((current) => current.map((item) => (item._id === id ? { ...item, [field]: !value } : item)));
  };

  const filtered = articles.filter((article) => {
    if (filterCat !== 'tous' && article.category !== filterCat) return false;
    if (search) {
      const query = search.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        (article.author || '').toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-sm text-gray-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-56"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={{ background: '#00E5FF', color: '#060D1F' }}
          >
            + Nouvel article
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'tous', label: 'Tous', count: articles.length }, ...BLOG_CATEGORIES.map((category) => ({
          v: category,
          label: category,
          count: articles.filter((article) => article.category === category).length,
        }))].map((filter) => (
          <button
            key={filter.v}
            onClick={() => setFilterCat(filter.v)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              background: filterCat === filter.v ? '#00E5FF' : '#1E2D4A',
              color: filterCat === filter.v ? '#060D1F' : '#94A3B8',
            }}
          >
            {filter.label}
            <span className="text-[10px] opacity-70">({filter.count})</span>
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
                {['Article', 'Catégorie', 'Publié', 'À la une', 'Vues', 'Date', 'Actions'].map((heading) => (
                  <th key={heading} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, index) => (
                <tr
                  key={article._id}
                  className="transition-colors"
                  style={{ background: index % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#0B1628' }}>
                        {article.image ? (
                          <img src={resolveMediaUrl(article.image)} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0066FF]/25 to-[#9B93FF]/15" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{article.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{article.author || 'SORA TECH'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{article.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(article._id, 'published', article.published)}
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: article.published ? '#10B98122' : '#1E2D4A', color: article.published ? '#10B981' : '#64748B' }}
                    >
                      {article.published ? 'Oui' : 'Non'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(article._id, 'featured', article.featured)}
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: article.featured ? '#F59E0B22' : '#1E2D4A', color: article.featured ? '#F59E0B' : '#64748B' }}
                    >
                      {article.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{article.views}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(article)}
                        className="px-2 py-1 rounded text-[10px] font-medium"
                        style={{ background: '#1E2D4A', color: '#94A3B8' }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => del(article._id)}
                        className="px-2 py-1 rounded text-[10px] font-medium"
                        style={{ background: '#EF444422', color: '#EF4444' }}
                      >
                        ✕
                      </button>
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
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
          >
            <div
              className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}
            >
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouvel'} article</h2>
              <button
                onClick={closeForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Titre</label>
                <input
                  value={form.title || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Auteur</label>
                <input
                  value={form.author || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                >
                  {BLOG_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Résumé</label>
                <textarea
                  value={form.excerpt || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Image de couverture</label>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                    style={{ background: '#1E2D4A', color: '#94A3B8' }}
                  >
                    Choisir image
                  </button>
                  <input
                    type="text"
                    placeholder="ou coller une URL"
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                  />
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {form.image && (
                  <img src={resolveMediaUrl(form.image)} alt="preview" className="mt-3 h-40 rounded-xl object-cover w-full" />
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Contenu</label>
                <textarea
                  value={form.content || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-300">Publié</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-300">À la une</span>
                </label>
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="w-full py-2.5 rounded-lg text-sm font-bold"
                style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}
              >
                {saving ? 'Enregistrement...' : editing ? 'Enregistrer les modifications' : 'Créer le blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
