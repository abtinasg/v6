'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  
  const displayName = personaData?.nameFa || aiModel?.name || 'AI';
  const avatar = personaData?.avatar || aiModel?.avatar || '🤖';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 px-4 py-6',
        role === 'user' ? 'bg-white' : 'bg-gray-50'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg',
        role === 'user' ? 'bg-gray-900' : 'bg-white border border-gray-200'
      )}>
        {role === 'user' ? (
          <span className="text-white text-sm">👤</span>
        ) : (
          <span>{avatar}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <p className="text-sm font-medium text-gray-500 mb-1">
          {role === 'user' ? 'شما' : displayName}
        </p>
        
        {/* Message */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
