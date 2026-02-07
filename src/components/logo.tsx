import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoVariant = 'default' | 'light' | 'dashboard';
type LogoSize = 'sm' | 'md';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', text: 'text-lg' },
  md: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5', text: 'text-xl' },
};

export function Logo({ variant = 'default', size = 'sm', showText = true, className }: LogoProps) {
  const s = sizeConfig[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          s.box,
          'flex items-center justify-center text-white flex-shrink-0',
          variant === 'dashboard'
            ? 'bg-[#135bec]'
            : 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)]'
        )}
      >
        <Layers className={s.icon} />
      </div>
      {showText && (
        <span
          className={cn(
            'font-bold',
            s.text,
            variant === 'light' ? 'text-white' : variant === 'dashboard' ? 'text-slate-900' : ''
          )}
        >
          TensorEval
        </span>
      )}
    </div>
  );
}
