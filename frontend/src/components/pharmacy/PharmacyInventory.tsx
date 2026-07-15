import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { InventoryItem } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function PharmacyInventory() {
  const token = useAppStore(s => s.token);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const fetchItems = () => {
    if (!token) return;
    fetch(`${API_BASE}/inventory`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setItems(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [token]);

  const filtered = items.filter(i =>
    i.medicineName.toLowerCase().includes(search.toLowerCase()) ||
    i.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = items.filter(i => i.quantityAvailable <= i.minimumStockLevel);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Pharmacy Inventory</h2>
        <div className="flex items-center gap-3">
          {lowStock.length > 0 && (
            <span className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-medium">{lowStock.length} low stock</span>
          )}
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            + Add Medicine
          </button>
        </div>
      </div>

      {showForm && (
        <InventoryForm
          item={editItem}
          onSaved={() => { setShowForm(false); setEditItem(null); fetchItems(); }}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, batch number, category..."
          className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading inventory...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Medicine</th>
                <th className="text-left px-4 py-3">Batch</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Stock</th>
                <th className="text-right px-4 py-3">Min Level</th>
                <th className="text-right px-4 py-3">Unit Price</th>
                <th className="text-left px-4 py-3">Expiry</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const isLow = item.quantityAvailable <= item.minimumStockLevel;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${isLow ? 'bg-rose-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{item.medicineName}</span>
                      <div className="text-[10px] text-slate-400">{item.supplier}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.batchNumber}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.category || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono font-medium ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>{item.quantityAvailable}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">{item.minimumStockLevel}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-600">Rs. {item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.expiryDate || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditItem(item); setShowForm(true); }}
                        className="px-2.5 py-1.5 text-[10px] bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 cursor-pointer">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No inventory items found.</div>
        )}
      </div>
    </div>
  );
}

function InventoryForm({ item, onSaved, onCancel }: { item: InventoryItem | null; onSaved: () => void; onCancel: () => void }) {
  const token = useAppStore(s => s.token);
  const [form, setForm] = useState({
    medicineName: item?.medicineName || '',
    category: item?.category || '',
    supplier: item?.supplier || '',
    batchNumber: item?.batchNumber || '',
    purchaseDate: item?.purchaseDate || '',
    expiryDate: item?.expiryDate || '',
    quantityAvailable: item?.quantityAvailable || 0,
    minimumStockLevel: item?.minimumStockLevel || 50,
    unitPrice: item?.unitPrice || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (item) {
        const res = await fetch(`${API_BASE}/inventory/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: item.id, ...form }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch(`${API_BASE}/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Create failed');
      }
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">{item ? 'Edit' : 'Add'} Medicine</h3>
      {error && <div className="text-xs text-rose-500">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Medicine Name *</label>
          <input required value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Batch Number *</label>
          <input required value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Category</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Supplier</label>
          <input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Quantity</label>
          <input type="number" value={form.quantityAvailable} onChange={e => setForm({ ...form, quantityAvailable: parseInt(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Min Stock Level</label>
          <input type="number" value={form.minimumStockLevel} onChange={e => setForm({ ...form, minimumStockLevel: parseInt(e.target.value) || 50 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Unit Price (Rs.)</label>
          <input type="number" step="0.01" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Purchase Date</label>
          <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Expiry Date</label>
          <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
