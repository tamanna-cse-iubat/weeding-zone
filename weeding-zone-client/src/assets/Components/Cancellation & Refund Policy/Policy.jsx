import React from 'react';
import { Link } from 'react-router';

const policySections = [
    {
        id: 'overview',
        title: 'Overview',
        paragraphs: [
            'We want you to feel confident when shopping with us. This Cancellation & Refund Policy explains how cancellations and refunds are handled for products and services purchased through our website.',
        ],
    },
    {
        id: 'cancellations',
        title: 'Order Cancellation',
        paragraphs: [
            'If you need to cancel an order, please contact our support team as soon as possible. Cancellations are accepted before the order has entered the shipping process or before any service has been rendered.',
        ],
        bullets: [
            'Cancellation requests should be submitted through the contact page or by email.',
            'Orders that have already shipped or been fulfilled may not be eligible for cancellation.',
            'Once an order is cancelled, we will notify you by email and process any applicable refund.',
        ],
    },
    {
        id: 'refunds',
        title: 'Refunds',
        paragraphs: [
            'Refunds are issued for eligible cancellations, returned products, and order errors. Processing time varies depending on the payment method used.',
        ],
        bullets: [
            'Refunds are typically processed within 5-7 business days after approval.',
            'Original shipping charges are non-refundable unless the return was due to our error.',
            'Refunds are returned to the original payment method whenever possible.',
        ],
    },

   
];

const Policy = () => {
    const lastUpdated = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section className="min-h-screen bg-[#FDFBF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_40px_120px_-40px_rgba(74,14,27,0.35)]">
                    <div className="h-2 bg-[#4A0E1B]"></div>
                    <div className="p-8 md:p-12">
                        <span className="inline-block rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#8A2B2B]">
                            Policy Document
                        </span>
                        <div className="mt-6 sm:flex sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-semibold tracking-tight text-[#2A1A17] sm:text-5xl">
                                    Cancellation & Refund Policy
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-8 text-[#5D4B48] sm:text-lg">
                                    Everything you need to know about cancelling orders, getting refunds, and returning products in accordance with our services.
                                </p>
                            </div>
                            <div className="rounded-3xl bg-[#FEF4F2] px-5 py-4 text-sm text-[#8A2B2B] ring-1 ring-rose-100">
                                <p className="font-semibold">Last updated</p>
                                <p className="mt-1">{lastUpdated}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid gap-6">
                    {policySections.map((section, index) => (
                        <article key={section.id} className="rounded-[1.75rem] border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-2xl font-semibold text-[#3F2A28]">{section.title}</h2>
                                <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-[#8A2B2B]">
                                    Section {index + 1}
                                </span>
                            </div>
                            <div className="mt-5 space-y-4 text-[#5D4B48]">
                                {section.paragraphs.map((paragraph, paragraphIndex) => (
                                    <p key={paragraphIndex} className="leading-7">
                                        {paragraph}
                                    </p>
                                ))}
                                {section.bullets && (
                                    <ul className="space-y-3">
                                        {section.bullets.map((bullet, bulletIndex) => (
                                            <li key={bulletIndex} className="flex gap-3 text-base leading-7">
                                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-sm font-bold">
                                                    ✓
                                                </span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Policy;
