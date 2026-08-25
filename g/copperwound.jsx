import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Menu, ChevronRight, Check } from "lucide-react";

/* ---------- Design tokens ----------
Background   #201510  (deep walnut)
Panel        #2B1D14  (wood panel)
Panel light  #3A281B
Brass        #C89B4A
Ember        #D9713C
Cream        #F3E9D8
Muted        #A6906F
Display font: Fraunces (warm variable serif)
Body font:    Inter
Mono/spec:    IBM Plex Mono
Signature:    six horizontal "string" lines (thickness = string gauge) used
              as dividers throughout — literally the thing that makes a guitar.
------------------------------------ */

const FONT_LINK = "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500";

const STRING_GAUGES = [1, 1.4, 1.9, 2.5, 3.2, 4]; // thin -> thick, like a real set

function StringDivider({ tone = "#C89B4A", opacity = 0.5 }) {
  return (
    <div className="w-full flex flex-col gap-[3px] py-2" aria-hidden="true">
      {STRING_GAUGES.map((g, i) => (
        <div
          key={i}
          style={{ height: g * 0.6, background: tone, opacity: opacity - i * 0.04 }}
        />
      ))}
    </div>
  );
}

/* Stylized line-art guitar marks — decorative, not literal renderings */
function GuitarMark({ shape, color = "#F3E9D8", className = "" }) {
  const paths = {
    dreadnought: (
      <>
        <path d="M100 20 L100 78" />
        <ellipse cx="100" cy="14" rx="10" ry="7" />
        <path d="M60 92 C40 96 34 118 44 138 C34 150 34 172 52 182 C70 194 118 194 138 180 C158 168 158 148 148 136 C160 118 152 96 130 90 C112 84 78 84 60 92 Z" />
        <circle cx="98" cy="136" r="16" />
      </>
    ),
    singlecut: (
      <>
        <path d="M100 20 L100 84" />
        <ellipse cx="100" cy="14" rx="10" ry="7" />
        <path d="M56 96 C38 104 36 128 50 142 C40 156 44 176 66 186 C90 196 134 192 150 172 C162 156 158 130 142 118 C150 100 132 84 108 84 C88 84 68 88 56 96 Z" />
        <rect x="82" y="120" width="34" height="12" rx="2" />
        <rect x="82" y="150" width="34" height="12" rx="2" />
      </>
    ),
    doublecut: (
      <>
        <path d="M100 20 L100 82" />
        <ellipse cx="100" cy="14" rx="10" ry="7" />
        <path d="M52 100 C38 112 40 130 54 138 C40 146 40 166 56 178 C74 192 100 192 116 182 C124 194 146 194 158 180 C170 164 164 142 148 134 C162 122 158 100 140 90 C118 78 96 82 82 92 C70 84 60 90 52 100 Z" />
        <rect x="78" y="112" width="30" height="10" rx="2" />
        <rect x="78" y="140" width="30" height="10" rx="2" />
      </>
    ),
    bass: (
      <>
        <path d="M100 10 L100 96" />
        <ellipse cx="100" cy="4" rx="9" ry="6" />
        <path d="M58 108 C40 118 38 140 54 152 C42 164 46 182 68 190 C92 198 132 194 146 176 C158 160 154 138 138 128 C148 112 132 98 110 98 C90 98 70 100 58 108 Z" />
        <rect x="86" y="132" width="28" height="11" rx="2" />
        <rect x="86" y="158" width="28" height="11" rx="2" />
      </>
    ),
    parlor: (
      <>
        <path d="M100 26 L100 80" />
        <ellipse cx="100" cy="20" rx="9" ry="6" />
        <path d="M68 92 C52 96 48 112 56 126 C48 136 48 154 62 164 C78 176 122 176 138 162 C150 150 150 132 140 124 C148 110 142 96 124 92 C110 88 84 88 68 92 Z" />
        <circle cx="98" cy="126" r="13" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 200 210" className={className} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      {paths[shape] || paths.dreadnought}
    </svg>
  );
}

const PRODUCTS = [
  { id: "drifter", name: "The Drifter", type: "Acoustic", shape: "dreadnought", wood: "Solid mahogany / spruce top", price: 1850, accent: "#C89B4A", blurb: "A dreadnought built for a front porch and a long night." },
  { id: "roadhouse", name: "The Roadhouse", type: "Electric", shape: "singlecut", wood: "Mahogany body, maple cap", price: 2400, accent: "#D9713C", blurb: "Thick, humbucker-driven, and unbothered by volume." },
  { id: "lowend-six", name: "Lowend Six", type: "Bass", shape: "bass", wood: "Ash body, maple neck", price: 2100, accent: "#8FA07A", blurb: "Punchy low end with room to growl on the bridge pickup." },
  { id: "parlor-12", name: "The Parlor 12", type: "Acoustic", shape: "parlor", wood: "Spruce top, rosewood back", price: 1200, accent: "#C89B4A", blurb: "Small body, big voice — fingerstyle players' favorite." },
  { id: "copperline", name: "Copperline Custom", type: "Electric", shape: "doublecut", wood: "Swamp ash body, roasted maple neck", price: 2850, accent: "#D9713C", blurb: "Single-coil twang with a copper-wound humbucker in the bridge." },
  { id: "nightcrawler", name: "The Nightcrawler", type: "Electric", shape: "singlecut", wood: "All-mahogany, ebony board", price: 3200, accent: "#B0563D", blurb: "Warm, dark, and built for sustain that won't quit." },
  { id: "highline-5", name: "Highline 5", type: "Bass", shape: "bass", wood: "Alder body, wenge neck", price: 2650, accent: "#8FA07A", blurb: "Five strings, wide neck, tuned for players who need the B." },
  { id: "songwriter", name: "The Songwriter", type: "Acoustic", shape: "dreadnought", wood: "Cedar top, walnut back", price: 1650, accent: "#C89B4A", blurb: "Bright and articulate — built for demoing at 2am." },
];

const CATEGORIES = ["All", "Acoustic", "Electric", "Bass"];

const PROCESS = [
  { n: "01", title: "Select the wood", body: "Every top is tap-tested by hand before it's cut. We reject more wood than we use." },
  { n: "02", title: "Carve the neck", body: "Shaped on the bench, not the CNC, so it fits a hand instead of a spec sheet." },
  { n: "03", title: "Fit the joint", body: "A dovetail neck joint, glued dry-fit first. No shims, no gaps." },
  { n: "04", title: "Finish thin", body: "A hand-rubbed nitro finish thin enough that the wood still breathes." },
  { n: "05", title: "String and settle", body: "Strung, played in, and left to settle for two weeks before it ships." },
];

function formatPrice(n) {
  return `$${n.toLocaleString("en-US")}`;
}

export default function Copperwound() {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]); // {id, qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.type === category)),
    [category]
  );

  const cartItems = cart.map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id) }));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);

  function addToCart(id) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id, qty: 1 }];
    });
    const p = PRODUCTS.find((p) => p.id === id);
    setToast(`Added ${p.name} to your cart`);
    setTimeout(() => setToast(null), 2200);
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#201510", color: "#F3E9D8", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${FONT_LINK}&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .grain-card { background: linear-gradient(160deg, #2B1D14 0%, #241811 100%); }
        .btn-brass { transition: transform .15s ease, background .15s ease; }
        .btn-brass:hover { transform: translateY(-1px); }
        .card-hover { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -20px rgba(0,0,0,0.6); }
        .focus-ring:focus-visible { outline: 2px solid #D9713C; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .card-hover, .btn-brass, .drawer-slide { transition: none !important; }
        }
        .drawer-slide { transition: transform .3s ease; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: "rgba(32,21,16,0.92)", backdropFilter: "blur(6px)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl tracking-tight" style={{ color: "#F3E9D8" }}>
              Copperwound
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest" style={{ color: "#A6906F" }}>
            <a href="#shop" className="hover:text-[#F3E9D8] transition-colors focus-ring">Shop</a>
            <a href="#craft" className="hover:text-[#F3E9D8] transition-colors focus-ring">Craft</a>
            <a href="#footer" className="hover:text-[#F3E9D8] transition-colors focus-ring">Contact</a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest btn-brass focus-ring"
            style={{ background: "#C89B4A", color: "#201510" }}
            aria-label="Open cart"
          >
            <ShoppingBag size={15} />
            Cart
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-semibold"
                style={{ background: "#D9713C", color: "#201510" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <StringDivider tone="#3A281B" opacity={0.9} />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "#D9713C" }}>
            Est. bench-built, one at a time
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6" style={{ color: "#F3E9D8" }}>
            Every note starts
            <br />
            with the wood.
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-md" style={{ color: "#C9B79A" }}>
            Copperwound builds acoustic, electric, and bass guitars by hand in small
            batches. No factory line, no shortcuts — just wood, wire, and a plane.
          </p>
          <div className="flex items-center gap-4 mb-10">
            <a
              href="#shop"
              className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest btn-brass focus-ring"
              style={{ background: "#D9713C", color: "#201510" }}
            >
              Shop the lineup
            </a>
            <a href="#craft" className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest border btn-brass focus-ring" style={{ borderColor: "#3A281B", color: "#F3E9D8" }}>
              How we build
            </a>
          </div>
          <StringDivider tone="#C89B4A" opacity={0.55} />
        </div>
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(217,113,60,0.25), transparent 70%)" }}
            aria-hidden="true"
          />
          <GuitarMark shape="singlecut" color="#F3E9D8" className="w-56 md:w-72 relative" />
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: "#F3E9D8" }}>
            The lineup
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-colors focus-ring"
                style={
                  category === c
                    ? { background: "#C89B4A", color: "#201510" }
                    : { background: "transparent", color: "#A6906F", border: "1px solid #3A281B" }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="grain-card card-hover rounded-2xl p-5 flex flex-col border"
              style={{ borderColor: "#3A281B" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#A6906F" }}>
                  {p.type}
                </span>
                <span
                  className="font-mono text-[10px] px-2 py-1 rounded-full"
                  style={{ background: "rgba(200,155,74,0.15)", color: "#C89B4A" }}
                >
                  {formatPrice(p.price)}
                </span>
              </div>
              <div className="flex items-center justify-center py-6">
                <GuitarMark shape={p.shape} color={p.accent} className="w-28 h-28" />
              </div>
              <h3 className="font-display text-xl mb-1" style={{ color: "#F3E9D8" }}>
                {p.name}
              </h3>
              <p className="text-sm mb-1" style={{ color: "#C9B79A" }}>{p.blurb}</p>
              <p className="font-mono text-[11px] mb-4" style={{ color: "#A6906F" }}>{p.wood}</p>
              <button
                onClick={() => addToCart(p.id)}
                className="mt-auto w-full py-2.5 rounded-full font-mono text-xs uppercase tracking-widest btn-brass focus-ring"
                style={{ background: "#3A281B", color: "#F3E9D8" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#C89B4A", e.currentTarget.style.color = "#201510")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3A281B", e.currentTarget.style.color = "#F3E9D8")}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Craft / process */}
      <section id="craft" className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="mb-10 max-w-lg">
          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: "#F3E9D8" }}>
            Five steps, no shortcuts
          </h2>
          <p style={{ color: "#C9B79A" }}>
            Each Copperwound guitar passes through the same five stages on the bench,
            in this order, before it ever leaves the shop.
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {PROCESS.map((step, i) => (
            <div key={step.n} className="relative pl-1">
              <span className="font-mono text-3xl block mb-3" style={{ color: "#3A281B" }}>
                {step.n}
              </span>
              <h3 className="font-display text-lg mb-2" style={{ color: "#F3E9D8" }}>{step.title}</h3>
              <p className="text-sm" style={{ color: "#A6906F" }}>{step.body}</p>
              {i < PROCESS.length - 1 && (
                <div className="hidden md:block absolute top-3 -right-3">
                  <ChevronRight size={14} color="#3A281B" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <StringDivider tone="#3A281B" opacity={0.8} />
      </div>

      {/* Trust strip */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid sm:grid-cols-3 gap-8">
        {[
          { title: "Two-week setup", body: "Every guitar is played in and re-set before it ships to you." },
          { title: "Lifetime rebalance", body: "Free neck resets and fret dressing for as long as you own it." },
          { title: "Built to order", body: "Choose your wood pairing — nothing leaves the shop off the rack." },
        ].map((f) => (
          <div key={f.title}>
            <div className="flex items-center gap-2 mb-2">
              <Check size={16} color="#D9713C" />
              <h4 className="font-display text-lg" style={{ color: "#F3E9D8" }}>{f.title}</h4>
            </div>
            <p className="text-sm" style={{ color: "#A6906F" }}>{f.body}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer id="footer" className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-14">
        <StringDivider tone="#C89B4A" opacity={0.4} />
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="font-display text-2xl" style={{ color: "#F3E9D8" }}>Copperwound</span>
            <p className="text-sm mt-2 max-w-xs" style={{ color: "#A6906F" }}>
              Handbuilt guitars from a small shop that still smells like sawdust.
            </p>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest flex gap-8" style={{ color: "#A6906F" }}>
            <a href="#shop" className="hover:text-[#F3E9D8] focus-ring">Shop</a>
            <a href="#craft" className="hover:text-[#F3E9D8] focus-ring">Craft</a>
            <a href="#" className="hover:text-[#F3E9D8] focus-ring">Care guide</a>
            <a href="#" className="hover:text-[#F3E9D8] focus-ring">Shipping</a>
          </div>
        </div>
        <p className="font-mono text-[10px] mt-10" style={{ color: "#4A3A2A" }}>
          © 2026 Copperwound Guitar Co. — every serial number tells a story.
        </p>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={() => setCartOpen(false)}
          />
          <div
            className="drawer-slide relative w-full max-w-sm h-full flex flex-col"
            style={{ background: "#201510", borderLeft: "1px solid #3A281B" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#3A281B" }}>
              <h3 className="font-display text-xl" style={{ color: "#F3E9D8" }}>Your cart</h3>
              <button onClick={() => setCartOpen(false)} className="focus-ring" aria-label="Close cart">
                <X size={20} color="#A6906F" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <p className="text-sm mt-8 text-center" style={{ color: "#A6906F" }}>
                  Nothing in here yet. Go find something worth playing.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {cartItems.map(({ id, qty, product }) => (
                    <div key={id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl grain-card flex items-center justify-center shrink-0" style={{ borderColor: "#3A281B" }}>
                        <GuitarMark shape={product.shape} color={product.accent} className="w-10 h-10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base truncate" style={{ color: "#F3E9D8" }}>{product.name}</p>
                        <p className="font-mono text-xs" style={{ color: "#A6906F" }}>{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => changeQty(id, -1)} className="focus-ring" aria-label="Decrease quantity">
                            <Minus size={14} color="#C89B4A" />
                          </button>
                          <span className="font-mono text-xs w-4 text-center">{qty}</span>
                          <button onClick={() => changeQty(id, 1)} className="focus-ring" aria-label="Increase quantity">
                            <Plus size={14} color="#C89B4A" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t" style={{ borderColor: "#3A281B" }}>
                <div className="flex justify-between font-mono text-sm mb-4">
                  <span style={{ color: "#A6906F" }}>Total</span>
                  <span style={{ color: "#F3E9D8" }}>{formatPrice(cartTotal)}</span>
                </div>
                <button
                  className="w-full py-3 rounded-full font-mono text-xs uppercase tracking-widest btn-brass focus-ring"
                  style={{ background: "#D9713C", color: "#201510" }}
                  onClick={() => setToast("This is a demo — no real checkout here.")}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full font-mono text-xs z-50 shadow-lg"
          style={{ background: "#F3E9D8", color: "#201510" }}
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
