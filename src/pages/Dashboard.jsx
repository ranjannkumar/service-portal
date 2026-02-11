import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, Check, X } from 'lucide-react';
import { api } from '../services/api';
import "../components/DashboardTable.css";

const Dashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newApplicant, setNewApplicant] = useState({ name: '', service: 'B.Ed Registration' });
  const [customService, setCustomService] = useState('');
  
  // Document Management State
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadApplicants = async () => {
    try {
      const data = await api.getAllApplicants();
      setApplicants(data);
    } catch (error) {
      console.error("Error loading applicants:", error);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.updateApplicant(id, { status: newStatus });
    loadApplicants();
  };

  const handlePaymentToggle = async (id, currentStatus) => {
    await api.updateApplicant(id, { paid: !currentStatus });
    loadApplicants();
  };

  const handleAddApplicant = async (e) => {
    e.preventDefault();
    if (!newApplicant.name) return;
    
    // Use custom service name if 'Other' is selected
    const finalService = newApplicant.service === 'Other' ? customService : newApplicant.service;
    
    if (!finalService) {
      alert("Please enter a service name");
      return;
    }

    await api.addApplicant({
      name: newApplicant.name,
      service_type: finalService
    });
    
    setIsAdding(false);
    setNewApplicant({ name: '', service: 'B.Ed Registration' });
    setCustomService('');
    loadApplicants();
  };

  // --- Document Functions ---
  const openDocumentModal = async (applicant) => {
    setSelectedApplicant(applicant);
    setIsDocModalOpen(true);
    try {
      const docs = await api.getDocuments(applicant.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to load documents");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedApplicant) return;

    setUploading(true);
    try {
      // Default doc type to file name or generic 'Document'
      const docType = 'Document'; 
      await api.uploadDocument(selectedApplicant.id, file, docType);
      
      // Refresh list
      const docs = await api.getDocuments(selectedApplicant.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.deleteDocument(doc.id, doc.file_path);
      // Refresh list
      const docs = await api.getDocuments(selectedApplicant.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Delete failed: " + error.message);
    }
  };

  const handleViewDocument = async (filePath) => {
    try {
      const url = await api.getDocumentUrl(filePath);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error getting document URL:", error);
      alert("Failed to open document");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={18} />
          New Applicant
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddApplicant} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Applicant Name</label>
              <input 
                type="text" 
                value={newApplicant.name} 
                onChange={(e) => setNewApplicant({...newApplicant, name: e.target.value})}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Service Type</label>
              <select 
                value={newApplicant.service} 
                onChange={(e) => setNewApplicant({...newApplicant, service: e.target.value})}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              >
                <option>B.Ed Registration</option>
                <option>SSC Form</option>
                <option>UPSC / BPSC</option>
                <option>Pan Card</option>
                <option>General Printing</option>
                <option value="Other">Other (Custom)</option>
              </select>
              
              {newApplicant.service === 'Other' && (
                <input 
                  type="text" 
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  placeholder="Enter custom service name"
                  style={{ 
                    marginTop: '0.5rem', 
                    width: '100%', 
                    padding: '0.6rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--color-primary)',
                    background: '#f8fafc'
                  }}
                  autoFocus
                />
              )}
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      )}

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Name</th>
              <th>Service</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(app => (
              <tr key={app.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{app.application_id}</td>
                <td style={{ fontWeight: '500' }}>{app.name}</td>
                <td>{app.service_type}</td>
                <td>
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={{ 
                      padding: '0.2rem', 
                      borderRadius: '4px', 
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <div className="payment-toggle" onClick={() => handlePaymentToggle(app.id, app.paid)}>
                    <div className={`toggle-switch ${app.paid ? 'active' : ''}`}>
                      <div className="toggle-thumb"></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: app.paid ? '#10b981' : '#64748b' }}>
                      {app.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </td>
                <td>
                  <button 
                    className="btn-icon"
                    onClick={() => openDocumentModal(app)}
                    title="Manage Documents"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No applicants found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Document Modal */}
      {isDocModalOpen && selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Documents: {selectedApplicant.name}</h3>
              <button onClick={() => setIsDocModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {/* Upload Section */}
              <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <input 
                  type="file" 
                  id="file-upload" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="btn btn-primary" style={{ display: 'inline-flex', cursor: uploading ? 'wait' : 'pointer' }}>
                  {uploading ? 'Uploading...' : <><Upload size={16} style={{ marginRight: '8px' }} /> Upload New Document</>}
                </label>
              </div>

              {/* Document List */}
              {documents.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No documents uploaded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {documents.map(doc => (
                    <div key={doc.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.75rem', 
                      background: 'var(--color-background)', 
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={20} color="var(--color-text-muted)" />
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{doc.metadata?.original_name || 'Document'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleViewDocument(doc.file_path)}
                          className="btn-icon"
                          title="View"
                          style={{ padding: '4px', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                        >
                          <span style={{ fontSize: '0.8rem', marginRight: '4px' }}>View</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc)}
                          className="btn-icon"
                          style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
