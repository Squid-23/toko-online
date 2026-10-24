
"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  label?: string;
  color: string;
  image: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Everyday Canvas Cap",
    category: "Aksesori",
    price: 89000,
    oldPrice: 119000,
    label: "Bestseller",
    color: "#e7e0d5",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",
    description: "Topi kasual dengan desain simpel untuk aktivitas sehari-hari.",
  },
  {
    id: 2,
    name: "Classic Street Sneakers",
    category: "Sepatu",
    price: 249000,
    oldPrice: 299000,
    label: "Hemat 17%",
    color: "#e8edf2",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    description: "Sepatu kasual yang cocok untuk gaya santai dan harian.",
  },
  {
    id: 3,
    name: "Daily Essential Bag",
    category: "Tas",
    price: 159000,
    color: "#e7e8df",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    description: "Tas serbaguna dengan tampilan minimal dan ruang penyimpanan praktis.",
  },
  {
    id: 4,
    name: "Soft Cotton Shirt",
    category: "Pakaian",
    price: 129000,
    oldPrice: 149000,
    color: "#e7eaf5",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
    description: "Kaos berbahan katun untuk melengkapi outfit sehari-hari.",
  },
  {
    id: 5,
    name: "Urban Crossbody Bag",
    category: "Tas",
    price: 119000,
    color: "#eee4dc",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    description: "Tas praktis untuk membawa barang penting saat bepergian.",
  },
  {
    id: 6,
    name: "Minimalist Daily Watch",
    category: "Aksesori",
    price: 189000,
    oldPrice: 229000,
    color: "#e4e9e5",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    description: "Jam tangan dengan gaya minimalis yang mudah dipadukan.",
  },
  {
    id: 7,
    name: "Weekend Sneakers",
    category: "Sepatu",
    price: 219000,
    color: "#eee8dd",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85",
    description: "Sepatu santai dengan desain modern untuk akhir pekan.",
  },
  {
    id: 8,
    name: "Relaxed Fit Shirt",
    category: "Pakaian",
    price: 145000,
    color: "#e4eaf2",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85",
    description: "Kemeja kasual untuk tampilan rapi tanpa terasa berlebihan.",
  },
];

