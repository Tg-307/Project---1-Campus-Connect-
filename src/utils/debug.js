// Debug utility to help troubleshoot API responses
export const logAPIResponse = (endpoint, response) => {
  console.group(`🔍 API Response: ${endpoint}`);
  console.log('Full Response:', response);
  console.log('Response Data:', response.data);
  console.log('Data Type:', typeof response.data);
  console.log('Is Array:', Array.isArray(response.data));
  
  if (response.data.results) {
    console.log('Results Found:', response.data.results);
    console.log('Results Length:', response.data.results.length);
  }
  
  console.groupEnd();
};
