import api from './api';

const workerWalletService = {
  getWallet: async () => {
    try {
      const response = await api.get('/workers/wallet');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTransactions: async (params) => {
    try {
      const response = await api.get('/workers/wallet/transactions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default workerWalletService;
