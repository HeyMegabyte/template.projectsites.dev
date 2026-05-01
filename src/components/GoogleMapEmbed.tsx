interface Props {
  query: string;
  height?: number;
  className?: string;
}

/**
 * Full-width responsive Google Maps embed.
 * `query` may be a street address, business name, or place ID.
 */
export function GoogleMapEmbed({ query, height = 420, className }: Props) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <iframe
      title={`Map: ${query}`}
      src={src}
      width="100%"
      height={height}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      style={{ border: 0, display: 'block', width: '100%' }}
    />
  );
}

export default GoogleMapEmbed;
