import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { 
  FileText, X, Sparkles, Loader2, CheckCircle2, 
  ArrowRight, Wand2, Copy, AlertCircle
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PasteProjectStructure() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [structureText, setStructureText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const parseStructure = async (text) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key niet gevonden. Voeg VITE_OPENAI_API_KEY toe aan je .env file.');
    }

    const systemPrompt = `Je bent een expert in het analyseren van app/project structuren. 

Je krijgt een project structuur in markdown/text formaat. Je taak is om deze te analyseren en een gestructureerde JSON response terug te geven met alle relevante informatie.

De output moet deze structuur hebben:
{
  "project": {
    "name": "Project naam",
    "description": "Uitgebreide beschrijving (2-4 zinnen)",
    "app_type": ["Web"] of ["iOS", "Android"] etc,
    "product_type": "SaaS" of "Mobile App" etc,
    "tech_stack": ["Tech1", "Tech2", ...],
    "status": "Planning"
  },
  "features": [
    {
      "name": "Feature naam",
      "description": "Beschrijving van de feature",
      "category": "Core" of "Secondary"
    },
    ...
  ],
  "pages": [
    {
      "name": "Page naam",
      "description": "Wat gebeurt op deze page",
      "path": "/path/to/page"
    },
    ...
  ],
  "notes": [
    "Notitie 1: Iets dat niet direct als feature/page past maar wel belangrijk is",
    "Notitie 2: ..."
  ]
}

Analyseer de structuur en:
1. Extraheer project basisinfo (naam, type, beschrijving, tech stack)
2. Identificeer alle features (functionaliteiten die de app moet hebben)
3. Identificeer alle pages/screens (navigatie structuur, routes, views)
4. Alles wat niet direct als feature of page past, maar wel relevante informatie is, ga naar "notes"

Antwoord ALLEEN met de JSON, geen extra tekst.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyseer deze project structuur:\n\n${text}` }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to call OpenAI API');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();
    
    // Parse JSON from response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (e) {
      throw new Error('Kon de AI response niet parsen: ' + e.message);
    }
  };

  const handlePasteAndAnalyze = async () => {
    if (!structureText.trim()) {
      toast.error('Plak eerst een project structuur');
      return;
    }

    setIsProcessing(true);
    try {
      const parsed = await parseStructure(structureText);
      setParsedData(parsed);
      toast.success('Structuur succesvol geanalyseerd!');
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Fout bij analyseren: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateProject = async () => {
    if (!parsedData || !parsedData.project) {
      toast.error('Geen parsed data beschikbaar');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create the project
      const project = await base44.entities.Project.create({
        name: parsedData.project.name || 'Untitled Project',
        description: parsedData.project.description || '',
        app_type: parsedData.project.app_type || ['Web'],
        product_type: parsedData.project.product_type || 'SaaS',
        ai_builder: 'Base44',
        status: parsedData.project.status || 'Planning',
        progress: 0
      });

      toast.success('Project aangemaakt! Features en pages worden toegevoegd...');

      // 2. Create features
      if (parsedData.features && Array.isArray(parsedData.features)) {
        for (const feature of parsedData.features) {
          try {
            await base44.entities.Feature.create({
              project: project.id,
              name: feature.name || 'Unnamed Feature',
              description: feature.description || '',
              status: 'Todo',
              priority: feature.category === 'Core' ? 'High' : 'Medium'
            });
          } catch (err) {
            console.error('Error creating feature:', err);
            // Continue with next feature
          }
        }
      }

      // 3. Create pages and store their IDs
      const createdPages = [];
      if (parsedData.pages && Array.isArray(parsedData.pages)) {
        for (const page of parsedData.pages) {
          try {
            const createdPage = await base44.entities.Page.create({
              project: project.id,
              name: page.name || 'Unnamed Page',
              description: page.description || '',
              path: page.path || '/',
              status: 'Todo'
            });
            createdPages.push(createdPage);
          } catch (err) {
            console.error('Error creating page:', err);
            // Continue with next page
          }
        }
      }

      // 4. Create notes for everything that doesn't fit
      // Use the first created page, or skip if no pages were created
      if (parsedData.notes && Array.isArray(parsedData.notes) && parsedData.notes.length > 0) {
        const firstPageId = createdPages.length > 0 ? createdPages[0].id : null;
        
        // If no pages exist, we can't create notes (notes require a page_id)
        // Instead, we'll create a summary note that combines all notes
        if (firstPageId) {
          for (const noteText of parsedData.notes) {
            try {
              // Extract title (first line or first 50 chars) and content
              const lines = noteText.split('\n').filter(l => l.trim());
              const title = lines[0]?.substring(0, 50) || 'Notitie';
              const content = lines.length > 1 ? lines.slice(1).join('\n') : noteText;
              
              // Create as a Note associated with the first page
              await base44.entities.Note.create({
                page: firstPageId,
                title: title,
                content: content,
                color: 'blue'
              });
            } catch (err) {
              console.error('Error creating note:', err);
              // If Note creation fails, just log it - don't break the flow
            }
          }
        } else {
          // If no pages, we could append to project description or create a special page
          console.log('Cannot create notes: No pages were created. Notes:', parsedData.notes);
          // Optionally, append notes to project description or create a notes page first
        }
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['features'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });

      toast.success(`Project "${project.name}" succesvol aangemaakt met ${parsedData.features?.length || 0} features en ${parsedData.pages?.length || 0} pages!`);
      
      // Navigate to the new project
      setTimeout(() => {
        navigate(createPageUrl('Projects'));
      }, 1500);

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Fout bij aanmaken project: ' + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Plak Project Structuur</h1>
            <p className="text-sm text-slate-500">Kopieer en plak een volledige project structuur om automatisch een project aan te maken</p>
          </div>
        </div>
        <button
          onClick={() => navigate(createPageUrl('Home'))}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">Hoe werkt het?</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Kopieer een volledige project structuur (bijv. markdown document met features, pages, tech stack, etc.)</li>
                  <li>Plak het in het tekstveld hieronder</li>
                  <li>Klik op "Analyseer Structuur" - AI analyseert de structuur</li>
                  <li>Controleer de preview van wat er wordt aangemaakt</li>
                  <li>Klik op "Project Aanmaken" om alles automatisch aan te maken</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  <strong>Tip:</strong> Informatie die niet direct als feature of page past, wordt automatisch naar notities verplaatst waar je het handmatig kunt bewerken.
                </p>
              </div>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Plak je project structuur hier</span>
              </div>
              <button
                onClick={() => setStructureText('')}
                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              >
                Wissen
              </button>
            </div>
            <textarea
              value={structureText}
              onChange={(e) => setStructureText(e.target.value)}
              placeholder={`# PROJECT OVERVIEW
Name: Flow Pro
Type: Web Application
Purpose: All-in-one media production platform...

## TECH STACK
Frontend: React + TypeScript
Backend: Supabase
...

## FEATURES
- Feature 1
- Feature 2
...

Plak hier je volledige project structuur...`}
              className="w-full h-[400px] p-4 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none"
            />
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePasteAndAnalyze}
              disabled={!structureText.trim() || isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              {isProcessing && parsedData === null ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyseren...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyseer Structuur
                </>
              )}
            </button>
          </div>

          {/* Preview Parsed Data */}
          {parsedData && (
            <div className="space-y-4">
              {/* Project Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Project Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Naam:</span>
                    <p className="text-base font-semibold text-slate-900">{parsedData.project?.name || 'Geen naam'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Beschrijving:</span>
                    <p className="text-sm text-slate-700 mt-1">{parsedData.project?.description || 'Geen beschrijving'}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Type:</span>
                      <p className="text-sm text-slate-900">{parsedData.project?.product_type || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Platforms:</span>
                      <p className="text-sm text-slate-900">{parsedData.project?.app_type?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  {parsedData.project?.tech_stack && parsedData.project.tech_stack.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">Tech Stack:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {parsedData.project.tech_stack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Preview */}
              {parsedData.features && parsedData.features.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Features ({parsedData.features.length})
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {parsedData.features.map((feature, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-medium text-slate-900">{feature.name}</div>
                        {feature.description && (
                          <div className="text-sm text-slate-600 mt-1">{feature.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages Preview */}
              {parsedData.pages && parsedData.pages.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Pages ({parsedData.pages.length})
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {parsedData.pages.map((page, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-medium text-slate-900">{page.name}</div>
                        {page.path && (
                          <div className="text-xs font-mono text-slate-500 mt-1">{page.path}</div>
                        )}
                        {page.description && (
                          <div className="text-sm text-slate-600 mt-1">{page.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Preview */}
              {parsedData.notes && parsedData.notes.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Notities ({parsedData.notes.length})
                  </h3>
                  <p className="text-sm text-amber-800 mb-3">
                    Deze informatie past niet direct als feature of page, maar wordt opgeslagen als notities voor handmatige bewerking:
                  </p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {parsedData.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 text-sm text-slate-700">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Project Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCreateProject}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg text-lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Project aanmaken...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Project Aanmaken
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">
                ⚠️ Voeg VITE_OPENAI_API_KEY toe aan je environment variables om deze feature te gebruiken
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

