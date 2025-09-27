// Shared in-memory data store for collections
// In production, this would be replaced with a proper database

export interface Collection {
  id: number;
  title: string;
  description?: string;
  target_amount?: number;
  current_amount: number;
  currency: string;
  status: string;
  is_public: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  created_by: number;
}

// Initial collections data
export let collections: Collection[] = [
  {
    id: 1,
    title: "School Fees Contribution",
    description: "Contribution for student school fees for the academic year",
    target_amount: 5000,
    current_amount: 1250,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    created_at: "2024-01-01T00:00:00",
    created_by: 1
  },
  {
    id: 2,
    title: "Church Building Fund",
    description: "Fundraising for new church construction",
    target_amount: 10000,
    current_amount: 3500,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    created_at: "2024-01-15T00:00:00",
    created_by: 1
  },
  {
    id: 3,
    title: "Medical Emergency Fund",
    description: "Emergency medical fund for community members",
    target_amount: 2000,
    current_amount: 800,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    created_at: "2024-02-01T00:00:00",
    created_by: 1
  }
];

// Helper functions
export function getPublicCollections(): Collection[] {
  return collections.filter(c => c.is_public);
}

export function getAllCollections(): Collection[] {
  return collections;
}

export function addCollection(collection: Omit<Collection, 'id' | 'created_at' | 'created_by' | 'current_amount' | 'status'>): Collection {
  const newCollection: Collection = {
    id: collections.length + 1,
    title: collection.title,
    description: collection.description,
    target_amount: collection.target_amount,
    current_amount: 0,
    currency: collection.currency,
    status: "active",
    is_public: collection.is_public,
    start_date: collection.start_date,
    end_date: collection.end_date,
    created_at: new Date().toISOString(),
    created_by: 1 // Default admin user
  };

  collections.push(newCollection);
  return newCollection;
}

export function updateCollectionAmount(id: number, amount: number): void {
  const collection = collections.find(c => c.id === id);
  if (collection) {
    collection.current_amount += amount;
  }
}