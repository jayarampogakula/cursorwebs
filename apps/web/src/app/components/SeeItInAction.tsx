"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Eye, Code, Settings, Terminal, Rocket, Palette, Building, 
  RefreshCw, ExternalLink, ArrowRight, CornerDownLeft, 
  Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, 
  Moon, Sun, Home, Sparkles, MessageSquare, Send, Check
} from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export default function SeeItInAction() {
  const [activeTab, setActiveTab] = useState<"preview" | "inspect" | "code">("preview");
  
  // Chat States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: "ai", text: "I've structured a playful, pet-friendly layout with a warm coral and blue theme. Let me know if you want any copy changes or section tweaks!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Live Edit Preview States
  const [heroTitle, setHeroTitle] = useState("Toys That Make Tails Wag!");
  const [heroSubtitle, setHeroSubtitle] = useState("Discover the happiest toys for your furry friends. Durable, safe, and endlessly entertaining toys that pets absolutely love.");
  
  // Inspect States
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editTextVal, setEditTextVal] = useState("");

  // Code Explorer States
  const [selectedFile, setSelectedFile] = useState("src/pages/Home.tsx");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "src/pages": true
  });

  const fileContents: Record<string, string> = {
    "src/pages/Home.tsx": `import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Sparkles, Star, Heart, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight">
            🐾 ${heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            ${heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg">Shop Now</Button>
            <Button size="lg" variant="outline">See Bestsellers</Button>
          </div>
        </div>
      </section>
    </div>
  );
}`,
    "src/App.tsx": `import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}`,
    "package.json": `{
  "name": "pet-toys-landing",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.331.0"
  }
}`
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      if (userMsg.toLowerCase().includes("title") || userMsg.toLowerCase().includes("heading") || userMsg.toLowerCase().includes("name")) {
        setHeroTitle("The Happiest Toys in the World!");
        setChatHistory(prev => [...prev, { sender: "ai", text: "Sure! I've updated the main header text to feel even more engaging and friendly. Check out the preview!" }]);
      } else if (userMsg.toLowerCase().includes("ecommerce") || userMsg.toLowerCase().includes("cart") || userMsg.toLowerCase().includes("shop")) {
        setChatHistory(prev => [...prev, { sender: "ai", text: "Got it! I am integrating e-commerce state, updating your checkout buttons, and preparing product layout components." }]);
      } else {
        setChatHistory(prev => [...prev, { sender: "ai", text: "Understood. Recompiling the layout code, updating layout sections, and optimizing client-side styles now." }]);
      }
    }, 1800);
  };

  const handleInspectAction = (action: "chat" | "edit" | "copy") => {
    if (!selectedElement) return;

    if (action === "chat") {
      setChatHistory(prev => [...prev, { 
        sender: "user", 
        text: `Tell me about the style of the ${selectedElement} element.` 
      }]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { 
          sender: "ai", 
          text: `The ${selectedElement} is using a modern text-5xl tracking-tight style, with color set to theme-primary. I can adjust its font size or alignment if you'd like!` 
        }]);
      }, 1500);
    } else if (action === "edit") {
      setIsEditingText(true);
      setEditTextVal(selectedElement === "title" ? heroTitle : heroSubtitle);
    }
    setSelectedElement(null);
  };

  const handleSaveText = () => {
    if (selectedElement === "title" || isEditingText) {
      if (selectedElement === "title" || editTextVal.length > 5) {
        if (editTextVal.includes("toy") || editTextVal.includes("Tails") || editTextVal.length < 50) {
          setHeroTitle(editTextVal);
        } else {
          setHeroSubtitle(editTextVal);
        }
      }
    }
    setIsEditingText(false);
    setSelectedElement(null);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  return (
    <section id="use-cases" className="section-band" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div className="section-copy" style={{ textAlign: "center", margin: "0 auto 1.5rem auto" }}>
        <span className="eyebrow" style={{ margin: "0 auto" }}>Interactive Demo</span>
        <h2>See it in action</h2>
        <p>A powerful development environment that lets you chat with AI, edit code, and manage projects all in one place.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="demo-tabs-container">
        <button 
          className={`demo-tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => { setActiveTab("preview"); setSelectedElement(null); }}
        >
          Preview
        </button>
        <button 
          className={`demo-tab-btn ${activeTab === "inspect" ? "active" : ""}`}
          onClick={() => { setActiveTab("inspect"); }}
        >
          Inspect
        </button>
        <button 
          className={`demo-tab-btn ${activeTab === "code" ? "active" : ""}`}
          onClick={() => { setActiveTab("code"); setSelectedElement(null); }}
        >
          Code
        </button>
      </div>

      {/* Mock Browser Container */}
      <div className="mock-browser-window">
        {/* Browser Top Header */}
        <div className="browser-header-bar">
          <div className="browser-window-dots">
            <span className="browser-dot" style={{ background: "#ef4444" }}></span>
            <span className="browser-dot" style={{ background: "#fbbf24" }}></span>
            <span className="browser-dot" style={{ background: "#10b981" }}></span>
          </div>

          <div className="browser-header-title">
            Design a landing page for my pet toy...
          </div>

          {/* Browser Right actions & tabs sync */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="browser-inner-tabs">
              <button 
                className={`browser-inner-tab ${activeTab === "preview" ? "active" : ""}`}
                onClick={() => { setActiveTab("preview"); setSelectedElement(null); }}
              >
                <Eye size={12} /> Preview
              </button>
              <button 
                className={`browser-inner-tab ${activeTab === "inspect" ? "active" : ""}`}
                onClick={() => { setActiveTab("inspect"); }}
              >
                <Play size={12} style={{ transform: "rotate(45deg)" }} /> Inspect
              </button>
              <button 
                className={`browser-inner-tab ${activeTab === "code" ? "active" : ""}`}
                onClick={() => { setActiveTab("code"); setSelectedElement(null); }}
              >
                <Code size={12} /> Code
              </button>
            </div>

            {/* Mock build actions */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="browser-inner-tab" style={{ background: "rgba(255,255,255,0.03)" }} title="Recompile Project">
                <RefreshCw size={11} /> <span style={{ fontSize: "0.72rem" }}>Rebuild</span>
              </button>
              <button className="browser-inner-tab" style={{ background: "rgba(255,255,255,0.03)" }} title="Open Live Site">
                <ExternalLink size={11} /> <span style={{ fontSize: "0.72rem" }}>Open</span>
              </button>
              <button 
                style={{ 
                  background: "#ffffff", 
                  color: "#000", 
                  border: "none", 
                  borderRadius: "0.35rem", 
                  padding: "0.3rem 0.75rem", 
                  fontSize: "0.72rem", 
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Browser Body Split Panel */}
        <div className="browser-body-layout">
          {/* LEFT SIDEBAR: AI Chat Panel */}
          <div className="browser-chat-sidebar">
            <div className="browser-chat-content">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.02)",
                    border: msg.sender === "user" ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(255,255,255,0.05)",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    maxWidth: "85%",
                    fontSize: "0.82rem",
                    color: msg.sender === "user" ? "#a5b4fc" : "#e2e8f0",
                    lineHeight: 1.5,
                    textAlign: "left"
                  }}
                >
                  {msg.text}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem", fontSize: "0.8rem", color: "var(--muted)", display: "flex", gap: "0.2rem" }}>
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="browser-chat-input-area">
              <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--line)", borderRadius: "0.5rem", padding: "0.4rem 0.6rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe what you want to build..." 
                  style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.8rem", flex: 1 }}
                />
                <button 
                  type="submit" 
                  style={{ background: "transparent", border: "none", outline: "none", color: "var(--muted)", cursor: "pointer", display: "grid", placeItems: "center" }}
                >
                  <Send size={14} />
                </button>
              </div>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem" }}>
                <CornerDownLeft size={10} /> Enter to send
              </span>
            </form>
          </div>

          {/* RIGHT VIEWPORT: Live Site/Code display */}
          <div className="browser-main-viewport">
            
            {/* VIEW 1: PREVIEW */}
            {activeTab === "preview" && (
              <div className="web-preview-pane">
                {/* Simulated Preview Header */}
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem", marginBottom: "3rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--blue)" }}>Paws&Play</span>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
                    <span>Shop</span>
                    <span>Safety</span>
                    <span>Reviews</span>
                  </div>
                </div>

                {/* Hero */}
                <span className="eyebrow" style={{ color: "var(--blue)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                  <Sparkles size={11} style={{ display: "inline", marginRight: "0.25rem" }} /> Best Pet Toys
                </span>
                <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "1rem 0 0.5rem 0", color: "#fff", letterSpacing: "-0.02em" }}>
                  🐾 {heroTitle}
                </h1>
                <p style={{ maxWidth: "600px", color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 auto" }}>
                  {heroSubtitle}
                </p>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2rem" }}>
                  <button style={{ background: "var(--blue)", color: "#fff", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 700, border: "none" }}>
                    Shop Now
                  </button>
                  <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 700 }}>
                    See Bestsellers
                  </button>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem", opacity: 0.6 }}>✓ Free shipping on orders over $50</span>

                {/* Bottom Segment */}
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "4rem", marginBottom: "0.5rem", color: "#fff" }}>
                  Why Pets (And Parents!) Love Us
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "2rem" }}>Because your furry family deserves the best</p>

                <div style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "800px" }}>
                  <div style={{ flex: 1, padding: "1rem", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
                    <strong style={{ color: "#fff", display: "block", marginBottom: "0.25rem" }}>100% Pet-Safe</strong>
                    <span style={{ color: "var(--muted)" }}>Non-toxic certified materials.</span>
                  </div>
                  <div style={{ flex: 1, padding: "1rem", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
                    <strong style={{ color: "#fff", display: "block", marginBottom: "0.25rem" }}>Designed for Play</strong>
                    <span style={{ color: "var(--muted)" }}>Interactive and highly stimulating.</span>
                  </div>
                  <div style={{ flex: 1, padding: "1rem", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
                    <strong style={{ color: "#fff", display: "block", marginBottom: "0.25rem" }}>Fast, Free Shipping</strong>
                    <span style={{ color: "var(--muted)" }}>Next-day delivery available.</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: INSPECT */}
            {activeTab === "inspect" && (
              <div className="web-preview-pane" style={{ position: "relative", cursor: "pointer" }}>
                {/* Floating Select / Edit mode bar */}
                <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.35rem", background: "rgba(0,0,0,0.8)", border: "1px solid var(--line)", padding: "0.2rem", borderRadius: "0.4rem", zIndex: 50 }}>
                  <button className="browser-inner-tab active" style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}><Play size={10} style={{ transform: "rotate(45deg)" }} /> Select</button>
                  <button className="browser-inner-tab" style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}><Code size={10} /> Edit</button>
                </div>

                {/* Simulated Preview Header */}
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem", marginBottom: "3rem", opacity: 0.6 }}>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--blue)" }}>Paws&Play</span>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
                    <span>Shop</span>
                    <span>Safety</span>
                    <span>Reviews</span>
                  </div>
                </div>

                {/* Hoverable / Clickable Title */}
                <div 
                  onMouseEnter={() => setHoveredElement("title")}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => { setSelectedElement("title"); setIsEditingText(false); }}
                  style={{
                    position: "relative",
                    border: hoveredElement === "title" || selectedElement === "title" ? "2px solid #3b82f6" : "2px dashed transparent",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    transition: "border 0.2s",
                    display: "inline-block",
                    margin: "0 auto"
                  }}
                >
                  <span className="eyebrow" style={{ color: "var(--blue)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.6 }}>
                    <Sparkles size={11} style={{ display: "inline", marginRight: "0.25rem" }} /> Best Pet Toys
                  </span>
                  
                  {isEditingText && selectedElement === "title" ? (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <input 
                        type="text" 
                        value={editTextVal}
                        onChange={(e) => setEditTextVal(e.target.value)}
                        style={{ background: "#111827", border: "1px solid var(--blue)", color: "#fff", padding: "0.4rem 0.75rem", borderRadius: "0.25rem", fontSize: "1.5rem", fontWeight: 800, width: "380px" }}
                      />
                      <button onClick={handleSaveText} style={{ background: "#10b981", border: "none", color: "#fff", padding: "0.4rem 0.75rem", borderRadius: "0.25rem", cursor: "pointer", display: "grid", placeItems: "center" }}><Check size={16} /></button>
                    </div>
                  ) : (
                    <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "0.5rem 0 0 0", color: "#fff", letterSpacing: "-0.02em" }}>
                      🐾 {heroTitle}
                    </h1>
                  )}

                  {/* Hover Tag */}
                  {hoveredElement === "title" && !selectedElement && (
                    <span style={{ position: "absolute", top: "-1.2rem", left: "0", background: "#3b82f6", color: "#fff", fontSize: "0.6rem", padding: "0.1rem 0.3rem", borderRadius: "0.2rem", fontWeight: 700 }}>
                      h1.text-5xl
                    </span>
                  )}

                  {/* Inspect Context Popover */}
                  {selectedElement === "title" && !isEditingText && (
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", background: "#0d1324", border: "1px solid var(--line)", borderRadius: "0.5rem", padding: "0.5rem", width: "190px", zIndex: 99, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left", marginTop: "0.5rem" }}>
                      <div style={{ fontSize: "0.72rem", borderBottom: "1px solid var(--line)", paddingBottom: "0.3rem", marginBottom: "0.3rem", color: "var(--muted)" }}>
                        <strong style={{ color: "#fff" }}>h1.text-5xl</strong>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{heroTitle}"</span>
                      </div>
                      <button onClick={() => handleInspectAction("chat")} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Mention in Chat</button>
                      <button onClick={() => handleInspectAction("edit")} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Edit Text</button>
                      <button style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Copy Selector</button>
                      <button onClick={() => setSelectedElement(null)} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#f87171", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left", marginTop: "0.2rem", borderTop: "1px solid rgba(255,255,255,0.03)" }}>Cancel</button>
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                <div
                  onMouseEnter={() => setHoveredElement("subtitle")}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => { setSelectedElement("subtitle"); setIsEditingText(false); }}
                  style={{
                    position: "relative",
                    border: hoveredElement === "subtitle" || selectedElement === "subtitle" ? "2px solid #3b82f6" : "2px dashed transparent",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    transition: "border 0.2s",
                    display: "block",
                    margin: "1rem auto 0 auto",
                    maxWidth: "620px"
                  }}
                >
                  {isEditingText && selectedElement === "subtitle" ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <textarea 
                        value={editTextVal}
                        onChange={(e) => setEditTextVal(e.target.value)}
                        style={{ background: "#111827", border: "1px solid var(--blue)", color: "#fff", padding: "0.4rem 0.75rem", borderRadius: "0.25rem", fontSize: "0.85rem", width: "100%", resize: "none" }}
                        rows={3}
                      />
                      <button onClick={handleSaveText} style={{ background: "#10b981", border: "none", color: "#fff", padding: "0.4rem 0.75rem", borderRadius: "0.25rem", cursor: "pointer", display: "grid", placeItems: "center" }}><Check size={16} /></button>
                    </div>
                  ) : (
                    <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                      {heroSubtitle}
                    </p>
                  )}

                  {hoveredElement === "subtitle" && !selectedElement && (
                    <span style={{ position: "absolute", top: "-1.2rem", left: "0", background: "#3b82f6", color: "#fff", fontSize: "0.6rem", padding: "0.1rem 0.3rem", borderRadius: "0.2rem", fontWeight: 700 }}>
                      p.text-xl
                    </span>
                  )}

                  {selectedElement === "subtitle" && !isEditingText && (
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", background: "#0d1324", border: "1px solid var(--line)", borderRadius: "0.5rem", padding: "0.5rem", width: "190px", zIndex: 99, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left", marginTop: "0.5rem" }}>
                      <div style={{ fontSize: "0.72rem", borderBottom: "1px solid var(--line)", paddingBottom: "0.3rem", marginBottom: "0.3rem", color: "var(--muted)" }}>
                        <strong style={{ color: "#fff" }}>p.text-xl</strong>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{heroSubtitle}"</span>
                      </div>
                      <button onClick={() => handleInspectAction("chat")} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Mention in Chat</button>
                      <button onClick={() => handleInspectAction("edit")} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Edit Text</button>
                      <button style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left" }}>Copy Selector</button>
                      <button onClick={() => setSelectedElement(null)} style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "#f87171", padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", cursor: "pointer", textAlign: "left", marginTop: "0.2rem", borderTop: "1px solid rgba(255,255,255,0.03)" }}>Cancel</button>
                    </div>
                  )}
                </div>

                {/* Sub-elements styled muted */}
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2rem", opacity: 0.5 }}>
                  <button style={{ background: "var(--blue)", color: "#fff", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 700, border: "none" }}>Shop Now</button>
                  <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 700 }}>See Bestsellers</button>
                </div>
              </div>
            )}

            {/* VIEW 3: CODE */}
            {activeTab === "code" && (
              <>
                {/* File Explorer */}
                <div className="file-explorer-sidebar">
                  {/* src folder */}
                  <div className="explorer-item" onClick={() => toggleFolder("src")} style={{ fontWeight: 600, color: "#fff" }}>
                    {expandedFolders["src"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {expandedFolders["src"] ? <FolderOpen size={14} style={{ color: "#3b82f6" }} /> : <Folder size={14} style={{ color: "#3b82f6" }} />}
                    src
                  </div>
                  
                  {expandedFolders["src"] && (
                    <div style={{ paddingLeft: "0.75rem" }}>
                      <div className="explorer-item">
                        <ChevronRight size={14} />
                        <Folder size={14} style={{ color: "#9ca3af" }} />
                        components
                      </div>
                      <div className="explorer-item">
                        <ChevronRight size={14} />
                        <Folder size={14} style={{ color: "#9ca3af" }} />
                        hooks
                      </div>
                      
                      {/* pages folder */}
                      <div className="explorer-item" onClick={() => toggleFolder("src/pages")} style={{ fontWeight: 600, color: "#fff" }}>
                        {expandedFolders["src/pages"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {expandedFolders["src/pages"] ? <FolderOpen size={14} style={{ color: "#3b82f6" }} /> : <Folder size={14} style={{ color: "#3b82f6" }} />}
                        pages
                      </div>

                      {expandedFolders["src/pages"] && (
                        <div style={{ paddingLeft: "0.75rem" }}>
                          <div 
                            className={`explorer-item ${selectedFile === "src/pages/About.tsx" ? "active" : ""}`}
                            onClick={() => setSelectedFile("src/pages/About.tsx")}
                          >
                            <FileCode size={13} style={{ color: "#60a5fa" }} />
                            About.tsx
                          </div>
                          <div 
                            className={`explorer-item ${selectedFile === "src/pages/Contact.tsx" ? "active" : ""}`}
                            onClick={() => setSelectedFile("src/pages/Contact.tsx")}
                          >
                            <FileCode size={13} style={{ color: "#60a5fa" }} />
                            Contact.tsx
                          </div>
                          <div 
                            className={`explorer-item ${selectedFile === "src/pages/Home.tsx" ? "active" : ""}`}
                            onClick={() => setSelectedFile("src/pages/Home.tsx")}
                          >
                            <FileCode size={13} style={{ color: "#60a5fa" }} />
                            Home.tsx
                          </div>
                          <div 
                            className={`explorer-item ${selectedFile === "src/pages/NotFound.tsx" ? "active" : ""}`}
                            onClick={() => setSelectedFile("src/pages/NotFound.tsx")}
                          >
                            <FileCode size={13} style={{ color: "#60a5fa" }} />
                            NotFound.tsx
                          </div>
                        </div>
                      )}

                      <div 
                        className={`explorer-item ${selectedFile === "src/App.tsx" ? "active" : ""}`}
                        onClick={() => setSelectedFile("src/App.tsx")}
                      >
                        <FileCode size={13} style={{ color: "#818cf8" }} />
                        App.tsx
                      </div>
                    </div>
                  )}

                  <div 
                    className={`explorer-item ${selectedFile === "package.json" ? "active" : ""}`}
                    onClick={() => setSelectedFile("package.json")}
                  >
                    <FileCode size={13} style={{ color: "#fbbf24" }} />
                    package.json
                  </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor-viewport">
                  <div className="editor-header-bar">
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>{selectedFile}</span>
                    <button 
                      style={{ 
                        background: "#10b981", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: "0.25rem", 
                        padding: "0.2rem 0.6rem", 
                        fontSize: "0.72rem", 
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      onClick={() => alert("Simulated save: Your live preview is fully updated.")}
                    >
                      Save
                    </button>
                  </div>

                  <div className="editor-textarea-wrapper">
                    <div className="editor-line-numbers">
                      {Array.from({ length: fileContents[selectedFile]?.split("\n").length || 15 }).map((_, i) => (
                        <span key={i} style={{ minHeight: "1.2rem" }}>{i + 1}</span>
                      ))}
                    </div>
                    <div className="editor-code-pane">
                      {fileContents[selectedFile] || `// Code for ${selectedFile} empty`}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
