'use client'

interface BookingSourceProps {
    status: string
    className?: string
}

export default function BookingSource({
                                             status,
                                             className = '',
                                         }: BookingSourceProps) {
    if (!status) return null

    const badgeConfig: Record<
        string,
        {
            label: string
            className: string
        }
    > = {
        MEMBER: {
            label: 'Member',
            className: 'bg-primary',
        },

        GUEST: {
            label: 'Guest',
            className: 'bg-success',
        }
    }

    const config = badgeConfig[status]

    if (!config) return null

    return (
        <>
      <span
          className={`badge rounded-pill ${config.className} ${className}`}
      >
        {config.label}
      </span>
        </>
    )
}