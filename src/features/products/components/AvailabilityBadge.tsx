import { Badge } from '@/components/ui/badge'

interface AvailabilityBadgeProps {
  isAvailable: boolean
}

export function AvailabilityBadge({ isAvailable }: AvailabilityBadgeProps) {
  return isAvailable ? (
    <Badge variant="success">Dostępny</Badge>
  ) : (
    <Badge variant="destructive">Niedostępny</Badge>
  )
}
