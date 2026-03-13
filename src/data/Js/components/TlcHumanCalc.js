'use strict';
/**
 * TlcHumanCalc.js — Human Growth Calculator
 * Schwebenes Fenster mit zwei Tabs:
 *   1. Inventory — Memories + Food Mengen eingeben
 *   2. Results   — Welche Human Types sind growable
 */

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */

const HC_MEMORIES = [
  { id:'ash_notebook',       name:'Ash Notebook',          adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'assembly_instr',     name:'Assembly Instructions', adaptability:0, creativity:0, communication:0, discipline:2, empathy:0, focus:0, leadership:0, logic:8, patience:0, wisdom:8 },
  { id:'basketball',         name:'Basketball',            adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:1, wisdom:0 },
  { id:'biology_notes',      name:'Biology Notes',         adaptability:10, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:0, wisdom:10 },
  { id:'blueprints',         name:'Blueprints',            adaptability:10, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:5, patience:0, wisdom:0 },
  { id:'bowling_ball',       name:'Bowling Ball',          adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:1, wisdom:0 },
  { id:'bowling_pin',        name:'Bowling Pin',           adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:1, wisdom:0 },
  { id:'camera',             name:'Camera',                adaptability:0, creativity:5, communication:5, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'cards',              name:'Cards',                 adaptability:0, creativity:0, communication:5, discipline:0, empathy:5, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'cognitive_cards',    name:'Cognitive Cards',       adaptability:7, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:5, patience:0, wisdom:3 },
  { id:'commanders_log',     name:"Commander's Log",       adaptability:0, creativity:0, communication:0, discipline:7, empathy:0, focus:0, leadership:8, logic:0, patience:0, wisdom:0 },
  { id:'compass',            name:'Compass',               adaptability:6, creativity:0, communication:0, discipline:0, empathy:0, focus:3, leadership:3, logic:0, patience:0, wisdom:0 },
  { id:'crayon',             name:'Crayon',                adaptability:0, creativity:5, communication:0, discipline:0, empathy:0, focus:2, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'encyclopedia',       name:'Encyclopedia',          adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:5, patience:0, wisdom:10 },
  { id:'first_aid',          name:'First Aid',             adaptability:10, creativity:0, communication:0, discipline:0, empathy:0,focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'guitar',             name:'Guitar',                adaptability:0, creativity:3, communication:3, discipline:0, empathy:0, focus:3, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'love_letters',       name:'Love Letters',          adaptability:0, creativity:0, communication:0, discipline:0, empathy:0,focus:0, leadership:0, logic:0, patience:0, wisdom:10 },
  { id:'maps',               name:'Maps',                  adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:5, logic:0, patience:0, wisdom:10 },
  { id:'meditation',         name:'Meditation',            adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:5, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'mirror',             name:'Mirror',                adaptability:0, creativity:0, communication:0, discipline:0, empathy:5, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'music_notes',        name:'Music Notes',           adaptability:0, creativity:5, communication:4, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'mystery_box',        name:'Mystery Box',           adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:5, wisdom:0 },
  { id:'plans',              name:'Plans',                 adaptability:0, creativity:0, communication:8, discipline:7, empathy:0, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'programming_manual', name:'Programming Manual',    adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:10,patience:0, wisdom:0 },
  { id:'small_human_art',    name:'Small Human Art',       adaptability:0, creativity:0, communication:0, discipline:0, empathy:5, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'small_tree',         name:'Small Tree',            adaptability:0, creativity:0, communication:0, discipline:5, empathy:0, focus:0, leadership:0, logic:0, patience:5, wisdom:0 },
  { id:'stopwatch',          name:'Stopwatch',             adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0, patience:5, wisdom:0 },
  { id:'sudoku_book',        name:'Sudoku Book',           adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:10,patience:0, wisdom:0 },
  { id:'survival_diagrams',  name:'Survival Diagrams',     adaptability:10, creativity:0, communication:0, discipline:0,empathy:0, focus:0, leadership:5, logic:0, patience:0, wisdom:0 },
  { id:'teddy_bear',         name:'Teddy Bear',            adaptability:0, creativity:0, communication:0, discipline:0, empathy:3, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'the_art_of_war',     name:'The Art of War',        adaptability:0, creativity:0, communication:5, discipline:0, empathy:0, focus:0, leadership:10,logic:0, patience:0, wisdom:0 },
  { id:'tommy',              name:'Tommy',                 adaptability:0, creativity:0, communication:0, discipline:0, empathy:3, focus:0, leadership:0, logic:0, patience:0, wisdom:0 },
  { id:'travel_journal',     name:'Travel Journal',        adaptability:10, creativity:0, communication:0, discipline:0, empathy:0, focus:0, leadership:0, logic:0,patience:0, wisdom:0 },
  { id:'wheres_tommy',       name:"Where's Tommy",         adaptability:0, creativity:0, communication:0, discipline:0, empathy:0, focus:5, leadership:0, logic:0, patience:5, wisdom:0 },
];

const HC_FOOD = [
  { id:'high_fat',        name:'High-Fat',             height:1,  intellect:1, life_expectancy:1,  strength:1,  weight:8   },
  { id:'mind_surge',      name:'Mind Surge',           height:1,  intellect:6, life_expectancy:6,  strength:1,  weight:1   },
  { id:'nutri_core',      name:'Nutri-Core',           height:3,  intellect:3, life_expectancy:3,  strength:3,  weight:3   },
  { id:'physique_fuel',   name:'Physique Fuel',        height:5,  intellect:1, life_expectancy:1,  strength:5,  weight:1   },
  { id:'bone_fortify',    name:'Bone-Fortify',         height:8,  intellect:2, life_expectancy:2,  strength:14,  weight:2   },
  { id:'endura_growth',   name:'Endura-Growth',        height:2,  intellect:12, life_expectancy:8,  strength:2,  weight:2   },
  { id:'immune_boost',    name:'Immune Boost',         height:6,  intellect:6, life_expectancy:6,  strength:6,  weight:6   },
  { id:'muscle_fort',     name:'Muscle Fortification', height:2,  intellect:2, life_expectancy:2,  strength:15, weight:8   },
  { id:'neuro_boost',     name:'Neuro-Boost',          height:2,  intellect:15, life_expectancy:10,  strength:2,  weight:2   },
  { id:'hyper_evolution', name:'Hyper-Evolution',      height:30, intellect:20, life_expectancy:5,  strength:3,  weight:3   },
  { id:'mito_surge',      name:'Mitochondrial Surge',  height:20, intellect:3, life_expectancy:12,  strength:28,  weight:3   },
  { id:'nanite_infusion', name:'Nanite Infusion',      height:25, intellect:25, life_expectancy:6,  strength:3,  weight:3   },
  { id:'ultimate_genesis',name:'Ultimate Genesis',     height:50, intellect:50,life_expectancy:40, strength:10, weight:10  },
];

// Basis-Werte die jeder Human bekommt (automatisch)
const HC_BASE = { height: 30, weight: 20, life_expectancy: 10 };

