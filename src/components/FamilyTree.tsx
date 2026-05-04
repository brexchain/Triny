import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { PUPPIES } from '../constants';

interface Enkel {
  id: number;
  name: string;
  parent: string;
  family: string;
}

interface FamilyTreeProps {
  isAdmin: boolean;
}

export function FamilyTree({ isAdmin }: FamilyTreeProps) {
  const [enkel, setEnkel] = useState<Enkel[]>([]);

  const addEnkel = () => {
    const name = prompt("Name des Enkels?");
    const parent = prompt("Elternteil? (z.B. Bounty)");
    const family = prompt("Neue Familie?");

    if (name && parent) {
      setEnkel([...enkel, {
        id: Date.now(),
        name,
        parent,
        family: family || 'Unbekannt'
      }]);
    }
  };

  const removeEnkel = (id: number) => {
    setEnkel(enkel.filter(e => e.id !== id));
  };

  return (
    <div className="py-12 px-4 bg-white dark:bg-[#0a0f0a] shadow-2xl rounded-2xl border-2 border-accent/10 dark:border-gold/10">
      <div className="text-center mb-16">
        <div className="inline-block border-4 border-accent dark:border-gold p-8 rounded-2xl transform -rotate-1 bg-white dark:bg-[#1a241a] shadow-xl">
          <p className="font-bold text-sm mb-2 uppercase tracking-[0.3em] text-accent/60 dark:text-gold/60">Die Ahnentafel</p>
          <p className="text-4xl font-display text-accent dark:text-gold">Coffee (Papa) & <br className="sm:hidden" /> Trinity van Bella (Mama)</p>
        </div>
        <div className="text-5xl text-accent/30 dark:text-gold/30 my-6 animate-bounce">↓</div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-24 px-4 sm:px-8">
        {PUPPIES.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#151a15] border-l-8 border-accent dark:border-gold p-6 rounded-xl shadow-[0_10px_40px_-15px_rgba(4,131,4,0.3)] dark:shadow-[0_10px_40px_-15px_rgba(212,175,55,0.1)] min-w-[240px] text-left transform transition-all hover:-translate-y-2"
          >
            <p className="font-bold text-accent dark:text-gold text-2xl mb-1">#{i+1} {p.name}</p>
            <p className="text-lg font-hand text-ink/70 dark:text-gold/70 italic underline decoration-accent/20 dark:decoration-gold/20">{p.gender}</p>
            <div className="mt-4 p-3 bg-paper/50 dark:bg-black/20 rounded-lg border border-accent/10 dark:border-gold/10">
              <p className="text-xs font-mono tracking-tighter text-ink/80 dark:text-gold/90">
                <span className="opacity-50">START:</span> {p.stats.geburtsgewicht} <br />
                <span className="opacity-50">12 WO:</span> {p.stats.wochen12}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mb-12 py-12 border-t-2 border-dashed border-accent/10 dark:border-gold/10">
        <div className="text-4xl text-accent/20 dark:text-gold/20 mb-6">↓</div>
        <p className="font-display text-4xl text-accent dark:text-gold italic mb-8">Nächste Generation ...</p>
        {isAdmin && (
          <button
            onClick={addEnkel}
            className="group relative inline-flex items-center gap-3 bg-accent dark:bg-gold text-paper dark:text-neutral-900 px-10 py-5 rounded-full font-display text-3xl shadow-[0_20px_50px_-10px_rgba(4,131,4,0.4)] transition-all hover:scale-105 hover:shadow-accent/40 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={32} /> Enkel eintragen
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-12">
        <AnimatePresence>
          {enkel.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-white dark:bg-[#1a241a] border-2 border-accent dark:border-gold p-8 rounded-3xl shadow-xl min-w-[200px] relative group overflow-hidden"
            >
              {isAdmin && (
                <button
                  onClick={() => removeEnkel(e.id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="text-4xl mb-4 text-center">🐾</div>
              <p className="font-bold text-center text-2xl text-accent dark:text-gold font-display">{e.name}</p>
              <div className="mt-6 text-sm border-t border-dashed border-accent/20 dark:border-gold/20 pt-4 space-y-2 font-hand">
                <p className="flex justify-between"><span className="opacity-50">Kind von:</span> <span className="font-bold">{e.parent}</span></p>
                <p className="flex justify-between"><span className="opacity-50">Familie:</span> <span className="italic">{e.family}</span></p>
              </div>
              <div className="absolute top-0 left-0 w-1 h-full bg-accent dark:bg-gold opacity-10" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
