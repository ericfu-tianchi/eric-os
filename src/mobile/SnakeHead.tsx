import { forwardRef } from "react";
import { useOS } from "../store";
import { Hat, TONGUE, TONGUE_PATH } from "../components/DesktopSnake";

/**
 * The phone snake's head decor, the same as the desktop's: forked tongue, eyes and the hat from the wardrobe.
 * Drawn in 44-unit head-local coordinates facing right, over one grid cell (`size` px) and turned to `ang`.
 * The box is three cells wide so the tongue and the brims can stick out.
 */
export const SnakeHead = forwardRef<SVGSVGElement, { size: number; ang: number; style?: React.CSSProperties; className?: string }>(
  function SnakeHead({ size, ang, style, className }, ref) {
    const hat = useOS((s) => s.snakeHat);
    const c = 44, er = c * 0.125, pr = er * 0.42, fa = c / 2 - er * 1.5, pb = c * 0.21;
    return (
      <svg ref={ref} className={className} width={size * 3} height={size * 3} viewBox="-66 -66 132 132" overflow="visible" aria-hidden
        style={{ position: "absolute", pointerEvents: "none", ...style }}>
        <g className="rot" transform={`rotate(${ang})`}>
          <g transform="translate(23,0)"><path d={TONGUE_PATH} fill={TONGUE} /></g>
          {[-1, 1].map((k) => (
            <g key={k}>
              <circle cx={fa} cy={pb * k} r={er} fill="#fafafa" />
              <circle cx={fa + pr * 0.8} cy={pb * k} r={pr} fill="#363636" />
            </g>
          ))}
          <Hat hat={hat} ang={ang} />
        </g>
      </svg>
    );
  },
);

export const angleOf = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;
