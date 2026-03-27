import { useState } from "react";
import "./Lead.css";

export default function Lead() {
  return (
    <div className="lead-container">
      {/* ── Services Section ── */}
      <section className="services-section">
        <h2 className="services-title">✨ Marketing cause why not</h2>
        <p className="services-subtitle">Custom Development & Consultation</p>
        
        <div className="services-grid">
          <div className="service-card service-card-featured">
            <div className="service-badge">FEATURED</div>
            <div className="service-icon-wrapper">
              <div className="service-icon">🤖</div>
            </div>
            <h3 className="service-title">AI SaaS Applications</h3>
            <p className="service-desc">Enterprise-grade MERN Stack solutions with cutting-edge AI integration</p>
            <div className="service-features">
              <span>⚡ Full Stack</span>
              <span>🧠 AI/ML Ready</span>
              <span>🚀 Scalable</span>
            </div>
            <a href="https://www.fiverr.com/s/99pBP8E" target="_blank" rel="noopener noreferrer" className="service-cta">View Service →</a>
          </div>
          
          <div className="service-card">
            <div className="service-icon-wrapper">
              <div className="service-icon">🌐</div>
            </div>
            <h3 className="service-title">Web Applications</h3>
            <p className="service-desc">Fast & modern web apps built with React, Node.js & FastAPI</p>
            <div className="service-features">
              <span>⚡ Performance</span>
              <span>📦 MERN Stack</span>
              <span>🔧 API Ready</span>
            </div>
            <a href="https://www.fiverr.com/s/rE40NAj" target="_blank" rel="noopener noreferrer" className="service-cta">View Service →</a>
          </div>

          <div className="service-card">
            <div className="service-icon-wrapper">
              <div className="service-icon">💼</div>
            </div>
            <h3 className="service-title">Full Stack Expertise</h3>
            <p className="service-desc">Professional development & consulting for enterprise projects</p>
            <div className="service-features">
              <span>🔥 Verified</span>
              <span>✅ Top Rated</span>
              <span>📈 Proven</span>
            </div>
            <a href="https://www.upwork.com/freelancers/~015ec88d39d0d74aa0" target="_blank" rel="noopener noreferrer" className="service-cta">View Profile →</a>
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="contact-section">
        <h2 className="contact-title">Let's Work Together!</h2>
        <p className="contact-subtitle">Choose your preferred platform to get in touch</p>
        <div className="contact-links-grid">
          <a href="https://www.fiverr.com/s/99pBP8E" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon">📲</div>
            <h3>Fiverr</h3>
            <p>Gig-based projects & quick turnarounds</p>
          </a>
          <a href="https://www.upwork.com/freelancers/~015ec88d39d0d74aa0" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon">💼</div>
            <h3>Upwork</h3>
            <p>Long-term contracts & large projects</p>
          </a>
          <a href="https://www.linkedin.com/in/muhammad-zubair-2130b2244/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-icon">🔗</div>
            <h3>LinkedIn</h3>
            <p>Professional networking & inquiries</p>
          </a>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="about-section">
        <h2 className="about-title">Who I Am</h2>
        <p className="about-text">
          I'm Muhammad Zubair, a full-stack developer specializing in MERN Stack and AI/SaaS applications. 
          With expertise in React, Node.js, MongoDB, and modern web technologies, I help businesses 
          build scalable, performant applications that drive growth.
        </p>
        <div className="expertise-grid">
          <div className="expertise-item">
            <span className="expertise-icon">⚡</span>
            <h4>Full Stack Development</h4>
            <p>React, Node.js, Express, MongoDB</p>
          </div>
          <div className="expertise-item">
            <span className="expertise-icon">🤖</span>
            <h4>AI Integration</h4>
            <p>Machine Learning & AI SaaS</p>
          </div>
          <div className="expertise-item">
            <span className="expertise-icon">🚀</span>
            <h4>Performance</h4>
            <p>Scalable & Optimized Solutions</p>
          </div>
          <div className="expertise-item">
            <span className="expertise-icon">🔧</span>
            <h4>Custom Tools</h4>
            <p>Purpose-built Applications</p>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-final">
        <h2>Ready to Build Something Amazing?</h2>
        <p>Let's discuss your project requirements</p>
        <a href="https://www.linkedin.com/in/muhammad-zubair-2130b2244/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="cta-btn">
          Get in Touch Now →
        </a>
      </section>
    </div>
  );
}
