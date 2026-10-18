// Fallback for requests that never reach a locale (the proxy normally prefixes every path with one).
export default function GlobalNotFound() {
  return (
    <html lang="en-GB">
      <body style={{ fontFamily: 'Georgia, serif', background: '#f5efe6', color: '#1d1a17', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <main style={{ textAlign: 'center' }}>
          <h1 style={{ fontStyle: 'italic', fontWeight: 300 }}>Signal lost</h1>
          <p>
            <a href="/en" style={{ color: '#8f0000' }}>
              Return to the CV
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
