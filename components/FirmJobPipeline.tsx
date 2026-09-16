'use client';

import { Send, CheckCircle, Clock, Star, XCircle, Briefcase } from 'lucide-react';

interface Bid {
  status: 'pending' | 'accepted' | 'rejected';
}

interface DirectJob {
  status: string;
  private_status: string;
}

interface FirmJobPipelineProps {
  myBids: Bid[];
  directJobs: DirectJob[];
}

export default function FirmJobPipeline({ myBids, directJobs }: FirmJobPipelineProps) {
  const pendingBids = myBids.filter((b) => b.status === 'pending').length;
  const acceptedBids = myBids.filter((b) => b.status === 'accepted').length;
  const rejectedBids = myBids.filter((b) => b.status === 'rejected').length;

  const inProgress = directJobs.filter((j) => j.private_status === 'in_progress' || j.status === 'in_progress').length;
  const donePending = directJobs.filter((j) => j.private_status === 'done_pending').length;
  const completed = directJobs.filter((j) => j.private_status === 'completed' || j.status === 'completed').length;

  const steps = [
    { label: 'Ponuđeno', count: pendingBids, icon: Send, tone: 'text-blue-500 bg-blue-500/10' },
    { label: 'Prihvaćeno', count: acceptedBids, icon: CheckCircle, tone: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'U toku', count: inProgress, icon: Clock, tone: 'text-amber-500 bg-amber-500/10' },
    { label: 'Završeno', count: completed + donePending, icon: Star, tone: 'text-brand-orange bg-brand-orange/10' },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand-orange" />
          Tvoji poslovi
        </h3>
        {rejectedBids > 0 && (
          <span className="text-xs text-steel">{rejectedBids} odbijenih ponuda</span>
        )}
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden sm:block absolute top-6 left-[12%] right-[12%] h-0.5 bg-gray-100 dark:bg-ink-800" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-ink-800/50"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{step.count}</p>
                <p className="text-xs text-steel">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
