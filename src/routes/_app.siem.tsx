import { createFileRoute } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import { useState, useRef, useEffect } from 'react';
import { Search, Database, Clock, Activity, Server, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/siem')({
  component: SiemPage,
});

// Mock Log Data
const MOCK_LOGS = [
  { _time: '2026-07-10T03:02:44.112Z', index: 'aws_vpc_flow', host: 'aws-ec2-prod-amw-k8s-node04', source: '10.200.44.114', dest: '91.229.229.99', action: 'ACCEPT', bytes: 4096, proto: 'TCP', dest_port: 443 },
  { _time: '2026-07-10T03:01:44.095Z', index: 'aws_vpc_flow', host: 'aws-ec2-prod-amw-k8s-node04', source: '10.200.44.114', dest: '91.229.229.99', action: 'ACCEPT', bytes: 3952, proto: 'TCP', dest_port: 443 },
  { _time: '2026-07-10T03:00:44.201Z', index: 'aws_vpc_flow', host: 'aws-ec2-prod-amw-k8s-node04', source: '10.200.44.114', dest: '91.229.229.99', action: 'ACCEPT', bytes: 4120, proto: 'TCP', dest_port: 443 },
  { _time: '2026-07-10T02:58:11.442Z', index: 'crowdstrike', host: 'GFS-LT-1101', user: 'cheryl.jenkins', process: 'notepad.exe', target_process: 'lsass.exe', event_type: 'ProcessAccess', severity: 'High', description: 'Suspicious handle requested to LSASS' },
  { _time: '2026-07-10T01:47:19.882Z', index: 'palo_alto', host: 'ny-dc01-fw01', source: '198.51.100.82', dest: '10.10.20.11', action: 'DROP', rule: 'WAF_SQLI_BLOCK', app: 'web-browsing', payload: '%27%20UNION%20SELECT%20NULL--' },
  { _time: '2026-07-10T01:47:19.451Z', index: 'palo_alto', host: 'ny-dc01-fw01', source: '198.51.100.82', dest: '10.10.20.11', action: 'ALLOW', rule: 'INBOUND_WEB', app: 'web-browsing', payload: '%27%20OR%201%3D1--' },
  { _time: '2026-07-09T23:34:07.110Z', index: 'windows_sec', host: 'ny-dc01', user: 'a.mercer', EventCode: 4769, TicketOptions: '0x40810000', TicketEncryptionType: '0x17', ServiceName: 'SVC_SQL_CORE' },
  { _time: '2026-07-09T22:12:33.501Z', index: 'zeek', host: 'sensor-hq01', source: '10.100.10.88', dest: '10.10.30.11', proto: 'RDP', bytes_in: 14502, bytes_out: 489920, duration: 720 },
  { _time: '2026-07-09T14:22:17.220Z', index: 'm365_defender', host: 'exchange_online', sender: 'payroll.update@gfs-corporate.com', recipient: 'finance.team@gfs.local', subject: 'Q4 Salary Update', action: 'Quarantined', attachment: 'Q4-2026-Salary-Update.xlsx' },
];

