// Pricing and payment configuration
export const paymentConfig = {
  // Report pricing
  amount: 100, // Amount in KES

  // M-PESA payment details  
  mpesa: {
    tillNumber: '5204479',
    businessName: 'FOOTBALL HIGHWAY ENTERPRISES'
  },

  // Report access features
  features: [
    {
      title: 'Credit Score',
      description: 'View your current credit score'
    },
    {
      title: 'Analysis',
      description: 'Detailed credit analysis'
    },
    {
      title: 'Full Report',
      description: 'Complete credit report'
    }
  ],

  // Benefits of credit report
  benefits: [
    'Quick loan approvals',
    'Know your credit standing',
    'Track credit improvements',
    'Better financial decisions'
  ]
};