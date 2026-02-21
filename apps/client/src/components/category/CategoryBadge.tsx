interface CategoryBadgeProps {
  name: string
  color: string
  size?: 'sm' | 'md'
}

export function CategoryBadge({
  name,
  color,
  size = 'sm',
}: CategoryBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} font-medium`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  )
}
