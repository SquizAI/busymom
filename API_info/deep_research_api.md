# Deep Research API Documentation

## Overview

The Deep Research API provides intelligent, AI-powered research capabilities for projects, companies, and people. It combines multiple data sources including Firecrawl web scraping, Apollo enrichment, Apify social media detection, and advanced AI models (OpenAI GPT-4o and Google Gemini 2.0) to provide comprehensive research results.

This API is inspired by [open-deep-research](https://github.com/nickscamara/open-deep-research) but tailored specifically for H+O Engineering's business development needs.

## Features

- **Multi-source Data Collection**: Combines web scraping, API enrichment, and AI analysis
- **Structured Data Extraction**: Uses Gemini's JSON mode for consistent data extraction
- **Google Search Grounding**: Leverages Gemini 2.0's grounding feature for real-time information
- **Specialized Research**: Tailored searches for BPDA projects, real estate news, golf clubs, etc.
- **Actionable Recommendations**: AI-generated next steps for business development
- **Confidence Scoring**: Each research result includes a confidence score (0-1)

## API Endpoints

### 1. Conduct Deep Research

**POST** `/api/research/conduct`

Performs comprehensive research on a single subject.

#### Request Body

```json
{
  "type": "project" | "company" | "person",
  "subject": "string",
  "context": "optional context string",
  "depth": "quick" | "standard" | "deep",
  "includeCompetitors": false,
  "includeFinancials": false,
  "includeNews": true,
  "includeSocialMedia": true
}
```

#### Parameters

- **type** (required): The type of research subject
  - `project`: Real estate development projects
  - `company`: Companies and developers
  - `person`: Individual contacts and decision makers

- **subject** (required): The name or identifier of the research subject

- **context** (optional): Additional context to guide the research

- **depth** (optional, default: "standard"): Research depth
  - `quick`: Basic search, 5-10 sources
  - `standard`: Moderate search, 10-15 sources
  - `deep`: Comprehensive search, 20+ sources

- **includeCompetitors** (optional, default: false): Include competitor analysis

- **includeFinancials** (optional, default: false): Include financial information

- **includeNews** (optional, default: true): Include recent news articles

- **includeSocialMedia** (optional, default: true): Include social media profiles

#### Response

```json
{
  "success": true,
  "researchId": "uuid",
  "result": {
    "summary": "Executive summary of findings",
    "keyFindings": [
      "Key finding 1",
      "Key finding 2"
    ],
    "sources": [
      {
        "url": "https://example.com",
        "title": "Source Title",
        "snippet": "Relevant excerpt",
        "relevance": 0.85
      }
    ],
    "structuredData": {
      // Varies by type - see schemas below
    },
    "recommendations": [
      "Schedule meeting with key decision maker",
      "Prepare proposal highlighting relevant experience"
    ],
    "confidenceScore": 0.82,
    "timestamp": "2025-05-28T14:00:00Z"
  }
}
```

### 2. Get Research Status

**GET** `/api/research/status/:id`

Retrieve a stored research result by ID.

#### Response

```json
{
  "success": true,
  "research": {
    "id": "uuid",
    "type": "company",
    "subject": "Suffolk Construction",
    "summary": "...",
    "keyFindings": [...],
    "structuredData": {...},
    "recommendations": [...],
    "sources": [...],
    "confidenceScore": 0.85,
    "createdAt": "2025-05-28T14:00:00Z"
  }
}
```

### 3. Get Recent Research

**GET** `/api/research/recent?type=company&limit=10`

Retrieve recent research results.

#### Query Parameters

- **type** (optional): Filter by research type
- **limit** (optional, default: 10): Number of results to return

### 4. Bulk Research

**POST** `/api/research/bulk`

Conduct research on multiple subjects at once.

#### Request Body

```json
{
  "subjects": ["Company A", "Company B", "Company C"],
  "type": "company",
  "depth": "quick"
}
```

#### Response

```json
{
  "success": true,
  "results": [
    {
      "subject": "Company A",
      "researchId": "uuid-1",
      "success": true,
      "summary": "..."
    },
    {
      "subject": "Company B",
      "researchId": "uuid-2",
      "success": true,
      "summary": "..."
    }
  ]
}
```

### 5. Search Research Results

**GET** `/api/research/search?q=boston&type=project&minConfidence=0.7`

Search through stored research results.

#### Query Parameters

- **q** (required): Search query
- **type** (optional): Filter by research type
- **minConfidence** (optional, default: 0): Minimum confidence score

## Structured Data Schemas

### Project Schema

```json
{
  "projectName": "string",
  "developer": "string",
  "location": "string",
  "projectType": "string",
  "size": "string",
  "estimatedValue": "string",
  "timeline": {
    "startDate": "string",
    "completionDate": "string"
  },
  "keyPeople": [
    {
      "name": "string",
      "role": "string"
    }
  ],
  "architect": "string",
  "contractor": "string",
  "status": "string"
}
```

### Company Schema

```json
{
  "companyName": "string",
  "industry": "string",
  "headquarters": "string",
  "founded": "string",
  "revenue": "string",
  "employees": "string",
  "keyPeople": [
    {
      "name": "string",
      "title": "string"
    }
  ],
  "recentProjects": ["string"],
  "specialties": ["string"],
  "website": "string"
}
```

### Person Schema

```json
{
  "fullName": "string",
  "currentTitle": "string",
  "currentCompany": "string",
  "location": "string",
  "education": ["string"],
  "experience": [
    {
      "company": "string",
      "title": "string",
      "duration": "string"
    }
  ],
  "skills": ["string"],
  "interests": ["string"],
  "contactInfo": {
    "email": "string",
    "phone": "string",
    "linkedin": "string"
  }
}
```

## Research Process

1. **Initial Search**: Uses Firecrawl to perform web searches based on the subject and type
2. **Data Extraction**: Uses Gemini 2.0 Flash with JSON mode to extract structured data
3. **Enrichment**: 
   - For people: Apollo API for contact info, Apify for social media
   - For companies: News articles, financial data
   - For projects: BPDA data, permit information
4. **Specialized Searches**: Based on initial findings, performs targeted searches
5. **AI Analysis**: Uses Gemini 2.0 Pro with Google Search grounding for comprehensive analysis
6. **Recommendations**: Generates actionable next steps for H+O business development

## Example Use Cases

### 1. Research a Development Project

```bash
curl -X POST http://localhost:3001/api/research/conduct \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project",
    "subject": "Boston Seaport Tower Development",
    "context": "New mixed-use development in Seaport District",
    "depth": "deep"
  }'
```

### 2. Research a Company with Competitors

```bash
curl -X POST http://localhost:3001/api/research/conduct \
  -H "Content-Type: application/json" \
  -d '{
    "type": "company",
    "subject": "Suffolk Construction",
    "includeCompetitors": true,
    "includeFinancials": true
  }'
```

### 3. Research a Person for Relationship Building

```bash
curl -X POST http://localhost:3001/api/research/conduct \
  -H "Content-Type: application/json" \
  -d '{
    "type": "person",
    "subject": "John Smith",
    "context": "CEO of ABC Development",
    "includeSocialMedia": true
  }'
```

## AI Models Used

### Gemini 2.0 Flash
- Used for: Structured data extraction from search results
- Features: JSON mode for consistent output format
- Cost: Efficient and fast for extraction tasks

### Gemini 2.0 Pro
- Used for: Comprehensive analysis and insights
- Features: Google Search grounding for real-time information
- Cost: Higher quality analysis with web grounding

### OpenAI GPT-4o (Fallback)
- Used for: Backup analysis if Gemini fails
- Features: JSON mode, high-quality reasoning
- Cost: Premium model for critical analysis

## Rate Limits and Costs

- Firecrawl: Based on your plan (typically 1000 pages/month)
- Apollo: 1000 enrichments/month on basic plan
- Apify: Usage-based pricing
- Gemini: 
  - Flash: 15 RPM, 1 million TPM, 1500 RPD
  - Pro: 2 RPM, 1500 grounded queries/day free
- OpenAI: Based on your tier

## Best Practices

1. **Start with Quick Depth**: For initial research, use "quick" depth to save API calls
2. **Use Context**: Provide context to improve research relevance
3. **Batch Similar Requests**: Use bulk endpoint for multiple similar subjects
4. **Cache Results**: Research results are stored and can be retrieved by ID
5. **Monitor Confidence Scores**: Higher scores (>0.8) indicate more reliable data

## Error Handling

The API returns standard HTTP status codes:

- **200**: Success
- **400**: Bad request (missing parameters, invalid type)
- **404**: Research not found
- **429**: Rate limit exceeded
- **500**: Internal server error

Error responses include:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
``` 