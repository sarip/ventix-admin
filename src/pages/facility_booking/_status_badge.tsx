/**
 * Booking Status Badge Component
 */

import React from 'react';
import { Badge } from 'react-bootstrap';

interface StatusBadgeProps {
    status: {
        name: string;
        color_code: string;
    };
}

const BookingStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
        <Badge
            bg=""
            style={{
                backgroundColor: status.color_code,
                color: '#fff'
            }}
        >
            {status.name}
        </Badge>
    );
};

export default BookingStatusBadge;