const HC_HUMANS = [
  // ── Tier 1 ──
  { name:'Station Roamer',      tier:1, category:'Explorer',      logic:0, focus:1,  discipline:0, creativity:2,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:1,  strength:60, height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Door Jammer',         tier:1, category:'Military',      logic:0, focus:2,  discipline:2, creativity:0,  communication:0, empathy:0,  leadership:1, wisdom:0,  patience:0,  adaptability:0,  strength:60, height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Nutrient Handler',    tier:1, category:'Agriculture',   logic:0, focus:0,  discipline:0, creativity:5,  communication:0, empathy:0,  leadership:5, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:190,weight:20,intellect:0, life_expectancy:60 },
  { name:'Maintenance Engineer',tier:1, category:'Engineer',      logic:3, focus:4,  discipline:5, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:71, height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Lab Technician',      tier:1, category:'Science',       logic:5, focus:0,  discipline:0, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:3,  patience:5,  adaptability:0,  strength:0,  height:0, weight:0, intellect:80,life_expectancy:0  },
  { name:'Basic Supplier',      tier:1, category:'Logistics',     logic:2, focus:4,  discipline:3, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:130,weight:0, intellect:0, life_expectancy:0  },
  { name:'Visual Technician',   tier:1, category:'Arts & Culture',logic:0, focus:0,  discipline:0, creativity:5,  communication:4, empathy:3,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:60 },
  { name:'Health Assistant',    tier:1, category:'Healthcare',    logic:0, focus:0,  discipline:0, creativity:0,  communication:0, empathy:5,  leadership:0, wisdom:3,  patience:5,  adaptability:0,  strength:0,  height:0, weight:70,intellect:0, life_expectancy:0  },
  { name:'Room Supervisor',     tier:1, category:'Leadership',    logic:0, focus:0,  discipline:0, creativity:0,  communication:4, empathy:3,  leadership:5, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:50 },
  { name:'Manual Holder',       tier:1, category:'Educator',      logic:0, focus:0,  discipline:0, creativity:0,  communication:5, empathy:0,  leadership:0, wisdom:10, patience:10, adaptability:0,  strength:0,  height:190,weight:60,intellect:0, life_expectancy:0  },
  // ── Tier 2 ──
  { name:'Guard',               tier:2, category:'Military',      logic:0, focus:12, discipline:15,creativity:0,  communication:0, empathy:0,  leadership:10,wisdom:0,  patience:0,  adaptability:0,  strength:120,height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Star Analyzer',       tier:2, category:'Explorer',      logic:0, focus:10, discipline:0, creativity:20, communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:15, strength:100,height:0, weight:0, intellect:0, life_expectancy:70 },
  { name:'Station Quartermaster',tier:2,category:'Leadership',    logic:0, focus:0,  discipline:0, creativity:0,  communication:10,empathy:10, leadership:15,wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:80 },
  { name:'Growth Specialist',   tier:2, category:'Agriculture',   logic:0, focus:0,  discipline:0, creativity:20, communication:0, empathy:0,  leadership:10,wisdom:0,  patience:15, adaptability:0,  strength:0,  height:210,weight:0, intellect:0, life_expectancy:75 },
  { name:'Systems Engineer',    tier:2, category:'Engineer',      logic:10, focus:10,discipline:10,creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:70, height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Teacher',             tier:2, category:'Educator',      logic:0, focus:0,  discipline:0, creativity:0,  communication:15,empathy:0,  leadership:0, wisdom:10, patience:15, adaptability:0,  strength:0,  height:190,weight:80,intellect:0, life_expectancy:0  },
  { name:'Distributor',         tier:2, category:'Logistics',     logic:12, focus:15,discipline:0, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:190,weight:0, intellect:0, life_expectancy:0  },
  { name:'Field Research Scientist',tier:2,category:'Science',    logic:9, focus:0,  discipline:0, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:9,  patience:9,  adaptability:0,  strength:0,  height:0, weight:0, intellect:110,life_expectancy:0 },
  { name:'Sculptor',            tier:2, category:'Arts & Culture',logic:0, focus:0,  discipline:0, creativity:20, communication:10,empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:90 },
  { name:'Doctor',              tier:2, category:'Healthcare',    logic:0, focus:0,  discipline:0, creativity:0,  communication:0, empathy:15, leadership:0, wisdom:10, patience:12, adaptability:0,  strength:0,  height:0, weight:100,intellect:0, life_expectancy:0  },
  // ── Tier 3 ──
  { name:'Resource Director',   tier:3, category:'Logistics',     logic:30, focus:40,discipline:35,creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:220,weight:0, intellect:0, life_expectancy:0  },
  { name:'Biosphere Director',  tier:3, category:'Agriculture',   logic:0, focus:0,  discipline:0, creativity:35, communication:0, empathy:0,  leadership:30,wisdom:0,  patience:40, adaptability:0,  strength:0,  height:220,weight:0, intellect:0, life_expectancy:130},
  { name:'Station Protector',   tier:3, category:'Military',      logic:0, focus:35, discipline:40,creativity:0,  communication:0, empathy:0,  leadership:30,wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:210,weight:0, intellect:0, life_expectancy:0  },
  { name:'Professor',           tier:3, category:'Educator',      logic:0, focus:0,  discipline:0, creativity:0,  communication:20,empathy:0,  leadership:0, wisdom:60, patience:30, adaptability:0,  strength:0,  height:210,weight:110,intellect:0, life_expectancy:0 },
  { name:'Neuro Specialist',    tier:3, category:'Healthcare',    logic:0, focus:0,  discipline:0, creativity:0,  communication:0, empathy:40, leadership:0, wisdom:30, patience:35, adaptability:0,  strength:0,  height:0, weight:140,intellect:0, life_expectancy:0  },
  { name:'Settlement Governor', tier:3, category:'Leadership',    logic:0, focus:0,  discipline:0, creativity:0,  communication:35,empathy:0,  leadership:40,wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:110},
  { name:'Energy Engineer',     tier:3, category:'Engineer',      logic:30, focus:30,discipline:30,creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:120,height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Theoretical Scientist',tier:3,category:'Science',       logic:25, focus:0, discipline:0, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:30, patience:40, adaptability:0,  strength:0,  height:0, weight:0, intellect:170,life_expectancy:0 },
  { name:'Mission Seeker',      tier:3, category:'Explorer',      logic:0, focus:0,  discipline:0, creativity:36, communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:40, strength:100,height:0, weight:0, intellect:0, life_expectancy:100},
  { name:'Cultural Archivist',  tier:3, category:'Arts & Culture',logic:0, focus:0,  discipline:0, creativity:45, communication:35,empathy:40, leadership:0, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:150},
  // ── Tier 4 ──
  { name:'Existential Expressionist',tier:4,category:'Arts & Culture',logic:0,focus:0,discipline:0,creativity:120,communication:60,empathy:80,leadership:0,wisdom:0,patience:0,adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:210},
  { name:'Quantum Physicist',   tier:4, category:'Science',       logic:120,focus:0, discipline:0, creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:100,patience:80, adaptability:0,  strength:0,  height:0, weight:0, intellect:221,life_expectancy:0 },
  { name:'Existential Chancellor',tier:4,category:'Educator',     logic:0, focus:0,  discipline:0, creativity:0,  communication:100,empathy:0, leadership:0, wisdom:120,patience:80, adaptability:0,  strength:0,  height:250,weight:140,intellect:0, life_expectancy:0 },
  { name:'Neural Architect',    tier:4, category:'Healthcare',    logic:0, focus:0,  discipline:0, creativity:0,  communication:0, empathy:100,leadership:0, wisdom:0,  patience:120,adaptability:0,  strength:0,  height:0, weight:220,intellect:0, life_expectancy:0  },
  { name:'Logistics High Command',tier:4,category:'Logistics',    logic:0, focus:100,discipline:82,creativity:0,  communication:0, empathy:0,  leadership:120,wisdom:0, patience:0,  adaptability:0,  strength:0,  height:250,weight:0, intellect:0, life_expectancy:0  },
  { name:'Sustenance Architect',tier:4, category:'Agriculture',   logic:0, focus:0,  discipline:0, creativity:50, communication:0, empathy:0,  leadership:50, wisdom:0,  patience:0,  adaptability:0,  strength:0,  height:230,weight:0, intellect:0, life_expectancy:190},
  { name:'Guardian of Humanity',tier:4, category:'Military',      logic:0, focus:0,  discipline:100,creativity:0, communication:0, empathy:0,  leadership:80, wisdom:0,  patience:0,  adaptability:0,  strength:200,height:230,weight:0, intellect:0, life_expectancy:0  },
  { name:'Frontier Explorer',   tier:4, category:'Explorer',      logic:0, focus:0,  discipline:0, creativity:80, communication:0, empathy:0,  leadership:0, wisdom:0,  patience:0,  adaptability:100,strength:120,height:0, weight:0, intellect:0, life_expectancy:150},
  { name:'Quantum Engineer',    tier:4, category:'Engineer',      logic:80, focus:0, discipline:61,creativity:0,  communication:0, empathy:0,  leadership:0, wisdom:0,  patience:160,adaptability:0,  strength:181,height:0, weight:0, intellect:0, life_expectancy:0  },
  { name:'Colonel of Humanity', tier:4, category:'Leadership',    logic:0, focus:0,  discipline:0, creativity:0,  communication:100,empathy:80,leadership:120,wisdom:0, patience:0,  adaptability:0,  strength:0,  height:0, weight:0, intellect:0, life_expectancy:230},
];

const HC_MEM_ATTRS  = ['logic','focus','discipline','creativity','communication','empathy','leadership','wisdom','patience','adaptability'];
const HC_FOOD_ATTRS = ['strength','height','weight','intellect','life_expectancy'];
const HC_TIER_COLORS = { 1:'#4a9aff', 2:'#00d4aa', 3:'#f0c040', 4:'#ff6b35' };

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
class TlcHumanCalc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode:'open' });
    this._inv          = {};   // { [id]: available to use (capped to stock) }
    this._stock        = {};   // { [id]: total on hand }
    this._humanStatus  = {};   // { [name]: 'owned'|'grow' }
    this._tab          = 'inventory';
    this._filterTier   = 0;
    this._filterSearch = '';
    this._showOnlyGrowable = false;
    this._detailHuman  = null; // aktuell geöffneter Detail-Human
  }

  connectedCallback() {
    this._loadInv();
    this._render();
  }

  /* ── Persistence ── */
  _loadInv() {
    try {
      this._stock       = (window.TLC_STATE?.get('humanCalcStock')) || {};
      this._inv         = (window.TLC_STATE?.get('humanCalcInv'))   || {};
      // Ensure inv never exceeds stock
      Object.keys(this._inv).forEach(id => {
        if ((this._inv[id]||0) > (this._stock[id]||0)) this._inv[id] = this._stock[id]||0;
      });
      this._humanStatus = (window.TLC_STATE?.get('humanCalcStatus')) || {};
    } catch(e) { this._inv = {}; this._humanStatus = {}; }
  }
  _saveInv() {
    try {
      window.TLC_STATE?.set('humanCalcInv',   this._inv);
      window.TLC_STATE?.set('humanCalcStock', this._stock);
      window.TLC_STATE?.save();
    } catch(e) {}
  }
  _saveStatus() {
    try {
      window.TLC_STATE?.set('humanCalcStatus', this._humanStatus);
      window.TLC_STATE?.save();
    } catch(e) {}
  }

  /* ── Partial DOM update für Totals-Bar ── */
  _updateTotalsBar() {
    const totals = this._totals();
    const bar = this.shadowRoot.querySelector('.totals-bar');
    if (!bar) return;
    const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
    allAttrs.forEach(a => {
      const chip = bar.querySelector(`.attr-chip[data-attr="${a}"]`);
      if (!chip) return;
      const v = totals[a] || 0;
      const valEl = chip.querySelector('.attr-val');
      if (valEl) {
        valEl.textContent = v;
        valEl.className = 'attr-val' + (v === 0 ? ' zero' : '');
      }
      chip.className = 'attr-chip' + (v > 0 ? ' has-value' : '');
    });
  }

  /* ── Attribute totals ── */
  _totals() {
    const t = { logic:0,focus:0,discipline:0,creativity:0,communication:0,empathy:0,leadership:0,wisdom:0,patience:0,adaptability:0, strength:0,height:0,weight:0,intellect:0,life_expectancy:0 };
    HC_MEMORIES.forEach(m => {
      const qty = this._inv[m.id] || 0;
      HC_MEM_ATTRS.forEach(a => t[a] += (m[a]||0) * qty);
    });
    HC_FOOD.forEach(f => {
      const qty = this._inv[f.id] || 0;
      HC_FOOD_ATTRS.forEach(a => t[a] += (f[a]||0) * qty);
    });
    // Add base values
    t.height          += HC_BASE.height;
    t.weight          += HC_BASE.weight;
    t.life_expectancy += HC_BASE.life_expectancy;
    return t;
  }

  _canGrow(h, totals) {
    const all = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
    return all.every(a => (totals[a]||0) >= (h[a]||0));
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  _render() {
    const totals = this._totals();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 60px; left: 50%; transform: translateX(-50%);
          /* needed for absolute detail overlay */
          isolation: isolate;
          width: 860px; max-width: calc(100vw - 20px);
          max-height: calc(100vh - 60px);
          background: rgba(8,18,26,0.98);
          border: 1px solid #1a4a5a;
          border-radius: 8px;
          box-shadow: 0 16px 64px rgba(0,0,0,0.8);
          z-index: 200;
          display: flex; flex-direction: column;
          font-family: 'Share Tech Mono', monospace;
          overflow: hidden;
        }
        /* Header */
        .hc-header {
          display:flex; align-items:center; gap:10px;
          padding: 12px 16px;
          background: rgba(0,212,170,0.07);
          border-bottom: 1px solid #1a4a5a;
          flex-shrink:0;
        }
        .hc-title {
          font-family:'Orbitron',sans-serif; font-size:13px;
          letter-spacing:2px; color:#00d4aa; flex:1;
        }
        .hc-close {
          background:none; border:none; color:#4a7a8a;
          font-size:18px; cursor:pointer; padding:0 4px;
          transition:color 120ms;
        }
        .hc-close:hover { color:#ff4060; }
        /* Tabs */
        .hc-tabs {
          display:flex; border-bottom:1px solid #1a4a5a;
          flex-shrink:0;
        }
        .hc-tab {
          flex:1; padding:10px; text-align:center;
          font-size:11px; letter-spacing:1px; text-transform:uppercase;
          color:#4a7a8a; cursor:pointer; border-bottom:2px solid transparent;
          transition:all 120ms;
        }
        .hc-tab.active { color:#00d4aa; border-bottom-color:#00d4aa; background:rgba(0,212,170,0.04); }
        /* Body */
        .hc-body { flex:1; overflow-y:auto; overflow-x:hidden; padding:0; }
        .hc-body::-webkit-scrollbar { width:4px; }
        .hc-body::-webkit-scrollbar-thumb { background:#1a4a5a; border-radius:2px; }
        /* Inventory */
        .inv-section { padding:14px 16px; border-bottom:1px solid rgba(26,74,90,0.4); }
        .inv-section-title {
          font-size:10px; letter-spacing:2px; color:#4a7a8a;
          text-transform:uppercase; margin-bottom:10px;
          display:flex; align-items:center; gap:8px;
        }
        .inv-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:6px;
        }
        .inv-item {
          display:flex; align-items:center; gap:6px;
          padding:5px 8px;
          background:rgba(0,0,0,0.2); border:1px solid #1a3a4a;
          border-radius:4px;
        }
        .inv-name { flex:1; font-size:13px; color:#b8e4f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .inv-ctrl { display:flex; align-items:center; gap:3px; }
        .inv-btn {
          background:none; border:1px solid #1a4a5a; color:#4a7a8a;
          width:20px; height:20px; border-radius:3px; cursor:pointer;
          font-size:13px; line-height:1; display:flex; align-items:center; justify-content:center;
          transition:all 80ms; padding:0;
        }
        .inv-btn:hover { border-color:#00d4aa; color:#00d4aa; }
        .inv-num {
          width:28px; text-align:center; font-size:13px;
          color:#00d4aa; font-family:'Orbitron',sans-serif;
        }
        .stock-num { color:#b8e4f0; }
        .inv-cols { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .inv-col-label { font-size:9px; color:#4a7a8a; text-transform:uppercase; letter-spacing:0.5px; }
        .inv-btn:disabled { opacity:0.25; cursor:default; pointer-events:none; }
        /* Totals bar */
        .totals-bar {
          padding:12px 16px;
          background:rgba(0,0,0,0.3);
          border-bottom:1px solid #1a4a5a;
          flex-shrink:0;
        }
        .totals-bar-title { font-size:9px; letter-spacing:2px; color:#4a7a8a; text-transform:uppercase; margin-bottom:8px; }
        .totals-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
        .attr-chip {
          background:rgba(0,0,0,0.3); border:1px solid #1a3a4a;
          border-radius:4px; padding:5px 8px; text-align:center;
        }
        .attr-chip.has-value { border-color:#00d4aa33; background:rgba(0,212,170,0.06); }
        .attr-name { font-size:9px; color:#4a7a8a; text-transform:uppercase; letter-spacing:0.5px; }
        .attr-val  { font-size:13px; color:#00d4aa; font-family:'Orbitron',sans-serif; margin-top:2px; }
        .attr-val.zero { color:#2a5a6a; }
        /* Results */
        .results-toolbar {
          padding:10px 14px; border-bottom:1px solid #1a4a5a;
          display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap;
        }
        .search-inp {
          flex:1; min-width:120px;
          background:rgba(0,0,0,0.4); border:1px solid #1a4a5a;
          border-radius:4px; color:#b8e4f0; font-family:inherit;
          font-size:11px; padding:6px 10px; outline:none;
        }
        .search-inp:focus { border-color:#00d4aa; }
        .tier-btn {
          padding:5px 10px; border-radius:4px; border:1px solid #1a4a5a;
          background:none; color:#4a7a8a; font-family:inherit;
          font-size:10px; cursor:pointer; transition:all 120ms; white-space:nowrap;
        }
        .tier-btn.active { border-color:#00d4aa; color:#00d4aa; background:rgba(0,212,170,0.1); }
        .growable-toggle {
          display:flex; align-items:center; gap:5px;
          font-size:11px; color:#4a7a8a; cursor:pointer; white-space:nowrap;
        }
        .growable-toggle input { accent-color:#00d4aa; }
        /* Human grid */
        .human-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
          padding:14px;
        }
        .human-card {
          background:rgba(0,0,0,0.25); border:1px solid #1a3a4a;
          border-radius:6px; padding:10px 12px;
          transition:border-color 150ms, background 150ms;
          cursor:default;
        }
        .human-card.growable {
          border-color: #00d4aa55;
          background: rgba(0,212,170,0.05);
          box-shadow: 0 0 12px rgba(0,212,170,0.08);
        }
        .human-card-head { display:flex; align-items:flex-start; gap:6px; margin-bottom:4px; }
        .human-name { flex:1; font-size:12px; color:#b8e4f0; font-family:'Orbitron',sans-serif; font-weight:normal; }
        .tier-badge {
          font-size:9px; padding:2px 6px; border-radius:10px;
          font-family:'Orbitron',sans-serif; letter-spacing:0.5px; flex-shrink:0;
        }
        .human-cat { font-size:10px; color:#4a7a8a; margin-bottom:8px; }
        .req-list { display:flex; flex-direction:column; gap:2px; }
        .req-row { display:flex; align-items:center; gap:6px; font-size:10px; }
        .req-name { flex:1; color:#4a7a8a; text-transform:capitalize; }
        .req-val  { font-family:'Orbitron',sans-serif; font-size:10px; white-space:nowrap; }
        .req-val.met    { color:#00d4aa; }
        .req-val.unmet  { color:#ff4060; }
        .req-val.base   { color:#4a7a8a; }
        .growable-label {
          margin-top:8px; padding-top:6px; border-top:1px solid #1a3a4a;
          font-size:10px; color:#00d4aa; text-align:center; letter-spacing:1px;
        }
        /* Status markierungen */
        .human-card { cursor:pointer; }
        .human-card.status-owned { border-color:#4a9aff55; background:rgba(74,154,255,0.06); }
        .human-card.status-grow  { border-color:#f0c04055; background:rgba(240,192,64,0.06); }
        .status-badge {
          font-size:9px; padding:2px 6px; border-radius:10px;
          letter-spacing:0.5px; flex-shrink:0; font-family:'Share Tech Mono',monospace;
        }
        .status-badge.owned { background:rgba(74,154,255,0.2); color:#4a9aff; border:1px solid #4a9aff55; }
        .status-badge.grow  { background:rgba(240,192,64,0.2); color:#f0c040; border:1px solid #f0c04055; }
        /* Context menu */
        .hc-ctx {
          position:fixed; z-index:9999;
          background:#0d1f28; border:1px solid #1a4a5a;
          border-radius:6px; padding:4px 0;
          box-shadow:0 8px 24px rgba(0,0,0,0.7);
          min-width:160px;
        }
        .hc-ctx-item {
          padding:8px 14px; font-size:11px; cursor:pointer;
          color:#b8e4f0; display:flex; align-items:center; gap:8px;
          transition:background 80ms;
        }
        .hc-ctx-item:hover { background:rgba(0,212,170,0.1); }
        .hc-ctx-item.active { color:#00d4aa; }
        .hc-ctx-sep { border-top:1px solid #1a3a4a; margin:4px 0; }
        /* Detail overlay */
        .hc-detail {
          position:absolute; inset:0; z-index:100;
          background:rgba(6,13,16,0.98);
          border-radius:8px;
          display:flex; flex-direction:column;
          overflow:hidden;
        }
        .hc-detail::-webkit-scrollbar { width:4px; }
        .hc-detail::-webkit-scrollbar-thumb { background:#1a4a5a; }
        .hc-detail-header {
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; border-bottom:1px solid #1a4a5a;
          position:sticky; top:0; background:rgba(6,13,16,0.98); z-index:1;
          flex-shrink:0;
        }
        .detail-chips {
          display:flex; flex-wrap:wrap; gap:6px;
          padding:10px 16px; border-bottom:1px solid #1a3a4a;
          flex-shrink:0;
        }
        .req-chip {
          padding:5px 10px; border-radius:4px;
          display:flex; flex-direction:column; align-items:center; gap:1px;
          min-width:70px;
        }
        .req-chip.met   { background:rgba(0,212,170,0.12); border:1px solid #00d4aa44; }
        .req-chip.unmet { background:rgba(255,64,96,0.10); border:1px solid #ff406044; }
        .req-chip-name  { font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#4a7a8a; }
        .req-chip.met   .req-chip-val { color:#00d4aa; font-family:'Orbitron',sans-serif; font-size:16px; }
        .req-chip.unmet .req-chip-val { color:#ff4060; font-family:'Orbitron',sans-serif; font-size:16px; }
        .capped-note { font-size:9px; color:#f0c040; margin-left:6px; }
        .over { color:#f0c040; font-size:9px; }
        .dinv-have { font-size:9px; color:#4a7a8a; margin-left:6px; }
        .detail-suggestion {
          padding:8px 14px; background:rgba(240,192,64,0.07);
          border-bottom:1px solid #f0c04033; flex-shrink:0;
        }
        .sug-title { font-size:12px; color:#f0c040; margin-bottom:8px; }
        .sug-items { display:flex; flex-wrap:wrap; gap:5px; }
        .sug-tag {
          font-size:12px; padding:4px 10px; border-radius:3px;
          background:rgba(240,192,64,0.1); border:1px solid #f0c04033;
          color:#b8e4f0;
        }
        .sug-attrs { color:#4a7a8a; }
        .detail-cols {
          display:grid; grid-template-columns:1fr 1fr;
          flex:1; overflow:hidden;
        }
        .detail-col {
          display:flex; flex-direction:column; overflow:hidden;
          border-right:1px solid #1a3a4a;
        }
        .detail-col:last-child { border-right:none; }
        .detail-col-title {
          padding:10px 14px; font-size:10px; letter-spacing:1.5px;
          text-transform:uppercase; color:#4a7a8a;
          border-bottom:1px solid #1a3a4a; flex-shrink:0;
        }
        .dinv-list { overflow-y:auto; flex:1; }
        .dinv-list::-webkit-scrollbar { width:3px; }
        .dinv-list::-webkit-scrollbar-thumb { background:#1a4a5a; }
        .dinv-row {
          display:flex; align-items:center; gap:8px;
          padding:8px 12px; border-bottom:1px solid rgba(26,58,74,0.3);
          transition:background 80ms;
        }
        .dinv-row:hover { background:rgba(0,212,170,0.04); }
        /* irrelevant rows hidden */
        .dinv-info { flex:1; min-width:0; }
        .dinv-name { font-size:13px; color:#b8e4f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .dinv-contrib { font-size:12px; color:#00d4aa; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .dinv-contrib.muted { color:#2a5a6a; }
        .dinv-ctrl { display:flex; align-items:center; gap:3px; flex-shrink:0; }
        .dinv-btn {
          background:none; border:1px solid #1a4a5a; color:#4a7a8a;
          width:20px; height:20px; border-radius:3px; cursor:pointer;
          font-size:13px; line-height:1; display:flex; align-items:center;
          justify-content:center; transition:all 80ms; padding:0;
        }
        .dinv-btn:hover { border-color:#00d4aa; color:#00d4aa; }
        .dinv-num {
          width:28px; text-align:center; font-size:13px;
          color:#00d4aa; font-family:'Orbitron',sans-serif;
          pointer-events:none; user-select:none;
        }
        .dinv-num.over { color:#f0c040; }
        .over-mark { font-size:10px; color:#f0c040; margin-left:2px; vertical-align:super; }
        .hc-detail-back {
          background:none; border:1px solid #1a4a5a; color:#4a7a8a;
          border-radius:4px; padding:4px 10px; cursor:pointer;
          font-family:inherit; font-size:11px; transition:all 120ms;
        }
        .hc-detail-back:hover { border-color:#00d4aa; color:#00d4aa; }
        .hc-detail-title { font-family:'Orbitron',sans-serif; font-size:13px; color:#b8e4f0; flex:1; }
        .hc-detail-body { padding:16px; }
        .detail-section { margin-bottom:20px; }
        .detail-section-title {
          font-size:9px; letter-spacing:2px; text-transform:uppercase;
          color:#4a7a8a; margin-bottom:10px; padding-bottom:6px;
          border-bottom:1px solid #1a3a4a;
        }
        .detail-attr-row {
          display:flex; align-items:center; gap:10px;
          padding:6px 0; border-bottom:1px solid rgba(26,58,74,0.4);
        }
        .detail-attr-name { flex:1; font-size:11px; color:#4a7a8a; text-transform:capitalize; }
        .detail-attr-need { font-family:'Orbitron',sans-serif; font-size:11px; color:#b8e4f0; width:40px; text-align:right; }
        .detail-attr-have { font-size:10px; width:60px; text-align:right; }
        .detail-attr-have.met   { color:#00d4aa; }
        .detail-attr-have.unmet { color:#ff4060; }
        .detail-progress {
          flex:1; height:4px; background:#0d1f28;
          border-radius:2px; overflow:hidden; margin:0 8px;
        }
        .detail-progress-bar { height:100%; border-radius:2px; transition:width 300ms; }
        /* Usable memories/food list */
        .usable-item {
          display:flex; align-items:center; gap:8px;
          padding:6px 8px; border-radius:4px;
          background:rgba(0,0,0,0.2); border:1px solid #1a3a4a;
          margin-bottom:4px;
        }
        .usable-name { flex:1; font-size:11px; color:#b8e4f0; }
        .usable-qty  { font-size:11px; color:#4a7a8a; }
        .usable-contribs { display:flex; flex-wrap:wrap; gap:4px; flex:1; }
        .contrib-tag {
          font-size:10px; padding:2px 6px; border-radius:3px;
          background:rgba(0,212,170,0.1); border:1px solid #00d4aa33; color:#4a7a8a;
        }
        .contrib-tag.met { color:#00d4aa; background:rgba(0,212,170,0.15); }
        .suggest-group-title { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#4a7a8a; margin-bottom:6px; }
        .usable-item.suggest { border-color:#f0c04022; background:rgba(240,192,64,0.04); }
        .usable-item.suggest .usable-name { color:#f0c040; }
        .no-results { padding:30px; text-align:center; color:#4a7a8a; font-size:12px; }
        /* Clear btn */
        .hc-footer {
          padding:8px 16px; border-top:1px solid #1a4a5a;
          display:flex; justify-content:flex-end; gap:8px; flex-shrink:0;
        }
        .btn-clear-all {
          padding:6px 14px; border-radius:4px;
          border:1px solid #ff4060; color:#ff4060;
          background:rgba(255,64,96,0.08); font-family:inherit;
          font-size:11px; cursor:pointer; transition:all 120ms;
        }
        .btn-clear-all:hover { background:rgba(255,64,96,0.2); }
      </style>

      <!-- Header -->
      <div class="hc-header">
        <span style="font-size:16px;">🧬</span>
        <div class="hc-title">HUMAN GROWTH CALCULATOR</div>
        <button class="hc-close" id="hc-close">✕</button>
      </div>

      <!-- Tabs -->
      <div class="hc-tabs">
        <div class="hc-tab ${this._tab==='inventory'?'active':''}" data-tab="inventory">📦 Inventory</div>
        <div class="hc-tab ${this._tab==='results'?'active':''}" data-tab="results">🧬 Available Humans</div>
      </div>

      ${this._tab === 'inventory' ? this._renderInventory(totals) : this._renderResults(totals)}

      <!-- Footer -->
      <div class="hc-footer">
        <button class="btn-clear-all" id="hc-clear">Clear All</button>
      </div>
    `;

    this._bindEvents();
  }

  /* ── Inventory Tab ── */
  _renderInventory(_unused) {
    const row = (item, type) => {
      const qty = this._inv[item.id] || 0;
      return `<div class="inv-item">
        <div class="inv-name" title="${item.name}">${item.name}</div>
        <div class="inv-ctrl">
          <button class="inv-btn" data-action="dec" data-id="${item.id}" data-type="${type}">−</button>
          <div class="inv-num">${qty}</div>
          <button class="inv-btn" data-action="inc" data-id="${item.id}" data-type="${type}">+</button>
        </div>
      </div>`;
    };


    return `
      <div class="hc-body">
        <div class="inv-section">
          <div class="inv-section-title">📖 Memories</div>
          <div class="inv-grid">${HC_MEMORIES.map(m => row(m,'mem')).join('')}</div>
        </div>
        <div class="inv-section">
          <div class="inv-section-title">🍎 Food</div>
          <div class="inv-grid">${HC_FOOD.map(f => row(f,'food')).join('')}</div>
        </div>
      </div>

`;  // no totals bar on inventory tab
  }

  /* ── Results Tab ── */
  _renderResults(totals) {
    let humans = HC_HUMANS;
    if (this._filterTier > 0) humans = humans.filter(h => h.tier === this._filterTier);
    if (this._filterSearch) humans = humans.filter(h => h.name.toLowerCase().includes(this._filterSearch) || h.category.toLowerCase().includes(this._filterSearch));
    if (this._showOnlyGrowable) humans = humans.filter(h => this._canGrow(h, totals));

    const growable = humans.filter(h => this._canGrow(h, totals)).length;

    const cards = humans.map(h => {
      const can    = this._canGrow(h, totals);
      const tc     = HC_TIER_COLORS[h.tier];
      const status = this._humanStatus[h.name] || null; // 'owned'|'grow'|null
      // Only show attrs that are required (>0) + base attrs
      const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
      const reqs = allAttrs
        .filter(a => (h[a]||0) > 0)
        .map(a => {
          const have = totals[a]||0;
          const need = h[a]||0;
          const met  = have >= need;
          return `<div class="req-row">
            <div class="req-name">${a.replace('_',' ')}</div>
            <div class="req-val ${met?'met':'unmet'}">${have} / ${need}</div>
          </div>`;
        });
      // Base attrs always shown
      const baseReqs = [
        { label:'Height (cm)', need: HC_BASE.height + (h.height||0), have: totals.height },
        { label:'Weight (kg)', need: HC_BASE.weight + (h.weight||0), have: totals.weight },
        { label:'Life Exp.',   need: HC_BASE.life_expectancy + (h.life_expectancy||0), have: totals.life_expectancy },
      ].filter(b => b.need > 0);

      const statusClass = status === 'owned' ? ' status-owned' : status === 'grow' ? ' status-grow' : '';
      return `<div class="human-card ${can?'growable':''}${statusClass}" data-human="${h.name}" title="Left-click: details | Right-click: set status">
        <div class="human-card-head">
          <div class="human-name">${h.name}</div>
          <div class="tier-badge" style="border:1px solid ${tc};color:${tc};">Tier ${h.tier}</div>
          ${status === 'owned' ? '<div class="status-badge owned">✓ Owned</div>' : ''}
          ${status === 'grow'  ? '<div class="status-badge grow">🌱 Grow</div>'  : ''}
        </div>
        <div class="human-cat">${h.category}</div>
        <div class="req-list">
          ${reqs.join('')}
          ${baseReqs.map(b => {
            const met = b.have >= b.need;
            return `<div class="req-row">
              <div class="req-name">${b.label}</div>
              <div class="req-val ${met?'met':'unmet'}">${b.have} / ${b.need}</div>
            </div>`;
          }).join('')}
        </div>
        ${can ? '<div class="growable-label">✓ GROWABLE</div>' : ''}
      </div>`;
    });

    return `
      <div class="results-toolbar">
        <input class="search-inp" id="hc-search" placeholder="Search humans..." value="${this._filterSearch}">
        ${[0,1,2,3,4].map(t => `<button class="tier-btn ${this._filterTier===t?'active':''}" data-tier="${t}">${t===0?'All':('Tier '+t)}</button>`).join('')}
        <label class="growable-toggle">
          <input type="checkbox" id="hc-growable" ${this._showOnlyGrowable?'checked':''}> Growable only
        </label>
      </div>
      <div class="hc-body">
        <div style="padding:10px 14px 0; font-size:11px; color:#4a7a8a;">
          ${growable} / ${humans.length} growable with current inventory
        </div>
        ${cards.length ? `<div class="human-grid">${cards.join('')}</div>` : `<div class="no-results">No humans match your filters.</div>`}
      </div>`;
  }

  /* ── Events ── */
  _bindEvents() {
    const sr = this.shadowRoot;

    sr.getElementById('hc-close').addEventListener('click', () => this.remove());

    // Tabs
    sr.querySelectorAll('.hc-tab').forEach(t => {
      t.addEventListener('click', () => {
        this._tab = t.dataset.tab;
        this._render();
      });
    });

    // Inventory +/- — kein Full-Rerender, nur Zahl + Totals updaten
    sr.querySelectorAll('.inv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id  = btn.dataset.id;
        const cur = this._inv[id] || 0;
        if (btn.dataset.action === 'inc') this._inv[id] = cur + 1;
        else if (cur > 0) this._inv[id] = cur - 1;
        this._saveInv();
        const numEl = btn.closest('.inv-item')?.querySelector('.inv-num');
        if (numEl) numEl.textContent = this._inv[id] || 0;
        this._updateTotalsBar();
      });
    });

    // Tier filter
    sr.querySelectorAll('.tier-btn')?.forEach(b => {
      b.addEventListener('click', () => {
        this._filterTier = parseInt(b.dataset.tier);
        this._render();
      });
    });

    // Search
    const si = sr.getElementById('hc-search');
    if (si) si.addEventListener('input', e => {
      this._filterSearch = e.target.value.toLowerCase();
      this._render();
    });

    // Growable toggle
    const gt = sr.getElementById('hc-growable');
    if (gt) gt.addEventListener('change', () => {
      this._showOnlyGrowable = gt.checked;
      this._render();
    });

    // Clear
    sr.getElementById('hc-clear').addEventListener('click', () => {
      if (!confirm('Clear all inventory?')) return;
      this._inv = {};
      this._saveInv();
      this._render();
    });

    // Human cards — LMB: detail, RMB: context menu
    sr.querySelectorAll('.human-card[data-human]').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.human;
        this._openDetail(name);
      });
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this._openCtx(e, card.dataset.human);
      });
    });
  }

  /* ── Context Menu ── */
  _openCtx(e, humanName) {
    // Remove any existing ctx
    this.shadowRoot.querySelector('.hc-ctx')?.remove();
    const status = this._humanStatus[humanName] || null;
    const menu = document.createElement('div');
    menu.className = 'hc-ctx';
    menu.innerHTML = `
      <div class="hc-ctx-item ${status==='owned'?'active':''}" data-action="owned">✓ Mark as Owned</div>
      <div class="hc-ctx-item ${status==='grow'?'active':''}"  data-action="grow">🌱 Mark to Grow</div>
      <div class="hc-ctx-sep"></div>
      <div class="hc-ctx-item" data-action="clear" style="color:#4a7a8a;">✕ Clear Status</div>
    `;
    // Position
    const rect = this.getBoundingClientRect();
    menu.style.top  = (e.clientY - rect.top)  + 'px';
    menu.style.left = (e.clientX - rect.left) + 'px';
    this.shadowRoot.appendChild(menu);

    menu.querySelectorAll('.hc-ctx-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'clear') delete this._humanStatus[humanName];
        else this._humanStatus[humanName] = (this._humanStatus[humanName] === action) ? null : action;
        if (!this._humanStatus[humanName]) delete this._humanStatus[humanName];
        this._saveStatus();
        menu.remove();
        // Update card DOM directly without full rerender
        const card = this.shadowRoot.querySelector(`.human-card[data-human="${humanName}"]`);
        if (card) {
          card.classList.remove('status-owned','status-grow');
          const newStatus = this._humanStatus[humanName] || null;
          if (newStatus) card.classList.add('status-' + newStatus);
          // Update badge
          card.querySelector('.status-badge.owned')?.remove();
          card.querySelector('.status-badge.grow')?.remove();
          const head = card.querySelector('.human-card-head');
          if (newStatus === 'owned') head.insertAdjacentHTML('beforeend','<div class="status-badge owned">✓ Owned</div>');
          if (newStatus === 'grow')  head.insertAdjacentHTML('beforeend','<div class="status-badge grow">🌱 Grow</div>');
        }
      });
    });

    // Click outside closes
    const close = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', close); } };
    setTimeout(() => document.addEventListener('click', close), 10);
  }

  /* ── Detail View ── */
  _openDetail(humanName) {
    const h = HC_HUMANS.find(x => x.name === humanName);
    if (!h) return;

    // Remove existing
    this.shadowRoot.querySelector('.hc-detail')?.remove();

    const detail = document.createElement('div');
    detail.className = 'hc-detail';
    detail.innerHTML = this._buildDetailHTML(h);
    this.shadowRoot.appendChild(detail);

    // Bind back button
    detail.querySelector('#detail-back').addEventListener('click', () => detail.remove());

    // Bind +/- in detail — always read have fresh from this._inv to avoid stale closure
    detail.querySelectorAll('.dinv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id     = btn.dataset.id;
        const have   = this._inv[id] || 0;       // fresh read every click
        const using  = this._detailUse[id] || 0; // fresh read every click

        if (btn.dataset.action === 'inc' && using < have) {
          this._detailUse[id] = using + 1;
        } else if (btn.dataset.action === 'dec' && using > 0) {
          this._detailUse[id] = using - 1;
        }

        const newUsing = this._detailUse[id] || 0;
        const row = btn.closest('.dinv-row');
        if (row) {
          // Update number display
          const numEl = row.querySelector('.dinv-num');
          if (numEl) {
            // Over-stat indicator
            const allItems = [...HC_MEMORIES, ...HC_FOOD];
            const item = allItems.find(x => x.id === id);
            const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
            let minNeeded = 0;
            if (item) allAttrs.forEach(a => {
              if ((item[a]||0) > 0 && (h[a]||0) > 0)
                minNeeded = Math.max(minNeeded, Math.ceil((h[a]||0) / (item[a]||1)));
            });
            numEl.className  = 'dinv-num' + (minNeeded > 0 && newUsing > minNeeded ? ' over' : '');
            numEl.textContent = newUsing;
          }
          // Update button disabled states — always fresh
          row.querySelectorAll('.dinv-btn').forEach(b => {
            const freshHave  = this._inv[b.dataset.id] || 0;
            const freshUsing = this._detailUse[b.dataset.id] || 0;
            if (b.dataset.action === 'dec') b.disabled = freshUsing <= 0;
            if (b.dataset.action === 'inc') b.disabled = freshUsing >= freshHave;
          });
        }
        this._refreshDetailChips(detail, h);
      });
    });
  }

  _buildDetailHTML(h) {
    const totals = this._totals();
    const tc     = HC_TIER_COLORS[h.tier];
    const can    = this._canGrow(h, totals);
    const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];

    // ── Auto-allocate: minimale Items um den Bedarf zu decken ──────────
    // Für jedes Attr: berechne wie viele von jedem Item gebraucht werden
    // Greedy: iteriere durch Items, fülle fehlende Attrs auf
    const _autoAlloc = (items, attrs) => {
      const alloc     = {};
      const remaining = {};
      attrs.forEach(a => { remaining[a] = h[a] || 0; }); // need to reach
      // Sort by most coverage first
      const sorted = [...items]
        .filter(item => this._inv[item.id] > 0) // only items user has
        .sort((a, b) => {
          const sa = attrs.reduce((s,x) => s + Math.min((a[x]||0), remaining[x]||0), 0);
          const sb = attrs.reduce((s,x) => s + Math.min((b[x]||0), remaining[x]||0), 0);
          return sb - sa;
        });
      for (const item of sorted) {
        if (attrs.every(a => remaining[a] <= 0)) break; // all filled
        const stillNeeded = attrs.some(a => (item[a]||0) > 0 && remaining[a] > 0);
        if (!stillNeeded) continue;
        // How many to exactly fill remaining (take minimum across all relevant attrs)
        let count = 0;
        attrs.forEach(a => {
          if ((item[a]||0) > 0 && remaining[a] > 0)
            count = Math.max(count, Math.ceil(remaining[a] / (item[a]||1)));
        });
        count = Math.min(count, this._inv[item.id] || 0);
        if (count > 0) {
          alloc[item.id] = count;
          attrs.forEach(a => {
            if ((item[a]||0) > 0) remaining[a] = Math.max(0, remaining[a] - (item[a]||0) * count);
          });
        }
      }
      return alloc;
    };

    // ── Per-item used quantity in detail view ──────────────────────────
    // _detailUse[id] = how many user wants to use (starts at auto-alloc, editable up to inv qty)
    if (!this._detailUse || this._detailUse._human !== h.name) {
      const memAlloc  = _autoAlloc(HC_MEMORIES, HC_MEM_ATTRS);
      const foodAlloc = _autoAlloc(HC_FOOD, HC_FOOD_ATTRS);
      // Merge allocs, ensure no value exceeds actual inventory
      const merged = { _human: h.name };
      const allAttrs2 = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
      [...HC_MEMORIES, ...HC_FOOD].forEach(item => {
        const suggested = (memAlloc[item.id] || 0) + (foodAlloc[item.id] || 0);
        const owned     = this._inv[item.id] || 0;
        if (suggested > 0 && owned > 0) {
          // Cap to stat-need: how many of this item are needed (not more)
          let statNeed = 0;
          allAttrs2.forEach(a => {
            if ((item[a]||0) > 0 && (h[a]||0) > 0)
              statNeed = Math.max(statNeed, Math.ceil((h[a]||0) / (item[a]||1)));
          });
          merged[item.id] = Math.min(statNeed || suggested, owned);
        }
      });
      this._detailUse = merged;
    }

    const chips = this._buildReqChipsFromUse(h, this._detailUse);

    // ── Suggestion for non-growable ────────────────────────────────────
    const missingAttrs = allAttrs.filter(a => (h[a]||0) > 0 && (totals[a]||0) < (h[a]||0));
    const suggestionHTML = !can && missingAttrs.length ? this._buildSuggestion(h, missingAttrs) : '';

    // ── Item rows ──────────────────────────────────────────────────────
    // How many of an item are minimally needed to cover its relevant attrs for h
    const _needForAttr = (item) => {
      const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
      let min = 0;
      allAttrs.forEach(a => {
        if ((item[a]||0) > 0 && (h[a]||0) > 0)
          min = Math.max(min, Math.ceil((h[a]||0) / (item[a]||1)));
      });
      return min;
    };

    const makeRow = (item, attrs) => {
      const have     = this._inv[item.id] || 0;
      const using    = this._detailUse[item.id] || 0;
      const relevant = attrs.filter(a => (h[a]||0) > 0 && (item[a]||0) > 0);
      const contribs = relevant.map(a => {
        const perItem = item[a] || 0;
        const total   = perItem * using;
        const need    = h[a] || 0;
        const isOver  = using > 0 && total > need;
        const overTxt = isOver ? ` <span class="over">(stat need: ${need})</span>` : '';
        return `${a.replace('_',' ')}: +${perItem} each${overTxt}`;
      }).join(' · ');
      if (!relevant.length) return ''; // irrelevante Items komplett ausblenden
      return `<div class="dinv-row relevant" data-id="${item.id}">
        <div class="dinv-info">
          <div class="dinv-name">${item.name}${have > 0 ? `<span class="dinv-have"> ×${have} owned</span>` : ''}</div>
          ${relevant.length
            ? `<div class="dinv-contrib">${contribs}</div>`
            : `<div class="dinv-contrib muted">No relevant attributes</div>`}
        </div>
        <div class="dinv-ctrl">
          <button class="dinv-btn" data-action="dec" data-id="${item.id}" ${using<=0?'disabled':''}>−</button>
          <div class="dinv-num ${using>_needForAttr(item)&&_needForAttr(item)>0?'over':''}">${using}</div>
          <button class="dinv-btn" data-action="inc" data-id="${item.id}" ${using>=have?'disabled':''}>+</button>
        </div>
      </div>`;
    };

    const memRows  = HC_MEMORIES.map(m => makeRow(m, HC_MEM_ATTRS)).join('');
    const foodRows = HC_FOOD.map(f => makeRow(f, HC_FOOD_ATTRS)).join('');

    return `
      <div class="hc-detail-header">
        <button class="hc-detail-back" id="detail-back">‹ Back</button>
        <div>
          <div class="hc-detail-title">${h.name}</div>
          <div style="font-size:10px;color:#4a7a8a;margin-top:2px;">${h.category} · Tier ${h.tier}</div>
        </div>
        <div class="tier-badge" style="border:1px solid ${tc};color:${tc};padding:3px 10px;border-radius:10px;font-size:10px;margin-left:auto;">Tier ${h.tier}</div>
        ${can ? '<div style="font-size:11px;color:#00d4aa;margin-left:8px;white-space:nowrap;">✓ GROWABLE</div>' : ''}
      </div>
      <div class="detail-chips" id="detail-chips">${chips}</div>
      ${suggestionHTML ? `<div class="detail-suggestion" id="detail-suggestion">${suggestionHTML}</div>` : ''}
      <div class="detail-cols">
        <div class="detail-col">
          <div class="detail-col-title">📖 Memories</div>
          <div class="dinv-list">${memRows}</div>
        </div>
        <div class="detail-col">
          <div class="detail-col-title">🍎 Food</div>
          <div class="dinv-list">${foodRows}</div>
        </div>
      </div>
    `;
  }

  _buildSuggestion(h, missingAttrs) {
    // Welche Items helfen für die fehlenden Attrs
    const allItems = [
      ...HC_MEMORIES.map(m => ({ ...m, _type:'mem' })),
      ...HC_FOOD.map(f => ({ ...f, _type:'food' }))
    ];
    const suggestions = allItems
      .map(item => {
        const coverage = missingAttrs.reduce((s, a) => s + Math.min((item[a]||0), (h[a]||0)), 0);
        return { item, coverage };
      })
      .filter(x => x.coverage > 0)
      .sort((a,b) => b.coverage - a.coverage)
      .slice(0, 5);

    if (!suggestions.length) return '';
    const tags = suggestions.map(s => {
      const attrs = missingAttrs.filter(a => (s.item[a]||0) > 0)
        .map(a => `${a.replace('_',' ')}: +${s.item[a]}`).join(', ');
      return `<span class="sug-tag">📦 ${s.item.name} <span class="sug-attrs">(${attrs})</span></span>`;
    }).join('');

    return `
      <div class="sug-title">💡 Missing: ${missingAttrs.map(a=>`${a.replace('_',' ')} ${(h[a]||0)-(this._totals()[a]||0)} more`).join(' · ')}</div>
      <div class="sug-items">${tags}</div>
    `;
  }

  _buildReqChipsFromUse(h, detailUse) {
    const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
    const useTotals = {};
    allAttrs.forEach(a => useTotals[a] = 0);
    // Sum from detailUse (what user selected to use for this human)
    HC_MEMORIES.forEach(m => {
      const qty = detailUse[m.id] || 0;
      HC_MEM_ATTRS.forEach(a => useTotals[a] += (m[a]||0) * qty);
    });
    HC_FOOD.forEach(f => {
      const qty = detailUse[f.id] || 0;
      HC_FOOD_ATTRS.forEach(a => useTotals[a] += (f[a]||0) * qty);
    });
    // Add base
    useTotals.height          += HC_BASE.height;
    useTotals.weight          += HC_BASE.weight;
    useTotals.life_expectancy += HC_BASE.life_expectancy;

    const baseMap = { height: HC_BASE.height, weight: HC_BASE.weight, life_expectancy: HC_BASE.life_expectancy };
    return allAttrs
      .filter(a => (h[a]||0) > 0 || (baseMap[a]||0) > 0)
      .map(a => {
        const need    = (h[a]||0) + (baseMap[a]||0);
        const raw     = useTotals[a] || 0;
        const display = raw; // show actual value including over-stat
        const met     = raw >= need;
        return `<div class="req-chip ${met?'met':'unmet'}">
          <div class="req-chip-name">${a.replace('_',' ')}</div>
          <div class="req-chip-val">${display} / ${need}</div>
        </div>`;
      }).join('');
  }

    _buildReqChips(h, totals) {
    const allAttrs = [...HC_MEM_ATTRS, ...HC_FOOD_ATTRS];
    // Include base attrs
    const baseMap = { height: HC_BASE.height, weight: HC_BASE.weight, life_expectancy: HC_BASE.life_expectancy };
    return allAttrs
      .filter(a => (h[a]||0) > 0 || (baseMap[a]||0) > 0)
      .map(a => {
        const need    = (h[a]||0) + (baseMap[a]||0);
        const haveRaw = totals[a]||0;
        const have    = Math.min(haveRaw, need); // cap — keine Überschreitung zeigen
        const met     = haveRaw >= need;
        return `<div class="req-chip ${met?'met':'unmet'}">
          <div class="req-chip-name">${a.replace('_',' ')}</div>
          <div class="req-chip-val">${have} / ${need}</div>
        </div>`;
      }).join('');
  }

  _refreshDetailChips(detail, h) {
    const chips = detail.querySelector('#detail-chips');
    if (chips) chips.innerHTML = this._buildReqChipsFromUse(h, this._detailUse || {});
  }

}

customElements.define('tlc-human-calc', TlcHumanCalc);
