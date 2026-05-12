'use client'

interface EventStatusBadgeProps {
    status?:
        | 'draft'
        | 'launch'
        | 'closed'
        | 'upcoming'
        | 'ongoing'
        | 'sold_out'
        | 'finished'
        | null
    className?: string
}

export default function EventStatusBadge({
                                             status,
                                             className = '',
                                         }: EventStatusBadgeProps) {
    if (!status) return null

    const badgeConfig: Record<
        string,
        {
            label: string
            className: string
        }
    > = {
        draft: {
            label: 'Draft',
            className: 'bg-warning text-dark',
        },

        launch: {
            label: 'Launch',
            className: 'bg-primary',
        },

        closed: {
            label: 'Closed',
            className: 'bg-danger',
        },

        upcoming: {
            label: 'Upcoming',
            className: 'bg-info text-dark',
        },

        ongoing: {
            label: 'Ongoing',
            className: 'bg-success',
        },

        sold_out: {
            label: 'Sold Out',
            className: 'bg-orange text-white',
        },

        finished: {
            label: 'Finished',
            className: 'bg-secondary',
        },
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

            {/* custom style sold out */}
            <style jsx>{`
        .bg-orange {
          background-color: #fd7e14;
        }
      `}</style>
        </>
    )
}