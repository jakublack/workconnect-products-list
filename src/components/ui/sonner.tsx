import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react'

// The app has a single light theme, so there is no `next-themes` provider to read from.
// Success uses Sonner's built-in filled check icon, which is what the design shows.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'calc(var(--radius) * 0.8)',
          '--width': '336px',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
          success: '[&_[data-icon]]:text-success',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
