import { createFileRoute } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { queryAIWithDelay, QUICK_PROMPTS, type AIResponse } from '@/services/LocalAIService';
import { useState, useRef, useEffect } from 'react';
import { Cpu, Send, User, Trash2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/copilot')({
  component: CopilotPage,
});

function CopilotPage() {
  const { state, dispatch } = useCyberOS();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.aiChatHistory, isTyping]);

  // Initial welcome message if history is empty
  useEffect(() => {
    if (state.aiChatHistory.length === 0) {
      dispatch({ 
        type: 'ADD_AI_MESSAGE', 
        role: 'assistant', 
        content: `Welcome to the **GFS AI Copilot**. I am your authorized, offline cybersecurity assistant. 

I can help you with:
- Explaining attack techniques (Kerberoasting, SQLi, etc.)
- Providing SPL queries for threat hunting
- Analyzing SOC alerts in your queue
- Clarifying GFS policies and architecture

How can I assist you today?` 
      });
    }
  }, [state.aiChatHistory.length, dispatch]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    // User message
    dispatch({ type: 'ADD_AI_MESSAGE', role: 'user', content: text });
    setInput('');
    setIsTyping(true);

    try {
      const response = await queryAIWithDelay(text);
      
      // Format response with references and suggested actions if available
      let fullResponse = response.content;
      
      if (response.suggestedActions && response.suggestedActions.length > 0) {
        fullResponse += '\\n\\n**Suggested Actions:**\\n' + response.suggestedActions.map(a => `- ${a}`).join('\\n');
      }
      
      if (response.references && response.references.length > 0) {
        fullResponse += '\\n\\n*References: ' + response.references.join(', ') + '*';
      }

      dispatch({ type: 'ADD_AI_MESSAGE', role: 'assistant', content: fullResponse });
    } catch (e) {
      dispatch({ type: 'ADD_AI_MESSAGE', role: 'assistant', content: 'System error. Unable to process query.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_AI_HISTORY' });
  };

  const formatMessageContent = (content: string) => {
    // Basic markdown formatting for bold, code blocks, lists
    const formatted = content
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
      .replace(/\\n/g, '<br/>')
      .replace(/\\`\\`\\`([\\s\\S]*?)\\`\\`\\`/g, '<pre class="bg-slate-950 border border-slate-800 p-3 rounded-md my-2 overflow-x-auto text-blue-400 font-mono text-xs"><code>$1</code></pre>')
      .replace(/\\`([^`]+)\\`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs">$1</code>');
      
    return { __html: formatted };
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] animate-in fade-in duration-500">
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg">
              <Cpu size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GFS AI Copilot</h1>
              <p className="text-xs text-slate-400">Offline Secure Assistant (Air-Gapped)</p>
            </div>
          </div>
          <Button 
            onClick={handleClear} 
            variant="outline" 
            size="sm"
            className="bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
          >
            <Trash2 size={16} className="mr-2" /> Clear Session
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          
          <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-3 flex items-start text-xs text-amber-500 max-w-2xl mx-auto mb-8">
            <ShieldAlert size={16} className="mr-2 shrink-0 mt-0.5" />
            <p><strong>SECURITY NOTICE:</strong> This AI model runs entirely offline within the GFS CyberOS environment. No data is transmitted externally. Authorized for use up to Highly_Confidential classification.</p>
          </div>

          {state.aiChatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-900 ml-3 text-blue-200' : 'bg-slate-800 mr-3 text-slate-300 border border-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Cpu size={16} />}
                </div>

                <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <div dangerouslySetInnerHTML={formatMessageContent(msg.content)} />
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 mr-3 flex items-center justify-center text-slate-300 border border-slate-700">
                  <Cpu size={16} />
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 rounded-tl-none flex space-x-2 items-center h-12">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 bg-[#0f0f13] border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Prompts */}
          <div className="flex overflow-x-auto space-x-2 mb-3 pb-2 scrollbar-hide">
            {QUICK_PROMPTS.slice(0, 4).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(prompt)}
                className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}
            className="flex items-center bg-[#050505] border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the GFS Copilot about security, SPL, incidents..."
              className="flex-1 bg-transparent border-none p-4 text-sm text-slate-200 focus:outline-none placeholder-slate-600"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-4 ${input.trim() && !isTyping ? 'text-blue-500 hover:text-blue-400 cursor-pointer' : 'text-slate-600 cursor-not-allowed'}`}
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] text-slate-600">
            Copilot can make mistakes. Verify critical actions before executing in production environments.
          </div>
        </div>
      </div>
    </div>
  );
}
