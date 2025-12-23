import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { 
  Bot, Send, Sparkles, X, Loader2, CheckCircle2, 
  ArrowRight, Wand2, MessageSquare, FileText
} from 'lucide-react';

export default function AIProjectGenerator() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initial AI message
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "👋 Hallo! Ik ben je AI project assistent. Beschrijf je app idee in een paar zinnen en ik zal een compleet project voor je aanmaken met naam, beschrijving, tech stack en features.\n\nBijvoorbeeld: 'Ik wil een app maken voor het delen van recepten met gebruikers, waar mensen foto\'s kunnen uploaden en recepten kunnen delen.'"
      }]);
    }
  }, []);

  const callAI = async (userMessage) => {
    // Check if OpenAI API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key niet gevonden. Voeg VITE_OPENAI_API_KEY toe aan je .env file.');
    }

    const systemPrompt = `Je bent een ervaren software architect en product manager. Je helpt gebruikers om hun app ideeën om te zetten naar concrete project specificaties.

Wanneer een gebruiker een app idee beschrijft, analyseer je dit en geef je een gestructureerde response terug in JSON formaat met de volgende structuur:

{
  "name": "Project naam (max 50 karakters, descriptief)",
  "description": "Uitgebreide beschrijving van het project (2-4 zinnen)",
  "app_type": "web" of "mobile" of "desktop",
  "product_type": "SaaS" of "Mobile App" of "Web App" etc,
  "platforms": ["Web"] of ["iOS", "Android"] etc,
  "ai_builder": "Base44",
  "status": "Planning",
  "features": ["Feature 1", "Feature 2", "Feature 3", ...],
  "tech_stack": ["Tech 1", "Tech 2", ...]
}

Zorg ervoor dat:
- De naam kort en krachtig is
- De beschrijving duidelijk uitlegt wat de app doet
- app_type en platforms logisch zijn gebaseerd op het idee
- Je minstens 3-5 relevante features genereert
- Je een realistische tech stack voorstelt

Antwoord ALLEEN met de JSON, geen extra tekst eromheen.`;

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
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to call OpenAI API');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();
    
    // Try to parse JSON from response
    try {
      // Remove markdown code blocks if present
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (e) {
      // If parsing fails, return the raw response
      return { raw_response: aiResponse };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call AI
      const aiResponse = await callAI(userMessage);
      
      if (aiResponse.raw_response) {
        // AI returned raw text instead of JSON
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: aiResponse.raw_response 
        }]);
      } else {
        // AI returned structured project data
        setProjectData(aiResponse);
        
        // Format the response for display
        const formattedResponse = `Ik heb je project geanalyseerd! Hier is wat ik heb bedacht:\n\n**${aiResponse.name}**\n\n${aiResponse.description}\n\n**Features:**\n${aiResponse.features?.map(f => `• ${f}`).join('\n') || 'Geen features gespecificeerd'}\n\n**Tech Stack:**\n${aiResponse.tech_stack?.map(t => `• ${t}`).join('\n') || 'Geen tech stack gespecificeerd'}\n\nWil je dat ik dit project nu voor je aanmaak?`;
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: formattedResponse,
          projectData: aiResponse
        }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Fout: ${error.message}\n\nProbeer het opnieuw of controleer je API key instellingen.`
      }]);
      toast.error('AI fout: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectDataToCreate) => {
    if (!projectDataToCreate || isCreatingProject) return;

    setIsCreatingProject(true);

    try {
      // Create project
      const project = await base44.entities.Project.create({
        name: projectDataToCreate.name || 'Untitled Project',
        description: projectDataToCreate.description || '',
        app_type: projectDataToCreate.platforms || ['Web'],
        product_type: projectDataToCreate.product_type || 'SaaS',
        ai_builder: projectDataToCreate.ai_builder || 'Base44',
        status: 'Planning',
        progress: 0
      });

      toast.success('Project succesvol aangemaakt!');
      
      // Navigate to project detail or projects list
      setTimeout(() => {
        navigate(createPageUrl('Projects'));
      }, 1000);

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Fout bij aanmaken project: ' + error.message);
      setIsCreatingProject(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleIdeas = [
    "Een app voor het delen van recepten met foto's",
    "Een project management tool voor kleine teams",
    "Een fitness tracking app met persoonlijke coach",
    "Een marktplaats voor tweedehands spullen"
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Project Generator</h1>
            <p className="text-sm text-slate-500">Beschrijf je idee en ik maak een project voor je</p>
          </div>
        </div>
        <button
          onClick={() => navigate(createPageUrl('Home'))}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            const hasProjectData = message.projectData && !isUser;
            
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="prose prose-sm max-w-none">
                        {message.content.split('**').map((part, i) => {
                          if (i % 2 === 1) {
                            return <strong key={i}>{part}</strong>;
                          }
                          return part.split('\n').map((line, j) => (
                            <React.Fragment key={j}>
                              {line}
                              {j < part.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ));
                        })}
                      </div>
                      
                      {hasProjectData && (
                        <button
                          onClick={() => handleCreateProject(message.projectData)}
                          disabled={isCreatingProject}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {isCreatingProject ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Project aanmaken...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Project aanmaken
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-slate-600">AI denkt na...</span>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="mt-8 space-y-2">
              <p className="text-sm font-medium text-slate-600 mb-3">Of probeer een voorbeeld:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(idea);
                      inputRef.current?.focus();
                    }}
                    className="text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm text-slate-700"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2 text-purple-600" />
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Beschrijf je app idee hier... (bijv. 'Een app voor het delen van recepten met foto's en ratings')"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[60px] max-h-[120px]"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              Verstuur
            </button>
          </div>
          
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              ⚠️ Voeg VITE_OPENAI_API_KEY toe aan je .env file om de AI te gebruiken
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

