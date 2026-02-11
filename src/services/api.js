import { supabase } from '../lib/supabaseClient';

export const api = {
  // Get applicant by ID (for Status Check)
  getApplicantById: async (appId) => {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('application_id', appId)
      .single();
    
    if (error) return null;
    return data;
  },

  // Get all applicants (for Dashboard)
  getAllApplicants: async () => {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add new applicant
  addApplicant: async (applicant) => {
    const newId = `APP${Date.now().toString().slice(-4)}`;
    const { data, error } = await supabase
      .from('applicants')
      .insert([{
        ...applicant,
        application_id: newId,
        status: 'Pending',
        paid: false
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update applicant status/payment
  updateApplicant: async (id, updates) => {
    const { data, error } = await supabase
      .from('applicants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // --- Document Management ---

  // Get documents for an applicant
  getDocuments: async (applicantId) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('applicant_id', applicantId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Upload a document
  uploadDocument: async (applicantId, file, docType) => {
    // 1. Upload file to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}/${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('applicant_documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Create record in Database
    const { data, error: dbError } = await supabase
      .from('documents')
      .insert([{
        applicant_id: applicantId,
        file_path: filePath,
        document_type: docType,
        metadata: { original_name: file.name, size: file.size }
      }])
      .select()
      .single();

    if (dbError) {
      // Cleanup storage if DB insert fails
      await supabase.storage.from('applicant_documents').remove([filePath]);
      throw dbError;
    }

    return data;
  },

  // Delete a document
  deleteDocument: async (documentId, filePath) => {
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('applicant_documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // 2. Delete from Database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;

    return true;
  },

  // Get signed URL for viewing
  getDocumentUrl: async (filePath) => {
    const { data, error } = await supabase.storage
      .from('applicant_documents')
      .createSignedUrl(filePath, 3600); // Valid for 1 hour

    if (error) throw error;
    return data.signedUrl;
  }
};
