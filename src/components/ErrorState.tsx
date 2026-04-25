export default function ErrorState(): React.ReactElement {
  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bella-bg)',
      }}
    >
      <p
        style={{
          fontFamily:    'var(--bella-font-serif)',
          fontStyle:     'italic',
          fontWeight:    300,
          fontSize:      '20px',
          color:         'var(--bella-mid)',
          letterSpacing: '-0.2px',
        }}
      >
        Something went wrong loading this portfolio.
      </p>
    </div>
  );
}
