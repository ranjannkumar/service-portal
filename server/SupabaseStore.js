const { createClient } = require('@supabase/supabase-js');

class SupabaseStore {
    constructor(options = {}) {
        this.supabase = createClient(options.url, options.key);
    }

    async sessionExists(options) {
        const { data, error } = await this.supabase
            .from('whatsapp_sessions')
            .select('session_id')
            .eq('session_id', options.session)
            .single();
        
        return !error && !!data;
    }

    async save(options) {
        console.log('SupabaseStore: Saving session...', { session: options.session, hasData: !!options.sessionData });
        
        // whatsapp-web.js passes session data as options.session (id) and data (payload)
        const { error } = await this.supabase
            .from('whatsapp_sessions')
            .upsert({
                session_id: options.session,
                data: options.sessionData // Use 'sessionData' or check structure
            });
        
        if (error) console.error('Error saving session:', error);
        else console.log('SupabaseStore: Session saved successfully!');
    }

    async extract(options) {
        const { data, error } = await this.supabase
            .from('whatsapp_sessions')
            .select('data')
            .eq('session_id', options.session)
            .single();
        
        if (error || !data) return null;
        return data.data;
    }

    async delete(options) {
        const { error } = await this.supabase
            .from('whatsapp_sessions')
            .delete()
            .eq('session_id', options.session);
        
        if (error) console.error('Error deleting session:', error);
    }
}

module.exports = SupabaseStore;
