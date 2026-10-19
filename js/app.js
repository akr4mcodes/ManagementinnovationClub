const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useEffect, createContext, useContext } = React;

// Import CONFIG from config.js
import { CONFIG, EVENTS } from './config.js?v=5.0';
import { translations } from './translations.js?v=5.0';

// Language Context
const LanguageContext = createContext();

// Firebase Configuration  
const firebaseConfig = {
    apiKey: "AIzaSyCpWrga98HreN4nOqf7UUtONJgzdt_yoAw",
    authDomain: "mic23-ae782.firebaseapp.com",
    projectId: "mic23-ae782",
    storageBucket: "mic23-ae782.firebasestorage.app",
    messagingSenderId: "127313940468",
    appId: "1:127313940468:web:4e1eae5084e9aac34ab3a1",
    measurementId: "G-QPKS7WQC02"
};

let db = null;

function initScrollAnimations() {
    const elements = Array.from(document.querySelectorAll('.animate-on-scroll'));
    if (!elements.length) {
        return;
    }

    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight - 80 && rect.bottom > 0;
    };

    const revealVisible = () => {
        elements.forEach(el => {
            if (!el.classList.contains('animate-visible') && isInViewport(el)) {
                el.classList.add('animate-visible');
            }
        });
    };

    const handleScroll = () => {
        revealVisible();
        if (elements.every(el => el.classList.contains('animate-visible'))) {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        }
    };

    if (!window.IntersectionObserver) {
        revealVisible();
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    elements.forEach(el => observer.observe(el));
    revealVisible();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.requestAnimationFrame(() => revealVisible());
}

// Initialize Firebase after page load
async function initializeFirebase() {
    try {
        const module = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
        const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        
        const { initializeApp } = module;
        const { getFirestore } = firestoreModule;
        
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
}

const CLUB_NAME = "Management Innovation Club";

// Some event descriptions contain inline "•" bullets; show them as a real list
function splitDescription(text) {
    if (typeof text !== 'string' || !text.includes('•')) return { intro: text, bullets: [] };
    const [intro, ...bullets] = text.split('•').map(part => part.trim()).filter(Boolean);
    return { intro, bullets };
}

// Header Component
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);
    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    const closeMenu = () => setMobileMenuOpen(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileMenuOpen]);

    const navItems = [
        { href: "#about", label: t.navAbout },
        { href: "#events", label: t.navEvents },
        { href: "#join", label: t.navJoin },
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: t.navContact }
    ];

    return React.createElement(
        "header",
        { className: `site-header ${scrolled ? "is-scrolled" : ""}` },
        React.createElement(
            "nav",
            { className: "container nav-inner", "aria-label": "Main" },
            React.createElement(
                "a",
                { className: "logo", href: "#top", onClick: closeMenu, "aria-label": "Management Innovation Club" },
                React.createElement("img", { className: "logo-mark", src: "icons/mic-mark.png", alt: "MIC", width: 58, height: 34 }),
                React.createElement(
                    "span",
                    { className: "logo-text" },
                    React.createElement("strong", null, "Management Innovation Club")
                )
            ),
            React.createElement(
                "ul",
                { className: `nav-links ${mobileMenuOpen ? "open" : ""}`, id: "primary-nav" },
                navItems.map(item =>
                    React.createElement("li", { key: item.href }, React.createElement("a", { href: item.href, onClick: closeMenu }, item.label))
                ),
                React.createElement(
                    "li",
                    { className: "nav-cta" },
                    React.createElement("a", { href: "#join", className: "btn btn-primary", onClick: closeMenu }, t.heroButton)
                )
            ),
            React.createElement(
                "div",
                { className: "nav-actions" },
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "lang-toggle",
                        onClick: toggleLanguage,
                        "aria-label": language === 'en' ? t.switchToFrench : t.switchToEnglish
                    },
                    React.createElement("span", { className: "lang-full" }, language === 'en' ? t.switchToFrench : t.switchToEnglish),
                    React.createElement("span", { className: "lang-short", "aria-hidden": "true" }, language === 'en' ? "FR" : "EN")
                ),
                React.createElement("a", { href: "#join", className: "btn btn-primary btn-sm nav-join" }, t.navJoin),
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "menu-toggle",
                        onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                        "aria-expanded": mobileMenuOpen,
                        "aria-controls": "primary-nav",
                        "aria-label": t.navMenu
                    },
                    React.createElement("span", { className: "menu-icon" })
                )
            )
        )
    );
}

