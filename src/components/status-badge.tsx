import { Badge } from './ui/badge'

interface Props {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusBadge({
  isActive,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}: Props) {
  return (
    <Badge variant={isActive ? 'default' : 'destructive'}>
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  )
}
