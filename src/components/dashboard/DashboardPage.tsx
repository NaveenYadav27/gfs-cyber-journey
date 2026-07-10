import { useCyberOS } from '@/context/CyberOSContext';
import { MODULES } from '@/data/curriculum';
import { Link } from '@tanstack/react-router';
import { ShieldAlert, BookOpen, AlertCircle, Award, Terminal, Activity, ArrowRight, Play, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  const { state, progressPercent, completedModuleCount } = useCyberOS();
  
  // Calculate stats
  const totalLabTime = Object.values(state.moduleProgress).reduce((acc, p) => acc + (p.timeSpentMinutes || 0), 0);
  const nextModule = MODULES.find(m => state.moduleProgress[m.id]?.status === 'available' || state.moduleProgress[m.id]?.status === 'in_progress');
  const openAlerts = state.socAlerts.filter(a => a.status === 'Open' || a.status === 'In_Progress');
  const recentAchievements = [...state.achievements].filter(a => a.earnedAt).sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime()).slice(0, 3);
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            Welcome back, {state.user.fullName.split(' ')[0]}
          </h1>
          <p className="text-slate-400 mt-1">GFS {state.user.businessUnit} • {state.user.role}</p>
        </div>
        <div className="flex space-x-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-center">
            <div className="text-sm text-slate-500">Level</div>
            <div className="text-xl font-bold text-blue-400">{state.level}</div>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-center">
            <div className="text-sm text-slate-500">Total XP</div>
            <div className="text-xl font-bold text-amber-400">{state.totalXpEarned.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Curriculum Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{progressPercent}%</div>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">{completedModuleCount} of {MODULES.length} modules completed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cyber Range Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{Math.floor(totalLabTime / 60)}h {totalLabTime % 60}m</div>
            <div className="flex items-center text-xs text-blue-400 mt-3">
              <Terminal size={14} className="mr-1" />
              Active Lab Environments
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">SOC Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{openAlerts.length}</div>
            <div className="flex items-center text-xs text-red-400 mt-3">
              <AlertCircle size={14} className="mr-1" />
              {openAlerts.filter(a => a.priority === 'P1').length} Critical P1 Alerts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state.achievements.filter(a => a.earnedAt).length}</div>
            <div className="flex items-center text-xs text-amber-400 mt-3">
              <Award size={14} className="mr-1" />
              Latest: {recentAchievements[0]?.title || 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Module Action */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 border-blue-900/50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <BookOpen className="mr-2" />
                Resume Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextModule ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="text-xs text-blue-500 font-bold uppercase tracking-wider">
                      Module {nextModule.id} • {nextModule.phaseLabel}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{nextModule.title}</h3>
                    <p className="text-slate-400 max-w-xl line-clamp-2">{nextModule.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
                      <span className="flex items-center"><Activity size={14} className="mr-1" /> {nextModule.difficulty}</span>
                      <span className="flex items-center"><Terminal size={14} className="mr-1" /> {nextModule.estimatedHours}h estimated</span>
                    </div>
                  </div>
                  <Link
                    to="/modules"
                    className="shrink-0 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors"
                  >
                    <Play size={18} className="mr-2" />
                    {state.moduleProgress[nextModule.id]?.status === 'in_progress' ? 'Continue' : 'Start Module'}
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award size={48} className="mx-auto text-amber-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">All Modules Completed!</h3>
                  <p className="text-slate-400">You've completed the entire GFS cybersecurity curriculum.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <h3 className="text-lg font-semibold text-white mb-4">Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/soc">
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-900/20 text-red-400 rounded-lg mr-4 group-hover:bg-red-900/40 transition-colors">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">SOC Console</h4>
                      <p className="text-sm text-slate-500">Triage {openAlerts.length} open alerts</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/siem">
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-900/20 text-emerald-400 rounded-lg mr-4 group-hover:bg-emerald-900/40 transition-colors">
                      <Search size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">SIEM Query</h4>
                      <p className="text-sm text-slate-500">Search enterprise logs</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Incident Feed */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800/50">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <ShieldAlert className="mr-2 text-red-500" size={16} />
                Critical Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800/50">
                {openAlerts.filter(a => a.severity === 'Critical').length > 0 ? (
                  openAlerts.filter(a => a.severity === 'Critical').slice(0, 4).map(alert => (
                    <div key={alert.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-red-400">{alert.id}</p>
                          <p className="text-sm text-white line-clamp-1">{alert.title}</p>
                          <p className="text-xs text-slate-500 truncate">{alert.affectedAsset}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">No critical incidents active.</div>
                )}
              </div>
              {openAlerts.length > 0 && (
                <div className="p-3 border-t border-slate-800/50 bg-slate-900/30 text-center">
                  <Link to="/soc" className="text-xs text-blue-400 hover:text-blue-300">
                    View all {openAlerts.length} alerts
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800/50">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Award className="mr-2 text-amber-500" size={16} />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800/50">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map(achievement => (
                    <div key={achievement.id} className="p-4 flex items-center">
                      <div className="text-2xl mr-3 bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center">
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{achievement.title}</p>
                        <p className="text-xs text-slate-500">{new Date(achievement.earnedAt!).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto text-xs font-bold text-amber-400">+{achievement.xpBonus} XP</div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">No achievements earned yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
