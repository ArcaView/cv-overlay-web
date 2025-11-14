// API Service Layer for Dashboard

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock data for development - replace with real API calls
export const api = {
  analytics: {
    async getMetrics(timeRange: string = '7d') {
      // Mock data - replace with real API call
      return {
        totalViews: 12847,
        totalClicks: 2341,
        conversionRate: 18.2,
        revenue: 4567.89,
        trends: {
          views: 12.5,
          clicks: -3.2,
          conversion: 5.1,
          revenue: 23.4
        }
      };
    },

    async getChartData(metric: string, timeRange: string = '7d') {
      // Mock data - replace with real API call
      const mockData = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 1000) + 500,
          previousValue: Math.floor(Math.random() * 900) + 400
        });
      }

      return mockData;
    },

    async getTopPerformers() {
      // Mock data - replace with real API call
      return [
        { name: 'Landing Page A', views: 4523, clicks: 892, conversion: 19.7 },
        { name: 'Product Page B', views: 3821, clicks: 734, conversion: 19.2 },
        { name: 'Campaign C', views: 2943, clicks: 521, conversion: 17.7 },
        { name: 'Feature D', views: 1560, clicks: 194, conversion: 12.4 }
      ];
    }
  },

  billing: {
    async getSubscription() {
      // Mock data - replace with real API call
      return {
        plan: 'Pro',
        status: 'active',
        billingCycle: 'monthly',
        amount: 49.00,
        currency: 'USD',
        nextBillingDate: '2025-12-14',
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2026
        }
      };
    },

    async getInvoices() {
      // Mock data - replace with real API call
      return [
        {
          id: 'inv_001',
          date: '2025-11-14',
          amount: 49.00,
          status: 'paid',
          invoiceUrl: '#'
        },
        {
          id: 'inv_002',
          date: '2025-10-14',
          amount: 49.00,
          status: 'paid',
          invoiceUrl: '#'
        },
        {
          id: 'inv_003',
          date: '2025-09-14',
          amount: 49.00,
          status: 'paid',
          invoiceUrl: '#'
        }
      ];
    },

    async updatePaymentMethod(data: any) {
      // Mock implementation - replace with real API call
      console.log('Updating payment method:', data);
      return { success: true };
    },

    async cancelSubscription() {
      // Mock implementation - replace with real API call
      return { success: true };
    },

    async changePlan(planId: string) {
      // Mock implementation - replace with real API call
      console.log('Changing to plan:', planId);
      return { success: true };
    }
  },

  settings: {
    async getSettings() {
      // Mock data - replace with real API call
      return {
        profile: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          company: 'Acme Inc.',
          avatar: ''
        },
        notifications: {
          emailNotifications: true,
          weeklyReport: true,
          productUpdates: false,
          marketingEmails: false
        },
        preferences: {
          language: 'en',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY'
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: '2025-08-15'
        }
      };
    },

    async updateProfile(data: any) {
      // Mock implementation - replace with real API call
      console.log('Updating profile:', data);
      return { success: true };
    },

    async updateNotifications(data: any) {
      // Mock implementation - replace with real API call
      console.log('Updating notifications:', data);
      return { success: true };
    },

    async updatePreferences(data: any) {
      // Mock implementation - replace with real API call
      console.log('Updating preferences:', data);
      return { success: true };
    },

    async updatePassword(oldPassword: string, newPassword: string) {
      // Mock implementation - replace with real API call
      console.log('Updating password');
      return { success: true };
    },

    async enableTwoFactor() {
      // Mock implementation - replace with real API call
      return {
        success: true,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        backupCodes: ['ABC123', 'DEF456', 'GHI789']
      };
    }
  }
};
