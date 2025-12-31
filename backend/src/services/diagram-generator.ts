import {
  ProjectSummary,
  ResearchResult,
  InputEnrichment,
} from '../../../shared/types/project';

/**
 * Diagram Generator Service (v0.7)
 * Generates Mermaid.js diagrams: C4 Context, C4 Container, ER Diagram, Sequence Diagrams
 */
export class DiagramGenerator {
  /**
   * Generate C4 Context Diagram
   */
  generateC4Context(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment
  ): string {
    const persona = enrichment?.personas?.[0] || { name: 'User', role: 'End User' };

    return `C4Context
  title System Context for ${parsedData.projectName}

  Person(user, "${persona.name}", "${persona.role}")
  System(app, "${parsedData.projectName}", "${parsedData.description}")
  System_Ext(email, "Email Service", "Sends notifications")
  ${researchResult.requiredFeatures.some(f => f.name.toLowerCase().includes('payment')) ? 'System_Ext(payment, "Payment Gateway", "Processes payments")' : ''}
  ${researchResult.requiredFeatures.some(f => f.name.toLowerCase().includes('storage') || f.name.toLowerCase().includes('file')) ? 'System_Ext(storage, "File Storage", "Stores user files")' : ''}

  Rel(user, app, "Uses", "HTTPS")
  Rel(app, email, "Sends emails via", "SMTP/API")
  ${researchResult.requiredFeatures.some(f => f.name.toLowerCase().includes('payment')) ? 'Rel(app, payment, "Processes payments", "HTTPS")' : ''}
  ${researchResult.requiredFeatures.some(f => f.name.toLowerCase().includes('storage')) ? 'Rel(app, storage, "Stores files", "S3 API")' : ''}`;
  }

  /**
   * Generate C4 Container Diagram
   */
  generateC4Container(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    enrichment?: InputEnrichment
  ): string {
    const hasRealtime = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('real-time') || f.name.toLowerCase().includes('websocket')
    );
    const hasAuth = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') || f.name.toLowerCase().includes('login')
    );

    return `C4Container
  title Container Diagram for ${parsedData.projectName}

  Person(user, "User", "Application user")

  System_Boundary(app, "${parsedData.projectName}") {
    Container(web, "Web Application", "${researchResult.recommendedTechStack.frontend?.framework || 'React'}", "Delivers UI to user's browser")
    Container(api, "API Application", "${researchResult.recommendedTechStack.backend?.framework || 'Express'}", "Provides REST API")
    ${hasRealtime ? 'Container(ws, "WebSocket Server", "Socket.io/WS", "Real-time communication")' : ''}
    ${hasAuth ? 'Container(auth, "Auth Service", "JWT/OAuth", "Handles authentication")' : ''}
    ContainerDb(db, "Database", "${researchResult.recommendedTechStack.database?.type || 'PostgreSQL'}", "Stores application data")
    ${hasRealtime ? 'ContainerDb(cache, "Cache", "Redis", "Session & real-time state")' : ''}
  }

  Rel(user, web, "Visits", "HTTPS")
  Rel(web, api, "Makes API calls", "JSON/HTTPS")
  ${hasRealtime ? 'Rel(web, ws, "Connects to", "WebSocket")' : ''}
  ${hasAuth ? 'Rel(web, auth, "Authenticates", "JWT")' : ''}
  Rel(api, db, "Reads/writes", "SQL/ORM")
  ${hasRealtime ? 'Rel(ws, cache, "Reads/writes", "Redis protocol")' : ''}
  ${hasAuth ? 'Rel(auth, db, "Validates credentials", "SQL")' : ''}`;
  }

  /**
   * Generate ER Diagram (Entity-Relationship)
   */
  generateERDiagram(
    parsedData: ProjectSummary,
    researchResult: ResearchResult
  ): string {
    // Infer entities from features
    const entities: string[] = [];
    const relationships: string[] = [];

    // Always have User if authentication exists
    const hasAuth = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') || f.name.toLowerCase().includes('user')
    );
    if (hasAuth) {
      entities.push('User { string id PK; string email; string passwordHash; datetime createdAt }');
    }

    // Check for common entities
    const featureText = parsedData.features?.join(' ').toLowerCase() || '';

    if (featureText.includes('task') || featureText.includes('todo')) {
      entities.push('Task { string id PK; string userId FK; string title; string description; string status; datetime dueDate }');
      if (hasAuth) relationships.push('User ||--o{ Task : creates');
    }

    if (featureText.includes('project')) {
      entities.push('Project { string id PK; string userId FK; string name; string description; datetime createdAt }');
      if (hasAuth) relationships.push('User ||--o{ Project : owns');
    }

    if (featureText.includes('comment')) {
      entities.push('Comment { string id PK; string userId FK; string itemId FK; string content; datetime createdAt }');
      if (hasAuth) relationships.push('User ||--o{ Comment : writes');
    }

    if (featureText.includes('product') || featureText.includes('item')) {
      entities.push('Product { string id PK; string name; string description; decimal price; integer stock }');
    }

    if (featureText.includes('order') || featureText.includes('cart')) {
      entities.push('Order { string id PK; string userId FK; decimal total; string status; datetime createdAt }');
      if (hasAuth) relationships.push('User ||--o{ Order : places');
    }

    // Fallback if no entities detected
    if (entities.length === 0) {
      entities.push('User { string id PK; string email; datetime createdAt }');
      entities.push('Item { string id PK; string userId FK; string name; string data; datetime createdAt }');
      relationships.push('User ||--o{ Item : owns');
    }

    return `erDiagram
${entities.map(e => `  ${e}`).join('\n')}
${relationships.map(r => `  ${r}`).join('\n')}`;
  }

  /**
   * Generate Sequence Diagrams for key flows
   */
  generateSequenceDiagrams(
    parsedData: ProjectSummary,
    researchResult: ResearchResult
  ): string[] {
    const diagrams: string[] = [];

    // Authentication flow
    const hasAuth = researchResult.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('auth') || f.name.toLowerCase().includes('login')
    );
    if (hasAuth) {
      diagrams.push(`sequenceDiagram
  participant U as User
  participant F as Frontend
  participant A as API
  participant D as Database

  U->>F: Enter credentials
  F->>A: POST /auth/login
  A->>D: Query user by email
  D-->>A: User data
  A->>A: Verify password hash
  A-->>F: JWT token
  F->>F: Store token in localStorage
  F-->>U: Redirect to dashboard`);
    }

    // CRUD operation flow
    diagrams.push(`sequenceDiagram
  participant U as User
  participant F as Frontend
  participant A as API
  participant D as Database

  U->>F: Click "Create New"
  F->>F: Show form
  U->>F: Submit form
  F->>A: POST /items (with JWT)
  A->>A: Verify JWT
  A->>D: INSERT INTO items
  D-->>A: New item ID
  A-->>F: 201 Created (item data)
  F->>F: Update UI
  F-->>U: Show success message`);

    return diagrams;
  }
}
