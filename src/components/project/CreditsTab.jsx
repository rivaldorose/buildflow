import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Coins, TrendingUp, Calculator, Info, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from 'date-fns';

const CREDIT_RATES = {
  Simple: { Lovable: 800, Cursor: 15, Base44: 1, v0: 1 },
  Medium: { Lovable: 2500, Cursor: 40, Base44: 3, v0: 3 },
  Hard: { Lovable: 6000, Cursor: 100, Base44: 8, v0: 8 }
};

const builderColors = {
  Lovable: 'bg-pink-100 text-pink-700',
  Cursor: 'bg-emerald-100 text-emerald-700',
  Base44: 'bg-violet-100 text-violet-700',
  v0: 'bg-slate-100 text-slate-700'
};

export default function CreditsTab({ creditLogs, features, projectId, builder }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    builder: builder || 'Base44',
    amount: '',
    description: ''
  });
  const [calculatorCounts, setCalculatorCounts] = useState({
    Simple: 0,
    Medium: 0,
    Hard: 0
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CreditLog.create({
      ...data,
      project: projectId,
      date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['creditLogs', projectId]);
      setIsDialogOpen(false);
      setForm({ builder: builder || 'Base44', amount: '', description: '' });
      toast.success('Credit log added!');
    }
  });

  const handleCreate = () => {
    if (!form.amount) {
      toast.error('Please enter an amount');
      return;
    }
    createMutation.mutate({
      ...form,
      amount: parseFloat(form.amount)
    });
  };

  // Calculate estimated credits from features
  const estimatedByComplexity = {
    Simple: features.filter(f => f.complexity === 'Simple').length,
    Medium: features.filter(f => f.complexity === 'Medium').length,
    Hard: features.filter(f => f.complexity === 'Hard').length
  };

  const totalEstimated = features.reduce((sum, f) => sum + (f.estimated_credits || 0), 0);
  const totalUsed = creditLogs.reduce((sum, log) => sum + (log.amount || 0), 0);

  // Group logs by builder
  const logsByBuilder = creditLogs.reduce((acc, log) => {
    acc[log.builder] = (acc[log.builder] || 0) + (log.amount || 0);
    return acc;
  }, {});

  // Calculator functions
  const updateCalculatorCount = (complexity, delta) => {
    setCalculatorCounts(prev => ({
      ...prev,
      [complexity]: Math.max(0, prev[complexity] + delta)
    }));
  };

  const handleCalculatorInputChange = (complexity, value) => {
    const num = parseInt(value) || 0;
    setCalculatorCounts(prev => ({
      ...prev,
      [complexity]: Math.max(0, num)
    }));
  };

  const calculateTotalForBuilder = (builderName) => {
    return Object.keys(calculatorCounts).reduce((sum, complexity) => {
      return sum + (calculatorCounts[complexity] * CREDIT_RATES[complexity][builderName]);
    }, 0);
  };

  const totalCalculatorFeatures = Object.values(calculatorCounts).reduce((sum, c) => sum + c, 0);

  return (
    <Tabs defaultValue="tracking" className="w-full">
      <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
        <TabsTrigger value="tracking" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Coins className="h-4 w-4 mr-2" />
          Credit Tracking
        </TabsTrigger>
        <TabsTrigger value="calculator" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Calculator className="h-4 w-4 mr-2" />
          Calculator
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tracking" className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Coins className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalEstimated.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Estimated Credits ({builder})</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalUsed.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Credits Used</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              totalUsed > totalEstimated ? 'bg-red-100' : 'bg-emerald-100'
            }`}>
              <Coins className={`h-5 w-5 ${
                totalUsed > totalEstimated ? 'text-red-600' : 'text-emerald-600'
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{Math.abs(totalEstimated - totalUsed).toLocaleString()}</p>
              <p className="text-sm text-slate-500">{totalUsed > totalEstimated ? 'Over Budget' : 'Remaining'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Builder Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Complexity</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">Features</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-pink-600">Lovable</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-emerald-600">Cursor</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-violet-600">Base44</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">v0</th>
              </tr>
            </thead>
            <tbody>
              {['Simple', 'Medium', 'Hard'].map(complexity => (
                <tr key={complexity} className="border-b border-slate-50">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      complexity === 'Simple' ? 'bg-emerald-100 text-emerald-700' :
                      complexity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {complexity}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 font-medium text-slate-900">
                    {estimatedByComplexity[complexity]}
                  </td>
                  <td className="text-center py-3 px-4 text-slate-600">
                    {estimatedByComplexity[complexity] * CREDIT_RATES[complexity].Lovable}
                  </td>
                  <td className="text-center py-3 px-4 text-slate-600">
                    {estimatedByComplexity[complexity] * CREDIT_RATES[complexity].Cursor}
                  </td>
                  <td className="text-center py-3 px-4 text-slate-600">
                    {estimatedByComplexity[complexity] * CREDIT_RATES[complexity].Base44}
                  </td>
                  <td className="text-center py-3 px-4 text-slate-600">
                    {estimatedByComplexity[complexity] * CREDIT_RATES[complexity].v0}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Total</td>
                <td className="text-center py-3 px-4 font-bold text-slate-900">{features.length}</td>
                <td className="text-center py-3 px-4 font-bold text-pink-600">
                  {Object.keys(CREDIT_RATES).reduce((sum, c) => sum + estimatedByComplexity[c] * CREDIT_RATES[c].Lovable, 0).toLocaleString()}
                </td>
                <td className="text-center py-3 px-4 font-bold text-emerald-600">
                  {Object.keys(CREDIT_RATES).reduce((sum, c) => sum + estimatedByComplexity[c] * CREDIT_RATES[c].Cursor, 0).toLocaleString()}
                </td>
                <td className="text-center py-3 px-4 font-bold text-violet-600">
                  {Object.keys(CREDIT_RATES).reduce((sum, c) => sum + estimatedByComplexity[c] * CREDIT_RATES[c].Base44, 0).toLocaleString()}
                </td>
                <td className="text-center py-3 px-4 font-bold text-slate-700">
                  {Object.keys(CREDIT_RATES).reduce((sum, c) => sum + estimatedByComplexity[c] * CREDIT_RATES[c].v0, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Credit Log</h3>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
        
        {creditLogs.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No credit logs yet</p>
        ) : (
          <div className="space-y-2">
            {creditLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${builderColors[log.builder]}`}>
                    {log.builder}
                  </span>
                  <span className="text-slate-700">{log.description || 'No description'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">
                    {log.date ? format(new Date(log.date), 'MMM d') : ''}
                  </span>
                  <span className="font-semibold text-slate-900">{log.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Credits Used</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Builder</label>
              <Select value={form.builder} onValueChange={(v) => setForm({ ...form, builder: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lovable">Lovable</SelectItem>
                  <SelectItem value="Cursor">Cursor</SelectItem>
                  <SelectItem value="Base44">Base44</SelectItem>
                  <SelectItem value="v0">v0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What was built?"
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={createMutation.isPending}
                className="flex-1 bg-violet-600 hover:bg-violet-700"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </TabsContent>

      {/* Calculator Tab */}
      <TabsContent value="calculator" className="space-y-6">
        {/* Feature Counter */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-900 mb-6">Feature Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Simple', 'Medium', 'Hard'].map(complexity => (
              <div 
                key={complexity}
                className={`rounded-xl border-2 p-6 ${
                  complexity === 'Simple' ? 'border-emerald-200 bg-emerald-50/50' :
                  complexity === 'Medium' ? 'border-amber-200 bg-amber-50/50' :
                  'border-red-200 bg-red-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    complexity === 'Simple' ? 'bg-emerald-100 text-emerald-700' :
                    complexity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {complexity}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          {complexity === 'Simple' && 'Basic UI components, simple CRUD, forms'}
                          {complexity === 'Medium' && 'Complex logic, integrations, multi-step flows'}
                          {complexity === 'Hard' && 'Advanced features, real-time, complex algorithms'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCalculatorCount(complexity, -1)}
                    className="h-10 w-10 rounded-xl"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={calculatorCounts[complexity]}
                    onChange={(e) => handleCalculatorInputChange(complexity, e.target.value)}
                    className="w-20 text-center text-xl font-bold h-12"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCalculatorCount(complexity, 1)}
                    className="h-10 w-10 rounded-xl"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-slate-500">Total Features: </span>
            <span className="text-2xl font-bold text-slate-900">{totalCalculatorFeatures}</span>
          </div>
        </div>

        {/* Cost Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {['Lovable', 'Cursor', 'Base44', 'v0'].map(builderName => {
            const total = calculateTotalForBuilder(builderName);
            const builderColors = {
              Lovable: 'from-pink-500 to-rose-600 border-pink-200 bg-pink-50',
              Cursor: 'from-emerald-500 to-teal-600 border-emerald-200 bg-emerald-50',
              Base44: 'from-violet-500 to-indigo-600 border-violet-200 bg-violet-50',
              v0: 'from-slate-600 to-slate-800 border-slate-200 bg-slate-50'
            };
            const colors = builderColors[builderName];
            
            return (
              <div 
                key={builderName}
                className={`rounded-2xl border-2 p-6 ${colors.split(' ').slice(2).join(' ')}`}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.split(' ').slice(0, 2).join(' ')} flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-white font-bold">{builderName.charAt(0)}</span>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-1">{builderName}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-1">{total}</p>
                <p className="text-sm text-slate-500">
                  {builderName === 'Lovable' && 'credits'}
                  {builderName === 'Cursor' && 'tokens (est.)'}
                  {builderName === 'Base44' && 'actions'}
                  {builderName === 'v0' && 'generations'}
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-2 text-sm">
                  {['Simple', 'Medium', 'Hard'].map(complexity => (
                    <div key={complexity} className="flex justify-between text-slate-600">
                      <span>{complexity}:</span>
                      <span className="font-medium">
                        {calculatorCounts[complexity]} × {CREDIT_RATES[complexity][builderName]} = {calculatorCounts[complexity] * CREDIT_RATES[complexity][builderName]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reference Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Credit Rates Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Complexity</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-pink-600">Lovable</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-emerald-600">Cursor</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-violet-600">Base44</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">v0</th>
                </tr>
              </thead>
              <tbody>
                {['Simple', 'Medium', 'Hard'].map(complexity => (
                  <tr key={complexity} className="border-b border-slate-50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        complexity === 'Simple' ? 'bg-emerald-100 text-emerald-700' :
                        complexity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {complexity}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">
                      {CREDIT_RATES[complexity].Lovable} credits
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">
                      {CREDIT_RATES[complexity].Cursor} tokens
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">
                      {CREDIT_RATES[complexity].Base44} actions
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">
                      {CREDIT_RATES[complexity].v0} gen
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}