import React, { useEffect } from 'react';

// Component to keep the frontend service alive
const HealthCheck: React.FC = () => {
  useEffect(() => {
    // Ping the health endpoint every 5 minutes to prevent Railway sleep
    const interval = setInterval(async () => {
      try {
        await fetch('/health');
        console.log('Health check ping sent');
      } catch (error) {
        console.warn('Health check failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default HealthCheck;