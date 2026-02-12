import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { authAPI, marketplaceAPI, ordersAPI, issuesAPI, notificationsAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import '../styles/Diagnostic.css';

const Diagnostic = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (name, apiCall) => {
    try {
      const response = await apiCall();
      return {
        success: true,
        data: response.data,
        message: 'Success',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        message: `Error: ${error.response?.status || 'Network Error'}`,
      };
    }
  };

  const runDiagnostics = async () => {
    setTesting(true);
    const newResults = {};

    console.log('🔍 Starting API Diagnostics...');

    // Test each endpoint
    const tests = [
      { name: 'User Info', call: () => authAPI.getMe() },
      { name: 'Institutes', call: () => authAPI.getInstitutes() },
      { name: 'Categories', call: () => marketplaceAPI.getCategories() },
      { name: 'Listings', call: () => marketplaceAPI.getListings() },
      { name: 'Orders', call: () => ordersAPI.getOrders() },
      { name: 'Issues', call: () => issuesAPI.getIssues() },
      { name: 'Notifications', call: () => notificationsAPI.getNotifications() },
    ];

    for (const test of tests) {
      console.log(`Testing: ${test.name}`);
      newResults[test.name] = await testEndpoint(test.name, test.call);
      setResults({ ...newResults });
    }

    setTesting(false);
    console.log('✅ Diagnostics Complete');
  };

  return (
    <>
      <Navbar />
      <div className="diagnostic-container">
        <motion.div
          className="diagnostic-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>API Diagnostics 🔍</h1>
          <p>Test all API endpoints and check data format</p>
          <button
            className="btn btn-primary"
            onClick={runDiagnostics}
            disabled={testing}
          >
            {testing ? (
              <>
                <div className="spinner"></div> Testing...
              </>
            ) : (
              <>
                <FiRefreshCw /> Run Diagnostics
              </>
            )}
          </button>
        </motion.div>

        <div className="diagnostic-results">
          {Object.entries(results).map(([name, result]) => (
            <motion.div
              key={name}
              className={`diagnostic-card ${result.success ? 'success' : 'error'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="diagnostic-header-row">
                {result.success ? (
                  <FiCheckCircle className="icon-success" />
                ) : (
                  <FiXCircle className="icon-error" />
                )}
                <h3>{name}</h3>
                <span className={`status ${result.success ? 'success' : 'error'}`}>
                  {result.message}
                </span>
              </div>

              <div className="diagnostic-details">
                {result.success ? (
                  <>
                    <div className="detail-item">
                      <strong>Data Type:</strong>{' '}
                      {Array.isArray(result.data)
                        ? 'Array'
                        : typeof result.data}
                    </div>
                    {Array.isArray(result.data) && (
                      <div className="detail-item">
                        <strong>Count:</strong> {result.data.length} items
                      </div>
                    )}
                    {result.data.results && (
                      <div className="detail-item">
                        <strong>Results Count:</strong>{' '}
                        {result.data.results.length} items
                      </div>
                    )}
                    {result.data.count !== undefined && (
                      <div className="detail-item">
                        <strong>Total Count:</strong> {result.data.count}
                      </div>
                    )}
                    <details>
                      <summary>View Raw Data</summary>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </details>
                  </>
                ) : (
                  <>
                    <div className="detail-item error">
                      <strong>Status:</strong> {result.status || 'Network Error'}
                    </div>
                    <details>
                      <summary>View Error Details</summary>
                      <pre>{JSON.stringify(result.error, null, 2)}</pre>
                    </details>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {Object.keys(results).length === 0 && !testing && (
          <div className="empty-diagnostic">
            <p>Click "Run Diagnostics" to test all API endpoints</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Diagnostic;
