import { createFileRoute, Link } from '@tanstack/react-router';
import { useCyberOS, type SocAlert } from '@/context/CyberOSContext';
import { useState } from 'react';
import { ShieldAlert, Filter, Clock, CheckCircle2, AlertTriangle, ArrowRight, XCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/soc/')({
  component: SocDashboard,
});

function SocDashboard() {
  const { state, dispatch } = useCyberOS();
  const [filter, setFilter] = useState<'All' | 'Open' | 'In_Progress' | 'Escalated' | 'Mitigated' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = state.socAlerts.filter(alert => {
    if (filter !== 'All' && alert.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return alert.id.toLowerCase().includes(term) || 
             alert.title.toLowerCase().includes(term) || 
             alert.affectedAsset.toLowerCase().includes(term);
    }
    return true;
  });

  const priorityColors = {
    P1: 'bg-red-500 text-white',
    P2: 'bg-orange-500 text-white',
    P3: 'bg-amber-500 text-white',
    P4: 'bg-blue-500 text-white',
  };

  const statusColors = {
    Open: 'bg-slate-800 text-slate-300 border-slate-700',
    In_Progress: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
    Escalated: 'bg-orange-900/40 text-orange-400 border-orange-800/50',
    Mitigated: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50',
    Closed: 'bg-slate-900 text-slate-500 border-slate-800',
    False_Positive: 'bg-slate-900 text-slate-500 border-slate-800 line-through',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <ShieldAlert className="mr-3 text-red-500" />
            Security Operations Center
          </h1>
          <p className="text-slate-400 mt-1">GFS Global Triage Queue</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {['All', 'Open', 'In_Progress', 'Escalated', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === status ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Open Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state.socAlerts.filter(a => a.status === 'Open').length}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{state.socAlerts.filter(a => a.status === 'In_Progress').length}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Escalated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{state.socAlerts.filter(a => a.status === 'Escalated').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center bg-slate-900/80">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by ID, title, or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0a0a0c] border border-slate-700 rounded-md text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="ml-auto text-sm text-slate-500">
            Showing {filteredAlerts.length} alerts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 bg-[#0f0f13]">
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Alert ID</th>
                <th className="p-4 font-medium w-1/3">Title & Asset</th>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Assignee</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No alerts match the current filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${priorityColors[alert.priority]}`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-400">
                      {alert.id}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-200 mb-1">{alert.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-md">{alert.affectedAsset}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-400 whitespace-nowrap flex items-center">
                      <Clock size={14} className="mr-2" />
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={statusColors[alert.status]}>
                        {alert.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {alert.assignedTo || <span className="text-slate-600 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to="/soc/$alertId"
                        params={{ alertId: alert.id }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                      >
                        Investigate <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