// Hero Section Component
function HeroSection() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    // Second word of the title is set in italic serif for a touch of character
    const titleParts = [];
    t.heroTitle.split(' ').forEach((word, i) => {
        if (i > 0) titleParts.push(' ');
        titleParts.push(i === 1 ? React.createElement("em", { key: i }, word) : word);
    });

    const stats = [
        { value: String(EVENTS.length), label: t.statEvents },
        { value: String(CONFIG.CELLS.length), label: t.statCells },
        { value: t.statNonProfit, label: t.statNonProfitLabel }
    ];

    return React.createElement(
        "section",
        { className: "hero" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "hero-grid" },
                React.createElement(
                    "div",
                    { className: "hero-text" },
                    React.createElement("h1", null, titleParts),
                    React.createElement("p", { className: "hero-lead" }, t.heroDescription),
                    React.createElement(
                        "div",
                        { className: "hero-actions" },
                        React.createElement(
                            "a",
                            { href: "#join", className: "btn btn-primary btn-large" },
                            t.heroButton,
                            React.createElement("span", { className: "arrow", "aria-hidden": "true" }, "→")
                        ),
                        React.createElement("a", { href: "#events", className: "btn btn-secondary btn-large" }, t.heroSecondary)
                    ),
                    React.createElement(
                        "div",
                        { className: "hero-stats" },
                        stats.map((stat, i) =>
                            React.createElement(
                                "div",
                                { className: "stat", key: i },
                                React.createElement("span", { className: "stat-value" }, stat.value),
                                React.createElement("span", { className: "stat-label" }, stat.label)
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: "hero-media",
                        style: {
                            alignSelf: "flex-start",
                            marginTop: "1.25rem"
                        }
                    },
                    React.createElement("img", {
                        src: "icons/mic-mark.png",
                        alt: "Management Innovation Club",
                        width: 760,
                        height: 445,
                        className: "hero-emblem-raw",
                        style: { maxWidth: "360px", width: "88%", height: "auto", display: "block" },
                        fetchpriority: "high",
                        decoding: "async"
                    })
                )
            )
        )
    );
}

// About Section Component
function AboutSection() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    return React.createElement(
        "section",
        { className: "section", id: "about" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "about-grid animate-on-scroll" },
                React.createElement(
                    "div",
                    { className: "about-head" },
                    React.createElement("span", { className: "eyebrow" }, t.aboutEyebrow),
                    React.createElement("h2", null, t.aboutTitle)
                ),
                React.createElement(
                    "div",
                    { className: "about-body" },
                    React.createElement(
                        "p",
                        { className: "lead" },
                        t.aboutDescription1.startsWith(CLUB_NAME)
                            ? [React.createElement("strong", { key: "name" }, CLUB_NAME), t.aboutDescription1.slice(CLUB_NAME.length)]
                            : [React.createElement("strong", { key: "name" }, CLUB_NAME), " ", t.aboutDescription1]
                    ),
                    React.createElement(
                        "p",
                        null,
                        language === 'en' ? "Based at " : "Basé à ",
                        React.createElement("a", { href: CONFIG.SCHOOL_URL, target: "_blank", rel: "noopener noreferrer" }, "ESSG Annaba"),
                        language === 'en' ? ", we serve students, the university, and the wider community." : ", nous servons les étudiants, l'université et la communauté plus large."
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "cells animate-on-scroll" },
                React.createElement("h3", { className: "cells-title" }, t.cellsTitle),
                React.createElement(
                    "ol",
                    { className: "cells-list" },
                    CONFIG.CELLS.map((cell, i) =>
                        React.createElement(
                            "li",
                            { className: "cell-card", key: cell.value },
                            React.createElement("span", { className: "cell-num" }, String(i + 1).padStart(2, '0')),
                            React.createElement("span", { className: "cell-name" }, cell.label[language])
                        )
                    )
                )
            )
        )
    );
}

