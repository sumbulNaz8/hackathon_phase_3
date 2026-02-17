export const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf8f3 0%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Loading Content */}
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        boxShadow: '0 8px 32px rgba(26, 15, 13, 0.1)',
        border: '2px solid rgba(212, 165, 67, 0.2)'
      }}>
        {/* Diamond Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 30px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #d4a543 0%, #e8c87a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(212, 165, 67, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '40px' }}>💎</span>
        </div>

        {/* Spinner */}
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(212, 165, 67, 0.2)',
          borderTop: '4px solid #d4a543',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px'
        }}></div>

        <p style={{
          color: '#d4a543',
          fontWeight: 'bold',
          fontSize: '18px',
          margin: 0
        }}>
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};