import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Set colors
    const primaryColor = [74, 14, 14];
    const accentColor = [212, 175, 55];
    const textDark = [50, 50, 50];
    const textGray = [100, 100, 100];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('WEDDING ZONE', 20, 20);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Premium Wedding Rental Services', 20, 26);

    // Invoice title on right
    doc.setTextColor(...accentColor);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', pageWidth - 40, 15);

    doc.setTextColor(...textDark);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice #: ${order.orderId}`, pageWidth - 40, 22);
    doc.text(`Date: ${order.date}`, pageWidth - 40, 28);

    yPosition = 38;

    // Company Info Section
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('WEDDING ZONE', 20, yPosition);

    doc.setTextColor(...textGray);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.text('Dhaka, Bangladesh', 20, yPosition);
    yPosition += 4;
    doc.text('Email: info@weddingzone.com', 20, yPosition);
    yPosition += 4;
    doc.text('Phone: +880 1XXX XXXXXX', 20, yPosition);

    // Customer Info Section (Right side)
    yPosition = 38;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('BILL TO:', pageWidth - 80, yPosition);

    doc.setTextColor(...textDark);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.text(order.customerName, pageWidth - 80, yPosition);
    yPosition += 4;
    doc.text(order.customerEmail, pageWidth - 80, yPosition);

    yPosition += 8;

    // Order Status
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Order Status:', 20, yPosition);
    doc.setTextColor(76, 175, 80);
    doc.text(order.status, 60, yPosition);

    doc.setTextColor(...primaryColor);
    doc.text('Payment Method:', 120, yPosition);
    doc.setTextColor(...textGray);
    doc.text(order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod === 'mobile' ? 'Mobile Banking' : 'Cash on Delivery', 165, yPosition);

    yPosition += 8;

    // Items Table
    const tableColumn = ['Item', 'Size', 'Days', 'Rate', 'Total'];
    const tableRows = order.items.map(item => [
        item.name,
        item.size ? item.size[0] : 'Standard',
        item.rent_for_days || 3,
        `BDT ${item.rent.toLocaleString()}`,
        `BDT ${(item.rent * (item.rent_for_days || 3)).toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: yPosition,
        head: [tableColumn],
        body: tableRows,
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
        },
        bodyStyles: {
            textColor: textDark,
            fontSize: 8,
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'left' },
            3: { halign: 'right' },
            4: { halign: 'right' }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        },
        margin: { left: 20, right: 20 },
        didDrawPage: () => {
            // Footer
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text('© 2024 Wedding Zone. All rights reserved.', 20, pageHeight - 10);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 60, pageHeight - 10);
        }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Totals Section
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(120, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;

    // Calculate totals
    const subtotal = order.subtotal || order.totalAmount;
    const discountAmount = order.discount || 0;
    const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% tax on discounted amount
    const total = (subtotal - discountAmount) + tax;

    doc.setTextColor(...textGray);
    doc.setFontSize(9);
    doc.text('Subtotal:', 140, yPosition);
    doc.setTextColor(...textDark);
    doc.setFont(undefined, 'bold');
    doc.text(`BDT ${subtotal.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });

    if (discountAmount > 0) {
        yPosition += 5;
        doc.setTextColor(76, 175, 80);
        doc.setFont(undefined, 'normal');
        doc.text(`Discount${order.appliedCoupon ? ` (${order.appliedCoupon.code})` : ''}:`, 140, yPosition);
        doc.setFont(undefined, 'bold');
        doc.text(`- BDT ${discountAmount.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });
    }

    yPosition += 5;
    doc.setTextColor(...textGray);
    doc.setFont(undefined, 'normal');
    doc.text('Tax (5%):', 140, yPosition);
    doc.setTextColor(...textDark);
    doc.setFont(undefined, 'bold');
    doc.text(`BDT ${tax.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });

    yPosition += 6;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(120, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;
    doc.setTextColor(...accentColor);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL DUE:', 140, yPosition);
    doc.setTextColor(...primaryColor);
    doc.text(`BDT ${total.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });

    yPosition += 12;

    // Notes
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Terms & Conditions:', 20, yPosition);

    yPosition += 4;
    doc.setTextColor(...textGray);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    const terms = [
        '• Rental period starts from delivery date and ends on return date.',
        '• Items must be returned in same condition as received.',
        '• Damage charges may apply as per our return policy.'
    ];

    terms.forEach(term => {
        doc.text(term, 20, yPosition, { maxWidth: pageWidth - 40 });
        yPosition += 4;
    });

    // Save the PDF
    doc.save(`invoice_${order.orderId.replace('#', '')}.pdf`);
};

export default generateInvoicePDF;
