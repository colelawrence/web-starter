const toString = str => (typeof str === 'function' ? str.name : String(str));

export function getLogger(...names: (string | Function)[]): Logger {
  return createLogger(names.map(toString));
}

interface Logger {
  info(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  named(name: string): Logger;
}

function createLogger(names: string[] = []): Logger {
  const args = [];
  let prefix = '';
  names.forEach(name => {
    prefix += ` %c${name}`;
    args.push(`color: ${fancify(name, 'dark')}`);
  });
  return {
    info: console.info.bind(console, 'info' + prefix, ...args),
    debug: console.debug.bind(console, 'debug' + prefix, ...args),
    warn: console.warn.bind(console, 'warn' + prefix, ...args),
    error: console.error.bind(console, 'error' + prefix, ...args),
    named(name: string | Function) {
      return createLogger([...names, toString(name)]);
    },
  };
}

// Based on this HSL-based color generator: https://gist.github.com/bendc/76c48ce53299e6078a76
function fancify(seed: string, shade: 'light' | 'dark') {
  const t = hash(seed);

  const h = lerp(0, 360, t);
  const s = lerp(42, 98, t);
  const l = shade === 'light' ? lerp(15, 40, t) : lerp(40, 90, t);
  return `hsl(${h},${s}%,${l}%)`;
}

/** linear interpolation to an integer */
function lerp(from: number, to: number, step: number) {
  return Math.floor(step * (to - from + 1)) + from;
}

// Convert to number
function hash(str: string) {
  let hash = 0;
  let char: number;
  for (let i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return (Math.abs(hash) % 10000) * 0.0001;
}
