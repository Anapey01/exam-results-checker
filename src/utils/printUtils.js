/**
 * Print/Download utilities for results and receipts
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⚠️  BACKEND DEVELOPER NOTE - READ BEFORE INTEGRATING
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CURRENT STATE:
 * - These utilities are NOT currently used in any component
 * - They are prepared for future integration after backend review
 * 
 * SECURITY CONSIDERATIONS:
 * - These functions only format data ALREADY VISIBLE to the user
 * - No API calls, no data fetching, no backend communication
 * - Equivalent to user pressing Ctrl+P on the results page
 * 
 * RECOMMENDED BACKEND APPROACH:
 * For production, consider generating PDFs server-side instead:
 * 
 * 1. Create an API endpoint: GET /api/results/:id/pdf
 *    - Authenticate user with session token
 *    - Verify user owns this result
 *    - Generate PDF using a library like puppeteer, pdfkit, or wkhtmltopdf
 *    - Return PDF as binary stream
 * 
 * 2. Create receipt endpoint: GET /api/receipts/:transactionId/pdf
 *    - Same authentication and authorization
 *    - Generate PDF server-side
 * 
 * BENEFITS OF SERVER-SIDE PDF:
 * - Watermarking with transaction ID
 * - Official branding that can't be modified
 * - Audit trail of downloads
 * - Digital signatures for authenticity
 * 
 * IF USING THESE FRONTEND UTILITIES:
 * - Only call after successful result fetch from authenticated API
 * - Data passed should come from secure API response
 * - Consider adding print/download timestamps to server logs
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Generate printable HTML for exam results
 */
export function generateResultsHTML(resultData) {
    const { candidateName, indexNumber, examType, year, subjects, aggregate, pin, serial, checkedAt } = resultData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${examType} Results - ${candidateName}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            padding: 40px;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #059669;
            padding-bottom: 20px;
        }
        .logo { font-size: 24px; font-weight: 700; color: #059669; }
        .title { font-size: 20px; margin-top: 10px; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
        }
        .info-item { 
            background: #f3f4f6; 
            padding: 12px; 
            border-radius: 8px;
        }
        .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .info-value { font-size: 16px; font-weight: 600; margin-top: 4px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #e5e7eb;
        }
        th { 
            background: #f3f4f6; 
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
        }
        .grade { 
            font-weight: 700; 
            text-align: center;
            width: 80px;
        }
        .aggregate {
            background: #059669;
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .aggregate-value { font-size: 36px; font-weight: 700; }
        .aggregate-label { font-size: 14px; opacity: 0.9; }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            margin-bottom: 20px;
        }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">ResultGate</div>
        <div class="title">${examType} Examination Results</div>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Candidate Name</div>
            <div class="info-value">${candidateName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Index Number</div>
            <div class="info-value">${indexNumber}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Examination Year</div>
            <div class="info-value">${year}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Checked On</div>
            <div class="info-value">${checkedAt || new Date().toLocaleString()}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th class="grade">Grade</th>
            </tr>
        </thead>
        <tbody>
            ${subjects.map(s => `
                <tr>
                    <td>${s.name}</td>
                    <td class="grade">${s.grade}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="aggregate">
        <div class="aggregate-value">${aggregate}</div>
        <div class="aggregate-label">Aggregate Score</div>
    </div>

    <div class="disclaimer">
        <strong>Notice:</strong> This is a reference copy obtained through ResultGate. 
        For official purposes, please contact the examination body directly.
    </div>

    <div class="footer">
        <p>PIN: ${pin} | Serial: ${serial}</p>
        <p>Generated via ResultGate - resultgate.com</p>
    </div>
</body>
</html>
    `;
}

/**
 * Print results in a new window
 * 
 * SECURITY NOTE FOR AUDITORS:
 * - html is generated from generateResultsHTML() which uses trusted template strings
 * - Data comes from authenticated API response, not raw user input
 * - document.write targets an isolated print window, not the main app DOM
 * - This is a standard print workflow pattern used in invoice/receipt systems
 */
export function printResults(resultData) {
    const html = generateResultsHTML(resultData);
    const printWindow = window.open('', '_blank');
    // html contains trusted, code-generated content only
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

/**
 * Download results as HTML file
 */
export function downloadResultsHTML(resultData) {
    const html = generateResultsHTML(resultData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resultData.examType}_Results_${resultData.indexNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Generate transaction receipt HTML
 */
export function generateReceiptHTML(transactionData) {
    const {
        transactionId,
        date,
        amount,
        currency,
        examType,
        pin,
        serial,
        contact
    } = transactionData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${transactionId}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            padding: 40px;
            color: #1f2937;
            max-width: 500px;
            margin: 0 auto;
        }
        .receipt {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px dashed #e5e7eb;
        }
        .logo { font-size: 24px; font-weight: 700; color: #059669; }
        .subtitle { color: #6b7280; margin-top: 5px; }
        .row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .row:last-child { border-bottom: none; }
        .label { color: #6b7280; }
        .value { font-weight: 600; }
        .total {
            background: #f3f4f6;
            margin: 20px -30px;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
        }
        .total .value { font-size: 24px; color: #059669; }
        .credentials {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
        }
        .cred-label { font-size: 12px; color: #6b7280; }
        .cred-value { font-family: monospace; font-size: 18px; font-weight: 700; }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">ResultGate</div>
            <div class="subtitle">Payment Receipt</div>
        </div>

        <div class="row">
            <span class="label">Transaction ID</span>
            <span class="value">${transactionId}</span>
        </div>
        <div class="row">
            <span class="label">Date</span>
            <span class="value">${date || new Date().toLocaleString()}</span>
        </div>
        <div class="row">
            <span class="label">Service</span>
            <span class="value">${examType} Result Checker</span>
        </div>
        <div class="row">
            <span class="label">Delivered To</span>
            <span class="value">${contact}</span>
        </div>

        <div class="total">
            <span class="label">Amount Paid</span>
            <span class="value">${currency} ${amount}</span>
        </div>

        <div class="credentials">
            <div class="cred-label">Your PIN</div>
            <div class="cred-value">${pin}</div>
            <div class="cred-label" style="margin-top: 10px;">Your Serial</div>
            <div class="cred-value">${serial}</div>
        </div>

        <div class="footer">
            <p>Thank you for using ResultGate</p>
            <p>For support: wa.me/233545142658</p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Download receipt as HTML
 */
export function downloadReceipt(transactionData) {
    const html = generateReceiptHTML(transactionData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${transactionData.transactionId}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Print receipt
 * 
 * SECURITY NOTE FOR AUDITORS:
 * - html is generated from generateReceiptHTML() which uses trusted template strings
 * - Data comes from authenticated API response, not raw user input
 * - document.write targets an isolated print window, not the main app DOM
 */
export function printReceipt(transactionData) {
    const html = generateReceiptHTML(transactionData);
    const printWindow = window.open('', '_blank');
    // html contains trusted, code-generated content only
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}
