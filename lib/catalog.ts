export type VerticalStatus = "ACTIVE" | "NEXT" | "QUEUED";
export type ToolStatus = "SHIPPING NOW" | "QUEUED";

export type Tool = {
  id: string;
  name: string;
  slug: string;
  status: ToolStatus;
  tagline: string;
  painSolved?: string;
  highlights?: string[];
  monthlyPrice: number;
  lifetimePrice?: number;
};

export type Vertical = {
  id: string;
  name: string;
  status: VerticalStatus;
  description: string;
  problemAreas: string[];
  tools: Tool[];
  suite?: {
    monthlyPrice: number;
    lifetimePrice: number;
    separateMonthlyTotal: number;
  };
};

export const catalog: Vertical[] = [
  {
    id: "01",
    name: "E-Commerce",
    status: "ACTIVE",
    description:
      "Automated defense, reconciliation, and operational protection for Shopify & Stripe merchants.",
    problemAreas: ["Chargebacks", "Payout reconciliation", "Refund abuse", "Policy compliance"],
    suite: {
      monthlyPrice: 149,
      lifetimePrice: 499,
      separateMonthlyTotal: 207,
    },
    tools: [
      {
        id: "01",
        name: "DisputeShield",
        slug: "disputeshield",
        status: "SHIPPING NOW",
        tagline:
          "Turn raw Stripe & Shopify order logs, carrier tracking, and refund policies into a Visa/Mastercard-compliant chargeback rebuttal PDF in 8 seconds.",
        painSolved:
          "Merchants lose 60%+ of chargebacks because gathering IP logs, AVS/CVC checks, delivery timestamps, and policy proof takes hours.",
        highlights: [
          "Auto-compiles IP, AVS/CVC, tracking & policy timestamps",
          "Formatted for Stripe & Shopify dispute reason codes",
          "Zero manual spreadsheet assembly",
        ],
        monthlyPrice: 79,
        lifetimePrice: 299,
      },
      {
        id: "02",
        name: "Payout Reconciler",
        slug: "payout-reconciler",
        status: "QUEUED",
        tagline:
          "Auto-match gateway payouts against processing fees, partial refunds, and supplier invoices.",
        highlights: [
          "Match payouts to underlying orders",
          "Surface fees and reconciliation gaps",
          "Export clean finance records",
        ],
        monthlyPrice: 59,
      },
      {
        id: "03",
        name: "Return & Policy Guard",
        slug: "return-guard",
        status: "QUEUED",
        tagline:
          "Detect serial refund abusers before fulfillment and archive proof-of-delivery logs automatically.",
        highlights: [
          "Flag repeat refund behavior",
          "Archive delivery evidence",
          "Protect fulfillment decisions",
        ],
        monthlyPrice: 69,
      },
    ],
  },
  {
    id: "02",
    name: "Agencies",
    status: "NEXT",
    description:
      "Automated client reporting, scope-creep alerts, and overdue invoice recovery.",
    problemAreas: ["Client reporting", "Scope creep", "Overdue invoices"],
    tools: [],
  },
  {
    id: "03",
    name: "Business Owners",
    status: "QUEUED",
    description:
      "Contract renewal tracking, vendor compliance, and repetitive back-office workflows.",
    problemAreas: ["Contract renewals", "Vendor compliance", "Repeating admin work"],
    tools: [],
  },
  {
    id: "04",
    name: "Real Estate",
    status: "QUEUED",
    description:
      "Track property operations, compliance deadlines, and repetitive agency workflows.",
    problemAreas: ["Compliance deadlines", "Document tracking", "Property operations"],
    tools: [],
  },
];

export function getVertical(name: string) {
  return catalog.find((vertical) => vertical.name === name) ?? catalog[0];
}

export function getTool(slug: string) {
  return catalog.flatMap((vertical) => vertical.tools).find((tool) => tool.slug === slug);
}