const categories = ["Semua", "Pakaian", "Sepatu", "Tas", "Aksesori"];

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [page, setPage] = useState<"home" | "cart" | "orders">("home");
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [orders, setOrders] = useState<
    { id: string; date: string; items: number; total: number; status: string }[]
  >([]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "Semua" || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartItems = products.filter((product) => (cart[product.id] ?? 0) > 0);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
    setNotice(`${product.name} ditambahkan ke keranjang`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] ?? 0) + amount;

      if (quantity <= 0) delete next[id];
      else next[id] = quantity;

      return next;
    });
  }

  function openAccount(mode: "login" | "register") {
    setAccountMode(mode);
    setRegisterStep(1);
    setAccountOpen(true);
    setNotice("");
  }

  function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setNotice("Lengkapi semua kolom terlebih dahulu.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice("Format email belum benar.");
      return;
    }

    if (password.length < 8) {
      setNotice("Password minimal 8 karakter.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setNotice("Password perlu memiliki huruf besar dan angka.");
      return;
    }

    if (password !== confirmPassword) {
      setNotice("Konfirmasi password belum cocok.");
      return;
    }

    setNotice("Validasi berhasil. Pendaftaran akun belum tersambung ke server.");
  }

  function simulateCheckout() {
    if (cartCount === 0) return;

    const order = {
      id: `RF-${Date.now().toString().slice(-7)}`,
      date: new Date().toLocaleDateString("id-ID"),
      items: cartCount,
      total: cartTotal,
      status: "Menunggu konfirmasi",
    };

    setOrders((current) => [order, ...current]);
    setCart({});
    setPage("orders");
    setNotice("Pesanan simulasi berhasil dibuat.");
    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <main className="store">
      <div className="announcement">
        <span>RIFARSTORE</span>
        <span>Temukan pilihan favoritmu, mulai dari sini.</span>
      </div>

      <header className="site-header">
        <button className="brand" onClick={() => setPage("home")} aria-label="Ke beranda">
          <span className="brand-mark">R</span>
          <span>rifar<span className="brand-accent">store</span></span>
        </button>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          <button className={page === "home" ? "nav-link active" : "nav-link"} onClick={() => setPage("home")}>
            Beranda
          </button>
          <button className="nav-link" onClick={() => { setPage("home"); setCategory("Semua"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
            Katalog
          </button>
          <button className={page === "orders" ? "nav-link active" : "nav-link"} onClick={() => setPage("orders")}>
            Pesanan Saya
          </button>
        </nav>

        <div className="header-actions">
          <button className="icon-button search-shortcut" aria-label="Fokus pencarian" onClick={() => { setPage("home"); document.getElementById("product-search")?.focus(); }}>
            <SearchIcon />
          </button>
          <button className="icon-button" aria-label="Akun saya" onClick={() => openAccount("login")}>
            <UserIcon />
          </button>
          <button className="cart-button" onClick={() => setPage("cart")} aria-label={`Keranjang, ${cartCount} produk`}>
            <BagIcon />
            <span className="cart-label">Keranjang</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> PILIHAN UNTUK HARI INI</span>
              <h1>Hal kecil yang bikin gayamu <span>lebih berarti.</span></h1>
              <p>Temukan barang pilihan untuk menemani keseharianmu. Simpel, nyaman, dan tetap sesuai gaya kamu.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
                  Jelajahi koleksi <ArrowIcon />
                </button>
                <button className="text-button" onClick={() => { setCategory("Semua"); setSearch(""); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Lihat semua produk
                </button>
              </div>
              <div className="hero-note">
                <span className="note-check"><CheckIcon /></span>
                <span>Belanja lebih mudah, langsung dari perangkatmu</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-card hero-card-back">
                <img src={products[2].image} alt="Tas pilihan RifarStore" />
              </div>
              <div className="hero-card hero-card-front">
                <img src={products[0].image} alt="Topi kasual pilihan RifarStore" />
              </div>
              <div className="floating-note">
                <span className="floating-note-icon"><SparkIcon /></span>
                <span><strong>Daily essentials</strong><small>Favorit untuk setiap hari</small></span>
              </div>
              <div className="hero-index">01 <span>/ 04</span></div>
            </div>
            <div className="hero-bottom-line" />
          </section>

          <section className="benefits" aria-label="Keunggulan toko">
            <div className="benefit-item"><span className="benefit-icon"><BoxIcon /></span><span><strong>Pilihan beragam</strong><small>Untuk kebutuhan harianmu</small></span></div>
            <div className="benefit-item"><span className="benefit-icon"><ShieldIcon /></span><span><strong>Belanja nyaman</strong><small>Alur yang mudah dipahami</small></span></div>
            <div className="benefit-item"><span className="benefit-icon"><HeartIcon /></span><span><strong>Dipilih dengan cermat</strong><small>Gaya simpel, tetap menarik</small></span></div>
          </section>

          <section className="catalog-section" id="catalog">
            <div className="section-heading">
              <div>
                <span className="section-kicker">TEMUKAN FAVORITMU</span>
                <h2>Koleksi pilihan<span>.</span></h2>
                <p>Temukan item yang cocok untuk menemani aktivitasmu.</p>
              </div>
              <label className="search-field">
                <SearchIcon />
                <input
                  id="product-search"
                  type="search"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && <button onClick={() => setSearch("")} aria-label="Hapus pencarian">×</button>}
              </label>
            </div>

            <div className="category-row">
              <div className="category-tabs">
                {categories.map((item) => (
                  <button key={item} className={category === item ? "category-tab selected" : "category-tab"} onClick={() => setCategory(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <span className="product-count">{filteredProducts.length} produk</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image" style={{ backgroundColor: product.color }}>
                      {product.label && <span className="product-label">{product.label}</span>}
                      <button className="quick-add" onClick={() => addToCart(product)} aria-label={`Tambah ${product.name} ke keranjang`}>
                        <PlusIcon />
                      </button>
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-price-row">
                        <strong>{money(product.price)}</strong>
                        {product.oldPrice && <del>{money(product.oldPrice)}</del>}
                      </div>
                      <button className="add-button" onClick={() => addToCart(product)}>
                        Tambah ke keranjang <PlusIcon />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><SearchIcon /></span>
                <h3>Produk belum ditemukan</h3>
                <p>Coba kata kunci atau kategori yang berbeda.</p>
                <button className="secondary-button" onClick={() => { setSearch(""); setCategory("Semua"); }}>Tampilkan semua produk</button>
              </div>
            )}
          </section>

          <section className="newsletter">
            <div className="newsletter-decoration" />
            <div>
              <span className="section-kicker">KENALAN DENGAN RIFARSTORE</span>
              <h2>Belanja simpel, pilihan tetap menarik.</h2>
              <p>Jelajahi koleksi kami dan temukan pilihan yang pas untuk keseharianmu.</p>
            </div>
            <button className="newsletter-button" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
              Lihat koleksi <ArrowIcon />
            </button>
          </section>
        </>
      )}

      {page === "cart" && (
        <section className="subpage">
          <button className="back-link" onClick={() => setPage("home")}><ArrowLeftIcon /> Lanjut belanja</button>
          <div className="subpage-heading"><span className="section-kicker">PILIHANMU</span><h1>Keranjang belanja<span>.</span></h1><p>Periksa kembali produk sebelum melanjutkan.</p></div>
          {cartItems.length === 0 ? (
            <div className="empty-state cart-empty"><span className="empty-icon"><BagIcon /></span><h3>Keranjangmu masih kosong</h3><p>Yuk, temukan produk yang kamu suka.</p><button className="primary-button" onClick={() => setPage("home")}>Mulai belanja <ArrowIcon /></button></div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cartItems.map((product) => (
                  <article className="cart-item" key={product.id}>
                    <div className="cart-product-image" style={{ backgroundColor: product.color }}><img src={product.image} alt={product.name} /></div>
                    <div className="cart-product-detail"><span className="product-category">{product.category}</span><h3>{product.name}</h3><strong>{money(product.price)}</strong><button className="remove-button" onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })}>Hapus</button></div>
                    <div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label="Kurangi jumlah">−</button><span>{cart[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="Tambah jumlah">+</button></div>
                  </article>
                ))}
              </div>
              <aside className="order-summary"><h2>Ringkasan pesanan</h2><div><span>Total item</span><span>{cartCount} produk</span></div><div><span>Pengiriman</span><span className="muted-value">Dihitung nanti</span></div><div className="summary-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><p className="simulation-note">Checkout ini masih simulasi dan belum memproses pembayaran nyata.</p><button className="primary-button checkout-button" onClick={simulateCheckout}>Buat pesanan simulasi <ArrowIcon /></button></aside>
            </div>
          )}
        </section>
      )}

      {page === "orders" && (
        <section className="subpage">
          <div className="subpage-heading"><span className="section-kicker">RIWAYAT BELANJA</span><h1>Pesanan saya<span>.</span></h1><p>Pesanan simulasi yang dibuat pada perangkat ini.</p></div>
          {orders.length === 0 ? (
            <div className="empty-state"><span className="empty-icon"><ClipboardIcon /></span><h3>Belum ada pesanan</h3><p>Pesanan yang kamu buat akan muncul di halaman ini.</p><button className="primary-button" onClick={() => setPage("home")}>Jelajahi produk <ArrowIcon /></button></div>
          ) : (
            <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><span className="order-id">{order.id}</span><span className="order-status">{order.status}</span></div><p>Tanggal: {order.date}</p><div className="order-card-bottom"><span>{order.items} item</span><strong>{money(order.total)}</strong></div></article>)}</div>
          )}
        </section>
      )}

      <footer className="site-footer">
        <div className="footer-main">
          <button className="brand footer-brand" onClick={() => setPage("home")}><span className="brand-mark">R</span><span>rifar<span className="brand-accent">store</span></span></button>
          <p>Temukan pilihan sehari-hari yang sesuai dengan gayamu.</p>
          <div className="footer-links"><button onClick={() => setPage("home")}>Beranda</button><button onClick={() => setPage("cart")}>Keranjang</button><button onClick={() => setPage("orders")}>Pesanan Saya</button><button onClick={() => openAccount("login")}>Akun</button></div>
        </div>
        <div className="footer-bottom"><span>© 2026 RifarStore. Project demo.</span><span>Dibuat untuk pengalaman belanja yang lebih simpel.</span></div>
      </footer>

      {notice && <div className="toast" role="status"><span className="toast-check"><CheckIcon /></span>{notice}</div>}

      {accountOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false); }}>
          <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button className="modal-close" onClick={() => setAccountOpen(false)} aria-label="Tutup">×</button>
            <div className="account-brand"><span className="brand-mark">R</span></div>
            <span className="section-kicker">{accountMode === "login" ? "SELAMAT DATANG KEMBALI" : "BUAT AKUN BARU"}</span>
            <h2 id="account-title">{accountMode === "login" ? "Senang melihatmu lagi." : "Mulai perjalananmu."}</h2>
            <p className="account-intro">{accountMode === "login" ? "Masuk untuk melanjutkan pengalaman belanjamu." : "Daftar dengan email untuk membuat akun RifarStore."}</p>

            {accountMode === "register" && (
              <div className="register-progress">
                {[1, 2, 3].map((step) => <div className={`progress-step ${registerStep >= step ? "progress-active" : ""}`} key={step}><span>{registerStep > step ? <CheckIcon /> : step}</span><small>{step === 1 ? "Data diri" : step === 2 ? "Keamanan" : "Selesai"}</small></div>)}
              </div>
            )}

            {accountMode === "login" ? (
              <form className="account-form" onSubmit={(event) => { event.preventDefault(); setNotice("Login belum aktif karena backend akun belum dipasang."); }}>
                <label>Email atau nomor HP<input type="text" placeholder="Masukkan email atau nomor HP" required /></label>
                <label>Password<div className="password-input"><input type={showPassword ? "text" : "password"} placeholder="Masukkan password" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Sembunyikan" : "Lihat"}</button></div></label>
                <button className="forgot-link" type="button" onClick={() => setNotice("Fitur reset password akan dibuat setelah backend akun tersedia.")}>Lupa password?</button>
                <button className="primary-button form-submit" type="submit">Masuk <ArrowIcon /></button>
                <div className="form-divider"><span />atau<span /></div>
                <button className="social-button" type="button" onClick={() => setNotice("Login Google belum dikonfigurasi.")}><GoogleMark /> Lanjutkan dengan Google</button>
                <p className="switch-account">Belum punya akun? <button type="button" onClick={() => { setAccountMode("register"); setRegisterStep(1); setNotice(""); }}>Daftar sekarang</button></p>
              </form>
            ) : (
              <div className="account-form">
                {registerStep === 1 && (
                  <>
                    <label>Nama lengkap<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama sesuai identitas" autoComplete="name" /></label>
                    <label>Email aktif<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" /></label>
                    <button className="primary-button form-submit" onClick={() => { if (!name.trim() || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setNotice("Isi nama dan email dengan format yang benar."); else { setRegisterStep(2); setNotice(""); } }}>Lanjutkan <ArrowIcon /></button>
                  </>
                )}
                {registerStep === 2 && (
                  <>
                    <label>Password<div className="password-input"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Buat password" autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Sembunyikan" : "Lihat"}</button></div></label>
                    <div className="password-rules">
                      <span className={password.length >= 8 ? "rule-valid" : ""}><CheckIcon /> Minimal 8 karakter</span>
                      <span className={/[A-Z]/.test(password) ? "rule-valid" : ""}><CheckIcon /> Memiliki huruf besar</span>
                      <span className={/[0-9]/.test(password) ? "rule-valid" : ""}><CheckIcon /> Memiliki angka</span>
                    </div>
                    <label>Konfirmasi password<div className="password-input"><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ulangi password" autoComplete="new-password" /></div></label>
                    <div className="form-button-row"><button className="secondary-button" onClick={() => { setRegisterStep(1); setNotice(""); }}><ArrowLeftIcon /> Kembali</button><button className="primary-button" onClick={() => { if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) setNotice("Periksa kembali ketentuan password."); else if (password !== confirmPassword) setNotice("Konfirmasi password belum cocok."); else { setRegisterStep(3); setNotice(""); } }}>Lanjutkan <ArrowIcon /></button></div>
                  </>
                )}
                {registerStep === 3 && (
                  <div className="register-finish"><span className="success-circle"><CheckIcon /></span><h3>Data pendaftaran siap</h3><p>Halo, {name}. Data awalmu sudah lolos validasi pada halaman ini. Pembuatan akun sungguhan menunggu backend.</p><button className="primary-button form-submit" onClick={handleRegister}>Validasi data <CheckIcon /></button><button className="back-link centered-link" onClick={() => { setRegisterStep(2); setNotice(""); }}><ArrowLeftIcon /> Periksa kembali</button></div>
                )}
                <p className="switch-account">{accountMode === "register" ? "Sudah punya akun?" : "Belum punya akun?"} <button type="button" onClick={() => { setAccountMode(accountMode === "register" ? "login" : "register"); setRegisterStep(1); setNotice(""); }}>{accountMode === "register" ? "Masuk" : "Daftar sekarang"}</button></p>
              </div>
            )}
            <p className="account-legal">Dengan melanjutkan, kamu menyetujui ketentuan penggunaan RifarStore.</p>
          </section>
        </div>
      )}
    </main>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
}
function UserIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-3.4 3.1-5.3 7-5.3s6.4 1.9 7 5.3" /></svg>;
}
function BagIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}
function ArrowLeftIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m7 7-7-7 7-7" /></svg>;
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>;
}
function BoxIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.5 8.3-8 10-4.5-1.7-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></svg>;
}
function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" /></svg>;
}
function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8L12 2Z" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" /></svg>;
}
function ClipboardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4" /></svg>;
}
function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.4 13.7a6 6 0 0 1 0-3.4V7.7H3.1a10 10 0 0 0 0 8.6l3.3-2.6Z" /><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.7l3.3 2.6C7.2 7.9 9.4 6.1 12 6.1Z" /></svg>;
}
