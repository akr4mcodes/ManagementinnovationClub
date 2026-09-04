const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useEffect, createContext, useContext } = React;

// Import CONFIG from config.js
import { CONFIG, EVENTS } from './config.js?v=2.3';
import { translations } from './translations.js?v=2.3';

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

// Header Component
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);
    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    return React.createElement(
        "header",
        null,
        React.createElement(
            "nav",
            { className: "container", style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0" } },
            React.createElement(
                "div",
                { className: "logo" },
                React.createElement("img", { src: "icons/mic.jpg", alt: "MIC Logo" }),
                React.createElement("span", null, "Management Innovation Club")
            ),
            React.createElement(
                "ul",
                { className: `nav-links ${mobileMenuOpen ? "active" : ""}` },
                React.createElement("li", null, React.createElement("a", { href: "#about" }, t.navAbout)),
                React.createElement("li", null, React.createElement("a", { href: "#events" }, t.navEvents)),
                React.createElement("li", null, React.createElement("a", { href: "#join" }, t.navJoin)),
                React.createElement("li", null, React.createElement("a", { href: "#contact" }, t.navContact))
            ),
            React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "1rem" } },
                React.createElement(
                    "button",
                    { 
                        className: "btn btn-primary", 
                        onClick: toggleLanguage,
                        style: { padding: "0.5rem 1rem", fontSize: "0.9rem", backgroundColor: "#0a149e", color: "white" }
                    },
                    language === 'en' ? t.switchToFrench : t.switchToEnglish
                ),
                React.createElement(
                    "button",
                    { className: "mobile-menu-toggle", onClick: () => setMobileMenuOpen(!mobileMenuOpen) },
                    "☰"
                )
            )
        )
    );
}

