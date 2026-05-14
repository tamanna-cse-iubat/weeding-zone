import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { addNotification } from '../../../utils/notificationService';
const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        // Simulate sending
        setTimeout(() => {
            setSending(false);
            
            // Notify Admin
            addNotification({
                role: 'admin',
                title: 'New Contact Message',
                message: `You received a new message from ${form.name} (${form.email}) regarding: ${form.subject}.`,
                fullMessage: form.message,
                senderName: form.name,
                senderEmail: form.email,
                type: 'contact'
            });

            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
                confirmButtonColor: '[#4A0E1B]',
                confirmButtonText: 'Wonderful!'
            });
        }, 1500);
    };

    const inputClass =
        'w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:border-[#4A0E1B] focus:ring-1 focus:ring-[#4A0E1B] transition placeholder:text-gray-400 text-sm';

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">

            {/* ── Hero Banner ── */}
            <div
                className="relative bg-[#4A0E1B] h-52 md:h-64 flex items-center justify-center overflow-hidden"

            >
                {/* Decorative petals / rings */}
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full border-2 border-white/30"></div>
                    <div className="absolute w-60 h-60 rounded-full border border-white/20"></div>
                </div>

                <div className="relative text-center px-4">
                    <p className="text-white text-xs tracking-[0.3em] uppercase mb-2 font-ubuntu">
                        We'd love to hear from you
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                        Contact Us
                    </h1>
                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-12 bg-white"></div>
                        <div className="w-2 h-2 rotate-45 bg-white"></div>
                        <div className="h-px w-12 bg-white"></div>
                    </div>
                </div>
            </div>

            {/* ── Breadcrumb ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <nav className="flex items-center text-sm text-gray-500 space-x-2">
                    <Link to="/" className="hover:text-[#4A0E1B] transition">Home</Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-[#4A0E1B] font-medium">Contact Us</span>
                </nav>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── LEFT: Info Cards ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Intro text */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-2xl font-serif font-bold text-[#4A0E1B] mb-2">Get in Touch</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Planning your dream wedding? Our team is here to help you find the perfect
                                outfit. Reach out anytime — we respond within 24 hours.
                            </p>
                        </div>

                        {/* Info items */}
                        {[
                            {
                                icon: <MapPinIcon className="h-5 w-5" />,
                                label: 'Our Showroom',
                                lines: ['House 31, Road 10B, Sector 11', 'Uttara, Dhaka – 1230'],
                                color: 'bg-[#4A0E1B] text-white'
                            },
                            {
                                icon: <PhoneIcon className="h-5 w-5" />,
                                label: 'Call Us',
                                lines: ['+880 1816-697212', '+880 1782-421132'],
                                color: 'bg-[#4A0E1B] text-white'
                            },
                            {
                                icon: <EnvelopeIcon className="h-5 w-5" />,
                                label: 'Email Us',
                                lines: ['support@weddingzone.com', 'info@weddingzone.com'],
                                color: 'bg-[#4A0E1B] text-white'
                            },
                            {
                                icon: <ClockIcon className="h-5 w-5" />,
                                label: 'Working Hours',
                                lines: ['Sat – Thu: 10:00 AM – 8:00 PM', 'Friday: Closed'],
                                color: 'bg-[#4A0E1B] text-white'
                            }
                        ].map(({ icon, label, lines, color }) => (
                            <div
                                key={label}
                                className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
                                    {icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm mb-1">{label}</p>
                                    {lines.map((l, i) => (
                                        <p key={i} className="text-gray-500 text-sm">{l}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Social strip */}
                        <div className="bg-[#4A0E1B] rounded-2xl p-5 text-white">
                            <p className="text-xs tracking-widest uppercase text-white mb-3 font-ubuntu">
                                Follow Our Journey
                            </p>
                            <div className="flex gap-3">
                                {['Facebook', 'Instagram', 'Pinterest'].map((s) => (
                                    <a
                                        key={s}
                                        href="#"
                                        className="flex-1 text-center text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 transition"
                                    >
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Contact Form ── */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

                            {/* Form header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-serif font-bold text-[#4A0E1B] mb-1">Send a Message</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-px w-8 bg-secondary/50"></div>
                                    <div className="w-1.5 h-1.5 rotate-45 bg-secondary"></div>
                                    <div className="h-px w-8 bg-secondary/50"></div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-name">
                                            Full Name <span className="text-[#4A0E1B]">*</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Fatima Rahman"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-email">
                                            Email Address <span className="text-[#4A0E1B]">*</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Phone + Subject */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-phone">
                                            Phone Number
                                        </label>
                                        <input
                                            id="contact-phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+880 1XXXXXXXXX"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-subject">
                                            Subject <span className="text-[#4A0E1B]">*</span>
                                        </label>
                                        <select
                                            id="contact-subject"
                                            name="subject"
                                            required
                                            value={form.subject}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="">Select a topic…</option>
                                            <option>Bridal Outfit Inquiry</option>
                                            <option>Groom Outfit Inquiry</option>
                                            <option>Rental & Pricing</option>
                                            <option>Order / Delivery Issue</option>
                                            <option>Return & Refund</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-message">
                                        Your Message <span className="text-[#4A0E1B]">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={5}
                                        placeholder="Tell us about your wedding date, outfit preferences, or any questions…"
                                        value={form.message}
                                        onChange={handleChange}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full flex items-center justify-center gap-2 bg-[#4A0E1B] hover:bg-[#5E0B15] text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-1">
                                    We typically respond within 24 hours on business days.
                                </p>
                            </form>
                        </div>
                    </div>

                </div>

                {/* ── Map placeholder ── */}
                <div className="mt-10 rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-56 md:h-72 bg-gradient-to-br from-rose-50 to-amber-50 flex flex-col items-center justify-center gap-3">
                    <MapPinIcon className="h-10 w-10 text-[#4A0E1B] opacity-40" />
                    <p className="text-gray-400 text-sm font-medium">House 31, Road 10B, Sector 11, Uttara, Dhaka</p>
                    <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#4A0E1B] border border-[#4A0E1B]/40 rounded-full px-4 py-1.5 hover:bg-[#4A0E1B] hover:text-white transition"
                    >
                        Open in Google Maps ↗
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Contact;