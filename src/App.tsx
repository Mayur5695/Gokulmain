import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  List, 
  Home, 
  BarChart3, 
  Trash2, 
  Calendar as CalendarIcon,
  Search,
  Wallet
} from 'lucide-react';
import { CATEGORIES, PARTNERS, type Expense, type FixedExpense } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'fixed' | 'summary'>('add');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cat, setCat] = useState<keyof typeof CATEGORIES | ''>('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(PARTNERS[0]);
  const [notes, setNotes] = useState('');

  // Fixed Form State
  const [fName, setFName] = useState('');
  const [fAmount, setFAmount] = useState('');
  const [fDay, setFDay] = useState('');

  // Filtering
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('gokul_expenses');
    if (saved) setExpenses(JSON.parse(saved));
    const savedFixed = localStorage.getItem('gokul_fixed');
    if (savedFixed) setFixedExpenses(JSON.parse(savedFixed));
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('gokul_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    if (fixedExpenses.length > 0) {
      localStorage.setItem('gokul_fixed', JSON.stringify(fixedExpenses));
    }
  }, [fixedExpenses]);

  const addExpense = () => {
    if (!date || !cat || !amount) {
      alert('कृपया सर्व माहिती भरा!');
      return;
    }
    const newExp: Expense = {
      id: Date.now().toString(),
      date,
      category: cat as keyof typeof CATEGORIES,
      amount: parseFloat(amount),
      paidBy,
      notes,
      createdAt: Date.now()
    };
    setExpenses([newExp, ...expenses]);
    setCat('');
    setAmount('');
    setNotes('');
    alert('✅ खर्च नोंदवला!');
  };

  const deleteExpense = (id: string) => {
    if (confirm('हा खर्च delete करायचा?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const addFixed = () => {
    if (!fName || !fAmount || !fDay) return;
    const newFixed: FixedExpense = {
      id: Date.now().toString(),
      name: fName,
      amount: parseFloat(fAmount),
      dayOfMonth: parseInt(fDay),
      notes: ''
    };
    setFixedExpenses([...fixedExpenses, newFixed]);
    setFName('');
    setFAmount('');
    setFDay('');
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonthStr = new Date().toISOString().slice(0, 7);
  const totalMonth = expenses.filter(e => e.date.startsWith(thisMonthStr)).reduce((s, e) => s + e.amount, 0);
  const totalInv = expenses.filter(e => ['inventory', 'transport'].includes(e.category)).reduce((s, e) => s + e.amount, 0);

  const filteredExpenses = expenses.filter(e => {
    const mMatch = filterMonth === 'all' || e.date.startsWith(filterMonth);
    const cMatch = filterCat === 'all' || e.category === filterCat;
    return mMatch && cMatch;
  });

  const months = Array.from(new Set(expenses.map(e => e.date.slice(0, 7)))).sort().reverse();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-saffron to-[#CC4400] px-6 py-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center font-bold text-dark text-xl shadow-md">GS</div>
          <div>
            <h1 className="text-white font-extrabold text-xl leading-none">Gokul Snacks</h1>
            <p className="text-white/70 text-[10px] tracking-widest uppercase mt-1">Dealership Tracker</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          {['Mayur', 'Suhail', 'Rahul'].map(p => (
            <span key={p} className="bg-black/20 border border-white/20 rounded-full px-3 py-1 text-xs text-white font-semibold">
              {p}
            </span>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="एकूण खर्च" amount={fmt(totalAll)} sub="All Time" color="text-gold" />
          <StatCard label="या महिन्यातील" amount={fmt(totalMonth)} sub={new Date().toLocaleString('mr-IN', { month: 'long', year: 'numeric' })} color="text-saffron-light" />
          <StatCard label="Inventory खर्च" amount={fmt(totalInv)} sub="All Time" color="text-blue-400" />
        </section>

        <nav className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'add'} onClick={() => setActiveTab('add')} icon={<PlusCircle size={18}/>} label="खर्च नोंद" />
          <TabButton active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<List size={18}/>} label="सर्व खर्च" />
          <TabButton active={activeTab === 'fixed'} onClick={() => setActiveTab('fixed')} icon={<Home size={18}/>} label="Fixed खर्च" />
          <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<BarChart3 size={18}/>} label="सारांश" />
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === 'add' && (
            <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-card border border-border-main rounded-2xl p-6 shadow-xl">
                <h3 className="text-gold font-bold mb-6 flex items-center gap-2 tracking-wide">नवीन खर्च नोंदवा</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <InputGroup label="खर्चाची तारीख">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron transition-colors" />
                  </InputGroup>
                  <InputGroup label="खर्चाचा प्रकार">
                    <select value={cat} onChange={e => setCat(e.target.value as any)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron transition-colors">
                      <option value="">-- प्रकार निवडा --</option>
                      {Object.entries(CATEGORIES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {val.label}</option>
                      ))}
                    </select>
                  </InputGroup>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <InputGroup label="रक्कम (₹)">
                    <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron transition-colors" />
                  </InputGroup>
                  <InputGroup label="कोणी दिले (Partner)">
                    <select value={paidBy} onChange={e => setPaidBy(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron transition-colors">
                      {PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </InputGroup>
                </div>
                <InputGroup label="तपशील / नोट्स" className="mb-6">
                  <textarea placeholder="उदा. March rent paid, 10 bags Bhujia order..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron transition-colors min-h-[80px]" />
                </InputGroup>
                <button onClick={addExpense} className="w-full bg-gradient-to-r from-saffron to-[#CC4400] text-white font-bold py-3 rounded-xl shadow-lg hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> ✅ खर्च नोंदवा
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center bg-card/40 p-4 rounded-xl border border-border-main mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-main uppercase tracking-wider">महिना:</span>
                  <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-card-dark border border-border-main rounded-lg px-3 py-2 text-sm text-text-main outline-none">
                    <option value="all">सर्व</option>
                    {months.map(m => (
                      <option key={m} value={m}>
                        {new Date(parseInt(m.split('-')[0]), parseInt(m.split('-')[1])-1).toLocaleString('mr-IN', { month: 'long', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-main uppercase tracking-wider">प्रकार:</span>
                  <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-card-dark border border-border-main rounded-lg px-3 py-2 text-sm text-text-main outline-none">
                    <option value="all">सर्व</option>
                    {Object.entries(CATEGORIES).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-card border border-border-main rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-card-dark/50">
                        <th className="px-5 py-4 text-[10px] font-bold text-muted-main uppercase tracking-widest whitespace-nowrap">तारीख</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-muted-main uppercase tracking-widest whitespace-nowrap">प्रकार</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-muted-main uppercase tracking-widest whitespace-nowrap">रक्कम</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-muted-main uppercase tracking-widest whitespace-nowrap">दिले</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-muted-main uppercase tracking-widest whitespace-nowrap text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-muted-main">
                            <Search className="mx-auto mb-2 opacity-20" size={40} />
                            <p>कोणताही खर्च आढळला नाही</p>
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map(e => (
                          <tr key={e.id} className="border-t border-border-main hover:bg-white/[0.02] transition-colors group">
                            <td className="px-5 py-4 text-xs font-medium">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                            <td className="px-5 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${getCategoryColor(e.category)}`}>
                                {CATEGORIES[e.category]?.label || e.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-bold text-red-400">{fmt(e.amount)}</td>
                            <td className="px-5 py-4 text-xs font-semibold text-text-main/80">{e.paidBy}</td>
                            <td className="px-5 py-4 text-right">
                              <button onClick={() => deleteExpense(e.id)} className="p-2 text-muted-main hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'fixed' && (
             <motion.div key="fixed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-card border border-border-main rounded-2xl p-6 shadow-xl">
                  <h3 className="text-gold font-bold mb-6 flex items-center gap-2">🏠 Fixed खर्च नोंदवा</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <InputGroup label="खर्चाचे नाव">
                      <input type="text" placeholder="उदा. Warehouse Rent" value={fName} onChange={e => setFName(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron" />
                    </InputGroup>
                    <InputGroup label="रक्कम (₹/महिना)">
                      <input type="number" placeholder="0" value={fAmount} onChange={e => setFAmount(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron" />
                    </InputGroup>
                    <InputGroup label="तारीख (दर महा)">
                      <input type="number" placeholder="1-28" value={fDay} onChange={e => setFDay(e.target.value)} className="w-full bg-card-dark border border-border-main rounded-xl p-3 text-text-main outline-none focus:border-saffron" />
                    </InputGroup>
                  </div>
                  <button onClick={addFixed} className="bg-saffron/10 hover:bg-saffron/20 text-saffron font-bold py-3 px-6 rounded-xl border border-saffron/30 transition-all">
                    + खर्च जोडा
                  </button>
                </div>
                <div className="bg-card border border-border-main rounded-2xl p-6 shadow-xl space-y-4">
                   <h4 className="text-white font-bold pb-2 border-b border-border-main">Fixed Monthly खर्च</h4>
                   <div className="divide-y divide-border-main">
                   {fixedExpenses.length === 0 ? (
                     <p className="text-muted-main text-center py-6">अजून कोणताही निव्वळ खर्च नाही</p>
                   ) : (
                     fixedExpenses.map(f => (
                       <div key={f.id} className="flex justify-between items-center py-4">
                         <div>
                           <p className="font-bold text-text-main">{f.name}</p>
                           <p className="text-[10px] text-muted-main">दर महिन्याच्या {f.dayOfMonth} तारखेला</p>
                         </div>
                         <div className="flex items-center gap-4">
                           <p className="font-extrabold text-saffron-light text-lg">{fmt(f.amount)}</p>
                           <button onClick={() => setFixedExpenses(fixedExpenses.filter(i => i.id !== f.id))} className="text-muted-main hover:text-red-400 p-2 transition-colors">
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </div>
                     ))
                   )}
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {months.map(m => {
                const monthExpenses = expenses.filter(e => e.date.startsWith(m));
                const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
                const partnersSum = PARTNERS.reduce((acc, p) => {
                   acc[p] = monthExpenses.filter(e => e.paidBy === p).reduce((s, e) => s + e.amount, 0);
                   return acc;
                }, {} as Record<string, number>);

                return (
                  <div key={m} className="bg-card border border-border-main rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white font-extrabold text-xl capitalize">
                        {new Date(parseInt(m.split('-')[0]), parseInt(m.split('-')[1])-1).toLocaleString('mr-IN', { month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-2xl font-black text-gold">{fmt(total)}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                       {Object.entries(CATEGORIES).map(([key, val]) => {
                         const catTotal = monthExpenses.filter(e => e.category === key).reduce((s, e) => s + e.amount, 0);
                         if (catTotal === 0) return null;
                         return (
                           <div key={key} className="flex justify-between items-center py-2 border-b border-border-main/50">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryColor(key as any)}`}>{val.label}</span>
                             <p className="font-bold text-text-main">{fmt(catTotal)}</p>
                           </div>
                         );
                       })}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed border-border-main text-xs">
                       {Object.entries(partnersSum).map(([p, a]) => (
                         a > 0 && <p key={p} className="text-muted-main">{p}: <span className="text-text-main font-bold">{fmt(a)}</span></p>
                       ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 text-center bg-black/20">
        <p className="text-muted-main text-[10px] tracking-widest uppercase">© 2026 Gokul Snacks • Business Intelligence</p>
      </footer>
    </div>
  );
}

function StatCard({ label, amount, sub, color }: { label: string; amount: string; sub: string; color: string }) {
  return (
    <div className="bg-card border border-border-main rounded-2xl p-5 flex flex-col gap-1 hover:-translate-y-1 transition-transform shadow-lg">
      <span className="text-[10px] text-muted-main font-bold uppercase tracking-widest">{label}</span>
      <span className={`text-2xl font-black ${color}`}>{amount}</span>
      <span className="text-[10px] text-muted-main opacity-60">{sub}</span>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap
        ${active 
          ? 'bg-saffron text-white shadow-[0_0_20px_rgba(255,107,0,0.4)]' 
          : 'bg-transparent text-muted-main border border-border-main hover:border-saffron hover:text-text-main'}`}
    >
      {icon} {label}
    </button>
  );
}

function InputGroup({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] font-bold text-muted-main uppercase tracking-widest mb-2 block">{label}</label>
      {children}
    </div>
  );
}

function getCategoryColor(cat: keyof typeof CATEGORIES) {
  switch (CATEGORIES[cat]?.color) {
    case 'blue': return 'bg-blue-400/10 text-blue-400';
    case 'gold': return 'bg-gold/10 text-gold';
    case 'saffron': return 'bg-saffron/10 text-saffron-light';
    case 'green': return 'bg-emerald-400/10 text-emerald-400';
    default: return 'bg-muted-main/10 text-muted-main';
  }
}
