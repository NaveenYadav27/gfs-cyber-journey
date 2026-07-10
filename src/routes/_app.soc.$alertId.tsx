import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { ArrowLeft, Terminal, ShieldAlert, AlertTriangle, MessageSquare, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Route = createFileRoute('/_app/soc/$alertId')({
  component: SocAlertDetail,
});

function SocAlertDetail() {
  const { alertId } = Route.useParams();
  const { state, dispatch } = useCyberOS();
  const navigate = useNavigate();
  
  const alert = state.socAlerts.find(a => a.id === alertId);
  const [note, setNote] = useState('');

  if (!alert) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-white">Alert not found</h2>
        <Button onClick={() => navigate({ to: '/soc' })} className="mt-4">Return to Queue</Button>
      </div>
    );
  }

  const handleUpdateStatus = (status: any) => {
    dispatch({ type: 'UPDATE_SOC_ALERT', alertId: alert.id, status, note: `Status changed to ${status}` });
    if (status === 'Closed' || status === 'False_Positive' || status === 'Mitigated') {
      dispatch({ type: 'EARN_ACHIEVEMENT', achievementId: 'soc-operator' });
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    dispatch({ type: 'UPDATE_SOC_ALERT', alertId: alert.id, status: alert.status, note });
    setNote('');
  };

  const handleAssignToMe = () => {
    dispatch({ type: 'ASSIGN_SOC_ALERT', alertId: alert.id, analyst: state.user.employeeId });
  };

  const priorityColors = {
    P1: 'bg-red-500',
    P2: 'bg-orange-500',
    P3: 'bg-amber-500',
    P4: 'bg-blue-500',
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/soc" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${priorityColors[alert.priority]}`}>
                  {alert.priority}
                </span>
                <span className="text-xs text-slate-400 font-mono">{alert.id}</span>
                <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                  {alert.status.replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-white leading-tight">{alert.title}</h1>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {alert.status !== 'Closed' && alert.status !== 'False_Positive' && (
              <>
                <Button 
                  onClick={() => handleUpdateStatus('False_Positive')}
                  variant="outline" 
                  className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <XCircle size={16} className="mr-2" /> Mark False Positive
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus('Mitigated')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <CheckCircle2 size={16} className="mr-2" /> Mitigate & Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-4 border-b border-slate-800/50">
                <CardTitle className="text-lg text-white">Alert Telemetry</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x divide-slate-800/50 border-b border-slate-800/50">
                  <div className="p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Affected Asset</div>
                    <div className="text-sm font-mono text-blue-400">{alert.affectedAsset}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detection Source</div>
                    <div className="text-sm text-slate-300">{alert.source}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-800/50 border-b border-slate-800/50">
                  <div className="p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">MITRE ATT&CK Technique</div>
                    <div className="text-sm font-mono text-amber-400">{alert.technique}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">First Seen</div>
                    <div className="text-sm text-slate-300">{new Date(alert.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Payload / Description</div>
                  <div className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
                    {alert.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 text-center">
                  <Terminal size={32} className="mx-auto text-blue-500 mb-3" />
                  <h3 className="font-semibold text-white mb-2">SIEM Query</h3>
                  <p className="text-xs text-slate-400 mb-4">Run correlation searches on the affected asset</p>
                  <Link to="/siem" className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-md transition-colors w-full">
                    Open in SIEM
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 text-center">
                  <ShieldAlert size={32} className="mx-auto text-amber-500 mb-3" />
                  <h3 className="font-semibold text-white mb-2">Containment</h3>
                  <p className="text-xs text-slate-400 mb-4">Isolate asset from GFS enterprise network</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-slate-800 border-slate-700 hover:bg-amber-900/30 hover:text-amber-400 transition-colors"
                    onClick={() => {
                      dispatch({ 
                        type: 'UPDATE_SOC_ALERT', 
                        alertId: alert.id, 
                        status: alert.status === 'Open' ? 'In_Progress' : alert.status, 
                        note: `Host isolation executed on ${alert.affectedAsset} via CrowdStrike Falcon containment API. Asset removed from network.` 
                      });
                    }}
                    disabled={alert.status === 'Closed' || alert.status === 'False_Positive'}
                  >
                    Execute Host Isolation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Workflow */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-4 border-b border-slate-800/50">
                <CardTitle className="text-lg text-white">Investigation Log</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                
                {/* Assignee Box */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <User size={16} className="text-slate-500 mr-2" />
                    <span className="text-sm text-slate-300">
                      {alert.assignedTo ? `Assigned to ${alert.assignedTo}` : 'Unassigned'}
                    </span>
                  </div>
                  {!alert.assignedTo && (
                    <Button onClick={handleAssignToMe} size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                      Assign to me
                    </Button>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-4 pt-2">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-0.5 h-full bg-slate-800 my-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-xs text-slate-500 mb-1">{new Date(alert.timestamp).toLocaleString()}</div>
                      <div className="text-sm text-slate-300">Alert generated by {alert.source}</div>
                    </div>
                  </div>
                  
                  {alert.actions.map((action, i) => (
                    <div key={i} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {i < alert.actions.length - 1 && <div className="w-0.5 h-full bg-slate-800 my-1" />}
                      </div>
                      <div className="pb-4">
                        <div className="text-xs text-slate-500 mb-1">
                          {new Date(action.timestamp).toLocaleString()} • {action.analyst}
                        </div>
                        <div className="text-sm font-semibold text-slate-200">{action.action}</div>
                        {action.result && (
                          <div className="text-sm text-slate-400 mt-1 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            {action.result}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <div className="pt-4 border-t border-slate-800">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add investigation notes..."
                    className="w-full bg-[#050505] border border-slate-700 rounded-md p-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none min-h-[100px] mb-3"
                  />
                  <Button 
                    onClick={handleAddNote} 
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                    disabled={!note.trim() || alert.status === 'Closed'}
                  >
                    <MessageSquare size={16} className="mr-2" /> Add Note
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
