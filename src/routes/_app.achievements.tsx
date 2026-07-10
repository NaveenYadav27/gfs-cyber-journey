import { createFileRoute } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { Award, Lock, Shield, Target, Trophy, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/achievements')({
  component: AchievementsPage,
});

function AchievementsPage() {
  const { state } = useCyberOS();

  const earnedCount = state.achievements.filter(a => a.earnedAt).length;
  const totalXP = state.totalXpEarned;
  
  const categoryIcons: Record<string, any> = {
    module: <Shield size={20} />,
    lab: <Zap size={20} />,
    soc: <Target size={20} />,
    hunt: <Target size={20} />,
    special: <Trophy size={20} />
  };

  const categoryColors: Record<string, string> = {
    module: 'text-blue-400 bg-blue-900/30 border-blue-800',
    lab: 'text-emerald-400 bg-emerald-900/30 border-emerald-800',
    soc: 'text-red-400 bg-red-900/30 border-red-800',
    hunt: 'text-orange-400 bg-orange-900/30 border-orange-800',
    special: 'text-amber-400 bg-amber-900/30 border-amber-800'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Award className="mr-3 text-amber-500" />
            Service Record
          </h1>
          <p className="text-slate-400 mt-2 max-w-3xl">
            Official GFS recognition for operational excellence and skill mastery.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="text-center bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[120px]">
            <div className="text-sm text-slate-400 mb-1">Earned</div>
            <div className="text-3xl font-bold text-white">{earnedCount}<span className="text-lg text-slate-600">/{state.achievements.length}</span></div>
          </div>
          <div className="text-center bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[120px]">
            <div className="text-sm text-slate-400 mb-1">Career XP</div>
            <div className="text-3xl font-bold text-amber-400">{totalXP.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {state.achievements.map((achievement) => {
          const isEarned = !!achievement.earnedAt;
          
          return (
            <Card 
              key={achievement.id}
              className={`relative overflow-hidden transition-all duration-500 ${
                isEarned 
                  ? 'bg-slate-900/80 border-slate-700 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:border-amber-500/50 hover:-translate-y-1' 
                  : 'bg-slate-900/30 border-slate-800/50 opacity-70 grayscale-[50%]'
              }`}
            >
              {isEarned && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent -z-10" />
              )}
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 ${
                    isEarned ? 'bg-[#050505] border border-amber-900/50 shadow-inner' : 'bg-[#050505] border border-slate-800 opacity-50'
                  }`}>
                    {isEarned ? achievement.icon : <Lock className="text-slate-600" size={24} />}
                  </div>
                  
                  <Badge variant="outline" className={`flex items-center space-x-1 ${
                    isEarned ? categoryColors[achievement.category] : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}>
                    {categoryIcons[achievement.category]}
                    <span className="capitalize ml-1">{achievement.category}</span>
                  </Badge>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${isEarned ? 'text-white' : 'text-slate-400'}`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-sm mb-6 ${isEarned ? 'text-slate-300' : 'text-slate-500'}`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                  <div className={`text-sm font-bold ${isEarned ? 'text-amber-400' : 'text-slate-600'}`}>
                    +{achievement.xpBonus} XP
                  </div>
                  {isEarned && achievement.earnedAt && (
                    <div className="text-xs text-slate-500 font-mono">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
