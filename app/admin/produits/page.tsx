'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Produit {
  _id: string; name: string; description: string; price: number;
  category: string; stock: number; active: boolean; image?: string;
}

const EMPTY: Partial<Produit> = { name: '', description: '', price: 0, category: 'logiciel', stock: -1, active: true };

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [form, setForm] = useState<Partial<Produit>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get<{ data: Produit[] }>('/api/produits').then(r => setProduits(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await api.patch(`/api/produits/${editing}`, form);
    } else {
      await api.post('/api/produits', form);
    }
    setShowForm(false); setEditing(null); setForm(EMPTY); load();
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/api/produits/${id}`); load();
  };

  const startEdit = (p: Produit) => { setForm(p); setEditing(p._id); setShowForm(true); };
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Ajouter
        </button>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produits.map(p => (
            <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{p.category}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: p.active ? '#10B98122' : '#EF444422', color: p.active ? '#10B981' : '#EF4444' }}>
                  {p.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-cyan-400 font-bold">{fmt(p.price)}</span>
                <span className="text-gray-500">{p.stock === -1 ? 'Illimité' : `Stock: ${p.stock}`}</span>
              </div>
              <div className="flex gap-2 mt-3">
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
          <div className="w-full max-w-md rounded-2xl p-6 space-y-3 overflow-y-auto max-h-screen" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} produit</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            {[
              { key: 'name', label: 'Nom', type: 'text' },
              { key: 'price', label: 'Prix (FCFA)', type: 'number' },
              { key: 'stock', label: 'Stock (-1 = illimité)', type: 'number' },
              { key: 'image', label: 'Image URL', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key] ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                {['logiciel', 'materiel', 'service', 'formation', 'abonnement'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
              <span className="text-sm text-gray-300">Produit actif</span>
            </label>
            <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold"
              style={{ background: '#00E5FF', color: '#060D1F' }}>
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
