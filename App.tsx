/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Home, 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  CheckSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [selectedPartner, setSelectedPartner] = useState('Mayur');
  const [expenseType, setExpenseType] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="orange-gradient py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#facc15] text-black font-bold p-2.5 rounded-lg shadow-inner flex items-center justify-center text-xl">
            GS
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-white leading-none">
              Gokul Snacks
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-semibold mt-1 opacity-80">
              Dealership Tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['Mayur', 'Suhail', 'Rahul'].map((user) => (
            <button 
              key={user}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-black/10 bg-black/5 text-stone-900 hover:bg-black/10 transition-colors"
            >
              {user}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'à¤à¤•à¥‚à¤£ à¤–à¤°à¥à¤š', value: 'â‚¹0', sub: 'All time', color: 'text-stone-100' },
            { label: 'à¤¯à¤¾ à¤®à¤¹à¤¿à¤¨à¥à¤¯à¤¾à¤¤à¥€à¤²', value: 'â‚¹0', sub: 'à¤à¤ªà¥à¤°à¤¿à¤² à¥¨à¥¦à¥¨à¥¬', color: 'text-stone-100' },
            { label: 'INVENTORY à¤–à¤°à¥à¤š', value: 'â‚¹0', sub: 'All time', color: 'text-blue-400' },
          ].map((card, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="custom-card relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">{card.label}</p>
              <h2 className={`text-4xl font-display font-bold ${card.color} mb-2`}>{card.value}</h2>
              <p className="text-[10px] text-stone-600 font-medium">{card.sub}</p>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <BarChart3 size={40} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl orange-gradient text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus size={20} />
            <span>à¤–à¤°à¥à¤š à¤¨à¥‹à¤‚à¤¦</span>
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 font-bold hover:bg-stone-800 transition-colors">
            <FileText size={18} />
            <span>à¤¸à¤°à¥à¤µ à¤–à¤°à¥à¤š</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 font-bold hover:bg-stone-800 transition-colors">
            <Home size={18} />
            <span>Fixed à¤–à¤°à¥à¤š</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 font-bold hover:bg-stone-800 transition-colors">
            <BarChart3 size={18} />
            <span>à¤¸à¤¾à¤°à¤¾à¤‚à¤¶</span>
          </button>
        </div>

        {/* Expense Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="custom-card max-w-4xl border-stone-800/50 bg-[#121110]"
        >
          <h3 className="text-orange-500 font-display font-bold text-xl mb-8">à¤¨à¤µà¥€à¤¨ à¤–à¤°à¥à¤š à¤¨à¥‹à¤‚à¤¦à¤µà¤¾</h3>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Date */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold flex items-center gap-1.5">
                à¤–à¤°à¥à¤šà¤¾à¤šà¥€ à¤¤à¤¾à¤°à¥€à¤–
              </label>
              <div className="relative group">
                <input 
                  type="date" 
                  defaultValue="2026-04-26"
                  className="w-full bg-[#0a0a0a] border border-stone-800 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-stone-300 transition-all appearance-none"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700 group-focus-within:text-primary/50 transition-colors" size={18} />
              </div>
            </div>

            {/* Expense Type */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                à¤–à¤°à¥à¤šà¤¾à¤šà¤¾ à¤ªà¥à¤°à¤•à¤¾à¤°
              </label>
              <div className="relative">
                <select 
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-stone-800 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-stone-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- à¤ªà¥à¤°à¤•à¤¾à¤° à¤¨à¤¿à¤µà¤¡à¤¾ --</option>
                  <option value="inventory">Inventory</option>
                  <option value="salary">Salary</option>
                  <option value="rent">Rent</option>
                  <option value="utility">Utility</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                à¤°à¤•à¥à¤•à¤® (â‚¹)
              </label>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-[#0a0a0a] border border-stone-800 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-stone-300 transition-all"
              />
            </div>

            {/* Partner */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                à¤•à¥‹à¤£à¥€ à¤¦à¤¿à¤²à¥‡ (PARTNER)
              </label>
              <div className="relative">
                <select 
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-stone-800 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-stone-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="Mayur">Mayur</option>
                  <option value="Suhail">Suhail</option>
                  <option value="Rahul">Rahul</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                à¤¤à¤ªà¤¶à¥€à¤² / à¤¨à¥‹à¤Ÿà¥à¤¸
              </label>
              <textarea 
                rows={4}
                placeholder="à¤‰à¤¦à¤¾. March rent paid, 10 bags Bhujia order..."
                className="w-full bg-[#0a0a0a] border border-stone-800 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-stone-300 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button 
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl orange-gradient text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto"
              >
                <CheckSquare size={18} />
                <span>à¤–à¤°à¥à¤š à¤¨à¥‹à¤‚à¤¦à¤µà¤¾</span>
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
