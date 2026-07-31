'use client';

import React, { useState } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Hash, Lock, Plus } from 'lucide-react';

export const CreateChannelModal: React.FC = () => {
  const { isCreateChannelOpen, setIsCreateChannelOpen, createChannel } = useChat();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createChannel(name.trim(), description.trim(), isPrivate);
    setName('');
    setDescription('');
    setIsPrivate(false);
  };

  return (
    <Dialog
      isOpen={isCreateChannelOpen}
      onClose={() => setIsCreateChannelOpen(false)}
      title="Create SaaS Channel"
      description="Channels are where your team communicates over real-time WebSockets."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Channel Name
          </label>
          <Input
            placeholder="e.g. security-audit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<Hash className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Description (Optional)
          </label>
          <Input
            placeholder="What is this channel about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Make Private</p>
              <p className="text-[11px] text-slate-400">Only invited members can access</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-signal-600 focus:ring-signal-500/20"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={() => setIsCreateChannelOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Plus className="w-4 h-4 mr-1" /> Create Channel
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
