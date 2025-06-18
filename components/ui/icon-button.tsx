import React from 'react'
import { Loader2, Send, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  icon?: 'send' | 'loading' | 'help'
  tooltip?: string
}

const variantClasses: Record<NonNullable<IconButtonProps['variant']>, string> = {
  default: 'bg-nylag-primary-blue text-white hover:bg-[#0088A8] shadow-sm focus-visible:ring-[var(--nylag-primary-blue)]',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 focus-visible:ring-[var(--nylag-primary-blue)]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
  ghost: 'hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-500',
  link: 'text-nylag-primary-blue hover:text-nylag-orange hover:underline focus-visible:ring-[var(--nylag-primary-blue)]'

}

const sizeClasses: Record<NonNullable<IconButtonProps['size']>, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10'
}

const icons = {
  send: Send,
  loading: Loader2,
  help: HelpCircle
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'default', icon, tooltip, children, ...props }, ref) => {
    const IconComponent = icon ? icons[icon] : null
    
    const button = (
      <button
        ref={ref}
        aria-label={!children && tooltip ? tooltip : undefined}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {IconComponent && <IconComponent className={cn('h-4 w-4', icon === 'loading' && 'animate-spin')} />}
        {children}
      </button>
    )

    if (tooltip) {
      return (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {button}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-2 py-1 rounded-md text-xs shadow-lg border border-gray-700"
                sideOffset={5}
              >
                {tooltip}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )
    }

    return button
  }
)

IconButton.displayName = 'IconButton'
