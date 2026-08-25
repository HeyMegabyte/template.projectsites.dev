interface Props {
  data: Record<string, unknown> | Record<string, unknown>[];
}

function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function JsonLd({ data }: Props) {
  // Render each node as its own <script> so every schema type is an independent,
  // universally-counted JSON-LD block (Google parses arrays too, but separate
  // blocks are what schema validators + our build gate count).
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(node) }}
        />
      ))}
    </>
  );
}
