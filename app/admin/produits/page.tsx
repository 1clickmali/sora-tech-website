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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Ajouter
        </button>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produits.map(p => (
            <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              {p.image && <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: p.active ? '#10B98122' : '#EF444422', color: p.active ? '#10B981' : '#EF4444' }}>
                  {p.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-cyan-400 font-bold">{fmt(p.price)}</span>
                <span className="text-gray-500">{p.stock === -1 ? 'Illimité' : 'Stock: ' + p.stock}</span>
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
          <div className="w-full max-w-md rounded-2xl p-6 space-y-3 overflow-y-auto max-h-[90vh]" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} produit</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">X</button>
            </div>

            {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

            {([
              { key: 'title', label: 'Nom du produit', type: 'text' },
              { key: 'price', label: 'Prix (FCFA)', type: 'number' },
              { key: 'badge', label: 'Badge (ex: NOUVEAU)', type: 'text' },
            ] as {key: string; label: string; type: string}[]).map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key] ?? ''}
                  onChange={e => setForm((p: any) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-white text-sm"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Photo du produit</label>
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
              {saving ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Creer le produit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
