'use client';

import React, { useState } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Phone, Lock, Plus } from 'lucide-react';

export const NewChatModal: React.FC = () => {
  const { isNewChatOpen, closeNewChat, addContactAndStartChat } = useChat();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addContactAndStartChat(name.trim(), phone.trim());
    setName('');
    setPhone('');
  };

  return (
    <Dialog
      isOpen={isNewChatOpen}
      onClose={closeNewChat}
      title="New Encrypted Conversation"
      description="Enter a contact name and phone number to initiate a Signal protocol session."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Contact Name
          </label>
          <Input
            placeholder="e.g. Sarah Connor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Phone Number
          </label>
          <Input
            placeholder="e.g. +1 (555) 234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-signal-400 flex-shrink-0" />
          <span>Contact keys will be automatically exchanged via E2EE algorithm.</span>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={closeNewChat}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Plus className="w-4 h-4 mr-1" /> Start Chat
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
