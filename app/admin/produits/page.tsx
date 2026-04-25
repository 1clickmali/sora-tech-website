'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

interface Produit {
  _id: string; title: string; description: string; price: number;
  category: string; stock: number; active: boolean; image?: string; badge?: string; digital: boolean;
}

const CATS = ['Logiciels', 'Templates', 'Formations', 'Services'];
const EMPTY = { title: '', description: '', price: 0, category: 'Logiciels', stock: -1, active: true, digital: true, badge: '', image: '' };

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('Tous');
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get<{ data: Produit[] }>('/api/produits?limit=100').then(r => setProduits(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm((p: any) => ({ ...p, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setError('');
    setSaving(true);
    try {
      if (editing) await api.patch('/api/produits/' + editing, form);
      else await api.post('/api/produits', form);
      setShowForm(false); setEditing(null); setForm(EMPTY); load();
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete('/api/produits/' + id); load();
  };

  const startEdit = (p: Produit) => { setForm(p); setEditing(p._id); setError(''); setShowForm(true); };
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  const actifs = produits.filter(p => p.active).length;
  const digitaux = produits.filter(p => p.digital).length;
  const stockFaible = produits.filter(p => !p.digital && p.stock >= 0 && p.stock <= 5).length;

  const filtered = produits.filter(p => {
    if (filterCat !== 'Tous' && p.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const stockColor = (p: Produit) => {
    if (p.digital || p.stock === -1) return '#00E5FF';
    if (p.stock === 0) return '#EF4444';
    if (p.stock <= 5) return '#F59E0B';
    return '#10B981';
  };
  const stockLabel = (p: Produit) => {
    if (p.digital) return 'Digital';
    if (p.stock === -1) return 'Illimité';
    if (p.stock === 0) return 'Rupture';
    return 'Stock : ' + p.stock;
  };

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-sm text-gray-500">{produits.length} produit{produits.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button onClick={() => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={{ background: '#00E5FF', color: '#060D1F' }}>
            + Ajouter un produit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total produits', value: produits.length, color: '#00E5FF' },
          { label: 'Actifs', value: actifs, color: '#10B981' },
          { label: 'Digitaux', value: digitaux, color: '#8B5CF6' },
          { label: 'Stock faible (≤5)', value: stockFaible, color: stockFaible > 0 ? '#F59E0B' : '#94A3B8' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alerte stock */}
      {stockFaible > 0 && (
        <div className="mb-5 p-3 rounded-lg text-sm flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
          ⚠️ {stockFaible} produit{stockFaible > 1 ? 's ont' : ' a'} un stock faible ou en rupture.
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['Tous', ...CATS].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              background: filterCat === c ? '#00E5FF' : '#1E2D4A',
              color: filterCat === c ? '#060D1F' : '#94A3B8',
            }}>
            {c}
            {c !== 'Tous' && <span className="text-[10px] opacity-70">({produits.filter(p => p.category === c).length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-sm">Aucun produit{filterCat !== 'Tous' ? ' dans cette catégorie' : ''}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              {p.image && <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <div className="text-white font-semibold truncate">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                  style={{ background: p.active ? '#10B98122' : '#EF444422', color: p.active ? '#10B981' : '#EF4444' }}>
                  {p.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-cyan-400 font-bold font-mono">{fmt(p.price)}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: stockColor(p) + '22', color: stockColor(p) }}>
                  {stockLabel(p)}
                </span>
              </div>
              {!p.digital && p.stock > 0 && p.stock !== -1 && (
                <div className="mb-3">
                  <div className="h-1.5 rounded-full" style={{ background: '#1E2D4A' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{
                      width: Math.min(100, (p.stock / 20) * 100) + '%',
                      background: p.stock <= 5 ? '#F59E0B' : '#10B981',
                    }} />
                  </div>
                </div>
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
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} produit</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

              {([
                { key: 'title', label: 'Nom du produit', type: 'text' },
                { key: 'price', label: 'Prix (FCFA)', type: 'number' },
                { key: 'badge', label: 'Badge (ex: NOUVEAU)', type: 'text' },
              ] as { key: string; label: string; type: string }[]).map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key] ?? ''}
                    onChange={e => setForm((p: any) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Catégorie</label>
                <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {!form.digital && (
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Stock (-1 = illimité)</label>
                  <input type="number" value={form.stock ?? -1}
                    onChange={e => setForm((p: any) => ({ ...p, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Photo du produit</label>
                <div className="flex gap-2 items-center">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                    style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                    Choisir image
                  </button>
                  <input type="text" placeholder="ou coller une URL"
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                    onChange={e => setForm((p: any) => ({ ...p, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" />
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm((p: any) => ({ ...p, active: e.target.checked }))} />
                  <span className="text-sm text-gray-300">Actif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.digital} onChange={e => setForm((p: any) => ({ ...p, digital: e.target.checked }))} />
                  <span className="text-sm text-gray-300">Produit digital</span>
                </label>
              </div>

              <button onClick={save} disabled={saving} className="w-full py-2.5 rounded-lg text-sm font-bold"
                style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}>
                {saving ? 'Enregistrement...' : editing ? 'Enregistrer les modifications' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