// Event photo gallery: one large photo plus tappable thumbnails
function EventGallery({ photos, title, caption }) {
    const [active, setActive] = useState(0);
    const [failed, setFailed] = useState({});

    const available = photos
        .map((src, index) => ({ src, index }))
        .filter(photo => !failed[photo.index]);

    if (!available.length) return null;
    const current = available.find(photo => photo.index === active) || available[0];

    return React.createElement(
        "div",
        { className: "event-media" },
        React.createElement(
            "div",
            { className: "event-main" },
            React.createElement("img", {
                key: current.src,
                src: current.src,
                alt: `${title} ${current.index + 1}`,
                loading: "lazy",
                decoding: "async",
                onError: () => setFailed(prev => ({ ...prev, [current.index]: true }))
            })
        ),
        React.createElement("p", { className: "event-caption" }, caption),
        available.length > 1 && React.createElement(
            "div",
            { className: "event-thumbs", role: "group", "aria-label": caption },
            available.map(photo =>
                React.createElement(
                    "button",
                    {
                        key: photo.src,
                        type: "button",
                        className: "thumb",
                        "aria-pressed": photo.index === current.index,
                        "aria-label": `${title} ${photo.index + 1}`,
                        onClick: () => setActive(photo.index)
                    },
                    React.createElement("img", { src: photo.src, alt: "", loading: "lazy", decoding: "async" })
                )
            )
        )
    );
}

// Events Section Component
function EventsSection() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    const events = EVENTS.map(event => ({
        ...event,
        title: event.title[language] || event.title,
        description: event.description[language] || event.description,
        features: event.features.map(f => typeof f === 'string' ? f : f[language] || f)
    }));

    return React.createElement(
        "section",
        { className: "section section-alt", id: "events" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "section-head animate-on-scroll" },
                React.createElement("span", { className: "eyebrow" }, t.eventsEyebrow),
                React.createElement("h2", null, t.eventsTitle)
            ),
            events.map((event, index) =>
                React.createElement(
                    "article",
                    { key: event.id, className: `event animate-on-scroll ${index % 2 === 1 ? "is-reversed" : ""}` },
                    React.createElement(EventGallery, {
                        photos: event.photos,
                        title: event.title,
                        caption: `${t.picturesFrom} ${event.title} ${event.year}`
                    }),
                    React.createElement(
                        "div",
                        { className: "event-body" },
                        React.createElement(
                            "div",
                            { className: "event-meta" },
                            React.createElement("span", { className: "event-index" }, String(index + 1).padStart(2, '0')),
                            React.createElement("span", { className: "event-year" }, event.year)
                        ),
                        React.createElement(
                            "h3",
                            null,
                            React.createElement("span", { className: "event-title-highlight" }, event.title)
                        ),
                        React.createElement("p", { className: "event-desc" }, splitDescription(event.description).intro),
                        splitDescription(event.description).bullets.length > 0 && React.createElement(
                            "ul",
                            { className: "event-features" },
                            splitDescription(event.description).bullets.map((bullet, idx) =>
                                React.createElement("li", { key: idx }, bullet)
                            )
                        ),
                        event.features.length > 0 && React.createElement(
                            "ul",
                            { className: "event-features" },
                            event.features.map((feature, idx) =>
                                React.createElement("li", { key: idx }, feature)
                            )
                        )
                    )
                )
            )
        )
    );
}

// Social icons (monochrome so they sit calmly on the footer)
function SocialIcon({ name }) {
    const common = {
        width: 20,
        height: 20,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        focusable: "false"
    };

    if (name === "Instagram") {
        return React.createElement(
            "svg",
            common,
            React.createElement("path", {
                d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            })
        );
    }
    if (name === "YouTube") {
        return React.createElement(
            "svg",
            common,
            React.createElement("path", {
                d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            })
        );
    }
    if (name === "TikTok") {
        return React.createElement(
            "svg",
            common,
            React.createElement("path", {
                d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
            })
        );
    }
    return null;
}