// Hero Section Component
function HeroSection() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    return React.createElement(
        "section",
        { className: "section hero animate-on-scroll" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "hero-content" },
                React.createElement(
                    "div",
                    { className: "hero-text", style: { flex: 1, minWidth: "300px" } },
                    React.createElement("h1", null, t.heroTitle),
                    React.createElement(
                        "p",
                        null,
                        t.heroDescription
                    ),
                    React.createElement(
                        "a",
                        { href: "#join", className: "btn btn-secondary btn-large" },
                        t.heroButton
                    )
                ),
                React.createElement(
                    "div",
                    { className: "hero-image", style: { flex: 1, minWidth: "300px", textAlign: "center" } },
                    React.createElement("img", { src: "icons/mic.png", alt: "Management Innovation Club" })
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
        { className: "section animate-on-scroll", id: "about" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement("h2", { className: "text-center mb-4" }, t.aboutTitle),
            React.createElement(
                "div",
                { style: { maxWidth: "800px", margin: "0 auto" } },
                React.createElement(
                    "p",
                    null,
                    React.createElement("strong", null, "Management Innovation Club"),
                    " ",
                    t.aboutDescription1
                ),
                React.createElement(
                    "p",
                    null,
                    language === 'en' ? "Based at " : "Basé à ",
                    React.createElement("a", { href: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://essg-annaba.dz/fr/accueil/&ved=2ahUKEwik2vzXjKKTAxWZVqQEHXlrAiEQFnoECBUQAQ&usg=AOvVaw3PcxP9YMHm5bg5Ou4v2Api", target: "_blank", style: { color: "var(--accent-color)" } }, "ESSG Annaba"),
                    language === 'en' ? ", we serve students, the university, and the wider community." : ", nous servons les étudiants, l'université et la communauté plus large."
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
        { className: "section animate-on-scroll", id: "events", style: { background: "#f8fafc" } },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement("h1", { className: "text-center mb-4" }, t.eventsTitle),
            React.createElement(
                "div",
                null,
                events.map(event =>
                    React.createElement(
                        "div",
                        { key: event.id, style: { marginBottom: "3rem" } },
                        React.createElement("h3", { style: { color: "var(--primary-color)", marginBottom: "0.5rem", fontSize: "1.5rem" } }, event.title),
                        React.createElement("p", { style: { color: "var(--text-light)", marginBottom: "1rem", fontSize: "1rem" } }, event.description),
                        event.features.length > 0 && React.createElement(
                            "ul",
                            { style: { marginBottom: "1.5rem", marginLeft: "1.5rem" } },
                            event.features.map((feature, idx) =>
                                React.createElement("li", { key: idx, style: { color: "var(--text-light)", marginBottom: "0.5rem" } }, feature)
                            )
                        ),
                        React.createElement("h4", { style: { marginBottom: "1rem", color: "var(--text-dark)" } }, `${t.picturesFrom} ${event.title} ${event.year}`),
                        React.createElement(
                            "div",
                            { className: "event-photos-grid", style: { marginBottom: "2rem" } },
                            event.photos.map((photo, idx) =>
                                React.createElement(
                                    "div",
                                    { key: idx },
                                    React.createElement("img", {
                                        src: photo,
                                        alt: `${event.title} ${idx + 1}`,
                                        onError: (e) => {
                                            e.target.style.display = "none";
                                        }
                                    })
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}

// Social Links Component
function SocialLinks() {
    const socials = [
        { name: "YouTube", url: "https://www.youtube.com/@ManagementInnovationClub", icon: "icons/yt.jpg" },
        { name: "Instagram", url: "https://www.instagram.com/management_innovation_club", icon: "icons/ig.jpg" },
        { name: "TikTok", url: "https://www.tiktok.com/@management_innova", icon: "icons/tt.jpg" }
    ];

    return React.createElement(
        "div",
        { className: "social-links" },
        socials.map(social =>
            React.createElement(
                "a",
                { key: social.name, href: social.url, target: "_blank", rel: "noopener noreferrer", title: social.name },
                React.createElement("img", { src: social.icon, alt: social.name })
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
        { className: "section animate-on-scroll", id: "join" },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement("h2", { className: "text-center mb-4" }, t.joinHeading1),
            React.createElement("h1", { className: "text-center", style: { marginBottom: "0.5rem", fontSize: "2.5rem" } }, t.joinHeading2),
            React.createElement("h3", { className: "text-center", style: { marginBottom: "2rem", color: "var(--text-light)" } }, t.joinSubheading),
            React.createElement(
                "div",
                { className: "form-container" },
                React.createElement("h4", { className: "text-center", style: { marginBottom: "2rem", color: "var(--text-dark)" } }, t.formSubtitle),
                React.createElement(
                    "form",
                    { onSubmit: handleSubmit },
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
                            pattern: "[A-Za-zÀ-ÖØ-öø-ÿ '-]+",
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
                            pattern: "[A-Za-zÀ-ÖØ-öø-ÿ '-]+",
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
                        { className: "form-group" },
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
                        { className: "form-group" },
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
                        { className: "form-group" },
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
                        { className: "form-group" },
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
                            className: `form-group ${formData.pastClubExperience === "no" ? "fade-dimmed" : ""}`,
                            style: { marginBottom: "1.5rem" }
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
                    React.createElement("h4", null, t.skills),
                    React.createElement(
                        "div",
                        { className: "checkbox-group", style: { marginBottom: "1.5rem" } },
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
                        { className: "form-group", style: { marginTop: "1rem" } },
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
                        { type: "submit", className: "btn btn-primary btn-large form-submit", disabled: loading },
                        loading ? t.submitting : t.submitButton
                    ),
                    message.text && React.createElement(
                        "div",
                        { className: message.type === "success" ? "success-message" : "error-message", style: { marginTop: "1.5rem" } },
                        message.text
                    )
                )
            )
        )
    );
}

// Contact Section Component
function ContactSection() {
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    return React.createElement(
        "section",
        { className: "section animate-on-scroll", id: "contact", style: { background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)", color: "white" } },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement("h2", { className: "text-center mb-4" }, t.contactTitle),
            React.createElement(
                "div",
                { style: { maxWidth: "600px", margin: "0 auto", textAlign: "center" } },
                React.createElement("p", { style: { fontSize: "1.1rem", marginBottom: "2rem" } }, t.contactDescription),
                React.createElement(SocialLinks),
                React.createElement(
                    "div",
                    { style: { marginTop: "2rem" } },
                    React.createElement("p", { style: { marginBottom: "0.5rem" } }, t.contactEmail + ": contact@mic.essg-annaba.dz"),
                    React.createElement("p", { style: { marginBottom: "0.5rem" } }, t.contactPhone + ": +213 XX XX XX XX"),
                    React.createElement("p", null, "🕐 " + t.contactFollowUs)
                )
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
        { className: "animate-on-scroll", id: "contact", style: { background: "var(--primary-color)", color: "white", padding: "3rem 0", marginTop: "4rem", textAlign: "center" } },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(SocialLinks),
            React.createElement("p", { style: { marginBottom: "1rem", opacity: 0.9 } }, t.contactFollowUs),
            React.createElement("p", { style: { marginTop: "2rem", marginBottom: "0.5rem" } }, t.footerText),
            React.createElement("p", { style: { opacity: 0.8, fontSize: "0.9rem" } }, 
                language === 'en' ? "based in " : "basée à ",
                React.createElement("a", { href: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://essg-annaba.dz/fr/accueil/&ved=2ahUKEwik2vzXjKKTAxWZVqQEHXlrAiEQFnoECBUQAQ&usg=AOvVaw3PcxP9YMHm5bg5Ou4v2Api", target: "_blank", style: { color: "white", textDecoration: "underline" } }, "ESSG Annaba"),
                language === 'en' ? ", Algeria" : ", Algérie"
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
        React.createElement(HeroSection),
        React.createElement(AboutSection),
        React.createElement(EventsSection),
        React.createElement(RegistrationForm),
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
