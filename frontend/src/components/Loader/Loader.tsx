import styles from "./Loader.module.css";

export default function Loader(): React.JSX.Element {
  return (
    <div
      className={styles.loaderOverlay}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.loader}>
        <div className={styles.ring}>
          <div className={styles.logo}>
            <svg
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Clock border */}
              <circle
                cx="32"
                cy="32"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />

              {/* Clock marks */}
              <path
                d="M32 10V14 M32 50V54 M10 32H14 M50 32H54"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Hour hand */}
              <g>
                <path
                  d="M32 32V21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 32 32"
                  to="360 32 32"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Minute hand */}
              <g>
                <path
                  d="M32 32L44 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 32 32"
                  to="360 32 32"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Center point */}
              <circle cx="32" cy="32" r="4" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
