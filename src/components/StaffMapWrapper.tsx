import dynamic from 'next/dynamic';

// Dynamically import StaffMap with SSR disabled
const StaffMap = dynamic(() => import('./StaffMap'), {
    ssr: false,
    loading: () => (
        <div style={{
            height: '400px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
        }}>
            <p>Loading map...</p>
        </div>
    )
});

export default StaffMap;
