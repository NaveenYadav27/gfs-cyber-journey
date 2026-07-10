import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { getModuleById } from '@/data/curriculum';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Terminal, FileText, CheckCircle, Lock, Play, HelpCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/modules/$moduleId')({
  component: ModuleDetail,
});

function ModuleDetail() {
  const { moduleId } = Route.useParams();
  const id = parseInt(moduleId, 10);
  const module = getModuleById(id);
  const { state, dispatch } = useCyberOS();
  const navigate = useNavigate();
  
  const progress = state.moduleProgress[id];
  const [activeTab, setActiveTab] = useState<'overview' | 'lab' | 'quiz'>('overview');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [labInput, setLabInput] = useState('');
  const [labOutput, setLabOutput] = useState<{ type: 'command' | 'output' | 'error' | 'success'; text: string }[]>([]);

  useEffect(() => {
    if (!module || progress?.status === 'locked') {
      navigate({ to: '/modules' });
    }
  }, [module, progress, navigate]);

  if (!module || progress?.status === 'locked') return null;

  const handleStartModule = () => {
    if (progress.status === 'available') {
      dispatch({ type: 'START_MODULE', moduleId: id });
    }
    setActiveTab('lab');
  };

  const handleQuizSubmit = () => {
    let score = 0;
    module.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) score += 1;
    });
    const percentage = Math.round((score / module.quiz.length) * 100);
    const passed = percentage >= 80;
    
    dispatch({ type: 'SET_QUIZ_SCORE', moduleId: id, score: percentage, passed });
    setQuizSubmitted(true);
  };

  const handleLabCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labInput.trim()) return;

    const currentStep = module.labSteps.find(s => !progress.labFlag || progress.labFlag !== module.flagHash);
    
    setLabOutput(prev => [...prev, { type: 'command', text: labInput }]);

    // Very basic command simulation
    if (labInput === module.flagHash) {
      setLabOutput(prev => [...prev, { type: 'success', text: 'FLAG ACCEPTED. Lab objective complete.' }]);
      dispatch({ type: 'COMPLETE_LAB', moduleId: id, flag: labInput });
    } else if (currentStep?.command && labInput === currentStep.command) {
      setLabOutput(prev => [...prev, { type: 'output', text: currentStep.expectedOutput || 'Command executed successfully.' }]);
    } else if (labInput.toLowerCase() === 'help') {
      setLabOutput(prev => [...prev, { type: 'output', text: 'Available commands: clear, help. To submit flag, just enter the flag string.' }]);
    } else if (labInput.toLowerCase() === 'clear') {
      setLabOutput([]);
    } else {
      setLabOutput(prev => [...prev, { type: 'error', text: `Command '${labInput}' not found or invalid in this context.` }]);
    }
    
    setLabInput('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/modules" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase">
                Module {module.id} • {module.phaseLabel}
              </div>
              <h1 className="text-xl font-bold text-white">{module.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-slate-800 border-slate-700">
              {progress.status === 'completed' ? 'Completed' : progress.status === 'in_progress' ? 'In Progress' : 'Available'}
            </Badge>
            {progress.status === 'completed' && <CheckCircle className="text-emerald-500" size={20} />}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        
        {/* Left Nav Tabs */}
        <div className="w-full md:w-64 shrink-0 border-r border-slate-800 bg-[#0f0f13] flex flex-row md:flex-col p-4 gap-2 overflow-x-auto md:overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <FileText size={18} className="mr-3" />
            Briefing
          </button>
          
          <button
            onClick={() => setActiveTab('lab')}
            disabled={progress.status === 'available'}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              progress.status === 'available' ? 'opacity-50 cursor-not-allowed text-slate-500' :
              activeTab === 'lab' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Terminal size={18} className="mr-3" />
            Cyber Range Lab
            {progress.labCompleted && <CheckCircle size={14} className="ml-auto text-emerald-500" />}
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            disabled={progress.status === 'available' || (!progress.labCompleted && progress.status !== 'completed')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              (progress.status === 'available' || (!progress.labCompleted && progress.status !== 'completed')) ? 'opacity-50 cursor-not-allowed text-slate-500' :
              activeTab === 'quiz' ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <HelpCircle size={18} className="mr-3" />
            Knowledge Check
            {progress.quizScore !== null && <span className="ml-auto text-xs font-bold text-amber-500">{progress.quizScore}%</span>}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0c]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
                <div className="prose prose-invert max-w-none text-slate-300">
                  <p>{module.description}</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <AlertTriangle className="mr-2 text-amber-500" size={20} />
                  Business Context
                </h3>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-5 text-amber-200/80 text-sm leading-relaxed">
                  {module.businessContext}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start bg-slate-900/50 border border-slate-800 rounded-md p-3">
                      <ShieldCheck className="text-blue-500 shrink-0 mr-3 mt-0.5" size={16} />
                      <span className="text-sm text-slate-300">{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {progress.status === 'available' && (
                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <Button onClick={handleStartModule} size="lg" className="bg-blue-600 hover:bg-blue-500 text-white">
                    <Play size={18} className="mr-2" />
                    Deploy Cyber Range
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* LAB TAB */}
          {activeTab === 'lab' && (
            <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Terminal className="mr-2 text-emerald-500" />
                  Authorized Cyber Range
                </h2>
                {progress.labCompleted && <Badge variant="outline" className="bg-emerald-900/30 text-emerald-400 border-emerald-800">Lab Completed</Badge>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Lab Instructions */}
                <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-6">
                  {module.labSteps.map((step, idx) => (
                    <Card key={idx} className="bg-slate-900/80 border-slate-700 shadow-xl">
                      <CardHeader className="py-4">
                        <CardTitle className="text-sm font-semibold flex items-center text-slate-200">
                          <span className="bg-blue-900 text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-blue-700">
                            {step.stepNumber}
                          </span>
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 pb-4 text-sm text-slate-400">
                        {step.instruction}
                        {step.hint && (
                          <div className="mt-4 p-3 bg-slate-950 rounded-md border border-slate-800 text-xs text-amber-500/80">
                            <strong>Hint:</strong> {step.hint}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Cheat Sheet */}
                  {module.cheatSheet.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Reference Materials</h4>
                      <div className="space-y-4">
                        {module.cheatSheet.map((sheet, i) => (
                          <div key={i} className="border border-slate-800 rounded-md overflow-hidden">
                            <div className="bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 border-b border-slate-800">
                              {sheet.category}
                            </div>
                            <div className="bg-[#0f0f13] divide-y divide-slate-800/50">
                              {sheet.commands.map((cmd, j) => (
                                <div key={j} className="p-2 text-xs">
                                  <code className="text-blue-400 font-mono mb-1 block select-all">{cmd.cmd}</code>
                                  <div className="text-slate-500">{cmd.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Terminal Simulator */}
                <div className="lg:col-span-2 flex flex-col bg-[#050505] rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative">
                  <div className="h-8 bg-slate-900 flex items-center px-4 shrink-0 border-b border-slate-800">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="mx-auto text-xs text-slate-500 font-mono">root@gfs-cyber-range:~</div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                    <div className="text-emerald-500 mb-4">
                      GFS Enterprise CyberOS Interactive Range [Version 5.0.22]<br/>
                      (c) 2026 Global Financial Services. All rights reserved.<br/><br/>
                      WARNING: You are accessing an authorized GFS target environment.<br/>
                      All activity is monitored and logged. Type 'help' for available commands.
                    </div>
                    
                    {labOutput.map((out, i) => (
                      <div key={i} className="mb-2">
                        {out.type === 'command' && (
                          <div className="flex text-slate-300">
                            <span className="text-emerald-500 mr-2">root@gfs-cyber-range:~#</span>
                            {out.text}
                          </div>
                        )}
                        {out.type === 'output' && <div className="text-slate-400 whitespace-pre-wrap ml-2 mt-1">{out.text}</div>}
                        {out.type === 'error' && <div className="text-red-400 ml-2 mt-1">{out.text}</div>}
                        {out.type === 'success' && <div className="text-amber-400 font-bold ml-2 mt-1">{out.text}</div>}
                      </div>
                    ))}
                  </div>

                  {!progress.labCompleted && (
                    <div className="h-12 bg-[#0a0a0c] border-t border-slate-800 shrink-0 px-4 flex items-center font-mono">
                      <span className="text-emerald-500 mr-2">root@gfs-cyber-range:~#</span>
                      <form onSubmit={handleLabCommand} className="flex-1">
                        <input
                          type="text"
                          value={labInput}
                          onChange={(e) => setLabInput(e.target.value)}
                          className="w-full bg-transparent outline-none text-slate-300 placeholder-slate-700"
                          placeholder="Enter command or flag..."
                          autoFocus
                          autoComplete="off"
                          spellCheck="false"
                        />
                      </form>
                    </div>
                  )}
                  {progress.labCompleted && (
                    <div className="h-12 bg-emerald-950/30 border-t border-emerald-900 shrink-0 px-4 flex items-center justify-center font-mono text-emerald-500 font-bold">
                      LAB OBJECTIVES COMPLETED. PROCEED TO KNOWLEDGE CHECK.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Knowledge Check</h2>
                <p className="text-slate-400">Validate your understanding of {module.title}. Requires 80% to pass.</p>
              </div>

              {progress.quizScore !== null && quizSubmitted && (
                <div className={`p-6 rounded-xl border text-center ${
                  progress.quizScore >= 80 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'
                }`}>
                  <div className={`text-4xl font-bold mb-2 ${progress.quizScore >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {progress.quizScore}%
                  </div>
                  <div className="text-sm text-slate-300">
                    {progress.quizScore >= 80 ? 'Passed. Excellent work, analyst.' : 'Failed. Review the material and try again.'}
                  </div>
                </div>
              )}

              <div className="space-y-10">
                {module.quiz.map((q, qIndex) => {
                  const isCorrect = quizSubmitted && quizAnswers[q.id] === q.correctIndex;
                  const isWrong = quizSubmitted && quizAnswers[q.id] !== q.correctIndex;

                  return (
                    <div key={q.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium text-slate-200">
                          <span className="text-slate-500 mr-2">{qIndex + 1}.</span>
                          {q.question}
                        </h4>
                        <Badge variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 shrink-0 ml-4">
                          {q.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-3 mt-6">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = quizAnswers[q.id] === oIndex;
                          const showCorrect = quizSubmitted && oIndex === q.correctIndex;
                          const showError = quizSubmitted && isSelected && oIndex !== q.correctIndex;

                          return (
                            <button
                              key={oIndex}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIndex }))}
                              className={`w-full text-left p-4 rounded-lg border transition-all ${
                                showCorrect ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100' :
                                showError ? 'bg-red-900/20 border-red-500/50 text-red-100' :
                                isSelected ? 'bg-blue-900/40 border-blue-500/50 text-white' :
                                'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex">
                                <span className="font-mono text-slate-500 mr-4 mt-0.5">{String.fromCharCode(65 + oIndex)}.</span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`mt-6 p-4 rounded-lg border ${
                          isCorrect ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200' : 'bg-red-950/20 border-red-900/30 text-red-200'
                        }`}>
                          <p className="text-sm leading-relaxed"><strong className="mr-2">Explanation:</strong> {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={handleQuizSubmit} 
                    disabled={Object.keys(quizAnswers).length < module.quiz.length}
                    size="lg" 
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Submit Evaluation
                  </Button>
                </div>
              )}
              {quizSubmitted && progress.quizScore !== null && progress.quizScore < 80 && (
                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} 
                    size="lg" 
                    className="bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    Retake Knowledge Check
                  </Button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
