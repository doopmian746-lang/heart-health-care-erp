import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { LabTest, LabOrder } from '../../types';

const API_BASE = '/api';

type Tab = 'dashboard' | 'catalog' | 'orders' | 'results';

export default function LabManagement() {
  const token = useAppStore(s => s.token);
  const patients = useAppStore(s => s.patients);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [tests, setTests] = useState<LabTest[]>([]);
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, todayOrders: 0, totalTests: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = () => {
    if (!token) return;
    Promise.all([
      fetch(`${API_BASE}/lab/tests`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/lab/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/lab/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([t, o, s]) => { setTests(t); setOrders(o); setStats(s); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalog', label: 'Test Catalog' },
    { id: 'orders', label: 'Test Orders' },
    { id: 'results', label: 'Enter Results' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Laboratory Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">{stats.totalTests} tests available · {stats.pending} pending orders</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-10 text-sm text-slate-400">Loading...</div>}

      {!loading && activeTab === 'dashboard' && (
        <DashboardTab stats={stats} orders={orders} />
      )}
      {!loading && activeTab === 'catalog' && (
        <CatalogTab tests={tests} token={token!} onRefresh={fetchData} />
      )}
      {!loading && activeTab === 'orders' && (
        <OrdersTab orders={orders} patients={patients} tests={tests} token={token!} onRefresh={fetchData} />
      )}
      {!loading && activeTab === 'results' && (
        <ResultsTab orders={orders} token={token!} onRefresh={fetchData} />
      )}
    </div>
  );
}

function DashboardTab({ stats, orders }: { stats: any; orders: LabOrder[] }) {
  const pending = orders.filter(o => o.status === 'Pending');
  const inProgress = orders.filter(o => o.status === 'In Progress');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Tests', value: stats.totalTests, color: 'bg-blue-50 border-blue-200 text-blue-800' },
          { label: 'Pending Orders', value: stats.pending, color: 'bg-amber-50 border-amber-200 text-amber-800' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-purple-50 border-purple-200 text-purple-800' },
          { label: 'Completed', value: stats.completed, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
          { label: 'Today Orders', value: stats.todayOrders, color: 'bg-slate-50 border-slate-200 text-slate-800' },
        ].map(kpi => (
          <div key={kpi.label} className={`border rounded-2xl p-4 ${kpi.color}`}>
            <p className="text-[10px] font-semibold uppercase">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-3">Pending Orders</h4>
          <div className="space-y-2">
            {pending.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="font-medium text-slate-700">{o.patientName}</span>
                  <span className="text-slate-400 ml-2">{o.id}</span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : o.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{o.priority}</span>
              </div>
            ))}
            {pending.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No pending orders</p>}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-3">In Progress</h4>
          <div className="space-y-2">
            {inProgress.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl text-xs">
                <div>
                  <span className="font-medium text-slate-700">{o.patientName}</span>
                  <span className="text-slate-400 ml-2">{o.doctorName}</span>
                </div>
                <span className="text-[9px] font-bold text-purple-600">In Progress</span>
              </div>
            ))}
            {inProgress.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No orders in progress</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogTab({ tests, token, onRefresh }: { tests: LabTest[]; token: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [editTest, setEditTest] = useState<LabTest | null>(null);

  const filtered = tests.filter(t =>
    t.testName.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(tests.map(t => t.category))];

  const handleSave = async (data: any) => {
    const url = editTest ? `${API_BASE}/lab/tests/${editTest.id}` : `${API_BASE}/lab/tests`;
    const method = editTest ? 'PATCH' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
    setShowForm(false);
    setEditTest(null);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests..."
            className="w-full px-4 py-2 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditTest(null); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer">
          + Add Test
        </button>
      </div>

      {showForm && (
        <TestForm test={editTest} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTest(null); }} />
      )}

      {categories.map(cat => (
        <div key={cat}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{cat}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.filter(t => t.category === cat).map(t => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.testName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.description}</p>
                  </div>
                  <button onClick={() => { setEditTest(t); setShowForm(true); }} className="text-slate-400 hover:text-blue-600 cursor-pointer text-xs">Edit</button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-slate-400">Normal:</span> <span className="font-medium">{t.normalRange || '—'}</span></div>
                  <div><span className="text-slate-400">Unit:</span> <span className="font-medium">{t.unit || '—'}</span></div>
                  <div><span className="text-slate-400">Cost:</span> <span className="font-bold text-emerald-700">Rs. {t.cost.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersTab({ orders, patients, tests, token, onRefresh }: { orders: LabOrder[]; patients: any[]; tests: LabTest[]; token: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const filtered = orders
    .filter(o => filter === 'All' || o.status === filter)
    .filter(o => o.patientName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (data: any) => {
    await fetch(`${API_BASE}/lab/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, testIds: selectedTests }),
    });
    setShowForm(false);
    setSelectedTests([]);
    onRefresh();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`${API_BASE}/lab/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer">
            + New Order
          </button>
        </div>
      </div>

      {showForm && (
        <OrderForm patients={patients} tests={tests} selectedTests={selectedTests} setSelectedTests={setSelectedTests} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Doctor</th>
                <th className="text-center px-4 py-3">Tests</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-800">{o.patientName}</span>
                    <div className="text-[10px] font-mono text-blue-600">{o.patientId}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{o.doctorName || '—'}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600">{o.items?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : o.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{o.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : o.status === 'In Progress' ? 'bg-purple-100 text-purple-700' : o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {o.status === 'Pending' && (
                      <button onClick={() => handleStatusChange(o.id, 'In Progress')} className="px-2 py-1 text-[10px] bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 cursor-pointer">Start</button>
                    )}
                    {o.status === 'In Progress' && (
                      <button onClick={() => handleStatusChange(o.id, 'Completed')} className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 cursor-pointer">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No orders found.</div>}
      </div>
    </div>
  );
}

function ResultsTab({ orders, token, onRefresh }: { orders: LabOrder[]; token: string; onRefresh: () => void }) {
  const activeOrders = orders.filter(o => o.status === 'In Progress' || o.status === 'Pending');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleResult = async (itemId: number, data: any) => {
    await fetch(`${API_BASE}/lab/results/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Select an order to enter test results. Orders are auto-completed when all results are entered.</p>
      {activeOrders.map(o => (
        <div key={o.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-500">{o.id}</span>
              <span className="text-sm font-medium text-slate-800">{o.patientName}</span>
              <span className="text-xs text-slate-400">{o.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.status === 'In Progress' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedOrder === o.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {expandedOrder === o.id && o.items && (
            <div className="border-t border-slate-100 p-4 space-y-3">
              {o.items.map(item => (
                <ResultItem key={item.id} item={item} onSubmit={(data) => handleResult(item.id, data)} />
              ))}
            </div>
          )}
        </div>
      ))}
      {activeOrders.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No orders to process.</div>}
    </div>
  );
}

function ResultItem({ item, onSubmit }: { item: any; onSubmit: (data: any) => void }) {
  const [resultValue, setResultValue] = useState(item.resultValue || '');
  const [result, setResult] = useState(item.result || '');
  const [saving, setSaving] = useState(false);

  const isAbnormal = () => {
    if (!resultValue || !item.normalRange) return false;
    const num = parseFloat(resultValue);
    if (isNaN(num)) return false;
    const match = item.normalRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      return num < min || num > max;
    }
    return false;
  };

  const handleSubmit = async () => {
    setSaving(true);
    const abnormal = isAbnormal();
    await onSubmit({
      resultValue, result: result || (abnormal ? 'Abnormal' : 'Normal'),
      status: abnormal ? 'Abnormal' : 'Completed',
    });
    setSaving(false);
  };

  return (
    <div className={`p-3 rounded-xl border ${isAbnormal() ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-slate-800">{item.testName}</span>
          <span className="text-[10px] text-slate-400 ml-2">Normal: {item.normalRange} {item.unit}</span>
        </div>
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Abnormal' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
      </div>
      {item.status === 'Pending' ? (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-400">Result Value</label>
            <input value={resultValue} onChange={e => setResultValue(e.target.value)} placeholder={`Enter value (${item.unit})`}
              className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-400">Notes</label>
            <input value={result} onChange={e => setResult(e.target.value)} placeholder="e.g. Normal, Slightly elevated"
              className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={handleSubmit} disabled={saving || !resultValue}
            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      ) : (
        <div className="text-xs">
          <span className="text-slate-500">Result:</span> <span className="font-bold">{item.resultValue} {item.unit}</span>
          <span className={`ml-2 px-2 py-0.5 text-[9px] font-bold rounded-full ${item.status === 'Abnormal' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.result || item.status}</span>
        </div>
      )}
    </div>
  );
}

function TestForm({ test, onSave, onCancel }: { test: LabTest | null; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    testName: test?.testName || '', category: test?.category || 'General',
    description: test?.description || '', normalRange: test?.normalRange || '',
    unit: test?.unit || '', cost: test?.cost || 0,
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">{test ? 'Edit Test' : 'Add New Test'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2"><label className="text-[10px] font-semibold text-slate-400 uppercase">Test Name *</label>
          <input required value={form.testName} onChange={e => setForm({ ...form, testName: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Hematology', 'Biochemistry', 'Cardiology', 'Radiology', 'Pathology', 'Endocrinology', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Normal Range</label>
          <input value={form.normalRange} onChange={e => setForm({ ...form, normalRange: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Unit</label>
          <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Cost (Rs.)</label>
          <input type="number" value={form.cost || ''} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="sm:col-span-3"><label className="text-[10px] font-semibold text-slate-400 uppercase">Description</label>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}

function OrderForm({ patients, tests, selectedTests, setSelectedTests, onSubmit, onCancel }: { patients: any[]; tests: LabTest[]; selectedTests: string[]; setSelectedTests: (t: string[]) => void; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ patientId: '', doctorName: '', priority: 'Routine', notes: '' });
  const [testSearch, setTestSearch] = useState('');

  const filteredTests = tests.filter(t => t.testName.toLowerCase().includes(testSearch.toLowerCase()));

  const toggleTest = (id: string) => {
    setSelectedTests(selectedTests.includes(id) ? selectedTests.filter(t => t !== id) : [...selectedTests, id]);
  };

  const totalCost = tests.filter(t => selectedTests.includes(t.id)).reduce((s, t) => s + t.cost, 0);

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">New Lab Order</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Patient *</label>
          <select required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select patient...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>)}
          </select></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Doctor</label>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="text-[10px] font-semibold text-slate-400 uppercase">Priority</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Routine', 'Urgent', 'STAT'].map(p => <option key={p} value={p}>{p}</option>)}
          </select></div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-slate-400 uppercase">Select Tests *</label>
        <input type="text" value={testSearch} onChange={e => setTestSearch(e.target.value)} placeholder="Search tests..."
          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="mt-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
          {filteredTests.map(t => (
            <label key={t.id} className={`flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-slate-50 ${selectedTests.includes(t.id) ? 'bg-blue-50' : ''}`}>
              <input type="checkbox" checked={selectedTests.includes(t.id)} onChange={() => toggleTest(t.id)} className="rounded" />
              <span className="flex-1 font-medium text-slate-700">{t.testName}</span>
              <span className="text-[10px] text-slate-400">{t.category}</span>
              <span className="text-[10px] font-bold text-emerald-700">Rs. {t.cost.toLocaleString()}</span>
            </label>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-1">{selectedTests.length} tests selected · Total: Rs. {totalCost.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={!form.patientId || selectedTests.length === 0}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">Create Order</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
