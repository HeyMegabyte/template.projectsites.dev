import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { SafeSection } from '@/components/SafeSection';

/**
 * A child that throws on render — simulates the classic AI-customized section
 * crash (`Cannot read properties of undefined (reading 'primary')`).
 *
 * Error boundaries only engage under the CLIENT renderer (SSR rethrows), so we
 * mount into a real jsdom container with `createRoot` + `act`. This needs no
 * @testing-library/dom peer dep — react-dom + jsdom already ship with the
 * template's toolchain.
 */
function Boom(): never {
  throw new Error("Cannot read properties of undefined (reading 'primary')");
}

// Tell React we're inside an act-aware environment so createRoot renders
// synchronously and doesn't warn.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(node: React.ReactNode): { html: string; cleanup: () => void } {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  const html = container.innerHTML;
  return {
    html,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe('SafeSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when nothing throws', () => {
    const { html, cleanup } = mount(
      <SafeSection name="ok">
        <p>healthy section</p>
      </SafeSection>
    );
    expect(html).toContain('healthy section');
    cleanup();
  });

  it('isolates a crashing section so siblings keep rendering', () => {
    // Silence the expected React error logs for the thrown render.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { html, cleanup } = mount(
      <div>
        <SafeSection name="crashy">
          <Boom />
        </SafeSection>
        <p>sibling survives</p>
      </div>
    );

    // The whole tree did NOT unwind — the sibling still paints.
    expect(html).toContain('sibling survives');
    // The crashing section was replaced by the fail-soft notice, not its
    // original content (in the test env import.meta.env.DEV is true, so the
    // notice surfaces the section name + message; in production it renders null).
    expect(html).toContain('failed to render');
    expect(html).toContain('crashy');
    cleanup();
  });

  it('renders a custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { html, cleanup } = mount(
      <SafeSection name="withFallback" fallback={() => <p>fallback content</p>}>
        <Boom />
      </SafeSection>
    );

    expect(html).toContain('fallback content');
    cleanup();
  });

  it('reports the crash to telemetry with the section name', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const capture = vi.fn();
    (window as unknown as { posthog?: { capture: typeof capture } }).posthog = { capture };

    const { cleanup } = mount(
      <SafeSection name="telemetry">
        <Boom />
      </SafeSection>
    );

    expect(capture).toHaveBeenCalledWith(
      'section_error',
      expect.objectContaining({ section: 'telemetry' })
    );

    delete (window as unknown as { posthog?: unknown }).posthog;
    cleanup();
  });
});
