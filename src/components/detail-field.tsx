interface DetailFieldProps {
  label: string
  children: React.ReactNode
}

export default function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}
