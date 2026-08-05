'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Loader2 } from 'lucide-react';
import { formatDate as formatDateHelper } from '@/lib/date';

interface Profile {
  id: string;
  full_name: string | null;
  is_admin?: boolean | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}

interface JobChatProps {
  jobId: string;
  userId: string;
  role: 'client' | 'firm' | 'admin';
  partnerName?: string | null;
  partnerIsAdmin?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return formatDateHelper(iso);
}

export default function JobChat({ jobId, userId, role, partnerName, partnerIsAdmin }: JobChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [jobId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!jobId) return;
    const channel = supabase
      .channel(`messages:${jobId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
        async (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id && newMessage.sender_id !== userId) {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('id, full_name, is_admin')
              .eq('id', newMessage.sender_id)
              .single();
            newMessage.sender = senderProfile as Profile | undefined;
          }
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          if (newMessage.sender_id !== userId) markAsRead();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, userId]);

  async function fetchMessages() {
    if (!jobId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, is_admin)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (err) {
      setError('Greška prilikom učitavanja poruka.');
    } else {
      setMessages((data as Message[]) || []);
    }
    setLoading(false);
    markAsRead();
  }

  async function markAsRead() {
    if (!jobId || !userId) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('job_id', jobId)
      .neq('sender_id', userId)
      .eq('read', false);
  }

  function getSenderLabel(msg: Message, isMe: boolean) {
    if (isMe) return 'Vi';
    if (msg.sender?.is_admin || partnerIsAdmin) return 'Administrator';
    return role === 'client' ? (partnerName || 'Firma') : 'Klijent';
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !jobId || !userId || sending) return;
    setSending(true);
    const { error: err } = await supabase.from('messages').insert({
      job_id: jobId,
      sender_id: userId,
      content: input.trim(),
      read: false,
    });
    setSending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setInput('');
  }

  return (
    <div className="flex flex-col h-full min-h-[360px]">
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

      <div className="flex-grow bg-white rounded-xl border border-gray-100 p-4 shadow-sm overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-steel">
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Učitavanje...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-steel text-sm mt-8">Pošaljite prvu poruku i dogovorite detalje posla.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isMe = msg.sender_id === userId;
              const showDate =
                idx === 0 ||
                new Date(msg.created_at).toDateString() !== new Date(messages[idx - 1].created_at).toDateString();
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center text-xs text-steel my-3">{formatDate(msg.created_at)}</div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        isMe ? 'bg-brand-orange text-[#ffffff] rounded-br-none' : 'bg-cloud text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className={`text-[10px] font-semibold mb-1 ${isMe ? 'text-[#ffffff]/80' : 'text-steel'}`}>
                        {getSenderLabel(msg, isMe)}
                      </p>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-[#ffffff]/80' : 'text-steel'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napišite poruku..."
          className="flex-grow rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-[#ffffff] px-4 rounded-xl font-semibold hover:shadow-md transition-all disabled:opacity-50 inline-flex items-center justify-center"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