function SiemPage() {
  const { state, dispatch } = useCyberOS();
  const [query, setQuery] = useState(state.siemLogFilter || 'index=* | head 50');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'raw'>('table');

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    dispatch({ type: 'SET_SIEM_FILTER', filter: query });
    dispatch({ type: 'ADD_LOG_SEARCH', query });

    // Simulate network delay and basic SPL processing
    setTimeout(() => {
      let filtered = [...MOCK_LOGS];
      const q = query.toLowerCase();

      // Very rudimentary SPL parsing for the simulation
      if (q.includes('index=windows')) filtered = filtered.filter(l => l.index === 'windows_sec');
      else if (q.includes('index=palo_alto')) filtered = filtered.filter(l => l.index === 'palo_alto');
      else if (q.includes('index=crowdstrike')) filtered = filtered.filter(l => l.index === 'crowdstrike');
      else if (q.includes('index=aws')) filtered = filtered.filter(l => l.index === 'aws_vpc_flow');

      // Simple keyword filtering
      const terms = q.split('|')[0].replace(/index=\\w+/g, '').trim().split(' ').filter(Boolean);
      if (terms.length > 0) {
        filtered = filtered.filter(log => {
          const logString = JSON.stringify(log).toLowerCase();
          return terms.every(term => logString.includes(term.replace(/"/g, '')));
        });
      }

      setResults(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const extractFields = (logs: any[]) => {
    const fields = new Set<string>();
    logs.forEach(log => {
      Object.keys(log).forEach(k => {
        if (k !== '_time' && k !== 'index' && k !== 'host') fields.add(k);
      });
    });
    return Array.from(fields);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] animate-in fade-in duration-500">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-900/30 text-emerald-400 rounded-lg">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SIEM Log Explorer</h1>
              <p className="text-xs text-slate-400">GFS Splunk Enterprise Virtual Appliance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs text-slate-500">
              <Server size={14} className="mr-1" />
              Ingest: 140 TB/day
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <Activity size={14} className="mr-1 text-emerald-500" />
              Cluster Health: OK
            </div>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="shrink-0 bg-[#0f0f13] border-b border-slate-800 p-4">
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            <div className="relative border border-slate-700 bg-[#050505] rounded-md overflow-hidden focus-within:border-blue-500 transition-colors">
              <div className="absolute top-3 left-3 text-emerald-500 font-mono font-bold text-sm select-none">
                &gt;
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-full bg-transparent p-3 pl-8 text-sm text-blue-300 font-mono focus:outline-none min-h-[80px] resize-y"
                placeholder="Enter SPL query (e.g. index=windows EventCode=4769)..."
                spellCheck={false}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span>Time Range:</span>
                <select 
                  value={state.siemTimeRange}
                  onChange={(e) => dispatch({ type: 'SET_SIEM_TIME_RANGE', range: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none"
                >
                  <option value="15m">Last 15 minutes</option>
                  <option value="60m">Last 60 minutes</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
                
                {state.logSearchHistory.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-2">History:</span>
                    <select 
                      onChange={(e) => {
                        if (e.target.value) setQuery(e.target.value);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none max-w-[200px]"
                    >
                      <option value="">Select past query...</option>
                      {state.logSearchHistory.map((h, i) => (
                        <option key={i} value={h}>{h.substring(0, 40)}{h.length > 40 ? '...' : ''}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 h-10 px-6 font-bold"
          >
            {isSearching ? 'Searching...' : <><Search size={16} className="mr-2" /> Search</>}
          </Button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-hidden bg-[#0a0a0c] flex">
        {/* Fields Sidebar */}
        <div className="w-64 shrink-0 border-r border-slate-800 bg-[#0f0f13] overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Fields</h3>
            <ul className="mt-2 space-y-1">
              <li className="text-xs text-blue-400 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-800 flex justify-between">
                a host <span>{hasSearched ? new Set(results.map(r => r.host)).size : 0}</span>
              </li>
              <li className="text-xs text-blue-400 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-800 flex justify-between">
                a index <span>{hasSearched ? new Set(results.map(r => r.index)).size : 0}</span>
              </li>
            </ul>
          </div>
          <div className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Interesting Fields</h3>
            <ul className="mt-2 space-y-1">
              {hasSearched && extractFields(results).map(field => (
                <li key={field} className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-800 flex justify-between">
                  a {field} <span>{new Set(results.filter(r => r[field]).map(r => r[field])).size}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Log Viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          {!hasSearched ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
              <Database size={64} className="mb-6 text-slate-800" />
              <h2 className="text-xl font-bold text-slate-400 mb-2">Ready for Search</h2>
              <p className="text-center max-w-md text-sm">
                Enter an SPL query above to search through GFS enterprise telemetry. 
                Common indices: <code>windows_sec</code>, <code>palo_alto</code>, <code>crowdstrike</code>, <code>aws_vpc_flow</code>, <code>zeek</code>.
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p>Scanning 140M+ events...</p>
            </div>
          ) : (
            <>
              {/* Results Toolbar */}
              <div className="h-12 border-b border-slate-800 bg-[#0f0f13] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-300">
                    <span className="font-bold text-white">{results.length}</span> events (from simulated data)
                  </div>
                </div>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-1">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Table
                  </button>
                  <button 
                    onClick={() => setViewMode('raw')}
                    className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'raw' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Raw List
                  </button>
                </div>
              </div>

              {/* Results Content */}
              <div className="flex-1 overflow-auto p-4">
                {results.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    <Search size={48} className="mx-auto mb-4 text-slate-700" />
                    <h3 className="text-lg font-bold">No results found</h3>
                    <p className="text-sm mt-1">Try expanding your time range or loosening your filters.</p>
                  </div>
                ) : viewMode === 'table' ? (
                  <div className="bg-[#050505] border border-slate-800 rounded-md overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <th className="p-3 font-mono text-xs whitespace-nowrap">_time</th>
                          <th className="p-3 font-mono text-xs">index</th>
                          <th className="p-3 font-mono text-xs">host</th>
                          <th className="p-3 font-mono text-xs">Event Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {results.map((log, i) => (
                          <tr key={i} className="hover:bg-slate-900/50">
                            <td className="p-3 font-mono text-xs text-blue-400 whitespace-nowrap">{new Date(log._time).toLocaleString()}</td>
                            <td className="p-3 text-amber-400 text-xs">{log.index}</td>
                            <td className="p-3 text-slate-300 text-xs">{log.host}</td>
                            <td className="p-3 text-xs font-mono text-slate-400">
                              {Object.entries(log)
                                .filter(([k]) => k !== '_time' && k !== 'index' && k !== 'host')
                                .map(([k, v]) => (
                                  <span key={k} className="mr-3 inline-block">
                                    <span className="text-slate-500">{k}=</span>
                                    <span className={typeof v === 'string' && (v.includes('DROP') || v.includes('Quarantined')) ? 'text-red-400 font-bold' : 'text-slate-200'}>{String(v)}</span>
                                  </span>
                                ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((log, i) => (
                      <div key={i} className="bg-[#050505] p-3 rounded border border-slate-800 font-mono text-xs flex">
                        <div className="w-48 shrink-0 text-slate-500">
                          {new Date(log._time).toLocaleString()}
                        </div>
                        <div className="flex-1 text-slate-300 break-all">
                          {Object.entries(log).map(([k, v]) => (
                            <span key={k} className="mr-3">
                              <span className="text-blue-500">{k}</span>=<span className={k === 'index' ? 'text-amber-400' : 'text-emerald-400'}>"{String(v)}"</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
