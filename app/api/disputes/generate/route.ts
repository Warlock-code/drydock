import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

type DisputePayload = {
  storeName: string;
  orderId: string;
  transactionAmount: string;
  disputeReason: string;
  customerEmail: string;
  ipAddress: string;
  avsCvcMatch: string;
  carrierAndTracking: string;
  deliveryStatus: string;
  policySummary: string;
};

const requiredFields: (keyof DisputePayload)[] = [
  "storeName",
  "orderId",
  "transactionAmount",
  "disputeReason",
  "customerEmail",
  "ipAddress",
  "avsCvcMatch",
  "carrierAndTracking",
  "deliveryStatus",
  "policySummary",
];

function safeText(value: string) {
  return value
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, "");
}

function wrapText(text: string, font: PDFFont | null, size: number, maxWidth: number) {
  if (!text) return [""];
  if (!font) return [text];
  const words = safeText(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function POST(request: Request) {
  let payload: DisputePayload;

  try {
    payload = (await request.json()) as DisputePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== "string") {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const pages: ReturnType<typeof pdf.addPage>[] = [];

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 52;

  function addPage() {
    const page = pdf.addPage([pageWidth, pageHeight]);
    pages.push(page);
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: 12,
      color: rgb(0.035, 0.035, 0.04),
    });
    return page;
  }

  function header(page: ReturnType<typeof pdf.addPage>, section: string) {
    page.drawText("DISPUTESHIELD", { x: margin, y: 744, size: 10, font: bold, color: rgb(0.12, 0.12, 0.14) });
    page.drawText(safeText(section).toUpperCase(), { x: margin, y: 724, size: 8, font: mono, color: rgb(0.42, 0.42, 0.46) });
    page.drawLine({ start: { x: margin, y: 710 }, end: { x: pageWidth - margin, y: 710 }, thickness: 1, color: rgb(0.86, 0.86, 0.88) });
  }

  function footer(page: ReturnType<typeof pdf.addPage>) {
    const index = pages.indexOf(page) + 1;
    page.drawText(`CONFIDENTIAL // ORDER ${safeText(payload.orderId)}`, { x: margin, y: 28, size: 7, font: mono, color: rgb(0.45, 0.45, 0.48) });
    page.drawText(`${index} / ${pages.length || 6}`, { x: pageWidth - margin - 34, y: 28, size: 7, font: mono, color: rgb(0.45, 0.45, 0.48) });
  }

  function drawParagraph(page: ReturnType<typeof pdf.addPage>, text: string, x: number, y: number, maxWidth: number, size = 10, font = regular, lineHeight = 15) {
    let cursor = y;
    for (const line of wrapText(text, font, size, maxWidth)) {
      page.drawText(line, { x, y: cursor, size, font, color: rgb(0.12, 0.12, 0.14) });
      cursor -= lineHeight;
    }
    return cursor;
  }

  function drawLabelValue(page: ReturnType<typeof pdf.addPage>, label: string, value: string, y: number) {
    page.drawText(safeText(label).toUpperCase(), { x: margin, y, size: 8, font: bold, color: rgb(0.42, 0.42, 0.46) });
    const nextY = drawParagraph(page, value, margin + 150, y - 1, pageWidth - margin - (margin + 150), 10);
    return nextY;
  }

  // Page 1: Cover
  const cover = addPage();
  cover.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: rgb(0.035, 0.035, 0.04) });
  cover.drawText("DISPUTESHIELD", { x: margin, y: 700, size: 12, font: bold, color: rgb(1, 1, 1) });
  cover.drawText("CHARGEBACK REBUTTAL DOSSIER", { x: margin, y: 620, size: 24, font: bold, color: rgb(1, 1, 1) });
  cover.drawText("VISA / MASTERCARD NETWORK RESPONSE", { x: margin, y: 592, size: 10, font: mono, color: rgb(0.55, 0.55, 0.58) });
  cover.drawLine({ start: { x: margin, y: 555 }, end: { x: pageWidth - margin, y: 555 }, thickness: 1, color: rgb(0.25, 0.25, 0.27) });
  cover.drawText("MERCHANT", { x: margin, y: 510, size: 8, font: mono, color: rgb(0.55, 0.55, 0.58) });
  cover.drawText(safeText(payload.storeName), { x: margin, y: 486, size: 16, font: bold, color: rgb(1, 1, 1) });
  cover.drawText("ORDER", { x: margin, y: 430, size: 8, font: mono, color: rgb(0.55, 0.55, 0.58) });
  cover.drawText(safeText(payload.orderId), { x: margin, y: 406, size: 12, font: mono, color: rgb(1, 1, 1) });
  cover.drawText("TRANSACTION", { x: 330, y: 430, size: 8, font: mono, color: rgb(0.55, 0.55, 0.58) });
  cover.drawText(safeText(payload.transactionAmount), { x: 330, y: 406, size: 12, font: bold, color: rgb(1, 1, 1) });
  cover.drawText(`ISSUE DATE // ${new Date().toISOString().slice(0, 10)}`, { x: margin, y: 28, size: 8, font: mono, color: rgb(0.55, 0.55, 0.58) });

  // Page 2: Executive summary
  const summary = addPage();
  header(summary, "01 // Executive Summary");
  summary.drawText("Rebuttal Position", { x: margin, y: 665, size: 20, font: bold, color: rgb(0.12, 0.12, 0.14) });
  let y = drawParagraph(summary, `This dossier addresses the ${payload.disputeReason} dispute for order ${payload.orderId}. It consolidates the transaction, fulfillment, customer, and merchant policy evidence available for the issuer and acquirer review.`, margin, 630, pageWidth - margin * 2, 11, regular, 17);
  y -= 24;
  summary.drawText("Core evidence", { x: margin, y, size: 12, font: bold, color: rgb(0.12, 0.12, 0.14) });
  y -= 32;
  y = drawLabelValue(summary, "Store", payload.storeName, y);
  y -= 30;
  y = drawLabelValue(summary, "Amount", payload.transactionAmount, y);
  y -= 30;
  y = drawLabelValue(summary, "Reason", payload.disputeReason, y);
  y -= 30;
  drawLabelValue(summary, "Delivery", payload.deliveryStatus, y);

  // Page 3: Transaction evidence
  const transaction = addPage();
  header(transaction, "02 // Transaction Evidence");
  transaction.drawText("Authorization & Identity Record", { x: margin, y: 665, size: 20, font: bold, color: rgb(0.12, 0.12, 0.14) });
  y = 620;
  y = drawLabelValue(transaction, "Order ID", payload.orderId, y); y -= 38;
  y = drawLabelValue(transaction, "Customer Email", payload.customerEmail, y); y -= 38;
  y = drawLabelValue(transaction, "IP Address", payload.ipAddress, y); y -= 38;
  y = drawLabelValue(transaction, "AVS / CVC", payload.avsCvcMatch, y); y -= 38;
  y = drawLabelValue(transaction, "Transaction Amount", payload.transactionAmount, y);
  transaction.drawText("Evidence note", { x: margin, y: 370, size: 12, font: bold, color: rgb(0.12, 0.12, 0.14) });
  drawParagraph(transaction, "The records above should be matched against processor logs and the cardholder account. Preserve original timestamps and identifiers; do not alter source data.", margin, 340, pageWidth - margin * 2, 10, regular, 16);

  // Page 4: Fulfillment
  const fulfillment = addPage();
  header(fulfillment, "03 // Fulfillment & Delivery");
  fulfillment.drawText("Shipping Evidence", { x: margin, y: 665, size: 20, font: bold, color: rgb(0.12, 0.12, 0.14) });
  y = 620;
  y = drawLabelValue(fulfillment, "Carrier / Tracking", payload.carrierAndTracking, y); y -= 38;
  y = drawLabelValue(fulfillment, "Delivery Status", payload.deliveryStatus, y); y -= 38;
  y = drawLabelValue(fulfillment, "Store", payload.storeName, y);
  fulfillment.drawText("Rebuttal analysis", { x: margin, y: 430, size: 12, font: bold, color: rgb(0.12, 0.12, 0.14) });
  drawParagraph(fulfillment, "Verify the tracking number, delivery address, carrier scan history, and proof of delivery against the transaction. Include screenshots or certified carrier data with the final issuer submission.", margin, 400, pageWidth - margin * 2, 10, regular, 16);

  // Page 5: Policy and reason code
  const policy = addPage();
  header(policy, "04 // Policy & Reason Analysis");
  policy.drawText("Merchant Policy Position", { x: margin, y: 665, size: 20, font: bold, color: rgb(0.12, 0.12, 0.14) });
  y = 620;
  y = drawLabelValue(policy, "Dispute Reason", payload.disputeReason, y); y -= 42;
  policy.drawText("Policy summary", { x: margin, y, size: 8, font: bold, color: rgb(0.42, 0.42, 0.46) });
  drawParagraph(policy, payload.policySummary, margin, y - 22, pageWidth - margin * 2, 10, regular, 16);
  policy.drawText("Recommended issuer response", { x: margin, y: 390, size: 12, font: bold, color: rgb(0.12, 0.12, 0.14) });
  drawParagraph(policy, "The documentary evidence should be reviewed in conjunction with the applicable Visa or Mastercard reason-code requirements. The rebuttal should demonstrate that the charge was authorized, the purchase was fulfilled, and the merchant followed its published terms.", margin, 360, pageWidth - margin * 2, 10, regular, 16);

  // Page 6: Evidence checklist
  const checklist = addPage();
  header(checklist, "05 // Submission Checklist");
  checklist.drawText("Evidence to Attach", { x: margin, y: 665, size: 20, font: bold, color: rgb(0.12, 0.12, 0.14) });
  const items = [
    "Payment authorization and transaction receipt",
    "AVS/CVC response and fraud-screening record",
    "Customer account and order history",
    "Carrier tracking and proof of delivery",
    "Merchant fulfillment policy and terms",
    "Customer communications and refund history",
  ];
  y = 610;
  for (const item of items) {
    checklist.drawRectangle({ x: margin, y: y - 4, width: 10, height: 10, borderWidth: 1, borderColor: rgb(0.38, 0.38, 0.42), color: rgb(1, 1, 1) });
    checklist.drawText(safeText(item), { x: margin + 24, y, size: 10, font: regular, color: rgb(0.12, 0.12, 0.14) });
    y -= 38;
  }
  checklist.drawLine({ start: { x: margin, y: 340 }, end: { x: pageWidth - margin, y: 340 }, thickness: 1, color: rgb(0.86, 0.86, 0.88) });
  checklist.drawText("Certification", { x: margin, y: 315, size: 12, font: bold, color: rgb(0.12, 0.12, 0.14) });
  drawParagraph(checklist, "This dossier is a document-assembly aid and not legal or financial advice. The submitting merchant is responsible for verifying all evidence and compliance with applicable network rules before filing.", margin, 285, pageWidth - margin * 2, 9, regular, 14);

  for (const page of pages) footer(page);

  const pdfBytes = await pdf.save();
  const safeOrderId = payload.orderId.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "dispute";

  return new NextResponse(pdfBytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="DisputeShield-${safeOrderId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
