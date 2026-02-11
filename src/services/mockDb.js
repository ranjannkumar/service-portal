const DB_KEY = 'patna_service_db';

const seedData = [
  { id: 'APP001', name: 'Rohan Kumar', service: 'SSC Form', status: 'Submitted', paid: true, date: '2024-02-10T10:00:00Z', documents: [] },
  { id: 'APP002', name: 'Priya Singh', service: 'B.Ed Registration', status: 'Pending', paid: false, date: '2024-02-11T14:30:00Z', documents: [] },
  { id: '12345', name: 'Demo User', service: 'Pan Card', status: 'Rejected', paid: true, date: '2024-02-12T09:15:00Z', documents: [] },
];

export const mockDb = {
  getAll: () => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(data);
  },
  
  getById: (id) => {
    const list = mockDb.getAll();
    return list.find(item => item.id === id);
  },
  
  add: (applicant) => {
    const list = mockDb.getAll();
    const newApplicant = { 
      ...applicant, 
      id: applicant.id || `APP${Date.now().toString().slice(-4)}`, 
      status: 'Pending', 
      paid: false, 
      date: new Date().toISOString(),
      documents: []
    };
    list.push(newApplicant);
    localStorage.setItem(DB_KEY, JSON.stringify(list));
    return newApplicant;
  },

  update: (id, updates) => {
    const list = mockDb.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(DB_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  }
};
