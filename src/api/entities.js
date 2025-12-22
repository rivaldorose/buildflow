// Supabase-based entities API
// This replaces the base44 entities API
import { supabase } from './supabaseClient';

// Helper function to convert Supabase response to base44-like format
const formatResponse = (data) => {
  if (Array.isArray(data)) {
    return data.map(formatResponse);
  }
  return data;
};

// Helper function for filtering
const buildFilter = (filters) => {
  let query = supabase;
  if (filters && typeof filters === 'object') {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }
  return query;
};

// Project entity
export const Project = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('projects').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('projects')
      .insert({ ...data, user_id: (await supabase.auth.getUser()).data.user?.id })
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Page entity
export const Page = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('pages').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('pages')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('pages')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Feature entity
export const Feature = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('features').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('features')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('features')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Todo entity
export const Todo = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('todos').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('todos')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('todos')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// DesignSystem entity
export const DesignSystem = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('design_systems')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('design_systems').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('design_systems')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('design_systems')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('design_systems')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Sprint entity
export const Sprint = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('sprints')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('sprints').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('sprints')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('sprints')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('sprints')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Flow entity
export const Flow = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('flows').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('flows')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('flows')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('flows')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// ProjectTodo entity
export const ProjectTodo = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('project_todos')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('project_todos').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('project_todos')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('project_todos')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('project_todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// TestCase entity
export const TestCase = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('test_cases').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('test_cases')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('test_cases')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Note entity
export const Note = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('notes').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('notes')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('notes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// API entity
export const API = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('apis')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('apis').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('apis')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('apis')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('apis')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// KnowledgeBase entity
export const KnowledgeBase = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('knowledge_base').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('knowledge_base')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  update: async (id, data) => {
    const { data: result, error } = await supabase
      .from('knowledge_base')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Version entity (optional - for versioning)
export const Version = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  filter: async (filters, orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    let query = supabase.from('versions').select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    query = query.order(field, { ascending });
    const { data, error } = await query;
    
    if (error) throw error;
    return formatResponse(data);
  },
  
  create: async (data) => {
    const { data: result, error } = await supabase
      .from('versions')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return formatResponse(result);
  }
};

// CreditLog entity (optional)
export const CreditLog = {
  list: async (orderBy = '-created_date') => {
    const [field, ascending] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), false] 
      : [orderBy, true];
    
    const { data, error } = await supabase
      .from('credit_logs')
      .select('*')
      .order(field, { ascending });
    
    if (error) throw error;
    return formatResponse(data);
  }
};

// Auth entity (Supabase Auth)
export const User = {
  me: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },
  
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};
