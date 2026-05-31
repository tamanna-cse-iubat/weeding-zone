import React from 'react';

const policySections = [
    {
        id: 'overview',
        title: 'Overview',
        bullets: [
            'We want you to feel confident when shopping with us. This Cancellation & Refund Policy explains how cancellations and refunds are handled for products and services purchased through our website.',
        ],
    },
    {
        id: 'cancellations',
        title: 'Order Cancellation',
        bullets: [
            'Orders can be cancelled within 24 hours of placing the order without any additional charge.',
            'If the cancellation is made 3 days before the event date, a partial refund may be provided.',
            'Cancellation requests made less than 24 hours before the event may not be eligible for a refund.',
            'Customized or specially reserved wedding items may have separate cancellation conditions.',
            'Full refund is applicable if cancellation is made within the allowed time.',
            'No refund will be provided for late cancellation or after the service is delivered.',
        ],
    },
    {
        id: 'refunds',
        title: 'Refunds',
        bullets: [
            'Refunds will be processed within 21 working days after cancellation approval.',
            'Refunds will be sent to the original payment method, including bKash, bank transfer, or card.',
            'Partial refund may apply in special cases.',
            'Refund amount depends on cancellation timing and order type.',
            'A full refund is applicable if cancellation is made within the allowed time.',
            'No refund is provided for late cancellation or after service delivery.',
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
            <div className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-[0_40px_120px_-40px_rgba(74,14,27,0.35)]">
                    <div className="h-2 bg-[#4A0E1B]"></div>
                    <div className="p-8 md:p-12">
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#8A2B2B]">
                            Policy Document
                        </span>
                        <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_0.8fr] lg:items-end">
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
                                <p className="mt-2 text-xs text-[#7E4A44]">Read the rules carefully for smooth cancellations and refunds.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid gap-6">
                    {policySections.map((section, index) => (
                        <article key={section.id} className="rounded-[1.75rem] border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <h2 className="text-2xl font-semibold text-[#3F2A28]">{section.title}</h2>
                                <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-[#8A2B2B]">
                                    Section {index + 1}
                                </span>
                            </div>
                            <div className="mt-6 space-y-4 text-[#5D4B48]">
                                {section.bullets && (
                                    <ul className="space-y-3">
                                        {section.bullets.map((bullet, bulletIndex) => (
                                            <li key={bulletIndex} className="flex gap-3 text-base leading-7">
                                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C518]/20 text-[#4A0E1B] text-sm font-bold">
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
