import { createFileRoute, Link } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { MODULES } from '@/data/curriculum';
import { Shield, Lock, CheckCircle, Clock, Terminal, Activity, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/modules/')({
  component: ModulesList,
});

function ModulesList() {
  const { state } = useCyberOS();

  // Group modules by phase
  const phases = [
    { id: 1, title: 'Phase 1: Enterprise Foundation' },
    { id: 2, title: 'Phase 2: Security Operations' },
    { id: 3, title: 'Phase 3: Ethical Hacking' },
    { id: 4, title: 'Phase 4: Modern Infrastructure' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Shield className="mr-3 text-blue-500" />
          CyberOS Curriculum
        </h1>
        <p className="text-slate-400 mt-2 max-w-3xl">
          The GFS structural contextualization training framework. Modules must be completed sequentially to ensure prerequisite knowledge is established before advancing to more complex enterprise environments.
        </p>
      </div>

      {/* Experience Platforms */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="text-fuchsia-400" size={22} />
          <h2 className="text-xl font-bold text-white">Enterprise Experience Platforms</h2>
          <Badge variant="outline" className="text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-500/10">New</Badge>
        </div>
        <p className="text-slate-400 text-sm mb-5 max-w-3xl">
          Immersive, self-contained enterprise learning environments. Each platform delivers diagrams, labs, commands, MITRE mapping, flashcards, and assessments for a single CEH v13 domain.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <a
            href="/experience/module02.html"
            className="group relative overflow-hidden rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/40 via-slate-900/80 to-slate-900 p-6 transition-all hover:border-fuchsia-400/60 hover:shadow-[0_0_30px_rgba(217,70,239,0.25)]"
          >
            <div className="absolute right-4 top-4 text-fuchsia-300/60 group-hover:text-fuchsia-300 transition-colors">
              <ExternalLink size={18} />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80 mb-2">
              Module 02 · ShadowXLab
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Reconnaissance Experience Platform</h3>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              Passive &amp; active recon, OSINT, DNS/subdomain enumeration, cloud &amp; GitHub exposure, attack-surface digital twin, terminal simulation, and MITRE ATT&amp;CK mapping.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300 border border-slate-700">Digital Twin</span>
              <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300 border border-slate-700">Interactive Labs</span>
              <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300 border border-slate-700">MITRE Mapping</span>
              <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300 border border-slate-700">Assessment</span>
            </div>
          </a>
        </div>
      </div>

      <div className="space-y-16">
        {phases.map((phase) => {
          const phaseModules = MODULES.filter(m => m.phase === phase.id);
          const isPhaseLocked = phaseModules.every(m => state.moduleProgress[m.id]?.status === 'locked');
          
          return (
            <div key={phase.id} className="relative">
              {/* Phase Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  isPhaseLocked 
                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                    : 'bg-blue-900/50 text-blue-400 border border-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                }`}>
                  {phase.id}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isPhaseLocked ? 'text-slate-500' : 'text-white'}`}>
                    {phase.title}
                  </h2>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="absolute left-6 top-12 bottom-[-4rem] w-px bg-slate-800 -z-10" />

              {/* Modules Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-16">
                {phaseModules.map((module) => {
                  const progress = state.moduleProgress[module.id];
                  const isLocked = progress?.status === 'locked';
                  const isCompleted = progress?.status === 'completed';
                  const isInProgress = progress?.status === 'in_progress';

                  return (
                    <Card 
                      key={module.id} 
                      className={`relative overflow-hidden transition-all duration-300 ${
                        isLocked 
                          ? 'bg-slate-900/30 border-slate-800/50 opacity-60' 
                          : isInProgress
                            ? 'bg-slate-900/80 border-blue-800/50 shadow-[0_0_20px_rgba(30,58,138,0.2)]'
                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {/* Status indicator line */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500' : 'bg-slate-800'
                      }`} />

                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`
                              ${module.difficulty === 'Foundation' ? 'text-emerald-400 border-emerald-400/30' : ''}
                              ${module.difficulty === 'Intermediate' ? 'text-blue-400 border-blue-400/30' : ''}
                              ${module.difficulty === 'Advanced' ? 'text-amber-400 border-amber-400/30' : ''}
                              ${module.difficulty === 'Expert' ? 'text-red-400 border-red-400/30' : ''}
                              bg-transparent
                            `}>
                              {module.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                              {module.xpReward} XP
                            </Badge>
                          </div>
                          
                          {isLocked ? (
                            <Lock className="text-slate-600" size={20} />
                          ) : isCompleted ? (
                            <CheckCircle className="text-emerald-500" size={20} />
                          ) : isInProgress ? (
                            <Activity className="text-blue-500 animate-pulse" size={20} />
                          ) : null}
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                          {module.id}. {module.title}
                        </h3>
                        
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                          {module.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex space-x-4 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Terminal size={14} className="mr-1" />
                              {module.labSteps.length} Labs
                            </span>
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {module.estimatedHours}h
                            </span>
                          </div>
                          
                          {!isLocked && (
                            <Link
                              to="/modules/$moduleId"
                              params={{ moduleId: module.id.toString() }}
                              className={`flex items-center text-sm font-medium transition-colors ${
                                isCompleted ? 'text-emerald-400 hover:text-emerald-300' : 'text-blue-400 hover:text-blue-300'
                              }`}
                            >
                              {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                              <ArrowRight size={16} className="ml-1" />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
