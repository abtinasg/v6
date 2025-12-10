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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex gap-4 px-4 py-5"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center flex-shrink-0 text-base shadow-soft">
        {role === 'user' ? (
          <span className="text-muted">👤</span>
        ) : (
          <span>{avatar}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        {/* Name */}
        <p className="text-xs font-medium mb-2 text-muted">
          {role === 'user' ? 'شما' : displayName}
        </p>
        
        {/* Message */}
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed text-[15px]">
            {content}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-accent animate-pulse-subtle mr-1 rounded-sm" />
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
