import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api } from '../services/api';

const StatusCheck = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const applicant = await api.getApplicantById(searchId.trim());
    if (applicant) {
      setResult(applicant);
    } else {
      setError('Application ID not found. Please check and try again.');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'text-green-600';
      case 'Rejected': return 'text-red-600';
      default: return 'text-amber-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted': return <CheckCircle className="text-green-600" size={48} />;
      case 'Rejected': return <XCircle className="text-red-600" size={48} />;
      default: return <Clock className="text-amber-500" size={48} />;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Check Application Status</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <input
            type="text"
            placeholder="Enter Application ID (e.g., APP001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Searching...' : <Search size={20} />}
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#ef4444', padding: '1rem', background: '#fef2f2', borderRadius: '8px' }}
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              {getStatusIcon(result.status)}
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{result.status}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Application Status</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Applicant Name</label>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{result.name}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Service Type</label>
                <div style={{ fontSize: '1.1rem' }}>{result.service_type}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block' }}>Payment Status</label>
                <div style={{ marginTop: '0.25rem' }}>
                  {result.amount_due > 0 ? (
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.5rem 1rem', 
                      background: '#fee2e2', 
                      color: '#991b1b', 
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      Amount Due: ₹{result.amount_due}
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem', 
                      background: '#dcfce7', 
                      color: '#166534', 
                      borderRadius: '999px',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      Fully Paid
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StatusCheck;
