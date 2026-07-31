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
          <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
            Channel Name
          </label>
          <Input
            placeholder="e.g. security-audit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<Hash className="w-4 h-4 text-[var(--text-muted)]" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
            Description (Optional)
          </label>
          <Input
            placeholder="What is this channel about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-[var(--text-main)]">Make Private</p>
              <p className="text-[11px] text-[var(--text-muted)]">Only invited members can access</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 rounded bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-main)] focus:ring-[var(--text-main)]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
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
