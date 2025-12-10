'use client';

import { motion } from 'framer-motion';
import { AI_MODELS, ROUNDTABLE_PERSONAS } from '@/lib/models';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  persona?: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, content, model, persona, isStreaming }: MessageBubbleProps) {
  const aiModel = model ? AI_MODELS.find(m => m.id === model) : null;
  const personaData = persona ? ROUNDTABLE_PERSONAS.find(p => p.id === persona) : null;
  
  const displayName = personaData?.nameFa || aiModel?.name || 'HUNO';
  const avatar = personaData?.avatar || aiModel?.avatar || '✦';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex gap-5 px-5 py-6"
    >
      {/* Avatar - Premium with subtle depth */}
      <div className="w-10 h-10 rounded-2xl bg-surface-elevated flex items-center justify-center flex-shrink-0 text-lg shadow-soft-sm">
        {role === 'user' ? (
          <span className="text-muted">👤</span>
        ) : (
          <span>{avatar}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-1.5">
        {/* Name */}
        <p className="text-xs font-semibold mb-2.5 text-muted">
          {role === 'user' ? 'شما' : displayName}
        </p>
        
        {/* Message */}
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground-secondary whitespace-pre-wrap leading-[1.75] text-[15px]">
            {content}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4.5 bg-accent animate-pulse-subtle mr-1.5 rounded-sm" />
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
