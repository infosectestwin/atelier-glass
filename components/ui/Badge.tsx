type BadgeVariant = 'new' | 'contacted' | 'done'

interface BadgeProps {
  variant: BadgeVariant
}

export default function Badge({ variant }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    new: 'bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30',
    contacted: 'bg-[#D97706]/20 text-[#FCD34D] border border-[#D97706]/30',
    done: 'bg-green-500/20 text-green-400 border border-green-500/30',
  }

  const labels: Record<BadgeVariant, string> = {
    new: 'New',
    contacted: 'Contacted',
    done: 'Done',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {labels[variant]}
    </span>
  )
}
