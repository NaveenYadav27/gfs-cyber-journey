import { createFileRoute, Link } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { Terminal, Shield, CheckCircle, Database, Server, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/_app/range')({
  component: CyberRangeOverview,
});

function CyberRangeOverview() {
  const { state } = useCyberOS();

  const activeLabs = Object.values(state.moduleProgress).filter(p => p.status === 'in_progress' || p.status === 'completed').length;
  const totalLabTime = Object.values(state.moduleProgress).reduce((acc, p) => acc + (p.timeSpentMinutes || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Terminal className="mr-3 text-emerald-500" />
          Cyber Range Operations
        </h1>
        <p className="text-slate-400 mt-2 max-w-3xl">
          Authorized isolated environments for practicing offensive and defensive techniques.
          All activity is sandboxed and monitored.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Environment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400 flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3 animate-pulse" />
              ONLINE (VLAN 99)
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{activeLabs}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{Math.floor(totalLabTime / 60)}h {totalLabTime % 60}m</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-6 text-amber-500">
        <h3 className="font-bold flex items-center mb-2">
          <AlertTriangle className="mr-2" /> Rules of Engagement (RoE)
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-amber-200/80">
          <li>All exploitation activities must be confined to the 10.10.99.0/24 subnet.</li>
          <li>Do not attempt to scan or exploit the hypervisor infrastructure.</li>
          <li>Data exfiltration must terminate at the designated sinkhole (10.10.99.254).</li>
          <li>Violation of the RoE will result in immediate termination of the lab environment and referral to HR.</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4">Available Target Environments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg mr-4">
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">GFS Baseline Network</h3>
                  <div className="text-sm text-slate-400 font-mono">10.10.20.0/24</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Simulated corporate network including Domain Controllers, Exchange servers, and standard employee workstations.
            </p>
            <div className="flex space-x-3">
              <Link to="/modules/$moduleId" params={{ moduleId: '4' }} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-500">Go to AD Lab</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-red-900/30 text-red-400 rounded-lg mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">DMZ / Public Face</h3>
                  <div className="text-sm text-slate-400 font-mono">198.51.100.0/24</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Vulnerable web applications, exposed APIs, and simulated external attack surface for the GFS banking application.
            </p>
            <div className="flex space-x-3">
              <Link to="/modules/$moduleId" params={{ moduleId: '17' }} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-500">Go to Web App Lab</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-900/30 text-emerald-400 rounded-lg mr-4">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Core Banking Enclave</h3>
                  <div className="text-sm text-slate-400 font-mono">10.10.30.0/24</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-950 text-red-500 border-red-900">Highly Restricted</Badge>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Simulated SWIFT gateways, mainframes, and core transactional databases. Requires advanced clearance to access.
            </p>
            <div className="flex space-x-3">
              {state.user.clearance === 'Highly_Confidential' || state.user.clearance === 'Compartmented_SecOps' ? (
                <Link to="/modules/$moduleId" params={{ moduleId: '20' }} className="flex-1">
                  <Button className="w-full bg-red-700 hover:bg-red-600">Enter Enclave</Button>
                </Link>
              ) : (
                <Button disabled className="w-full bg-slate-800 text-slate-500">Clearance Too Low</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
