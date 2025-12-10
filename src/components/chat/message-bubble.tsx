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
        'flex gap-4 px-4 py-6',
        role === 'user' ? 'bg-white' : 'bg-gradient-to-r from-gray-50 to-white'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg shadow-sm',
        role === 'user' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-700' 
          : 'bg-white border border-gray-200'
      )}>
        {role === 'user' ? (
          <span className="text-white text-base">👤</span>
        ) : (
          <span className="text-lg">{avatar}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <p className={cn(
          'text-sm font-semibold mb-2',
          role === 'user' ? 'text-gray-800' : 'text-gray-600'
        )}>
          {role === 'user' ? 'شما' : displayName}
        </p>
        
        {/* Message */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-gray-500 animate-pulse mr-1 rounded-sm" />
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
