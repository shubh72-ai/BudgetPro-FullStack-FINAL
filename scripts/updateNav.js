const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Update navLinks
const oldNavLinks = `  const navLinks = [
    { id: "/",         label: "Home" },
    { id: "/product",  label: "Product" },
  ];`;
  
const newNavLinks = `  const navLinks = [
    { id: "/",         label: "Home" },
    { id: "/product",  label: "Product" },
    { id: "/#inside",  label: "What's Inside" },
    { id: "/#reviews", label: "Reviews" },
    { id: "/#faq",     label: "FAQ" },
  ];`;

content = content.replace(oldNavLinks, newNavLinks);

// 2. Update Nav styling
const oldNavStyle = `      <nav style={{
        background: scrolled ? "rgba(5,5,6,0.86)" : "rgba(5,5,6,0.62)",
        borderBottom: \`1px solid \${DS.color.border}\`,
        position: "sticky",
        top: 0,
        zIndex: 150,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: scrolled ? "0 18px 56px rgba(0,0,0,0.36)" : "none",
        transition: \`all 0.3s \${DS.ease.smooth}\`,
      }}>`;
      
const newNavStyle = `      <nav style={{
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.7)",
        borderBottom: \`1px solid rgba(15, 23, 42, 0.08)\`,
        position: "sticky",
        top: 0,
        zIndex: 150,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
        transition: \`all 0.3s \${DS.ease.smooth}\`,
      }}>`;

content = content.replace(oldNavStyle, newNavStyle);

// 3. Update the Nav Desktop links styling to match white theme
const oldNavLinkStyle = `                  style={{
                    background: isActive ? DS.color.mintLight : "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 15px",
                    borderRadius: DS.radius.lg,
                    fontWeight: isActive ? 800 : 500,
                    color: isActive ? DS.color.mintDark : DS.color.slate,
                    fontSize: 14,
                    fontFamily: "inherit",
                  }}`;
                  
const newNavLinkStyle = `                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 15px",
                    borderRadius: "100px",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? "#3b82f6" : "#475569",
                    fontSize: 14,
                    fontFamily: "'Inter', sans-serif",
                    position: "relative",
                  }}`;

content = content.replace(oldNavLinkStyle, newNavLinkStyle);

// 4. Update right side buttons
const oldNavRight = `          <div className="nav-desktop" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 1, height: 24, background: DS.color.border, margin: "0 4px" }} />
            <Btn size="sm" variant="outline" onClick={() => goTo("/product")}>Product</Btn>
            <Btn size="sm" variant="gold" onClick={() => goTo("/checkout?plan=monthly")}>Start for ₹19</Btn>
            <button
              onClick={() => goTo("/admin")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: DS.color.slateLight, marginLeft: 2 }}
              title="Admin"
              aria-label="Admin panel"
            >
              <Icon name="settings" size={17} color={DS.color.slateLight} />
            </button>
          </div>`;
          
const newNavRight = `          <div className="nav-desktop" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button 
              onClick={() => goTo("/checkout?plan=monthly")}
              style={{ background: \`linear-gradient(135deg, #8b5cf6, #3b82f6)\`, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)" }}
            >
              Start for ₹19
            </button>
            <button
              onClick={() => goTo("/admin")}
              style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.08)", borderRadius: "50%", cursor: "pointer", padding: "10px", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Toggle Theme"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
          </div>`;

content = content.replace(oldNavRight, newNavRight);

fs.writeFileSync(appPath, content, 'utf8');
console.log("Successfully updated Navbar styling.");