// Social Links Component
function SocialLinks() {
    const socials = [
        { name: "YouTube", url: "https://www.youtube.com/@ManagementInnovationClub" },
        { name: "Instagram", url: "https://www.instagram.com/management_innovation_club" },
        { name: "TikTok", url: "https://www.tiktok.com/@management_innova" }
    ];

    return React.createElement(
        "div",
        { className: "social-links" },
        socials.map(social =>
            React.createElement(
                "a",
                { key: social.name, href: social.url, target: "_blank", rel: "noopener noreferrer", title: social.name, "aria-label": social.name },
                React.createElement(SocialIcon, { name: social.name })
            )
        )
    );
}

// Registration Form Component
function RegistrationForm() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];
    const [formData, setFormData] = useState({
        fullName: "",
        familyName: "",
        birthday: "",
        degree: "CP1",
        phone: "",
        institution: "ESSG",
        email: "",
        socialLink: "",
        cell: "External relations",
        pastClubExperience: "",
        clubExperienceDetails: "",
        skills: [],
        motivation: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        if (name === 'phone') {
            sanitizedValue = value.replace(/\D/g, '');
        }

        if (name === 'fullName' || name === 'familyName') {
            sanitizedValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ '-]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(value)
                ? prev.skills.filter(s => s !== value)
                : [...prev.skills, value]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        // Validate Facebook or Instagram profile link pattern
        const socialRegex = /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.com|instagram\.com|instagr\.am)\/.+/i;
        if (!formData.socialLink || !socialRegex.test(formData.socialLink.trim())) {
            setMessage({ type: "error", text: t.invalidSocialLink });
            setLoading(false);
            return;
        }

        // Validate scientific club experience selection
        if (!formData.pastClubExperience) {
            setMessage({ type: "error", text: t.requiredField });
            setLoading(false);
            return;
        }

        const submissionData = {
            ...formData,
            skillsText: formData.skills.join(', '),
            skillsString: formData.skills.join(', '),
            // Include descriptive aliases for Google Sheets and Firestore compatibility
            facebookOrInstagram: formData.socialLink.trim(),
            scientificClubMember: formData.pastClubExperience,
            clubDetails: formData.clubExperienceDetails,
            motivationLetter: formData.motivation,
            timestamp: new Date().toISOString()
        };

        let sheetSuccess = false;
        let firestoreSuccess = false;

        // 1. Send directly to Google Sheets
        const sheetUrl = CONFIG.GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbxa-OlXhQIhyDYdGvs5xzd4AzyU6N7i03-HRWhq1QsLdArzm8X4YiA-KAqDXn2fhiqK/exec';
        try {
            console.log("Submitting to Google Sheets...", submissionData);
            await fetch(sheetUrl, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(submissionData)
            });
            sheetSuccess = true;
            console.log("Google Sheets submission sent successfully");
        } catch (sheetErr) {
            console.error("Google Sheets synchronization error:", sheetErr);
        }

        // 2. Save to Cloud Firestore
        try {
            if (db) {
                const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
                await addDoc(collection(db, "registrations"), submissionData);
                firestoreSuccess = true;
                console.log("Firestore registration saved successfully");
            } else {
                console.warn("Firestore database not yet initialized");
            }
        } catch (firestoreErr) {
            console.error("Firestore error:", firestoreErr);
        }

        // Show feedback to user
        if (sheetSuccess || firestoreSuccess) {
            setMessage({ type: "success", text: t.formSuccess });
            setFormData({
                fullName: "",
                familyName: "",
                birthday: "",
                degree: "CP1",
                phone: "",
                institution: "ESSG",
                email: "",
                socialLink: "",
                cell: "External relations",
                pastClubExperience: "",
                clubExperienceDetails: "",
                skills: [],
                motivation: ""
            });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } else {
            setMessage({ 
                type: "error", 
                text: t.formError 
            });
        }
        setLoading(false);
    };

    return React.createElement(
        "section",
        { className: "section", id: "join" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "join-grid" },
                React.createElement(
                    "div",
                    { className: "join-intro" },
                    React.createElement("span", { className: "eyebrow" }, t.joinHeading1),
                    React.createElement("h2", null, t.joinHeading2),
                    React.createElement("p", { className: "join-sub" }, t.joinSubheading)
                ),
                React.createElement(
                    "div",
                    { className: "form-container animate-on-scroll" },
                    React.createElement("p", { className: "form-intro" }, t.formSubtitle),
                    React.createElement(
                        "form",
                        { onSubmit: handleSubmit, className: "form-grid" },
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.fullName),
                            React.createElement("input", {
                                type: "text",
                                name: "fullName",
                                value: formData.fullName,
                                onChange: handleInputChange,
                                placeholder: t.fullNamePlaceholder,
                                minLength: "3",
                                maxLength: "50",
                                pattern: "[A-Za-zÀ-ÖØ-öø-ÿ '\\-]+",
                                inputMode: "text",
                                required: true
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.familyName),
                            React.createElement("input", {
                                type: "text",
                                name: "familyName",
                                value: formData.familyName,
                                onChange: handleInputChange,
                                placeholder: t.familyNamePlaceholder,
                                minLength: "3",
                                maxLength: "50",
                                pattern: "[A-Za-zÀ-ÖØ-öø-ÿ '\\-]+",
                                inputMode: "text",
                                required: true
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.birthday),
                            React.createElement("input", {
                                type: "date",
                                name: "birthday",
                                value: formData.birthday,
                                onChange: handleInputChange,
                                required: true
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.degree),
                            React.createElement(
                                "select",
                                { name: "degree", value: formData.degree, onChange: handleInputChange, required: true },
                                CONFIG.DEGREES.map(degree =>
                                    React.createElement("option", { key: degree.value, value: degree.value }, degree.label[language])
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.phone),
                            React.createElement("input", {
                                type: "tel",
                                name: "phone",
                                value: formData.phone,
                                onChange: handleInputChange,
                                placeholder: t.phonePlaceholder,
                                maxLength: "10",
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                required: true
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement("label", null, t.schoolLabel),
                            React.createElement(
                                "select",
                                { name: "institution", value: formData.institution, onChange: handleInputChange, required: true },
                                React.createElement("option", { value: "ESSG" }, "ESSG Annaba"),
                                React.createElement("option", { value: "Other" }, "Other")
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group full" },
                            React.createElement("label", null, t.email),
                            React.createElement("input", {
                                type: "email",
                                name: "email",
                                value: formData.email,
                                onChange: handleInputChange,
                                placeholder: t.emailPlaceholder,
                                required: true
                            })
                        ),
                        // 4/ Facebook Or Instagram Profile Link (between Email Address of the School and preferred cell)
                        React.createElement(
                            "div",
                            { className: "form-group full" },
                            React.createElement("label", null, t.socialLink),
                            React.createElement("input", {
                                type: "text",
                                name: "socialLink",
                                value: formData.socialLink,
                                onChange: handleInputChange,
                                placeholder: t.socialLinkPlaceholder,
                                pattern: "(https?:\\/\\/)?(www\\.|m\\.)?(facebook\\.com|fb\\.com|instagram\\.com|instagr\\.am)\\/.+",
                                title: language === 'en' 
                                    ? "Link must start with facebook.com or instagram.com (e.g. https://instagram.com/yourusername)" 
                                    : "Le lien doit commencer par facebook.com ou instagram.com (ex: https://instagram.com/votreprofil)",
                                required: true
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "form-group full" },
                            React.createElement("label", null, t.cell),
                            React.createElement(
                                "select",
                                { name: "cell", value: formData.cell, onChange: handleInputChange, required: true },
                                CONFIG.CELLS.map(cell =>
                                    React.createElement("option", { key: cell.value, value: cell.value }, cell.label[language])
                                )
                            )
                        ),
                        // 1/ Have you ever been part of a scientific club / association ? (between preferred cell and skills and interests)
                        React.createElement(
                            "div",
                            { className: "form-group full" },
                            React.createElement("label", { style: { marginBottom: "0.5rem" } }, t.pastClubExperience),
                            React.createElement(
                                "div",
                                { className: "radio-group" },
                                React.createElement(
                                    "label",
                                    { className: `radio-card ${formData.pastClubExperience === "yes" ? "selected" : ""}` },
                                    React.createElement("input", {
                                        type: "radio",
                                        name: "pastClubExperience",
                                        value: "yes",
                                        checked: formData.pastClubExperience === "yes",
                                        onChange: handleInputChange,
                                        required: true
                                    }),
                                    React.createElement("span", null, t.yes)
                                ),
                                React.createElement(
                                    "label",
                                    { className: `radio-card ${formData.pastClubExperience === "no" ? "selected" : ""}` },
                                    React.createElement("input", {
                                        type: "radio",
                                        name: "pastClubExperience",
                                        value: "no",
                                        checked: formData.pastClubExperience === "no",
                                        onChange: handleInputChange,
                                        required: true
                                    }),
                                    React.createElement("span", null, t.no)
                                )
                            )
                        ),
                        // 2/ If yes, tell us more? (down by question 1)
                        React.createElement(
                            "div",
                            { 
                                className: `form-group full ${formData.pastClubExperience === "no" ? "fade-dimmed" : ""}`
                            },
                            React.createElement("label", null, t.clubExperienceDetails),
                            React.createElement("textarea", {
                                name: "clubExperienceDetails",
                                value: formData.clubExperienceDetails,
                                onChange: handleInputChange,
                                placeholder: t.clubExperienceDetailsPlaceholder,
                                rows: "3",
                                disabled: formData.pastClubExperience === "no",
                                required: formData.pastClubExperience === "yes"
                            })
                        ),
                        React.createElement("h4", { className: "form-subtitle full" }, t.skills),
                        React.createElement(
                            "div",
                            { className: "checkbox-group full" },
                            CONFIG.SKILLS.map(skill =>
                                React.createElement(
                                    "label",
                                    { key: skill.value, className: "checkbox-label" },
                                    React.createElement("input", {
                                        type: "checkbox",
                                        value: skill.value,
                                        checked: formData.skills.includes(skill.value),
                                        onChange: handleCheckboxChange
                                    }),
                                    skill.label[language]
                                )
                            )
                        ),
                        // 3/ What are your motivations for applying to MIC ESSG Annaba ? (box that can type letters and numbers)
                        React.createElement(
                            "div",
                            { className: "form-group full" },
                            React.createElement("label", null, t.motivationQuestion),
                            React.createElement("textarea", {
                                name: "motivation",
                                value: formData.motivation,
                                onChange: handleInputChange,
                                placeholder: t.motivationQuestionPlaceholder,
                                rows: "4"
                            })
                        ),
                        React.createElement(
                            "button",
                            { type: "submit", className: "btn btn-primary btn-large form-submit full", disabled: loading },
                            loading ? t.submitting : t.submitButton
                        ),
                        message.text && React.createElement(
                            "div",
                            {
                                className: `${message.type === "success" ? "success-message" : "error-message"} full`,
                                role: message.type === "success" ? "status" : "alert"
                            },
                            message.text
                        )
                    )
                )
            )
        )
    );
}

// Default FAQs data fallback to ensure display even if translations cache is stale
const DEFAULT_FAQS = {
    en: {
        eyebrow: "Answers & Inquiries",
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about joining Management Innovation Club and our activities.",
        items: [
            {
                q: "Who is eligible to join MIC ESSG Annaba?",
                a: "All registered university students from CP1 to Master level at ESSG Annaba as well as neighboring institutions with a passion for scientific research, management innovation, and professional teamwork are welcome to apply."
            },
            {
                q: "Do I need prior club experience to be accepted?",
                a: "No prior club experience is required. We evaluate candidates based on their enthusiasm, curiosity, willingness to learn, and commitment to scientific and managerial development."
            },
            {
                q: "How are members assigned to the operational cells?",
                a: "During application, candidates indicate their preferred cell (External Relations, Design, Marketing, Logistics, or Projects). Assignments are made based on personal interests, skills, and current cell capacities."
            },
            {
                q: "What is the annual Stagera event?",
                a: "Stagera is our premier annual career convention connecting students directly with corporate recruiters, founders, and industry leaders through exclusive workshops, panel discussions, and internship matchmaking."
            }
        ]
    },
    fr: {
        eyebrow: "Réponses & Informations",
        title: "Foire Aux Questions",
        subtitle: "Tout ce que vous devez savoir pour rejoindre le Management Innovation Club et participer à nos activités.",
        items: [
            {
                q: "Qui peut postuler pour rejoindre le MIC ESSG Annaba ?",
                a: "Tous les étudiants inscrits de la classe préparatoire (CP1) jusqu'au Master à l'ESSG Annaba ainsi que des établissements partenaires, animés par la passion de l'innovation et du management, sont les bienvenus."
            },
            {
                q: "Faut-il avoir une expérience préalable en club associatif ?",
                a: "Aucune expérience préalable n'est exigée. Nous sélectionnons les candidats sur leur motivation, curiosité, esprit d'initiative et volonté d'apprendre au sein d'une équipe dynamique."
            },
            {
                q: "Comment les membres sont-ils affectés aux cellules spécialisées ?",
                a: "Lors de la candidature, vous indiquez votre cellule de préférence. L'affectation est confirmée suite à l'entretien selon vos centres d'intérêt, compétences et besoins de l'équipe."
            },
            {
                q: "En quoi consiste l'événement annuel Stagera ?",
                a: "Stagera est notre forum annuel réunissant recruteurs, dirigeants et étudiants pour des ateliers de simulation d'entretiens, des conférences exclusives et des opportunités concrètes de stages."
            }
        ]
    }
};

// FAQ Section Component
function FaqSection() {
    const { language } = useContext(LanguageContext);
    const lang = (language === 'fr') ? 'fr' : 'en';
    const t = (translations && translations[lang]) ? translations[lang] : {};
    const fallback = DEFAULT_FAQS[lang] || DEFAULT_FAQS.en;

    const eyebrow = t.faqEyebrow || fallback.eyebrow;
    const title = t.faqTitle || fallback.title;
    const subtitle = t.faqSubtitle || fallback.subtitle;
    const faqList = (t.faqs && Array.isArray(t.faqs) && t.faqs.length > 0) ? t.faqs : fallback.items;

    const [openIndex, setOpenIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenIndex(prev => prev === index ? -1 : index);
    };

    return React.createElement(
        "section",
        { className: "section section-alt", id: "faq" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "faq-header" },
                React.createElement("span", { className: "eyebrow" }, eyebrow),
                React.createElement("h2", null, title),
                React.createElement("p", { className: "lead" }, subtitle)
            ),
            React.createElement(
                "div",
                { className: "faq-accordion" },
                faqList.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return React.createElement(
                        "div",
                        {
                            className: `faq-item ${isOpen ? "is-open" : ""}`,
                            key: index
                        },
                        React.createElement(
                            "button",
                            {
                                className: "faq-question",
                                onClick: () => toggleFaq(index),
                                "aria-expanded": isOpen,
                                "aria-controls": `faq-ans-${index}`,
                                id: `faq-q-${index}`
                            },
                            React.createElement("span", { className: "faq-q-text" }, faq.q),
                            React.createElement(
                                "span",
                                { className: "faq-icon", "aria-hidden": "true" },
                                isOpen ? "−" : "+"
                            )
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "faq-answer",
                                id: `faq-ans-${index}`,
                                role: "region",
                                "aria-labelledby": `faq-q-${index}`,
                                style: { display: isOpen ? "block" : "none" }
                            },
                            React.createElement("p", null, faq.a)
                        )
                    );
                })
            )
        )
    );
}

