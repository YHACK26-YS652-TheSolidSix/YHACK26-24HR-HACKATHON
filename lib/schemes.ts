export type Scheme = {
  id: number;
  name: string;
  sector: string;
  businessType: string;
  womenOnly: boolean;
  startupOnly: boolean;
  description: string;
};

export const schemes: Scheme[] = [
  {
    id: 1,
    name: "StartupTN Seed Fund",
    sector: "Technology",
    businessType: "Startup",
    womenOnly: false,
    startupOnly: true,
    description: "Funding support for innovative startups in Tamil Nadu."
  },
  {
    id: 2,
    name: "PMEGP Loan Assistance",
    sector: "Manufacturing",
    businessType: "MSME",
    womenOnly: false,
    startupOnly: false,
    description: "Government-backed loan assistance for MSMEs."
  },
  {
    id: 3,
    name: "NEEDS Subsidy Scheme",
    sector: "Manufacturing",
    businessType: "Startup",
    womenOnly: false,
    startupOnly: true,
    description: "Subsidy for new entrepreneurs in Tamil Nadu."
  },
  {
    id: 4,
    name: "Women Entrepreneur Subsidy",
    sector: "Any",
    businessType: "MSME",
    womenOnly: true,
    startupOnly: false,
    description: "Special subsidy and incentives for women entrepreneurs."
  },
  {
    id: 5,
    name: "CGTMSE Credit Guarantee",
    sector: "Any",
    businessType: "MSME",
    womenOnly: false,
    startupOnly: false,
    description: "Collateral-free credit guarantee for MSMEs."
  },
  {
    id: 6,
    name: "MSME Technology Upgrade Scheme",
    sector: "Technology",
    businessType: "MSME",
    womenOnly: false,
    startupOnly: false,
    description: "Financial support for adopting new technologies."
  },
  {
    id: 7,
    name: "Agri Business Modernization Grant",
    sector: "Agriculture",
    businessType: "MSME",
    womenOnly: false,
    startupOnly: false,
    description: "Support for agriculture-based enterprises."
  },
  {
    id: 8,
    name: "Green Energy MSME Incentive",
    sector: "Energy",
    businessType: "MSME",
    womenOnly: false,
    startupOnly: false,
    description: "Incentives for sustainable energy businesses."
  }
];