// Compatibility layer for base44 API
// This allows existing code to work without changes
import * as entities from './entities';
import * as integrations from './integrations';

// Re-export entities as base44.entities
export const base44 = {
  entities: {
    Project: entities.Project,
    Feature: entities.Feature,
    Page: entities.Page,
    Todo: entities.Todo,
    DesignSystem: entities.DesignSystem,
    Sprint: entities.Sprint,
    Flow: entities.Flow,
    ProjectTodo: entities.ProjectTodo,
    TestCase: entities.TestCase,
    Note: entities.Note,
    API: entities.API,
    KnowledgeBase: entities.KnowledgeBase,
    Version: entities.Version,
    CreditLog: entities.CreditLog,
  },
  auth: {
    me: () => entities.User.me(),
    signIn: (email, password) => entities.User.signIn(email, password),
    signUp: (email, password) => entities.User.signUp(email, password),
    signOut: () => entities.User.signOut(),
    getSession: () => entities.User.getSession(),
  },
  integrations: {
    Core: integrations.Core,
  }
};

// Also export as default for backward compatibility
export default base44;