// Footer Component
function Footer() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    return React.createElement(
        "footer",
        { className: "site-footer", id: "contact" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "footer-top" },
                React.createElement(
                    "div",
                    { className: "footer-brand" },
                    React.createElement(
                        "div",
                        {
                            className: "footer-badge",
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.85rem",
                                padding: "0",
                                marginBottom: "1.25rem",
                                background: "transparent",
                                borderRadius: "0",
                                boxShadow: "none"
                            }
                        },
                        React.createElement("img", {
                            src: "icons/mic-mark.png",
                            alt: "Management Innovation Club",
                            width: 84,
                            height: 49,
                            style: {
                                width: "84px",
                                height: "auto",
                                display: "block",
                                flex: "none",
                                filter: "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9))"
                            },
                            loading: "lazy"
                        }),
                        React.createElement(
                            "div",
                            {
                                className: "footer-badge-text",
                                style: {
                                    minWidth: 0,
                                    paddingLeft: "0.85rem",
                                    borderLeft: "1px solid rgba(255, 255, 255, 0.25)",
                                    lineHeight: "1.3"
                                }
                            },
                            React.createElement("strong", { style: { display: "block", fontSize: "0.95rem", color: "#ffffff", fontWeight: "700" } }, CONFIG.SCHOOL),
                            React.createElement("span", { style: { display: "block", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.72)", fontWeight: "500" } }, language === 'en' ? "Algeria" : "Algérie")
                        )
                    ),
                    React.createElement("p", { className: "footer-follow" }, t.contactFollowUs)
                ),
                React.createElement(
                    "nav",
                    { className: "footer-nav", "aria-label": "Footer" },
                    React.createElement(
                        "ul",
                        null,
                        React.createElement("li", null, React.createElement("a", { href: "#about" }, t.navAbout)),
                        React.createElement("li", null, React.createElement("a", { href: "#events" }, t.navEvents)),
                        React.createElement("li", null, React.createElement("a", { href: "#join" }, t.navJoin)),
                        React.createElement("li", null, React.createElement("a", { href: "#faq" }, "FAQ"))
                    )
                ),
                React.createElement(SocialLinks)
            ),
            React.createElement(
                "div",
                { className: "footer-bottom" },
                React.createElement("p", null, t.footerText || "© 2026 Management Innovation Club. All rights reserved."),
                React.createElement(
                    "p",
                    null,
                    language === 'en' ? "based in " : "basée à ",
                    React.createElement("a", { href: CONFIG.SCHOOL_URL, target: "_blank", rel: "noopener noreferrer" }, "ESSG Annaba"),
                    language === 'en' ? ", Algeria" : ", Algérie"
                ),
                React.createElement(
                    "a",
                    { className: "back-to-top", href: "#top" },
                    t.backToTop || (language === 'fr' ? "Retour en haut" : "Back to top"),
                    React.createElement("span", { "aria-hidden": "true" }, "↑")
                )
            ),
            React.createElement(
                "div",
                {
                    className: "footer-credits",
                    style: {
                        width: "100%",
                        marginTop: "1.75rem",
                        paddingTop: "1.25rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                        textAlign: "center",
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.85)"
                    }
                },
                React.createElement(
                    "p",
                    { style: { margin: 0 } },
                    "developed with love by ",
                    React.createElement(
                        "a",
                        {
                            href: "https://www.instagram.com/akr4m.codes",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "creator-link"
                        },
                        "@akr4m.codes"
                    )
                )
            )
        )
    );
}

// Main App Component
function App() {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        initializeFirebase();
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        initScrollAnimations();
    }, []);

    return React.createElement(
        LanguageContext.Provider,
        { value: { language, setLanguage } },
        React.createElement(Header),
        React.createElement(
            "main",
            null,
            React.createElement(HeroSection),
            React.createElement(AboutSection),
            React.createElement(EventsSection),
            React.createElement(RegistrationForm),
            React.createElement(FaqSection)
        ),
        React.createElement(Footer)
    );
}

// Render App when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(React.createElement(App));
    });
} else {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(React.createElement(App));
}
