/**
 * eklo's mark — a sprout on a rounded-square badge. Same component and
 * source artwork (`public/eklo-logo.png`) as the main eklo.app product,
 * copied here rather than redrawn so the two sites' branding stays
 * pixel-identical.
 */
export function EkloMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/eklo-logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
