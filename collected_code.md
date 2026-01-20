# Code Collection for options-platform2

## File: gather_code.py
```py
import os

# Configuration
TARGET_DIR = r"D:\options-platform2"
OUTPUT_FILE = "collected_code.md"  # Change to .txt if preferred
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', 'build', '__pycache__'}
# Add extensions you want to include
EXTENSIONS = {'.py', '.js', '.ts', '.tsx', '.css', '.html', '.json'}

def collect_code():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        outfile.write(f"# Code Collection for {os.path.basename(TARGET_DIR)}\n\n")
        
        for root, dirs, files in os.walk(TARGET_DIR):
            # Prune excluded directories in-place to stop os.walk from entering them
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in EXTENSIONS:
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, TARGET_DIR)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                        # Formatting for Markdown
                        outfile.write(f"## File: {relative_path}\n")
                        outfile.write(f"```{ext.strip('.')}\n")
                        outfile.write(content)
                        outfile.write("\n```\n\n")
                        print(f"Collected: {relative_path}")
                        
                    except Exception as e:
                        print(f"Skipped {relative_path}: {e}")

if __name__ == "__main__":
    collect_code()
    print(f"\nDone! All code saved to {OUTPUT_FILE}")

```

## File: generate_refactor.py
```py
"""
NSE Options Platform - Complete Refactor Generator
Run this script: python generate_refactor.py
This will create ALL 30 TypeScript files with complete code in one go!
"""

import os
from datetime import datetime
from pathlib import Path

BASE_DIR = r"D:\options-platform2\client\src"

print("=" * 60)
print("NSE OPTIONS PLATFORM - COMPLETE REFACTOR")
print("=" * 60)
print()
print(f"Target directory: {BASE_DIR}")
print()
input("Press ENTER to continue or Ctrl+C to cancel...")

# Backup existing App.tsx
app_file = Path(BASE_DIR) / "App.tsx"
if app_file.exists():
    backup_name = f"App.tsx.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    app_file.rename(Path(BASE_DIR) / backup_name)
    print(f"✓ Backed up to: {backup_name}")

# Create folder structure
folders = [
    "types", "utils", "services", "hooks", "context",
    "components/charts", "components/controls", "components/tables",
    "components/analytics", "components/modals", "components/common", "layouts"
]

for folder in folders:
    Path(BASE_DIR, folder).mkdir(parents=True, exist_ok=True)
print(f"✓ Created {len(folders)} folders")

# File contents dictionary
FILES = {}

# ============================================================================
# TYPES (4 files)
# ============================================================================

FILES["types/option.types.ts"] = """// Core option data types
export interface OptionRow {
  strike_price: number;
  ce_oi: number | null;
  ce_change_oi: number | null;
  ce_ltp: number | string | null;
  pe_oi: number | null;
  pe_change_oi: number | null;
  pe_ltp: number | string | null;
  underlying_value: string | number;
}

export interface CombinedStrikeData {
  strike: number;
  ceoi: number;
  peoi: number;
  cechange: number;
  pechange: number;
}

export interface StrikeTimelineData {
  timestamp: string;
  ltp: number;
  bid: number;
  ask: number;
  oi: number;
  volume: number;
}
"""

FILES["types/analytics.types.ts"] = """// Analytics calculation types
export interface Analytics {
  ceOi: number;
  peOi: number;
  pcr: string;
  peCeDiff: number;
  maxPain: number | null;
}

export interface StrikeRange {
  min: number;
  max: number;
}
"""

FILES["types/api.types.ts"] = """// API/IPC types
export interface GetSnapshotParams {
  symbol: string;
  expiry: string;
  timestamp: number;
}

export interface GetTimestampsParams {
  symbol: string;
  date: string;
  expiry: string;
}

export interface GetExpiriesParams {
  symbol: string;
  tradingdate: string;
}

export interface GetStrikeTimelineParams {
  symbol: string;
  strike: number;
  optionType: 'CE' | 'PE';
  date: string;
  expiry: string;
}

export interface Instrument {
  symbol: string;
  name: string;
}
"""

FILES["types/trading.types.ts"] = """// Trading calculation types
export interface Trade {
  timestamp: string;
  type: 'SELL' | 'BUY';
  quantity: number;
  price: number;
}

export interface PnLResult {
  realizedPnL: number;
  unrealizedPnL: number;
  totalPnL: number;
  openPositions: number;
  openTrades: Trade[];
}

export type AccountingMethod = 'FIFO' | 'LIFO';
"""

# ============================================================================
# UTILS (3 files)
# ============================================================================

FILES["utils/formatters.ts"] = """// Formatting utilities
export const formatNumber = (num: number, useCrores: boolean): string => {
  if (useCrores) {
    return (num / 10000000).toFixed(2) + ' Cr';
  }
  return (num / 100000).toFixed(1) + 'L';
};

export const formatTime = (isoString: string | null | undefined): string => {
  try {
    if (!isoString) return '--:--:--';
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return '--:--:--';
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  try {
    if (!dateString) return '--/--/----';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch {
    return '--/--/----';
  }
};
"""

FILES["utils/calculations.ts"] = """// Calculation utilities
export const safeNumber = (val: any, defaultVal: number = 0): number => {
  const num = parseFloat(String(val || 0));
  return isNaN(num) || !isFinite(num) ? defaultVal : num;
};

export const calculateOIChangePercent = (change: number, current: number): string => {
  if (current === 0) return '0.00%';
  return ((change / current) * 100).toFixed(2) + '%';
};

export const isStrikeATM = (strike: number, spotPrice: number, threshold: number = 100): boolean => {
  return Math.abs(strike - spotPrice) <= threshold;
};
"""

FILES["utils/validators.ts"] = """// Validation utilities
export const isValidArray = <T>(arr: any): arr is T[] => {
  return Array.isArray(arr) && arr.length > 0;
};

export const isValidNumber = (val: any): val is number => {
  return typeof val === 'number' && !isNaN(val) && isFinite(val);
};

export const isValidTimestamp = (timestamp: string): boolean => {
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
"""

# Write all files
print()
print("Creating files...")
for filepath, content in FILES.items():
    full_path = Path(BASE_DIR) / filepath.replace("/", os.sep)
    full_path.write_text(content, encoding='utf-8')
    print(f"  ✓ {filepath}")

print()
print("=" * 60)
print(f"✓ Created {len(FILES)} files successfully!")
print("=" * 60)
print()
print("IMPORTANT: This is Part 1 of 2")
print("Due to file size, run: python generate_refactor_part2.py")
print("to create remaining hooks, components, and main App.tsx")

```

## File: optionChainTable.tsx
```tsx

```

## File: package-lock.json
```json
{
  "name": "nse-options-orchestrator",
  "version": "1.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "nse-options-orchestrator",
      "version": "1.0.1",
      "dependencies": {
        "axios": "^1.6.0",
        "dotenv": "^16.4.5",
        "pg": "^8.11.3",
        "zod": "^3.22.4"
      },
      "devDependencies": {
        "concurrently": "^8.2.2",
        "electron": "^39.2.7",
        "typescript": "^5.0.0",
        "vite": "^5.0.0",
        "wait-on": "^7.2.0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.28.4",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.4.tgz",
      "integrity": "sha512-Q/N6JNWvIvPnLDvjlE1OUBLPQHH6l3CltCEsHIujp45zQUSSh8K+gHnaEX45yAT1nyngnINhvWtzN+Nb9D8RAQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@electron/get": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@electron/get/-/get-2.0.3.tgz",
      "integrity": "sha512-Qkzpg2s9GnVV2I2BjRksUi43U5e6+zaQMcjoJy0C+C5oxaKl+fmckGDQFtRpZpZV0NQekuZZ+tGz7EA9TVnQtQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^4.1.1",
        "env-paths": "^2.2.0",
        "fs-extra": "^8.1.0",
        "got": "^11.8.5",
        "progress": "^2.0.3",
        "semver": "^6.2.0",
        "sumchecker": "^3.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "optionalDependencies": {
        "global-agent": "^3.0.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.21.5.tgz",
      "integrity": "sha512-1SDgH6ZSPTlggy1yI6+Dbkiz8xzpHJEVAlF/AM1tHPLsf5STom9rwtjE4hKAF20FfXXNTFqEYXyJNWh1GiZedQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.21.5.tgz",
      "integrity": "sha512-vCPvzSjpPHEi1siZdlvAlsPxXl7WbOVUBBAowWug4rJHb68Ox8KualB+1ocNvT5fjv6wpkX6o/iEpbDrf68zcg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.21.5.tgz",
      "integrity": "sha512-c0uX9VAUBQ7dTDCjq+wdyGLowMdtR/GoC2U5IYk/7D1H1JYC0qseD7+11iMP2mRLN9RcCMRcjC4YMclCzGwS/A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.21.5.tgz",
      "integrity": "sha512-D7aPRUUNHRBwHxzxRvp856rjUHRFW1SdQATKXH2hqA0kAZb1hKmi02OpYRacl0TxIGz/ZmXWlbZgjwWYaCakTA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.21.5.tgz",
      "integrity": "sha512-DwqXqZyuk5AiWWf3UfLiRDJ5EDd49zg6O9wclZ7kUMv2WRFr4HKjXp/5t8JZ11QbQfUS6/cRCKGwYhtNAY88kQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.21.5.tgz",
      "integrity": "sha512-se/JjF8NlmKVG4kNIuyWMV/22ZaerB+qaSi5MdrXtd6R08kvs2qCN4C09miupktDitvh8jRFflwGFBQcxZRjbw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.21.5.tgz",
      "integrity": "sha512-5JcRxxRDUJLX8JXp/wcBCy3pENnCgBR9bN6JsY4OmhfUtIHe3ZW0mawA7+RDAcMLrMIZaf03NlQiX9DGyB8h4g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.21.5.tgz",
      "integrity": "sha512-J95kNBj1zkbMXtHVH29bBriQygMXqoVQOQYA+ISs0/2l3T9/kj42ow2mpqerRBxDJnmkUDCaQT/dfNXWX/ZZCQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.21.5.tgz",
      "integrity": "sha512-bPb5AHZtbeNGjCKVZ9UGqGwo8EUu4cLq68E95A53KlxAPRmUyYv2D6F0uUI65XisGOL1hBP5mTronbgo+0bFcA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.21.5.tgz",
      "integrity": "sha512-ibKvmyYzKsBeX8d8I7MH/TMfWDXBF3db4qM6sy+7re0YXya+K1cem3on9XgdT2EQGMu4hQyZhan7TeQ8XkGp4Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.21.5.tgz",
      "integrity": "sha512-YvjXDqLRqPDl2dvRODYmmhz4rPeVKYvppfGYKSNGdyZkA01046pLWyRKKI3ax8fbJoK5QbxblURkwK/MWY18Tg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.21.5.tgz",
      "integrity": "sha512-uHf1BmMG8qEvzdrzAqg2SIG/02+4/DHB6a9Kbya0XDvwDEKCoC8ZRWI5JJvNdUjtciBGFQ5PuBlpEOXQj+JQSg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.21.5.tgz",
      "integrity": "sha512-IajOmO+KJK23bj52dFSNCMsz1QP1DqM6cwLUv3W1QwyxkyIWecfafnI555fvSGqEKwjMXVLokcV5ygHW5b3Jbg==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.21.5.tgz",
      "integrity": "sha512-1hHV/Z4OEfMwpLO8rp7CvlhBDnjsC3CttJXIhBi+5Aj5r+MBvy4egg7wCbe//hSsT+RvDAG7s81tAvpL2XAE4w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.21.5.tgz",
      "integrity": "sha512-2HdXDMd9GMgTGrPWnJzP2ALSokE/0O5HhTUvWIbD3YdjME8JwvSCnNGBnTThKGEB91OZhzrJ4qIIxk/SBmyDDA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.21.5.tgz",
      "integrity": "sha512-zus5sxzqBJD3eXxwvjN1yQkRepANgxE9lgOW2qLnmr8ikMTphkjgXu1HR01K4FJg8h1kEEDAqDcZQtbrRnB41A==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.21.5.tgz",
      "integrity": "sha512-1rYdTpyv03iycF1+BhzrzQJCdOuAOtaqHTWJZCWvijKD2N5Xu0TtVC8/+1faWqcP9iBCWOmjmhoH94dH82BxPQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.21.5.tgz",
      "integrity": "sha512-Woi2MXzXjMULccIwMnLciyZH4nCIMpWQAs049KEeMvOcNADVxo0UBIQPfSmxB3CWKedngg7sWZdLvLczpe0tLg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.21.5.tgz",
      "integrity": "sha512-HLNNw99xsvx12lFBUwoT8EVCsSvRNDVxNpjZ7bPn947b8gJPzeHWyNVhFsaerc0n3TsbOINvRP2byTZ5LKezow==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.21.5.tgz",
      "integrity": "sha512-6+gjmFpfy0BHU5Tpptkuh8+uw3mnrvgs+dSPQXQOv3ekbordwnzTVEb4qnIvQcYXq6gzkyTnoZ9dZG+D4garKg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.21.5.tgz",
      "integrity": "sha512-Z0gOTd75VvXqyq7nsl93zwahcTROgqvuAcYDUr+vOv8uHhNSKROyU961kgtCD1e95IqPKSQKH7tBTslnS3tA8A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.21.5.tgz",
      "integrity": "sha512-SWXFF1CL2RVNMaVs+BBClwtfZSvDgtL//G/smwAc5oVK/UPu2Gu9tIaRgFmYFFKrmg3SyAjSrElf0TiJ1v8fYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.21.5.tgz",
      "integrity": "sha512-tQd/1efJuzPC6rCFwEvLtci/xNFcTZknmXs98FYDfGE4wP9ClFV98nyKrzJKVPMhdDnjzLhdUyMX4PsQAPjwIw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@hapi/hoek": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/@hapi/hoek/-/hoek-9.3.0.tgz",
      "integrity": "sha512-/c6rf4UJlmHlC9b5BaNvzAcFv7HZ2QHaV0D4/HNlBdvFnvQq8RI4kYdhyPCl7Xj+oWvTWQ8ujhqS53LIgAe6KQ==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/@hapi/topo": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/@hapi/topo/-/topo-5.1.0.tgz",
      "integrity": "sha512-foQZKJig7Ob0BMAYBfcJk8d77QtOe7Wo4ox7ff1lQYoNNAb6jwcY1ncdoy2e9wQZzvNy7ODZCYJkK8kzmcAnAg==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@hapi/hoek": "^9.0.0"
      }
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.55.1.tgz",
      "integrity": "sha512-9R0DM/ykwfGIlNu6+2U09ga0WXeZ9MRC2Ter8jnz8415VbuIykVuc6bhdrbORFZANDmTDvq26mJrEVTl8TdnDg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.55.1.tgz",
      "integrity": "sha512-eFZCb1YUqhTysgW3sj/55du5cG57S7UTNtdMjCW7LwVcj3dTTcowCsC8p7uBdzKsZYa8J7IDE8lhMI+HX1vQvg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.55.1.tgz",
      "integrity": "sha512-p3grE2PHcQm2e8PSGZdzIhCKbMCw/xi9XvMPErPhwO17vxtvCN5FEA2mSLgmKlCjHGMQTP6phuQTYWUnKewwGg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.55.1.tgz",
      "integrity": "sha512-rDUjG25C9qoTm+e02Esi+aqTKSBYwVTaoS1wxcN47/Luqef57Vgp96xNANwt5npq9GDxsH7kXxNkJVEsWEOEaQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.55.1.tgz",
      "integrity": "sha512-+JiU7Jbp5cdxekIgdte0jfcu5oqw4GCKr6i3PJTlXTCU5H5Fvtkpbs4XJHRmWNXF+hKmn4v7ogI5OQPaupJgOg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.55.1.tgz",
      "integrity": "sha512-V5xC1tOVWtLLmr3YUk2f6EJK4qksksOYiz/TCsFHu/R+woubcLWdC9nZQmwjOAbmExBIVKsm1/wKmEy4z4u4Bw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.55.1.tgz",
      "integrity": "sha512-Rn3n+FUk2J5VWx+ywrG/HGPTD9jXNbicRtTM11e/uorplArnXZYsVifnPPqNNP5BsO3roI4n8332ukpY/zN7rQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.55.1.tgz",
      "integrity": "sha512-grPNWydeKtc1aEdrJDWk4opD7nFtQbMmV7769hiAaYyUKCT1faPRm2av8CX1YJsZ4TLAZcg9gTR1KvEzoLjXkg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.55.1.tgz",
      "integrity": "sha512-a59mwd1k6x8tXKcUxSyISiquLwB5pX+fJW9TkWU46lCqD/GRDe9uDN31jrMmVP3feI3mhAdvcCClhV8V5MhJFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.55.1.tgz",
      "integrity": "sha512-puS1MEgWX5GsHSoiAsF0TYrpomdvkaXm0CofIMG5uVkP6IBV+ZO9xhC5YEN49nsgYo1DuuMquF9+7EDBVYu4uA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.55.1.tgz",
      "integrity": "sha512-r3Wv40in+lTsULSb6nnoudVbARdOwb2u5fpeoOAZjFLznp6tDU8kd+GTHmJoqZ9lt6/Sys33KdIHUaQihFcu7g==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.55.1.tgz",
      "integrity": "sha512-MR8c0+UxAlB22Fq4R+aQSPBayvYa3+9DrwG/i1TKQXFYEaoW3B5b/rkSRIypcZDdWjWnpcvxbNaAJDcSbJU3Lw==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.55.1.tgz",
      "integrity": "sha512-3KhoECe1BRlSYpMTeVrD4sh2Pw2xgt4jzNSZIIPLFEsnQn9gAnZagW9+VqDqAHgm1Xc77LzJOo2LdigS5qZ+gw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.55.1.tgz",
      "integrity": "sha512-ziR1OuZx0vdYZZ30vueNZTg73alF59DicYrPViG0NEgDVN8/Jl87zkAPu4u6VjZST2llgEUjaiNl9JM6HH1Vdw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.55.1.tgz",
      "integrity": "sha512-uW0Y12ih2XJRERZ4jAfKamTyIHVMPQnTZcQjme2HMVDAHY4amf5u414OqNYC+x+LzRdRcnIG1YodLrrtA8xsxw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.55.1.tgz",
      "integrity": "sha512-u9yZ0jUkOED1BFrqu3BwMQoixvGHGZ+JhJNkNKY/hyoEgOwlqKb62qu+7UjbPSHYjiVy8kKJHvXKv5coH4wDeg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.55.1.tgz",
      "integrity": "sha512-/0PenBCmqM4ZUd0190j7J0UsQ/1nsi735iPRakO8iPciE7BQ495Y6msPzaOmvx0/pn+eJVVlZrNrSh4WSYLxNg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.55.1.tgz",
      "integrity": "sha512-a8G4wiQxQG2BAvo+gU6XrReRRqj+pLS2NGXKm8io19goR+K8lw269eTrPkSdDTALwMmJp4th2Uh0D8J9bEV1vg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.55.1.tgz",
      "integrity": "sha512-bD+zjpFrMpP/hqkfEcnjXWHMw5BIghGisOKPj+2NaNDuVT+8Ds4mPf3XcPHuat1tz89WRL+1wbcxKY3WSbiT7w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.55.1.tgz",
      "integrity": "sha512-eLXw0dOiqE4QmvikfQ6yjgkg/xDM+MdU9YJuP4ySTibXU0oAvnEWXt7UDJmD4UkYialMfOGFPJnIHSe/kdzPxg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.55.1.tgz",
      "integrity": "sha512-xzm44KgEP11te3S2HCSyYf5zIzWmx3n8HDCc7EE59+lTcswEWNpvMLfd9uJvVX8LCg9QWG67Xt75AuHn4vgsXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.55.1.tgz",
      "integrity": "sha512-yR6Bl3tMC/gBok5cz/Qi0xYnVbIxGx5Fcf/ca0eB6/6JwOY+SRUcJfI0OpeTpPls7f194as62thCt/2BjxYN8g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.55.1.tgz",
      "integrity": "sha512-3fZBidchE0eY0oFZBnekYCfg+5wAB0mbpCBuofh5mZuzIU/4jIVkbESmd2dOsFNS78b53CYv3OAtwqkZZmU5nA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.55.1.tgz",
      "integrity": "sha512-xGGY5pXj69IxKb4yv/POoocPy/qmEGhimy/FoTpTSVju3FYXUQQMFCaZZXJVidsmGxRioZAwpThl/4zX41gRKg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.55.1.tgz",
      "integrity": "sha512-SPEpaL6DX4rmcXtnhdrQYgzQ5W2uW3SCJch88lB2zImhJRhIIK44fkUrgIV/Q8yUNfw5oyZ5vkeQsZLhCb06lw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@sideway/address": {
      "version": "4.1.5",
      "resolved": "https://registry.npmjs.org/@sideway/address/-/address-4.1.5.tgz",
      "integrity": "sha512-IqO/DUQHUkPeixNQ8n0JA6102hT9CmaljNTPmQ1u8MEhBo/R4Q8eKLN/vGZxuebwOroDB4cbpjheD4+/sKFK4Q==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@hapi/hoek": "^9.0.0"
      }
    },
    "node_modules/@sideway/formula": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@sideway/formula/-/formula-3.0.1.tgz",
      "integrity": "sha512-/poHZJJVjx3L+zVD6g9KgHfYnb443oi7wLu/XKojDviHy6HOEOA6z1Trk5aR1dGcmPenJEgb2sK2I80LeS3MIg==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/@sideway/pinpoint": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@sideway/pinpoint/-/pinpoint-2.0.0.tgz",
      "integrity": "sha512-RNiOoTPkptFtSVzQevY/yWtZwf/RxyVnPy/OcA9HBM3MlGDnBEYL5B41H0MTn0Uec8Hi+2qUtTfG2WWZBmMejQ==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/@sindresorhus/is": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/@sindresorhus/is/-/is-4.6.0.tgz",
      "integrity": "sha512-t09vSN3MdfsyCHoFcTRCH/iUtG7OJ0CsjzB8cjAmKc/va/kIgeDI/TxsigdncE/4be734m0cvIYwNaV4i2XqAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/is?sponsor=1"
      }
    },
    "node_modules/@szmarczak/http-timer": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/@szmarczak/http-timer/-/http-timer-4.0.6.tgz",
      "integrity": "sha512-4BAffykYOgO+5nzBWYwE3W90sBgLJoUPRWWcL8wlyiM8IB8ipJz3UMJ9KXQd1RKQXpKp8Tutn80HZtWsu2u76w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "defer-to-connect": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@types/cacheable-request": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/@types/cacheable-request/-/cacheable-request-6.0.3.tgz",
      "integrity": "sha512-IQ3EbTzGxIigb1I3qPZc1rWJnH0BmSKv5QYTalEwweFvyBDLSAe24zP0le/hyi7ecGfZVlIVAg4BZqb8WBwKqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/http-cache-semantics": "*",
        "@types/keyv": "^3.1.4",
        "@types/node": "*",
        "@types/responselike": "^1.0.0"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/http-cache-semantics": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/@types/http-cache-semantics/-/http-cache-semantics-4.0.4.tgz",
      "integrity": "sha512-1m0bIFVc7eJWyve9S0RnuRgcQqF/Xd5QsUZAZeQFr1Q3/p9JWoQQEqmVy+DPTNpGXwhgIetAoYF8JSc33q29QA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/keyv": {
      "version": "3.1.4",
      "resolved": "https://registry.npmjs.org/@types/keyv/-/keyv-3.1.4.tgz",
      "integrity": "sha512-BQ5aZNSCpj7D6K2ksrRCTmKRLEpnPvWDiLPfoGyhZ++8YtiK9d/3DBKPJgry359X/P1PfruyYwvnvwFjuEiEIg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "22.19.3",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.19.3.tgz",
      "integrity": "sha512-1N9SBnWYOJTrNZCdh/yJE+t910Y128BoyY+zBLWhL3r0TYzlTmFdXrPwHL9DyFZmlEXNQQolTZh3KHV31QDhyA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/responselike": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@types/responselike/-/responselike-1.0.3.tgz",
      "integrity": "sha512-H/+L+UkTV33uf49PH5pCAUBVPNj2nDBXTN+qS1dOwyyg24l3CcicicCA7ca+HMvJBZcFgl5r8e+RR6elsb4Lyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/yauzl": {
      "version": "2.10.3",
      "resolved": "https://registry.npmjs.org/@types/yauzl/-/yauzl-2.10.3.tgz",
      "integrity": "sha512-oJoftv0LSuaDZE3Le4DbKX+KS9G36NzOeSap90UIK0yMA/NhKJhqlSGtNDORNRaIbQfzjXDrQa0ytJ6mNRGz/Q==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT"
    },
    "node_modules/axios": {
      "version": "1.13.2",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.13.2.tgz",
      "integrity": "sha512-VPk9ebNqPcy5lRGuSlKx752IlDatOjT9paPlm8A7yOuW2Fbvp4X3JznJtT4f0GzGLLiWE9W8onz51SqLYwzGaA==",
      "license": "MIT",
      "dependencies": {
        "follow-redirects": "^1.15.6",
        "form-data": "^4.0.4",
        "proxy-from-env": "^1.1.0"
      }
    },
    "node_modules/boolean": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/boolean/-/boolean-3.2.0.tgz",
      "integrity": "sha512-d0II/GO9uf9lfUHH2BQsjxzRJZBdsjgsBiW4BvhWk/3qoKwQFjIDVN19PfX8F2D/r9PCMTtLWjYVCFrpeYUzsw==",
      "deprecated": "Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/buffer-crc32": {
      "version": "0.2.13",
      "resolved": "https://registry.npmjs.org/buffer-crc32/-/buffer-crc32-0.2.13.tgz",
      "integrity": "sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/cacheable-lookup": {
      "version": "5.0.4",
      "resolved": "https://registry.npmjs.org/cacheable-lookup/-/cacheable-lookup-5.0.4.tgz",
      "integrity": "sha512-2/kNscPhpcxrOigMZzbiWF7dz8ilhb/nIHU3EyZiXWXpeq/au8qJ8VhdftMkty3n7Gj6HIGalQG8oiBNB3AJgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10.6.0"
      }
    },
    "node_modules/cacheable-request": {
      "version": "7.0.4",
      "resolved": "https://registry.npmjs.org/cacheable-request/-/cacheable-request-7.0.4.tgz",
      "integrity": "sha512-v+p6ongsrp0yTGbJXjgxPow2+DL93DASP4kXCDKb8/bwRtt9OEF3whggkkDkGNzgcWy2XaF4a8nZglC7uElscg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "clone-response": "^1.0.2",
        "get-stream": "^5.1.0",
        "http-cache-semantics": "^4.0.0",
        "keyv": "^4.0.0",
        "lowercase-keys": "^2.0.0",
        "normalize-url": "^6.0.1",
        "responselike": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chalk/node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/clone-response": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/clone-response/-/clone-response-1.0.3.tgz",
      "integrity": "sha512-ROoL94jJH2dUVML2Y/5PEDNaSHgeOdSDicUyS7izcF63G6sTc/FTjLub4b8Il9S8S0beOfYt0TaA5qvFK+w0wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mimic-response": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/concurrently": {
      "version": "8.2.2",
      "resolved": "https://registry.npmjs.org/concurrently/-/concurrently-8.2.2.tgz",
      "integrity": "sha512-1dP4gpXFhei8IOtlXRE/T/4H88ElHgTiUzh71YUmtjTEHMSRS2Z/fgOxHSxxusGHogsRfxNq1vyAwxSC+EVyDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chalk": "^4.1.2",
        "date-fns": "^2.30.0",
        "lodash": "^4.17.21",
        "rxjs": "^7.8.1",
        "shell-quote": "^1.8.1",
        "spawn-command": "0.0.2",
        "supports-color": "^8.1.1",
        "tree-kill": "^1.2.2",
        "yargs": "^17.7.2"
      },
      "bin": {
        "conc": "dist/bin/concurrently.js",
        "concurrently": "dist/bin/concurrently.js"
      },
      "engines": {
        "node": "^14.13.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/open-cli-tools/concurrently?sponsor=1"
      }
    },
    "node_modules/date-fns": {
      "version": "2.30.0",
      "resolved": "https://registry.npmjs.org/date-fns/-/date-fns-2.30.0.tgz",
      "integrity": "sha512-fnULvOpxnC5/Vg3NCiWelDsLiUc9bRwAPs/+LfTLNvetFCtCTN+yQz15C/fs4AwX1R9K5GLtLfn8QW+dWisaAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.21.0"
      },
      "engines": {
        "node": ">=0.11"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/date-fns"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decompress-response": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/decompress-response/-/decompress-response-6.0.0.tgz",
      "integrity": "sha512-aW35yZM6Bb/4oJlZncMH2LCoZtJXTRxES17vE3hoRiowU2kWHaJKFkSBDnDR+cm9J+9QhXmREyIfv0pji9ejCQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mimic-response": "^3.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/decompress-response/node_modules/mimic-response": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-3.1.0.tgz",
      "integrity": "sha512-z0yWI+4FDrrweS8Zmt4Ej5HdJmky15+L2e6Wgn3+iK5fWzb6T3fhNFq2+MeTRb064c6Wr4N/wv0DzQTjNzHNGQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/defer-to-connect": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/defer-to-connect/-/defer-to-connect-2.0.1.tgz",
      "integrity": "sha512-4tvttepXG1VaYGrRibk5EwJd1t4udunSOVMdLSAL6mId1ix438oPwPZMALY41FCijukO1L0twNcGsdzS7dHgDg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/detect-node": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/detect-node/-/detect-node-2.1.0.tgz",
      "integrity": "sha512-T0NIuQpnTvFDATNuHN5roPwSBG83rFsuO+MXXH9/3N1eFbn4wcPjttvjMLEPWJ0RGUYgQE7cGgS3tNxbqCGM7g==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/dotenv": {
      "version": "16.6.1",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-16.6.1.tgz",
      "integrity": "sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron": {
      "version": "39.2.7",
      "resolved": "https://registry.npmjs.org/electron/-/electron-39.2.7.tgz",
      "integrity": "sha512-KU0uFS6LSTh4aOIC3miolcbizOFP7N1M46VTYVfqIgFiuA2ilfNaOHLDS9tCMvwwHRowAsvqBrh9NgMXcTOHCQ==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "@electron/get": "^2.0.0",
        "@types/node": "^22.7.7",
        "extract-zip": "^2.0.1"
      },
      "bin": {
        "electron": "cli.js"
      },
      "engines": {
        "node": ">= 12.20.55"
      }
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/end-of-stream": {
      "version": "1.4.5",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.5.tgz",
      "integrity": "sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/env-paths": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
      "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es6-error": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/es6-error/-/es6-error-4.1.1.tgz",
      "integrity": "sha512-Um/+FxMr9CISWh0bi5Zv0iOD+4cFh5qLeks1qhAopKVAJw3drgKbKySikp7wGhDL0HPeaja0P5ULZrxLkniUVg==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/esbuild": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.21.5.tgz",
      "integrity": "sha512-mg3OPMV4hXywwpoDxu3Qda5xCKQi+vCTZq8S9J/EpkhB2HzKXq4SNFZE3+NK93JYxc8VMSep+lOUSC/RVKaBqw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=12"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.21.5",
        "@esbuild/android-arm": "0.21.5",
        "@esbuild/android-arm64": "0.21.5",
        "@esbuild/android-x64": "0.21.5",
        "@esbuild/darwin-arm64": "0.21.5",
        "@esbuild/darwin-x64": "0.21.5",
        "@esbuild/freebsd-arm64": "0.21.5",
        "@esbuild/freebsd-x64": "0.21.5",
        "@esbuild/linux-arm": "0.21.5",
        "@esbuild/linux-arm64": "0.21.5",
        "@esbuild/linux-ia32": "0.21.5",
        "@esbuild/linux-loong64": "0.21.5",
        "@esbuild/linux-mips64el": "0.21.5",
        "@esbuild/linux-ppc64": "0.21.5",
        "@esbuild/linux-riscv64": "0.21.5",
        "@esbuild/linux-s390x": "0.21.5",
        "@esbuild/linux-x64": "0.21.5",
        "@esbuild/netbsd-x64": "0.21.5",
        "@esbuild/openbsd-x64": "0.21.5",
        "@esbuild/sunos-x64": "0.21.5",
        "@esbuild/win32-arm64": "0.21.5",
        "@esbuild/win32-ia32": "0.21.5",
        "@esbuild/win32-x64": "0.21.5"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/extract-zip": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/extract-zip/-/extract-zip-2.0.1.tgz",
      "integrity": "sha512-GDhU9ntwuKyGXdZBUgTIe+vXnWj0fppUEtMDL0+idd5Sta8TGpHssn/eusA9mrPr9qNDym6SxAYZjNvCn/9RBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "debug": "^4.1.1",
        "get-stream": "^5.1.0",
        "yauzl": "^2.10.0"
      },
      "bin": {
        "extract-zip": "cli.js"
      },
      "engines": {
        "node": ">= 10.17.0"
      },
      "optionalDependencies": {
        "@types/yauzl": "^2.9.1"
      }
    },
    "node_modules/fd-slicer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/fd-slicer/-/fd-slicer-1.1.0.tgz",
      "integrity": "sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pend": "~1.2.0"
      }
    },
    "node_modules/follow-redirects": {
      "version": "1.15.11",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.15.11.tgz",
      "integrity": "sha512-deG2P0JfjrTxl50XGCDyfI97ZGVCxIpfKYmfyrQ54n5FO/0gfIES8C/Psl6kWVDolizcaaxZJnTS0QSMxvnsBQ==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/form-data": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.5.tgz",
      "integrity": "sha512-8RipRLol37bNs2bhoV67fiTEvdTrbMUYcFTiy3+wuuOnUog2QBHCZWXDRijWQfAkhBj2Uf5UnVaiWwA5vdd82w==",
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.12"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fs-extra": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-8.1.0.tgz",
      "integrity": "sha512-yhlQgA6mnOJUKOsRUFsgJdQCvkKhcz8tlZG5HBQfReYZy46OwLcY+Zia0mtdHsOo9y/hP+CxMN0TU9QxoOtG4g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.0",
        "jsonfile": "^4.0.0",
        "universalify": "^0.1.0"
      },
      "engines": {
        "node": ">=6 <7 || >=8"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-stream": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-5.2.0.tgz",
      "integrity": "sha512-nBF+F1rAZVCu/p7rjzgA+Yb4lfYXrpl7a6VmJrU8wF9I1CKvP/QwPNZHnOlwbTkY6dvtFIzFMSyQXbLoTQPRpA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pump": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/global-agent": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/global-agent/-/global-agent-3.0.0.tgz",
      "integrity": "sha512-PT6XReJ+D07JvGoxQMkT6qji/jVNfX/h364XHZOWeRzy64sSFr+xJ5OX7LI3b4MPQzdL4H8Y8M0xzPpsVMwA8Q==",
      "dev": true,
      "license": "BSD-3-Clause",
      "optional": true,
      "dependencies": {
        "boolean": "^3.0.1",
        "es6-error": "^4.1.1",
        "matcher": "^3.0.0",
        "roarr": "^2.15.3",
        "semver": "^7.3.2",
        "serialize-error": "^7.0.1"
      },
      "engines": {
        "node": ">=10.0"
      }
    },
    "node_modules/global-agent/node_modules/semver": {
      "version": "7.7.3",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.3.tgz",
      "integrity": "sha512-SdsKMrI9TdgjdweUSR9MweHA4EJ8YxHn8DFaDisvhVlUOe4BF1tLD7GAj0lIqWVl+dPb/rExr0Btby5loQm20Q==",
      "dev": true,
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/got": {
      "version": "11.8.6",
      "resolved": "https://registry.npmjs.org/got/-/got-11.8.6.tgz",
      "integrity": "sha512-6tfZ91bOr7bOXnK7PRDCGBLa1H4U080YHNaAQ2KsMGlLEzRbk44nsZF2E1IeRc3vtJHPVbKCYgdFbaGO2ljd8g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@sindresorhus/is": "^4.0.0",
        "@szmarczak/http-timer": "^4.0.5",
        "@types/cacheable-request": "^6.0.1",
        "@types/responselike": "^1.0.0",
        "cacheable-lookup": "^5.0.3",
        "cacheable-request": "^7.0.2",
        "decompress-response": "^6.0.0",
        "http2-wrapper": "^1.0.0-beta.5.2",
        "lowercase-keys": "^2.0.0",
        "p-cancelable": "^2.0.0",
        "responselike": "^2.0.0"
      },
      "engines": {
        "node": ">=10.19.0"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/got?sponsor=1"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-cache-semantics": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/http-cache-semantics/-/http-cache-semantics-4.2.0.tgz",
      "integrity": "sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/http2-wrapper": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/http2-wrapper/-/http2-wrapper-1.0.3.tgz",
      "integrity": "sha512-V+23sDMr12Wnz7iTcDeJr3O6AIxlnvT/bmaAAAP/Xda35C90p9599p0F1eHR/N1KILWSoWVAiOMFjBBXaXSMxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "quick-lru": "^5.1.1",
        "resolve-alpn": "^1.0.0"
      },
      "engines": {
        "node": ">=10.19.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/joi": {
      "version": "17.13.3",
      "resolved": "https://registry.npmjs.org/joi/-/joi-17.13.3.tgz",
      "integrity": "sha512-otDA4ldcIx+ZXsKHWmp0YizCweVRZG96J10b0FevjfuncLO1oX59THoAmHkNubYJ+9gWsYsp5k8v4ib6oDv1fA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@hapi/hoek": "^9.3.0",
        "@hapi/topo": "^5.1.0",
        "@sideway/address": "^4.1.5",
        "@sideway/formula": "^3.0.1",
        "@sideway/pinpoint": "^2.0.0"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stringify-safe": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz",
      "integrity": "sha512-ZClg6AaYvamvYEE82d3Iyd3vSSIjQ+odgjaTzRuO3s7toCdFKczob2i0zCh7JE8kWn17yvAWhUVxvqGwUalsRA==",
      "dev": true,
      "license": "ISC",
      "optional": true
    },
    "node_modules/jsonfile": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-4.0.0.tgz",
      "integrity": "sha512-m6F1R3z8jjlf2imQHS2Qez5sjKWQzbuuhuJ/FKYFRZvPE3PuHcSMVZzfsLhGVOkfd20obL5SWEBew5ShlquNxg==",
      "dev": true,
      "license": "MIT",
      "optionalDependencies": {
        "graceful-fs": "^4.1.6"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/lowercase-keys": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/lowercase-keys/-/lowercase-keys-2.0.0.tgz",
      "integrity": "sha512-tqNXrS78oMOE73NMxK4EMLQsQowWf8jKooH9g7xPavRT706R6bkQJ6DY2Te7QukaZsulxa30wQ7bk0pm4XiHmA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/matcher": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/matcher/-/matcher-3.0.0.tgz",
      "integrity": "sha512-OkeDaAZ/bQCxeFAozM55PKcKU0yJMPGifLwV4Qgjitu+5MoAfSQN4lsLJeXZ1b8w0x+/Emda6MZgXS1jvsapng==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "escape-string-regexp": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mimic-response": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-1.0.1.tgz",
      "integrity": "sha512-j5EctnkH7amfV/q5Hgmoal1g2QHFJRraOtmx0JpIqkxhBhI/lJSl1nMpQ45hVarwNETOoWEimndZ4QK0RHxuxQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.11",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
      "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/normalize-url": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/normalize-url/-/normalize-url-6.1.0.tgz",
      "integrity": "sha512-DlL+XwOy3NxAQ8xuC0okPgK46iuVNAK01YN7RueYBqqFeGsBjV9XmCAzAdgt+667bCl5kPh9EqKKDwnaPG1I7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/p-cancelable": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/p-cancelable/-/p-cancelable-2.1.1.tgz",
      "integrity": "sha512-BZOr3nRQHOntUjTrH8+Lh54smKHoHyur8We1V8DSMVrl5A2malOOwuJRnKRDjSnkoeBh4at6BwEnb5I7Jl31wg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/pend": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/pend/-/pend-1.2.0.tgz",
      "integrity": "sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/pg": {
      "version": "8.16.3",
      "resolved": "https://registry.npmjs.org/pg/-/pg-8.16.3.tgz",
      "integrity": "sha512-enxc1h0jA/aq5oSDMvqyW3q89ra6XIIDZgCX9vkMrnz5DFTw/Ny3Li2lFQ+pt3L6MCgm/5o2o8HW9hiJji+xvw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "pg-connection-string": "^2.9.1",
        "pg-pool": "^3.10.1",
        "pg-protocol": "^1.10.3",
        "pg-types": "2.2.0",
        "pgpass": "1.0.5"
      },
      "engines": {
        "node": ">= 16.0.0"
      },
      "optionalDependencies": {
        "pg-cloudflare": "^1.2.7"
      },
      "peerDependencies": {
        "pg-native": ">=3.0.1"
      },
      "peerDependenciesMeta": {
        "pg-native": {
          "optional": true
        }
      }
    },
    "node_modules/pg-cloudflare": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/pg-cloudflare/-/pg-cloudflare-1.2.7.tgz",
      "integrity": "sha512-YgCtzMH0ptvZJslLM1ffsY4EuGaU0cx4XSdXLRFae8bPP4dS5xL1tNB3k2o/N64cHJpwU7dxKli/nZ2lUa5fLg==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/pg-connection-string": {
      "version": "2.9.1",
      "resolved": "https://registry.npmjs.org/pg-connection-string/-/pg-connection-string-2.9.1.tgz",
      "integrity": "sha512-nkc6NpDcvPVpZXxrreI/FOtX3XemeLl8E0qFr6F2Lrm/I8WOnaWNhIPK2Z7OHpw7gh5XJThi6j6ppgNoaT1w4w==",
      "license": "MIT"
    },
    "node_modules/pg-int8": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/pg-int8/-/pg-int8-1.0.1.tgz",
      "integrity": "sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==",
      "license": "ISC",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/pg-pool": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/pg-pool/-/pg-pool-3.10.1.tgz",
      "integrity": "sha512-Tu8jMlcX+9d8+QVzKIvM/uJtp07PKr82IUOYEphaWcoBhIYkoHpLXN3qO59nAI11ripznDsEzEv8nUxBVWajGg==",
      "license": "MIT",
      "peerDependencies": {
        "pg": ">=8.0"
      }
    },
    "node_modules/pg-protocol": {
      "version": "1.10.3",
      "resolved": "https://registry.npmjs.org/pg-protocol/-/pg-protocol-1.10.3.tgz",
      "integrity": "sha512-6DIBgBQaTKDJyxnXaLiLR8wBpQQcGWuAESkRBX/t6OwA8YsqP+iVSiond2EDy6Y/dsGk8rh/jtax3js5NeV7JQ==",
      "license": "MIT"
    },
    "node_modules/pg-types": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/pg-types/-/pg-types-2.2.0.tgz",
      "integrity": "sha512-qTAAlrEsl8s4OiEQY69wDvcMIdQN6wdz5ojQiOy6YRMuynxenON0O5oCpJI6lshc6scgAY8qvJ2On/p+CXY0GA==",
      "license": "MIT",
      "dependencies": {
        "pg-int8": "1.0.1",
        "postgres-array": "~2.0.0",
        "postgres-bytea": "~1.0.0",
        "postgres-date": "~1.0.4",
        "postgres-interval": "^1.1.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/pgpass": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/pgpass/-/pgpass-1.0.5.tgz",
      "integrity": "sha512-FdW9r/jQZhSeohs1Z3sI1yxFQNFvMcnmfuj4WBMUTxOrAyLMaTcE1aAMBiTlbMNaXvBCQuVi0R7hd8udDSP7ug==",
      "license": "MIT",
      "dependencies": {
        "split2": "^4.1.0"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/postcss": {
      "version": "8.5.6",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.6.tgz",
      "integrity": "sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postgres-array": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/postgres-array/-/postgres-array-2.0.0.tgz",
      "integrity": "sha512-VpZrUqU5A69eQyW2c5CA1jtLecCsN2U/bD6VilrFDWq5+5UIEVO7nazS3TEcHf1zuPYO/sqGvUvW62g86RXZuA==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postgres-bytea": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/postgres-bytea/-/postgres-bytea-1.0.1.tgz",
      "integrity": "sha512-5+5HqXnsZPE65IJZSMkZtURARZelel2oXUEO8rH83VS/hxH5vv1uHquPg5wZs8yMAfdv971IU+kcPUczi7NVBQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/postgres-date": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/postgres-date/-/postgres-date-1.0.7.tgz",
      "integrity": "sha512-suDmjLVQg78nMK2UZ454hAG+OAW+HQPZ6n++TNDUX+L0+uUlLywnoxJKDou51Zm+zTCjrCl0Nq6J9C5hP9vK/Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/postgres-interval": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/postgres-interval/-/postgres-interval-1.2.0.tgz",
      "integrity": "sha512-9ZhXKM/rw350N1ovuWHbGxnGh/SNJ4cnxHiM0rxE4VN41wsg8P8zWn9hv/buK00RP4WvlOyr/RBDiptyxVbkZQ==",
      "license": "MIT",
      "dependencies": {
        "xtend": "^4.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/progress": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/progress/-/progress-2.0.3.tgz",
      "integrity": "sha512-7PiHtLll5LdnKIMw100I+8xJXR5gW2QwWYkT6iJva0bXitZKa/XMrSbdmg3r2Xnaidz9Qumd0VPaMrZlF9V9sA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-1.1.0.tgz",
      "integrity": "sha512-D+zkORCbA9f1tdWRK0RaCR3GPv50cMxcrz4X8k5LTSUD1Dkw47mKJEZQNunItRTkWwgtaUSo1RVFRIG9ZXiFYg==",
      "license": "MIT"
    },
    "node_modules/pump": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.3.tgz",
      "integrity": "sha512-todwxLMY7/heScKmntwQG8CXVkWUOdYxIvY2s0VWAAMh/nd8SoYiRaKjlr7+iCs984f2P8zvrfWcDDYVb73NfA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "end-of-stream": "^1.1.0",
        "once": "^1.3.1"
      }
    },
    "node_modules/quick-lru": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/quick-lru/-/quick-lru-5.1.1.tgz",
      "integrity": "sha512-WuyALRjWPDGtt/wzJiadO5AXY+8hZ80hVpe6MyivgraREW751X3SbhRvG3eLKOYN+8VEvqLcf3wdnt44Z4S4SA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/resolve-alpn": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/resolve-alpn/-/resolve-alpn-1.2.1.tgz",
      "integrity": "sha512-0a1F4l73/ZFZOakJnQ3FvkJ2+gSTQWz/r2KE5OdDY0TxPm5h4GkqkWWfM47T7HsbnOtcJVEF4epCVy6u7Q3K+g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/responselike": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/responselike/-/responselike-2.0.1.tgz",
      "integrity": "sha512-4gl03wn3hj1HP3yzgdI7d3lCkF95F21Pz4BPGvKHinyQzALR5CapwC8yIi0Rh58DEMQ/SguC03wFj2k0M/mHhw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lowercase-keys": "^2.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/roarr": {
      "version": "2.15.4",
      "resolved": "https://registry.npmjs.org/roarr/-/roarr-2.15.4.tgz",
      "integrity": "sha512-CHhPh+UNHD2GTXNYhPWLnU8ONHdI+5DI+4EYIAOaiD63rHeYlZvyh8P+in5999TTSFgUYuKUAjzRI4mdh/p+2A==",
      "dev": true,
      "license": "BSD-3-Clause",
      "optional": true,
      "dependencies": {
        "boolean": "^3.0.1",
        "detect-node": "^2.0.4",
        "globalthis": "^1.0.1",
        "json-stringify-safe": "^5.0.1",
        "semver-compare": "^1.0.0",
        "sprintf-js": "^1.1.2"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/rollup": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.55.1.tgz",
      "integrity": "sha512-wDv/Ht1BNHB4upNbK74s9usvl7hObDnvVzknxqY/E/O3X6rW1U1rV1aENEfJ54eFZDTNo7zv1f5N4edCluH7+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.55.1",
        "@rollup/rollup-android-arm64": "4.55.1",
        "@rollup/rollup-darwin-arm64": "4.55.1",
        "@rollup/rollup-darwin-x64": "4.55.1",
        "@rollup/rollup-freebsd-arm64": "4.55.1",
        "@rollup/rollup-freebsd-x64": "4.55.1",
        "@rollup/rollup-linux-arm-gnueabihf": "4.55.1",
        "@rollup/rollup-linux-arm-musleabihf": "4.55.1",
        "@rollup/rollup-linux-arm64-gnu": "4.55.1",
        "@rollup/rollup-linux-arm64-musl": "4.55.1",
        "@rollup/rollup-linux-loong64-gnu": "4.55.1",
        "@rollup/rollup-linux-loong64-musl": "4.55.1",
        "@rollup/rollup-linux-ppc64-gnu": "4.55.1",
        "@rollup/rollup-linux-ppc64-musl": "4.55.1",
        "@rollup/rollup-linux-riscv64-gnu": "4.55.1",
        "@rollup/rollup-linux-riscv64-musl": "4.55.1",
        "@rollup/rollup-linux-s390x-gnu": "4.55.1",
        "@rollup/rollup-linux-x64-gnu": "4.55.1",
        "@rollup/rollup-linux-x64-musl": "4.55.1",
        "@rollup/rollup-openbsd-x64": "4.55.1",
        "@rollup/rollup-openharmony-arm64": "4.55.1",
        "@rollup/rollup-win32-arm64-msvc": "4.55.1",
        "@rollup/rollup-win32-ia32-msvc": "4.55.1",
        "@rollup/rollup-win32-x64-gnu": "4.55.1",
        "@rollup/rollup-win32-x64-msvc": "4.55.1",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",
      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/semver-compare": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/semver-compare/-/semver-compare-1.0.0.tgz",
      "integrity": "sha512-YM3/ITh2MJ5MtzaM429anh+x2jiLVjqILF4m4oyQB18W7Ggea7BfqdH/wGMK7dDiMghv/6WG7znWMwUDzJiXow==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/serialize-error": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/serialize-error/-/serialize-error-7.0.1.tgz",
      "integrity": "sha512-8I8TjW5KMOKsZQTvoxjuSIa7foAwPWGOts+6o7sgjz41/qMD9VQHEDxi6PBvK2l0MXUmqZyNpUK+T2tQaaElvw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "type-fest": "^0.13.1"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/shell-quote": {
      "version": "1.8.3",
      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.8.3.tgz",
      "integrity": "sha512-ObmnIF4hXNg1BqhnHmgbDETF8dLPCggZWBjkQfhZpbszZnYur5DUljTcCHii5LC3J5E0yeO/1LIMyH+UvHQgyw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/spawn-command": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/spawn-command/-/spawn-command-0.0.2.tgz",
      "integrity": "sha512-zC8zGoGkmc8J9ndvml8Xksr1Amk9qBujgbF0JAIWO7kXr43w0h/0GJNM/Vustixu+YE8N/MTrQ7N31FvHUACxQ==",
      "dev": true
    },
    "node_modules/split2": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/split2/-/split2-4.2.0.tgz",
      "integrity": "sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==",
      "license": "ISC",
      "engines": {
        "node": ">= 10.x"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.1.3.tgz",
      "integrity": "sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "optional": true
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/sumchecker": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/sumchecker/-/sumchecker-3.0.1.tgz",
      "integrity": "sha512-MvjXzkz/BOfyVDkG0oFOtBxHX2u3gKbMHIF/dXblZsgD3BWOFLmHovIpZY7BykJdAjcqRCBi1WYBNdEC9yI7vg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "debug": "^4.1.0"
      },
      "engines": {
        "node": ">= 8.0"
      }
    },
    "node_modules/supports-color": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",
      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/tree-kill": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/tree-kill/-/tree-kill-1.2.2.tgz",
      "integrity": "sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "tree-kill": "cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "dev": true,
      "license": "0BSD"
    },
    "node_modules/type-fest": {
      "version": "0.13.1",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.13.1.tgz",
      "integrity": "sha512-34R7HTnG0XIJcBSn5XhDd7nNFPRcXYRZrBB2O2jdKqYODldSzBAqzsWoZYYvduky73toYS/ESqxPvkDf/F0XMg==",
      "dev": true,
      "license": "(MIT OR CC0-1.0)",
      "optional": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/universalify": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-0.1.2.tgz",
      "integrity": "sha512-rBJeI5CXAlmy1pV+617WB9J63U6XcazHHF2f2dbJix4XzpUF0RS3Zbj0FGIOCAva5P/d/GBOYaACQ1w+0azUkg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4.0.0"
      }
    },
    "node_modules/vite": {
      "version": "5.4.21",
      "resolved": "https://registry.npmjs.org/vite/-/vite-5.4.21.tgz",
      "integrity": "sha512-o5a9xKjbtuhY6Bi5S3+HvbRERmouabWbyUcpXXUA1u+GNUKoROi9byOJ8M0nHbHYHkYICiMlqxkg1KkYmm25Sw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.21.3",
        "postcss": "^8.4.43",
        "rollup": "^4.20.0"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^18.0.0 || >=20.0.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^18.0.0 || >=20.0.0",
        "less": "*",
        "lightningcss": "^1.21.0",
        "sass": "*",
        "sass-embedded": "*",
        "stylus": "*",
        "sugarss": "*",
        "terser": "^5.4.0"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        }
      }
    },
    "node_modules/wait-on": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/wait-on/-/wait-on-7.2.0.tgz",
      "integrity": "sha512-wCQcHkRazgjG5XoAq9jbTMLpNIjoSlZslrJ2+N9MxDsGEv1HnFoVjOCexL0ESva7Y9cu350j+DWADdk54s4AFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "axios": "^1.6.1",
        "joi": "^17.11.0",
        "lodash": "^4.17.21",
        "minimist": "^1.2.8",
        "rxjs": "^7.8.1"
      },
      "bin": {
        "wait-on": "bin/wait-on"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/xtend": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/xtend/-/xtend-4.0.2.tgz",
      "integrity": "sha512-LKYU1iAXJXUgAXn9URjiu+MWhyUXHsvfp7mcuYm9dSUKK0/CjtrUwFAxD82/mCWbtLsGjFIad0wIsod4zrTAEQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yauzl": {
      "version": "2.10.0",
      "resolved": "https://registry.npmjs.org/yauzl/-/yauzl-2.10.0.tgz",
      "integrity": "sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "buffer-crc32": "~0.2.3",
        "fd-slicer": "~1.1.0"
      }
    },
    "node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}

```

## File: package.json
```json
{
  "name": "nse-options-orchestrator",
  "version": "1.0.1",
  "private": true,
  "description": "Electron + Vite + React NSE Options Platform",
  "main": "server/dist/main.js",
  "scripts": {
    "dev": "concurrently \"npm run build:watch\" \"npm run electron\"",
    "build": "tsc -p tsconfig.json",
    "build:watch": "tsc -p tsconfig.json --watch",
    "electron": "wait-on http://localhost:5173 && electron ."
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0",
    "typescript": "^5.0.0",
    "electron": "^39.2.7",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "axios": "^1.6.0"
  }
}
```

## File: tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ES2020"
        ],
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx",
        "strict": true,
        "skipLibCheck": true,
        "isolatedModules": true,
        "noEmit": true
    },
    "include": [
        "src"
    ]
}
```

## File: useOptionChain.ts
```ts
// ✅ CORRECTED: useOptionChain.ts
import { useState, useEffect } from 'react';

export function useOptionChain(
    symbol: string,
    selectedExpiries: string[],
    timestamp: string
) {
    const [dataByExpiry, setDataByExpiry] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ FIXED: Validate all parameters before fetching
        if (!symbol || !timestamp || selectedExpiries.length === 0) {
            console.log('⏭️ Skipping fetch - missing parameters:', {
                symbol: !!symbol,
                timestamp: !!timestamp,
                expiriesCount: selectedExpiries.length
            });
            setDataByExpiry({});
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const allData: Record<string, any[]> = {};

                for (const expiry of selectedExpiries) {
                    try {
                        console.log(`📊 Fetching snapshot:`, {
                            symbol,
                            expiry,
                            timestamp
                        });

                        // ✅ FIXED: Pass correct parameters
                        const result = await window.api.getSnapshot({
                            symbol,
                            expiry,  // This is now the actual date string
                            timestamp  // This is now the ISO string
                        });

                        allData[expiry] = result || [];
                        console.log(`✅ Loaded ${result?.length || 0} rows for ${expiry}`);
                    } catch (err: any) {
                        // ✅ FIXED: Proper quote escaping
                        console.error(`❌ Failed to fetch data for ${expiry}:`, err);
                        allData[expiry] = [];
                        setError(err.message);
                    }
                }

                setDataByExpiry(allData);
            } catch (err: any) {
                console.error('Failed to fetch option chain:', err);
                setError(err.message);
                setDataByExpiry({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, timestamp, JSON.stringify(selectedExpiries)]);

    return { dataByExpiry, loading, error };
}

```

## File: .vscode\settings.json
```json
{
    "git.ignoreLimitWarning": true
}
```

## File: client\index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NSE Options Platform</title>
</head>

<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>

</html>
```

## File: client\package-lock.json
```json
{
  "name": "options-dashboard",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "options-dashboard",
      "version": "0.1.0",
      "dependencies": {
        "axios": "^1.13.2",
        "black-scholes": "^1.1.0",
        "lucide-react": "^0.468.0",
        "mathjs": "^15.1.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^7.12.0"
      },
      "devDependencies": {
        "@vitejs/plugin-react": "^5.1.2",
        "autoprefixer": "^10.4.23",
        "postcss": "^8.5.6",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.9.3",
        "vite": "^7.3.1"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
      "integrity": "sha512-cjQ7ZlQ0Mv3b47hABuTevyTuYN4i+loJKGeV9flcCgIK37cCXRh+L1bd3iBHlynerhQ7BhCkn2BPbQUL+rGqFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.27.1",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.28.5.tgz",
      "integrity": "sha512-6uFXyCayocRbqhZOB+6XcuZbkMNimwfVGFji8CTZnCzOHVGvDqzvitu1re2AU5LROliz7eQPhB8CpAMvnx9EjA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.28.5.tgz",
      "integrity": "sha512-e7jT4DxYvIDLk1ZHmU/m/mB19rex9sv0c2ftBtjSBv+kVM/902eh0fINUzD7UwLLNR+jU585GxUJ8/EBfAM5fw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.27.1",
        "@babel/generator": "^7.28.5",
        "@babel/helper-compilation-targets": "^7.27.2",
        "@babel/helper-module-transforms": "^7.28.3",
        "@babel/helpers": "^7.28.4",
        "@babel/parser": "^7.28.5",
        "@babel/template": "^7.27.2",
        "@babel/traverse": "^7.28.5",
        "@babel/types": "^7.28.5",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.28.5.tgz",
      "integrity": "sha512-3EwLFhZ38J4VyIP6WNtt2kUdW9dokXA9Cr4IVIFHuCpZ3H8/YFOl5JjZHisrn1fATPBmKKqXzDFvh9fUwHz6CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.28.5",
        "@babel/types": "^7.28.5",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.27.2",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.27.2.tgz",
      "integrity": "sha512-2+1thGUUWWjLTYTHZWK1n8Yga0ijBz1XAhUXcKy81rd5g6yh7hGqMp45v7cadSbEHc9G3OTv45SyneRN3ps4DQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.27.2",
        "@babel/helper-validator-option": "^7.27.1",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.27.1.tgz",
      "integrity": "sha512-0gSFWUPNXNopqtIPQvlD5WgXYI5GY2kP2cCvoT8kczjbfcfuIljTbcWrulD1CIPIX2gt1wghbDy08yE1p+/r3w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.27.1",
        "@babel/types": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.28.3",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.3.tgz",
      "integrity": "sha512-gytXUbs8k2sXS9PnQptz5o0QnpLL51SwASIORY6XaBKF88nsOT0Zw9szLqlSGQDP/4TljBAD5y98p2U1fqkdsw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.27.1",
        "@babel/traverse": "^7.28.3"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.27.1.tgz",
      "integrity": "sha512-1gn1Up5YXka3YYAHGKpbideQ5Yjf1tDa9qYcgysz+cNCXukyLl6DjPXhD3VRwSb8c0J9tA4b2+rHEZtc6R0tlw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.28.4",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.28.4.tgz",
      "integrity": "sha512-HFN59MmQXGHVyYadKLVumYsA9dBFun/ldYxipEjzA4196jpLZd8UjEEBLkbEkvfYreDqJhZxYAWFPtrfhNpj4w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.27.2",
        "@babel/types": "^7.28.4"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.28.5.tgz",
      "integrity": "sha512-KKBU1VGYR7ORr3At5HAtUQ+TV3SzRCXmA/8OdDZiLDBIZxVyzXuztPjfLd3BV1PRAQGCMWWSHYhL0F8d5uHBDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.5"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-self": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-source": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
      "integrity": "sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.6.tgz",
      "integrity": "sha512-05WQkdpL9COIMz4LjTxGpPNCdlpyimKppYNoJ5Di5EUObifl8t4tuLuUBBZEpoLYOmfvIWrsp9fCl0HoPRVTdA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.27.2",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.27.2.tgz",
      "integrity": "sha512-LPDZ85aEJyYSd18/DkjNh4/y1ntkE5KwUHWTiqgRxruuZL2F1yuHligVHLvcHY2vMHXttKFpJn6LwfI7cw7ODw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.27.1",
        "@babel/parser": "^7.27.2",
        "@babel/types": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.28.5.tgz",
      "integrity": "sha512-TCCj4t55U90khlYkVV/0TfkJkAkUg3jZFA3Neb7unZT8CPok7iiRfaX0F+WnqWqt7OxhOn0uBKXCw4lbL8W0aQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.27.1",
        "@babel/generator": "^7.28.5",
        "@babel/helper-globals": "^7.28.0",
        "@babel/parser": "^7.28.5",
        "@babel/template": "^7.27.2",
        "@babel/types": "^7.28.5",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.28.5.tgz",
      "integrity": "sha512-qQ5m48eI/MFLQ5PxQj4PFaprjyCTLI37ElWMmNs0K8Lk3dVeOdNpB3ks8jc7yM5CDmVC73eMVk/trk3fgmrUpA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.2.tgz",
      "integrity": "sha512-GZMB+a0mOMZs4MpDbj8RJp4cw+w1WV5NYD6xzgvzUJ5Ek2jerwfO2eADyI6ExDSUED+1X8aMbegahsJi+8mgpw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.2.tgz",
      "integrity": "sha512-DVNI8jlPa7Ujbr1yjU2PfUSRtAUZPG9I1RwW4F4xFB1Imiu2on0ADiI/c3td+KmDtVKNbi+nffGDQMfcIMkwIA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.2.tgz",
      "integrity": "sha512-pvz8ZZ7ot/RBphf8fv60ljmaoydPU12VuXHImtAs0XhLLw+EXBi2BLe3OYSBslR4rryHvweW5gmkKFwTiFy6KA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.2.tgz",
      "integrity": "sha512-z8Ank4Byh4TJJOh4wpz8g2vDy75zFL0TlZlkUkEwYXuPSgX8yzep596n6mT7905kA9uHZsf/o2OJZubl2l3M7A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.2.tgz",
      "integrity": "sha512-davCD2Zc80nzDVRwXTcQP/28fiJbcOwvdolL0sOiOsbwBa72kegmVU0Wrh1MYrbuCL98Omp5dVhQFWRKR2ZAlg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.2.tgz",
      "integrity": "sha512-ZxtijOmlQCBWGwbVmwOF/UCzuGIbUkqB1faQRf5akQmxRJ1ujusWsb3CVfk/9iZKr2L5SMU5wPBi1UWbvL+VQA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.2.tgz",
      "integrity": "sha512-lS/9CN+rgqQ9czogxlMcBMGd+l8Q3Nj1MFQwBZJyoEKI50XGxwuzznYdwcav6lpOGv5BqaZXqvBSiB/kJ5op+g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.2.tgz",
      "integrity": "sha512-tAfqtNYb4YgPnJlEFu4c212HYjQWSO/w/h/lQaBK7RbwGIkBOuNKQI9tqWzx7Wtp7bTPaGC6MJvWI608P3wXYA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.2.tgz",
      "integrity": "sha512-vWfq4GaIMP9AIe4yj1ZUW18RDhx6EPQKjwe7n8BbIecFtCQG4CfHGaHuh7fdfq+y3LIA2vGS/o9ZBGVxIDi9hw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.27.2.tgz",
      "integrity": "sha512-hYxN8pr66NsCCiRFkHUAsxylNOcAQaxSSkHMMjcpx0si13t1LHFphxJZUiGwojB1a/Hd5OiPIqDdXONia6bhTw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.27.2.tgz",
      "integrity": "sha512-MJt5BRRSScPDwG2hLelYhAAKh9imjHK5+NE/tvnRLbIqUWa+0E9N4WNMjmp/kXXPHZGqPLxggwVhz7QP8CTR8w==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.27.2.tgz",
      "integrity": "sha512-lugyF1atnAT463aO6KPshVCJK5NgRnU4yb3FUumyVz+cGvZbontBgzeGFO1nF+dPueHD367a2ZXe1NtUkAjOtg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.27.2.tgz",
      "integrity": "sha512-nlP2I6ArEBewvJ2gjrrkESEZkB5mIoaTswuqNFRv/WYd+ATtUpe9Y09RnJvgvdag7he0OWgEZWhviS1OTOKixw==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.27.2.tgz",
      "integrity": "sha512-C92gnpey7tUQONqg1n6dKVbx3vphKtTHJaNG2Ok9lGwbZil6DrfyecMsp9CrmXGQJmZ7iiVXvvZH6Ml5hL6XdQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.27.2.tgz",
      "integrity": "sha512-B5BOmojNtUyN8AXlK0QJyvjEZkWwy/FKvakkTDCziX95AowLZKR6aCDhG7LeF7uMCXEJqwa8Bejz5LTPYm8AvA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.27.2.tgz",
      "integrity": "sha512-p4bm9+wsPwup5Z8f4EpfN63qNagQ47Ua2znaqGH6bqLlmJ4bx97Y9JdqxgGZ6Y8xVTixUnEkoKSHcpRlDnNr5w==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.27.2.tgz",
      "integrity": "sha512-uwp2Tip5aPmH+NRUwTcfLb+W32WXjpFejTIOWZFw/v7/KnpCDKG66u4DLcurQpiYTiYwQ9B7KOeMJvLCu/OvbA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.2.tgz",
      "integrity": "sha512-Kj6DiBlwXrPsCRDeRvGAUb/LNrBASrfqAIok+xB0LxK8CHqxZ037viF13ugfsIpePH93mX7xfJp97cyDuTZ3cw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.27.2.tgz",
      "integrity": "sha512-HwGDZ0VLVBY3Y+Nw0JexZy9o/nUAWq9MlV7cahpaXKW6TOzfVno3y3/M8Ga8u8Yr7GldLOov27xiCnqRZf0tCA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.2.tgz",
      "integrity": "sha512-DNIHH2BPQ5551A7oSHD0CKbwIA/Ox7+78/AWkbS5QoRzaqlev2uFayfSxq68EkonB+IKjiuxBFoV8ESJy8bOHA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.27.2.tgz",
      "integrity": "sha512-/it7w9Nb7+0KFIzjalNJVR5bOzA9Vay+yIPLVHfIQYG/j+j9VTH84aNB8ExGKPU4AzfaEvN9/V4HV+F+vo8OEg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.2.tgz",
      "integrity": "sha512-LRBbCmiU51IXfeXk59csuX/aSaToeG7w48nMwA6049Y4J4+VbWALAuXcs+qcD04rHDuSCSRKdmY63sruDS5qag==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.27.2.tgz",
      "integrity": "sha512-kMtx1yqJHTmqaqHPAzKCAkDaKsffmXkPHThSfRwZGyuqyIeBvf08KSsYXl+abf5HDAPMJIPnbBfXvP2ZC2TfHg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.27.2.tgz",
      "integrity": "sha512-Yaf78O/B3Kkh+nKABUF++bvJv5Ijoy9AN1ww904rOXZFLWVc5OLOfL56W+C8F9xn5JQZa3UX6m+IktJnIb1Jjg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.27.2.tgz",
      "integrity": "sha512-Iuws0kxo4yusk7sw70Xa2E2imZU5HoixzxfGCdxwBdhiDgt9vX9VUCBhqcwY7/uh//78A1hMkkROMJq9l27oLQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.27.2.tgz",
      "integrity": "sha512-sRdU18mcKf7F+YgheI/zGf5alZatMUTKj/jNS6l744f9u3WFu4v7twcUI9vu4mknF4Y9aDlblIie0IM+5xxaqQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/source-map": {
      "version": "0.3.11",
      "resolved": "https://registry.npmjs.org/@jridgewell/source-map/-/source-map-0.3.11.tgz",
      "integrity": "sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.0-beta.53",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.53.tgz",
      "integrity": "sha512-vENRlFU4YbrwVqNDZ7fLvy+JR1CRkyr01jhSiDpE1u6py3OMzQfztQU2jxykW3ALNxO4kSlqIDeYyD0Y9RcQeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.55.1.tgz",
      "integrity": "sha512-9R0DM/ykwfGIlNu6+2U09ga0WXeZ9MRC2Ter8jnz8415VbuIykVuc6bhdrbORFZANDmTDvq26mJrEVTl8TdnDg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.55.1.tgz",
      "integrity": "sha512-eFZCb1YUqhTysgW3sj/55du5cG57S7UTNtdMjCW7LwVcj3dTTcowCsC8p7uBdzKsZYa8J7IDE8lhMI+HX1vQvg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.55.1.tgz",
      "integrity": "sha512-p3grE2PHcQm2e8PSGZdzIhCKbMCw/xi9XvMPErPhwO17vxtvCN5FEA2mSLgmKlCjHGMQTP6phuQTYWUnKewwGg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.55.1.tgz",
      "integrity": "sha512-rDUjG25C9qoTm+e02Esi+aqTKSBYwVTaoS1wxcN47/Luqef57Vgp96xNANwt5npq9GDxsH7kXxNkJVEsWEOEaQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.55.1.tgz",
      "integrity": "sha512-+JiU7Jbp5cdxekIgdte0jfcu5oqw4GCKr6i3PJTlXTCU5H5Fvtkpbs4XJHRmWNXF+hKmn4v7ogI5OQPaupJgOg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.55.1.tgz",
      "integrity": "sha512-V5xC1tOVWtLLmr3YUk2f6EJK4qksksOYiz/TCsFHu/R+woubcLWdC9nZQmwjOAbmExBIVKsm1/wKmEy4z4u4Bw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.55.1.tgz",
      "integrity": "sha512-Rn3n+FUk2J5VWx+ywrG/HGPTD9jXNbicRtTM11e/uorplArnXZYsVifnPPqNNP5BsO3roI4n8332ukpY/zN7rQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.55.1.tgz",
      "integrity": "sha512-grPNWydeKtc1aEdrJDWk4opD7nFtQbMmV7769hiAaYyUKCT1faPRm2av8CX1YJsZ4TLAZcg9gTR1KvEzoLjXkg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.55.1.tgz",
      "integrity": "sha512-a59mwd1k6x8tXKcUxSyISiquLwB5pX+fJW9TkWU46lCqD/GRDe9uDN31jrMmVP3feI3mhAdvcCClhV8V5MhJFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.55.1.tgz",
      "integrity": "sha512-puS1MEgWX5GsHSoiAsF0TYrpomdvkaXm0CofIMG5uVkP6IBV+ZO9xhC5YEN49nsgYo1DuuMquF9+7EDBVYu4uA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.55.1.tgz",
      "integrity": "sha512-r3Wv40in+lTsULSb6nnoudVbARdOwb2u5fpeoOAZjFLznp6tDU8kd+GTHmJoqZ9lt6/Sys33KdIHUaQihFcu7g==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.55.1.tgz",
      "integrity": "sha512-MR8c0+UxAlB22Fq4R+aQSPBayvYa3+9DrwG/i1TKQXFYEaoW3B5b/rkSRIypcZDdWjWnpcvxbNaAJDcSbJU3Lw==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.55.1.tgz",
      "integrity": "sha512-3KhoECe1BRlSYpMTeVrD4sh2Pw2xgt4jzNSZIIPLFEsnQn9gAnZagW9+VqDqAHgm1Xc77LzJOo2LdigS5qZ+gw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.55.1.tgz",
      "integrity": "sha512-ziR1OuZx0vdYZZ30vueNZTg73alF59DicYrPViG0NEgDVN8/Jl87zkAPu4u6VjZST2llgEUjaiNl9JM6HH1Vdw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.55.1.tgz",
      "integrity": "sha512-uW0Y12ih2XJRERZ4jAfKamTyIHVMPQnTZcQjme2HMVDAHY4amf5u414OqNYC+x+LzRdRcnIG1YodLrrtA8xsxw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.55.1.tgz",
      "integrity": "sha512-u9yZ0jUkOED1BFrqu3BwMQoixvGHGZ+JhJNkNKY/hyoEgOwlqKb62qu+7UjbPSHYjiVy8kKJHvXKv5coH4wDeg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.55.1.tgz",
      "integrity": "sha512-/0PenBCmqM4ZUd0190j7J0UsQ/1nsi735iPRakO8iPciE7BQ495Y6msPzaOmvx0/pn+eJVVlZrNrSh4WSYLxNg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.55.1.tgz",
      "integrity": "sha512-a8G4wiQxQG2BAvo+gU6XrReRRqj+pLS2NGXKm8io19goR+K8lw269eTrPkSdDTALwMmJp4th2Uh0D8J9bEV1vg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.55.1.tgz",
      "integrity": "sha512-bD+zjpFrMpP/hqkfEcnjXWHMw5BIghGisOKPj+2NaNDuVT+8Ds4mPf3XcPHuat1tz89WRL+1wbcxKY3WSbiT7w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.55.1.tgz",
      "integrity": "sha512-eLXw0dOiqE4QmvikfQ6yjgkg/xDM+MdU9YJuP4ySTibXU0oAvnEWXt7UDJmD4UkYialMfOGFPJnIHSe/kdzPxg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.55.1.tgz",
      "integrity": "sha512-xzm44KgEP11te3S2HCSyYf5zIzWmx3n8HDCc7EE59+lTcswEWNpvMLfd9uJvVX8LCg9QWG67Xt75AuHn4vgsXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.55.1.tgz",
      "integrity": "sha512-yR6Bl3tMC/gBok5cz/Qi0xYnVbIxGx5Fcf/ca0eB6/6JwOY+SRUcJfI0OpeTpPls7f194as62thCt/2BjxYN8g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.55.1.tgz",
      "integrity": "sha512-3fZBidchE0eY0oFZBnekYCfg+5wAB0mbpCBuofh5mZuzIU/4jIVkbESmd2dOsFNS78b53CYv3OAtwqkZZmU5nA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.55.1.tgz",
      "integrity": "sha512-xGGY5pXj69IxKb4yv/POoocPy/qmEGhimy/FoTpTSVju3FYXUQQMFCaZZXJVidsmGxRioZAwpThl/4zX41gRKg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.55.1.tgz",
      "integrity": "sha512-SPEpaL6DX4rmcXtnhdrQYgzQ5W2uW3SCJch88lB2zImhJRhIIK44fkUrgIV/Q8yUNfw5oyZ5vkeQsZLhCb06lw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@types/babel__core": {
      "version": "7.20.5",
      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.20.7",
        "@babel/types": "^7.20.7",
        "@types/babel__generator": "*",
        "@types/babel__template": "*",
        "@types/babel__traverse": "*"
      }
    },
    "node_modules/@types/babel__generator": {
      "version": "7.27.0",
      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
      "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__template": {
      "version": "7.4.4",
      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.1.0",
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__traverse": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
      "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.2"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-5.1.2.tgz",
      "integrity": "sha512-EcA07pHJouywpzsoTUqNh5NwGayl2PPVEJKUSinGGSxFGYn+shYbqMGBg6FXDqgXum9Ou/ecb+411ssw8HImJQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.28.5",
        "@babel/plugin-transform-react-jsx-self": "^7.27.1",
        "@babel/plugin-transform-react-jsx-source": "^7.27.1",
        "@rolldown/pluginutils": "1.0.0-beta.53",
        "@types/babel__core": "^7.20.5",
        "react-refresh": "^0.18.0"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "peerDependencies": {
        "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
      }
    },
    "node_modules/@vitejs/plugin-react/node_modules/react-refresh": {
      "version": "0.18.0",
      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.18.0.tgz",
      "integrity": "sha512-QgT5//D3jfjJb6Gsjxv0Slpj23ip+HtOpnNgnb2S5zU3CB26G/IDPGoy4RJB42wzFE46DRsstbW6tKHoKbhAxw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/acorn": {
      "version": "8.15.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.15.0.tgz",
      "integrity": "sha512-NZyJarBfL7nWwIq+FDL6Zp/yHEhePMNnnJ0y3qfieCrmNvYct8uvtiV41UvlSe6apAfk0fY1FbWx+NwfmpvtTg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT"
    },
    "node_modules/autoprefixer": {
      "version": "10.4.23",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.4.23.tgz",
      "integrity": "sha512-YYTXSFulfwytnjAPlw8QHncHJmlvFKtczb8InXaAx9Q0LbfDnfEYDE55omerIJKihhmU61Ft+cAOSzQVaBUmeA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.1",
        "caniuse-lite": "^1.0.30001760",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/axios": {
      "version": "1.13.2",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.13.2.tgz",
      "integrity": "sha512-VPk9ebNqPcy5lRGuSlKx752IlDatOjT9paPlm8A7yOuW2Fbvp4X3JznJtT4f0GzGLLiWE9W8onz51SqLYwzGaA==",
      "license": "MIT",
      "dependencies": {
        "follow-redirects": "^1.15.6",
        "form-data": "^4.0.4",
        "proxy-from-env": "^1.1.0"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.9.11",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.9.11.tgz",
      "integrity": "sha512-Sg0xJUNDU1sJNGdfGWhVHX0kkZ+HWcvmVymJbj6NSgZZmW/8S9Y2HQ5euytnIgakgxN6papOAWiwDo1ctFDcoQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.js"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/black-scholes": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/black-scholes/-/black-scholes-1.1.0.tgz",
      "integrity": "sha512-23iaI490ai4pRclxWTM7BJyD8GzDibJCltLSX3xg86D3t8fzx67cqYSfL8WQLHnza1BhEeeA898XqpfRuQyQ2w==",
      "license": "MIT"
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.1",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.1.tgz",
      "integrity": "sha512-ZC5Bd0LgJXgwGqUknZY/vkUQ04r8NXnJZ3yYi4vDmSiZmC/pdSN0NbNRPxZpbtO4uAfDUAFffO8IZoM3Gj8IkA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.9.0",
        "caniuse-lite": "^1.0.30001759",
        "electron-to-chromium": "^1.5.263",
        "node-releases": "^2.0.27",
        "update-browserslist-db": "^1.2.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001762",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001762.tgz",
      "integrity": "sha512-PxZwGNvH7Ak8WX5iXzoK1KPZttBXNPuaOvI2ZYU7NrlM+d9Ov+TUvlLOBNGzVXAntMSMMlJPd+jY6ovrVjSmUw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/complex.js": {
      "version": "2.4.3",
      "resolved": "https://registry.npmjs.org/complex.js/-/complex.js-2.4.3.tgz",
      "integrity": "sha512-UrQVSUur14tNX6tiP4y8T4w4FeJAX3bi2cIv0pu/DTLFNxoq7z2Yh83Vfzztj6Px3X/lubqQ9IrPp7Bpn6p4MQ==",
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",
      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decimal.js": {
      "version": "10.6.0",
      "resolved": "https://registry.npmjs.org/decimal.js/-/decimal.js-10.6.0.tgz",
      "integrity": "sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==",
      "license": "MIT"
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.267",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.267.tgz",
      "integrity": "sha512-0Drusm6MVRXSOJpGbaSVgcQsuB4hEkMpHXaVstcPmhu5LIedxs1xNK/nIxmQIU/RPC0+1/o0AVZfBTkTNJOdUw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.27.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.27.2.tgz",
      "integrity": "sha512-HyNQImnsOC7X9PMNaCIeAm4ISCQXs5a5YasTXVliKv4uuBo1dKrG0A+uQS8M5eXjVMnLg3WgXaKvprHlFJQffw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.27.2",
        "@esbuild/android-arm": "0.27.2",
        "@esbuild/android-arm64": "0.27.2",
        "@esbuild/android-x64": "0.27.2",
        "@esbuild/darwin-arm64": "0.27.2",
        "@esbuild/darwin-x64": "0.27.2",
        "@esbuild/freebsd-arm64": "0.27.2",
        "@esbuild/freebsd-x64": "0.27.2",
        "@esbuild/linux-arm": "0.27.2",
        "@esbuild/linux-arm64": "0.27.2",
        "@esbuild/linux-ia32": "0.27.2",
        "@esbuild/linux-loong64": "0.27.2",
        "@esbuild/linux-mips64el": "0.27.2",
        "@esbuild/linux-ppc64": "0.27.2",
        "@esbuild/linux-riscv64": "0.27.2",
        "@esbuild/linux-s390x": "0.27.2",
        "@esbuild/linux-x64": "0.27.2",
        "@esbuild/netbsd-arm64": "0.27.2",
        "@esbuild/netbsd-x64": "0.27.2",
        "@esbuild/openbsd-arm64": "0.27.2",
        "@esbuild/openbsd-x64": "0.27.2",
        "@esbuild/openharmony-arm64": "0.27.2",
        "@esbuild/sunos-x64": "0.27.2",
        "@esbuild/win32-arm64": "0.27.2",
        "@esbuild/win32-ia32": "0.27.2",
        "@esbuild/win32-x64": "0.27.2"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-latex": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/escape-latex/-/escape-latex-1.2.0.tgz",
      "integrity": "sha512-nV5aVWW1K0wEiUIEdZ4erkGGH8mDxGyxSeqPzRNtWP7ataw+/olFObw7hujFWlVjNsaDFw5VZ5NzVSIqRgfTiw==",
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/follow-redirects": {
      "version": "1.15.11",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.15.11.tgz",
      "integrity": "sha512-deG2P0JfjrTxl50XGCDyfI97ZGVCxIpfKYmfyrQ54n5FO/0gfIES8C/Psl6kWVDolizcaaxZJnTS0QSMxvnsBQ==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/form-data": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.5.tgz",
      "integrity": "sha512-8RipRLol37bNs2bhoV67fiTEvdTrbMUYcFTiy3+wuuOnUog2QBHCZWXDRijWQfAkhBj2Uf5UnVaiWwA5vdd82w==",
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.12"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.1",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "integrity": "sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/javascript-natural-sort": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/javascript-natural-sort/-/javascript-natural-sort-0.7.1.tgz",
      "integrity": "sha512-nO6jcEfZWQXDhOiBtG2KvKyEptz7RVbpGP4vTD2hLBdmNQSsCiicO2Ioinv6UI4y9ukqnBpy+XZ9H6uLNgJTlw==",
      "license": "MIT"
    },
    "node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/lilconfig": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-2.1.0.tgz",
      "integrity": "sha512-utWOt/GHzuUxnLKxB6dk81RoOeoNeHgbrXiuGk4yyF5qlRz+iIVWu56E2fqGHFrXz0QNUhLB/8nKqvRH66JKGQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "0.468.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-0.468.0.tgz",
      "integrity": "sha512-6koYRhnM2N0GGZIdXzSeiNwguv1gt/FAjZOiPl76roBi3xKEXa4WmfpxgQwTTL4KipXjefrnf3oV4IsYhi4JFA==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/mathjs": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/mathjs/-/mathjs-15.1.0.tgz",
      "integrity": "sha512-HfnAcScQm9drGryodlDqeS3WAl4gUTYGDcOtcqL/8s23MZ28Ib1i8XnYK3ZdjNuaW/L4BAp9lIp8vxAMrcuu1w==",
      "license": "Apache-2.0",
      "dependencies": {
        "@babel/runtime": "^7.26.10",
        "complex.js": "^2.2.5",
        "decimal.js": "^10.4.3",
        "escape-latex": "^1.2.0",
        "fraction.js": "^5.2.1",
        "javascript-natural-sort": "^0.7.1",
        "seedrandom": "^3.0.5",
        "tiny-emitter": "^2.1.0",
        "typed-function": "^4.2.1"
      },
      "bin": {
        "mathjs": "bin/cli.js"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.11",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
      "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.27",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.27.tgz",
      "integrity": "sha512-nmh3lCkYZ3grZvqcCH+fjmQ7X+H0OeZgP40OierEaAptX4XofMh5kwNbWh7lBduUzCcV/8kZ+NDLCwm2iorIlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.6",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.6.tgz",
      "integrity": "sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-4.0.2.tgz",
      "integrity": "sha512-bSVhyJGL00wMVoPUzAVAnbEoWyqRxkjv64tUl427SKnPrENtq6hJwUojroMz2VB+Q1edmi4IfrAPpami5VVgMQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.0.0",
        "yaml": "^2.3.4"
      },
      "engines": {
        "node": ">= 14"
      },
      "peerDependencies": {
        "postcss": ">=8.0.9",
        "ts-node": ">=9.0.0"
      },
      "peerDependenciesMeta": {
        "postcss": {
          "optional": true
        },
        "ts-node": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-load-config/node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.2",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.2.tgz",
      "integrity": "sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/proxy-from-env": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-1.1.0.tgz",
      "integrity": "sha512-D+zkORCbA9f1tdWRK0RaCR3GPv50cMxcrz4X8k5LTSUD1Dkw47mKJEZQNunItRTkWwgtaUSo1RVFRIG9ZXiFYg==",
      "license": "MIT"
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "loose-envify": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
      "integrity": "sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "loose-envify": "^1.1.0",
        "scheduler": "^0.23.2"
      },
      "peerDependencies": {
        "react": "^18.3.1"
      }
    },
    "node_modules/react-router": {
      "version": "7.12.0",
      "resolved": "https://registry.npmjs.org/react-router/-/react-router-7.12.0.tgz",
      "integrity": "sha512-kTPDYPFzDVGIIGNLS5VJykK0HfHLY5MF3b+xj0/tTyNYL1gF1qs7u67Z9jEhQk2sQ98SUaHxlG31g1JtF7IfVw==",
      "license": "MIT",
      "dependencies": {
        "cookie": "^1.0.1",
        "set-cookie-parser": "^2.6.0"
      },
      "engines": {
        "node": ">=20.0.0"
      },
      "peerDependencies": {
        "react": ">=18",
        "react-dom": ">=18"
      },
      "peerDependenciesMeta": {
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/react-router-dom": {
      "version": "7.12.0",
      "resolved": "https://registry.npmjs.org/react-router-dom/-/react-router-dom-7.12.0.tgz",
      "integrity": "sha512-pfO9fiBcpEfX4Tx+iTYKDtPbrSLLCbwJ5EqP+SPYQu1VYCXdy79GSj0wttR0U4cikVdlImZuEZ/9ZNCgoaxwBA==",
      "license": "MIT",
      "dependencies": {
        "react-router": "7.12.0"
      },
      "engines": {
        "node": ">=20.0.0"
      },
      "peerDependencies": {
        "react": ">=18",
        "react-dom": ">=18"
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
      "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/resolve": {
      "version": "1.22.11",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.11.tgz",
      "integrity": "sha512-RfqAvLnMl313r7c9oclB1HhUEAezcpLjz95wFH4LVuhk9JF/r22qmVP9AMmOU4vMX7Q8pN8jwNg/CSpdFnMjTQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/scheduler": {
      "version": "0.23.2",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz",
      "integrity": "sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    },
    "node_modules/seedrandom": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/seedrandom/-/seedrandom-3.0.5.tgz",
      "integrity": "sha512-8OwmbklUNzwezjGInmZ+2clQmExQPvomqjL7LFqOYqtmuxRgQYqOD3mHaU+MvZn5FLUeVxVfQjwLZW/n/JFuqg==",
      "license": "MIT"
    },
    "node_modules/set-cookie-parser": {
      "version": "2.7.2",
      "resolved": "https://registry.npmjs.org/set-cookie-parser/-/set-cookie-parser-2.7.2.tgz",
      "integrity": "sha512-oeM1lpU/UvhTxw+g3cIfxXHyJRc/uidd3yK1P242gzHds0udQBYzs3y8j4gCCW+ZJ7ad0yctld8RYO+bdurlvw==",
      "license": "MIT"
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/source-map-support/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "optional": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.1",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.1.tgz",
      "integrity": "sha512-qAYmXRfk3ENzuPBakNK0SRrUDipP8NQnEY6772uDhflcQz5EhRdD7JNZxyrFHVQNCwULPBn6FNPp9brpO7ctcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.5.3",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.0",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.19.1",
        "lilconfig": "^2.1.0",
        "micromatch": "^4.0.5",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.0.0",
        "postcss": "^8.4.23",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.1",
        "postcss-nested": "^6.0.1",
        "postcss-selector-parser": "^6.0.11",
        "resolve": "^1.22.2",
        "sucrase": "^3.32.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/terser": {
      "version": "5.44.1",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.44.1.tgz",
      "integrity": "sha512-t/R3R/n0MSwnnazuPpPNVO60LX0SKL45pyl9YlvxIdkH0Of7D5qM2EVe+yASRIlY5pZ73nclYJfNANGWPwFDZw==",
      "dev": true,
      "license": "BSD-2-Clause",
      "optional": true,
      "dependencies": {
        "@jridgewell/source-map": "^0.3.3",
        "acorn": "^8.15.0",
        "commander": "^2.20.0",
        "source-map-support": "~0.5.20"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/terser/node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/tiny-emitter": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/tiny-emitter/-/tiny-emitter-2.1.0.tgz",
      "integrity": "sha512-NB6Dk1A9xgQPMoGqC5CVXn123gWyte215ONT5Pp5a0yt4nlEoO1ZWeCwpncaekPHXO60i47ihFnZPiRPjRMq4Q==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.15",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.15.tgz",
      "integrity": "sha512-j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/typed-function": {
      "version": "4.2.2",
      "resolved": "https://registry.npmjs.org/typed-function/-/typed-function-4.2.2.tgz",
      "integrity": "sha512-VwaXim9Gp1bngi/q3do8hgttYn2uC3MoT/gfuMWylnj1IeZBUAyPddHZlo1K05BDoj8DYPpMdiHqH1dDYdJf2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vite": {
      "version": "7.3.1",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.1.tgz",
      "integrity": "sha512-w+N7Hifpc3gRjZ63vYBXA56dvvRlNWRczTdmCBBa+CotUzAPf5b7YMdMR/8CQoeYE5LX3W4wj6RYTgonm1b9DA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "esbuild": "^0.27.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/vite/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/vite/node_modules/picomatch": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz",
      "integrity": "sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/vite/node_modules/rollup": {
      "version": "4.55.1",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.55.1.tgz",
      "integrity": "sha512-wDv/Ht1BNHB4upNbK74s9usvl7hObDnvVzknxqY/E/O3X6rW1U1rV1aENEfJ54eFZDTNo7zv1f5N4edCluH7+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.55.1",
        "@rollup/rollup-android-arm64": "4.55.1",
        "@rollup/rollup-darwin-arm64": "4.55.1",
        "@rollup/rollup-darwin-x64": "4.55.1",
        "@rollup/rollup-freebsd-arm64": "4.55.1",
        "@rollup/rollup-freebsd-x64": "4.55.1",
        "@rollup/rollup-linux-arm-gnueabihf": "4.55.1",
        "@rollup/rollup-linux-arm-musleabihf": "4.55.1",
        "@rollup/rollup-linux-arm64-gnu": "4.55.1",
        "@rollup/rollup-linux-arm64-musl": "4.55.1",
        "@rollup/rollup-linux-loong64-gnu": "4.55.1",
        "@rollup/rollup-linux-loong64-musl": "4.55.1",
        "@rollup/rollup-linux-ppc64-gnu": "4.55.1",
        "@rollup/rollup-linux-ppc64-musl": "4.55.1",
        "@rollup/rollup-linux-riscv64-gnu": "4.55.1",
        "@rollup/rollup-linux-riscv64-musl": "4.55.1",
        "@rollup/rollup-linux-s390x-gnu": "4.55.1",
        "@rollup/rollup-linux-x64-gnu": "4.55.1",
        "@rollup/rollup-linux-x64-musl": "4.55.1",
        "@rollup/rollup-openbsd-x64": "4.55.1",
        "@rollup/rollup-openharmony-arm64": "4.55.1",
        "@rollup/rollup-win32-arm64-msvc": "4.55.1",
        "@rollup/rollup-win32-ia32-msvc": "4.55.1",
        "@rollup/rollup-win32-x64-gnu": "4.55.1",
        "@rollup/rollup-win32-x64-msvc": "4.55.1",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yaml": {
      "version": "2.8.2",
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-2.8.2.tgz",
      "integrity": "sha512-mplynKqc1C2hTVYxd0PU2xQAc22TI1vShAYGksCCfxbn/dFwnHTNi1bvYsBTkhdUNtGIf5xNOg938rrSSYvS9A==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "yaml": "bin.mjs"
      },
      "engines": {
        "node": ">= 14.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/eemeli"
      }
    }
  }
}

```

## File: client\package.json
```json
{
  "name": "options-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.2",
    "black-scholes": "^1.1.0",
    "lucide-react": "^0.468.0",
    "mathjs": "^15.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.2",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  }
}

```

## File: client\postcss.config.js
```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}

```

## File: client\tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

## File: client\tailwind.config.ts
```ts
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

```

## File: client\tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ES2020"
        ],
        "typeRoots": [
            "./node_modules/@types",
            "./src/types"
        ],
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx",
        "strict": true,
        "isolatedModules": true,
        "noEmit": true,
        "skipLibCheck": true
    },
    "include": [
        "src/**/*",
        "src/types/window.d.ts"
    ]
}
```

## File: client\vite.config.ts
```ts
// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: __dirname,
    base: "./",
    server: {
        port: 5173,
        strictPort: true,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, "index.html"),
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});

```

## File: client\public\index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>

```

## File: client\public\manifest.json
```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

```

## File: client\src\App.css
```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

```

## File: client\src\App.test.js
```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

## File: client\src\App.tsx
```tsx
import React from 'react';
import { AppProvider } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import { MainLayout } from './layouts/MainLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <ModalProvider>
                    <MainLayout />
                </ModalProvider>
            </AppProvider>
        </ErrorBoundary>
    );
}

```

## File: client\src\global.d.ts
```ts
// Global TypeScript declarations for Electron IPC

declare global {
    interface Window {
        api?: {
            getInstruments: () => Promise<string[] | Array<{ symbol: string; name: string }>>;
            getDates: (symbol: string) => Promise<string[]>;
            getExpiries: (params: { symbol: string; tradingdate: string }) => Promise<string[]>;
            getTimestamps: (params: { symbol: string; date: string; expiry: string }) => Promise<string[]>;
            getSnapshot: (params: { symbol: string; expiry: string; timestamp: number }) => Promise<any[]>;
            getStrikeTimeline: (params: { symbol: string; strike: number; optionType: string; date: string; expiry: string }) => Promise<any[]>;
        };
    }
}

export { };

```

## File: client\src\index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

#root {
  width: 100vw;
  height: 100vh;
}
```

## File: client\src\main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

```

## File: client\src\preload.ts
```ts
calculateGreeks: (params: {
    spotPrice: number;
    strikes: number[];
    daysToExpiry: number;
    volatility?: number;
}) => ipcRenderer.invoke('calculate-greeks', params),

```

## File: client\src\reportWebVitals.js
```js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

## File: client\src\setupTests.js
```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

## File: client\src\api\ipc.ts
```ts
// Type definitions for Electron API
export interface ElectronAPI {
    getSnapshot: (opts: {
        underlyingSymbol: string;
        expiryDate: string;
        timestamp: string;
        strike_min?: number;
        strike_max?: number;
        limit?: number;
        offset?: number;
    }) => Promise<{ ok: boolean; rows?: any[]; error?: string; status?: number }>;

    getNearestTick: (opts: {
        underlyingSymbol: string;
        expiryDate: string;
        requestedTimestamp: string;
    }) => Promise<{ ok: boolean; timestamp?: string; error?: string; status?: number }>;

    onSpotUpdate: (callback: (payload: any) => void) => () => void;
}

declare global {
    interface Window {
        api: ElectronAPI;
    }
}

// Safe accessor with fallback for web dev
export const ipc: ElectronAPI = window.api || {
    getSnapshot: async () => ({ ok: false, error: 'Electron API not available' }),
    getNearestTick: async () => ({ ok: false, error: 'Electron API not available' }),
    onSpotUpdate: () => () => { },
};

export default ipc;

```

## File: client\src\api\types.ts
```ts
export type IPCOk<T> = {
    ok: true;
    data: T;
};

export type IPCError = {
    ok: false;
    error: {
        code: string;
        message: string;
    };
};

export type IPCResponse<T> = IPCOk<T> | IPCError;

```

## File: client\src\components\ControlBar.tsx
```tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDate, formatTime } from '../utils/formatters';

export const ControlBar: React.FC = () => {
    const {
        state,
        setSymbol,
        setTradeDate,
        setTimestamp,
        toggleExpiry,
        setViewMode,
        setStrikeWindow
    } = useAppContext();

    const {
        symbol,
        instruments = [],
        tradeDates = [],
        tradeDate,
        expiries = [],
        selectedExpiries = [],
        timestamps = [],
        timestamp,
        viewMode = 'split',
        strikeWindow = 20
    } = state;

    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            padding: '15px',
            background: '#1e1e1e',
            borderBottom: '1px solid #333',
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>

            {/* Symbol Selector */}
            <div>
                <label style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>
                    Symbol:
                </label>
                <select
                    value={symbol || ''}
                    onChange={(e) => setSymbol(e.target.value)}
                    disabled={instruments.length === 0}
                    style={{
                        padding: '8px 12px',
                        background: '#2a2a2a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    {instruments.length === 0 && <option>Loading...</option>}
                    {instruments.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                    ))}
                </select>
            </div>

            {/* Date Selector */}
            <div>
                <label style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>
                    Trade Date:
                </label>
                <select
                    value={tradeDate || ''}
                    onChange={(e) => setTradeDate(e.target.value)}
                    disabled={tradeDates.length === 0}
                    style={{
                        padding: '8px 12px',
                        background: '#2a2a2a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        minWidth: '120px'
                    }}
                >
                    {tradeDates.length === 0 && <option>Loading...</option>}
                    {tradeDates.map(date => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Expiry Pills */}
            {expiries.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ color: '#888', fontSize: '12px', marginRight: '4px' }}>
                        Expiries:
                    </label>
                    {expiries.map(exp => {
                        const isSelected = selectedExpiries.includes(exp);
                        return (
                            <button
                                key={exp}
                                onClick={() => toggleExpiry(exp)}
                                style={{
                                    padding: '6px 12px',
                                    background: isSelected ? '#4a9eff' : '#2a2a2a',
                                    color: '#fff',
                                    border: `1px solid ${isSelected ? '#4a9eff' : '#444'}`,
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {formatDate(exp)}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Timestamp Slider */}
            {timestamps.length > 0 && timestamp && (
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                        Timestamp: {formatTime(timestamp)}
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={timestamps.length - 1}
                        value={timestamps.indexOf(timestamp)}
                        onChange={(e) => {
                            const idx = parseInt(e.target.value);
                            if (idx >= 0 && idx < timestamps.length) {
                                setTimestamp(timestamps[idx]);
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                </div>
            )}

            {/* View Mode Toggle */}
            <div>
                <label style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>
                    View:
                </label>
                <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'split' | 'combined')}
                    style={{
                        padding: '8px 12px',
                        background: '#2a2a2a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="split">Split (CE | PE)</option>
                    <option value="combined">Combined</option>
                </select>
            </div>

            {/* Strike Window */}
            <div>
                <label style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>
                    Strikes:
                </label>
                <select
                    value={strikeWindow}
                    onChange={(e) => setStrikeWindow(parseInt(e.target.value))}
                    style={{
                        padding: '8px 12px',
                        background: '#2a2a2a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    <option value={10}>±10</option>
                    <option value={15}>±15</option>
                    <option value={20}>±20</option>
                    <option value={30}>±30</option>
                    <option value={50}>All</option>
                </select>
            </div>

        </div>
    );
};

```

## File: client\src\components\HeaderBar.tsx
```tsx
// client/src/components/HeaderBar.tsx
import React from "react";

export default function HeaderBar({ spotPrice, spotTimestamp, currentTimestamp }: { spotPrice: number | null; spotTimestamp: string | null; currentTimestamp: string | null; }) {
    return (
        <header style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #ddd" }}>
            <div>
                <div style={{ fontWeight: 700 }}>NSE Options Platform</div>
                <div style={{ fontSize: 12 }}>Timestamp: {currentTimestamp ?? "—"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14 }}>Spot: {spotPrice ?? "—"}</div>
                <div style={{ fontSize: 12 }}>{spotTimestamp ?? "—"}</div>
            </div>
        </header>
    );
}

```

## File: client\src\components\MasterControlBar.css
```css
.master-control-bar {
    background: linear-gradient(180deg, #1a1d2e 0%, #16192b 100%);
    padding: 16px 20px;
    border-bottom: 1px solid #2a2d3e;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* ROW 1: Instrument, Date, Toggles */
.control-row-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-controls {
    display: flex;
    gap: 12px;
    align-items: center;
}

.instrument-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #2563eb;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
}

.instrument-select {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
}

.date-select {
    padding: 10px 16px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
}

.right-controls {
    display: flex;
    gap: 8px;
}

.toggle-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #94a3b8;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}

/* ROW 2: Playback Controls */
.control-row-2 {
    display: flex;
    align-items: center;
    gap: 16px;
}

.playback-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.playback-btn {
    padding: 8px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.playback-btn:hover:not(:disabled) {
    background: #334155;
}

.playback-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.play-btn {
    background: #2563eb;
    border-color: #2563eb;
}

.speed-select {
    padding: 6px 10px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: white;
    font-size: 12px;
}

.time-display {
    padding: 6px 12px;
    background: #0f172a;
    border-radius: 6px;
    color: #60a5fa;
    font-family: 'Courier New', monospace;
    font-size: 13px;
}

.time-slider-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-label {
    font-size: 11px;
    color: #64748b;
    font-family: 'Courier New', monospace;
}

.time-slider {
    flex: 1;
    height: 6px;
    background: #1e293b;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}

.time-slider::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    background: #2563eb;
    border-radius: 50%;
    cursor: pointer;
}

.quick-jumps {
    display: flex;
    gap: 4px;
}

.quick-jumps button {
    padding: 6px 10px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 4px;
    color: #94a3b8;
    font-size: 11px;
    cursor: pointer;
}

.quick-jumps button.active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
}

/* ROW 3: Expiries */
.control-row-3 {
    display: flex;
    align-items: center;
    gap: 12px;
}

.expiry-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.expiry-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.expiry-tab {
    padding: 8px 16px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #94a3b8;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.expiry-tab.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
    font-weight: 600;
}

.expiry-info {
    margin-left: auto;
    font-size: 12px;
    color: #64748b;
}

/* ROW 4: Strike Window */
.control-row-4 {
    display: flex;
    align-items: center;
    gap: 12px;
}

.strike-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
}

.strike-buttons {
    display: flex;
    gap: 6px;
}

.strike-btn {
    padding: 6px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #94a3b8;
    font-size: 13px;
    cursor: pointer;
    min-width: 44px;
}

.strike-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
    font-weight: 600;
}
```

## File: client\src\components\MasterControlBar.tsx
```tsx
// ============================================================================
// MASTER CONTROL BAR - RESTORED PREVIOUS VERSION
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useInstruments } from '../hooks/useInstruments';
import { useTradeDates } from '../hooks/useTradeDates';
import { useExpiries } from '../hooks/useExpiries';
import { useTimestamps } from '../hooks/useTimestamps';

export interface ControlState {
    symbol: string;
    tradeDate: string;
    selectedExpiries: string[];
    timestamp: string;
    strikeWindow: number | 'All';
    autoUpdate: boolean;
    showLakhs: boolean;
    showTable: boolean;
    playbackSpeed: number;
}

interface MasterControlBarProps {
    onStateChange: (state: ControlState) => void;
}

export function MasterControlBar({ onStateChange }: MasterControlBarProps) {
    // State
    const [symbol, setSymbol] = useState('NIFTY');
    const [tradeDate, setTradeDate] = useState('');
    const [selectedExpiries, setSelectedExpiries] = useState<string[]>([]);
    const [timestamp, setTimestamp] = useState('');
    const [strikeWindow, setStrikeWindow] = useState<number | 'All'>(15);
    const [autoUpdate, setAutoUpdate] = useState(false);
    const [showLakhs, setShowLakhs] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Data hooks
    const { instruments } = useInstruments();
    const { dates } = useTradeDates(symbol);
    const { expiries } = useExpiries(symbol, tradeDate);
    const { timestamps } = useTimestamps(symbol, tradeDate, selectedExpiries[0] || '');

    // Auto-select defaults
    useEffect(() => {
        if (!symbol && instruments.includes('NIFTY')) setSymbol('NIFTY');
    }, [instruments, symbol]);

    useEffect(() => {
        if (!tradeDate && dates.length > 0) setTradeDate(dates[dates.length - 1]);
    }, [dates, tradeDate]);

    useEffect(() => {
        if (selectedExpiries.length === 0 && expiries.length > 0) {
            setSelectedExpiries([expiries[0]]);
        }
    }, [expiries, selectedExpiries]);

    useEffect(() => {
        if (!timestamp && timestamps.length > 0) {
            setTimestamp(timestamps[timestamps.length - 1]);
        }
    }, [timestamps, timestamp]);

    // Emit state changes
    useEffect(() => {
        if (symbol && tradeDate && selectedExpiries.length > 0 && timestamp) {
            onStateChange({
                symbol,
                tradeDate,
                selectedExpiries,
                timestamp,
                strikeWindow,
                autoUpdate,
                showLakhs,
                showTable,
                playbackSpeed
            });
        }
    }, [symbol, tradeDate, selectedExpiries, timestamp, strikeWindow, autoUpdate, showLakhs, showTable, playbackSpeed]);

    // Playback control
    useEffect(() => {
        if (!isPlaying || timestamps.length === 0) return;

        const currentIndex = timestamps.indexOf(timestamp);
        if (currentIndex >= timestamps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            const nextIndex = timestamps.indexOf(timestamp) + 1;
            if (nextIndex < timestamps.length) {
                setTimestamp(timestamps[nextIndex]);
            } else {
                setIsPlaying(false);
            }
        }, 1000 / playbackSpeed);

        return () => clearInterval(interval);
    }, [isPlaying, timestamp, timestamps, playbackSpeed]);

    const handleExpiryToggle = (expiry: string) => {
        setSelectedExpiries(prev => {
            const isSelected = prev.includes(expiry);
            return isSelected ? prev.filter(e => e !== expiry) : [...prev, expiry];
        });
    };

    const formatTime = (ts: string) => {
        return new Date(ts).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const currentTimeIndex = timestamps.indexOf(timestamp);
    const sliderValue = timestamps.length > 0 ? (currentTimeIndex / (timestamps.length - 1)) * 100 : 0;

    return (
        <div className="master-control-bar">
            {/* TOP ROW - Instrument, Date, Toggles */}
            <div className="control-row-1">
                <div className="left-controls">
                    {/* Instrument Selector */}
                    <div className="instrument-selector">
                        <button className="instrument-button">
                            <span className="search-icon">🔍</span>
                            <select
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="instrument-select"
                            >
                                {instruments.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </button>
                    </div>

                    {/* Date Selector */}
                    <div className="date-selector">
                        <select
                            value={tradeDate}
                            onChange={(e) => setTradeDate(e.target.value)}
                            className="date-select"
                        >
                            {dates.map(d => (
                                <option key={d} value={d}>{formatDate(d)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="right-controls">
                    {/* Toggle Buttons */}
                    <button
                        className={`toggle-btn ${autoUpdate ? 'active' : ''}`}
                        onClick={() => setAutoUpdate(!autoUpdate)}
                    >
                        <span className="icon">🔄</span> Auto Update
                    </button>

                    <button
                        className={`toggle-btn ${showLakhs ? 'active' : ''}`}
                        onClick={() => setShowLakhs(!showLakhs)}
                    >
                        <span className="icon">₹</span> Lakhs
                    </button>

                    <button
                        className={`toggle-btn ${showTable ? 'active' : ''}`}
                        onClick={() => setShowTable(!showTable)}
                    >
                        <span className="icon">▼</span> Show Table
                    </button>
                </div>
            </div>

            {/* PLAYBACK CONTROLS */}
            <div className="control-row-2">
                <div className="playback-controls">
                    <button
                        className="playback-btn"
                        onClick={() => {
                            const idx = Math.max(0, currentTimeIndex - 1);
                            setTimestamp(timestamps[idx]);
                        }}
                        disabled={currentTimeIndex <= 0}
                    >
                        <SkipBack size={16} />
                    </button>

                    <button
                        className="playback-btn play-btn"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                        className="playback-btn"
                        onClick={() => {
                            const idx = Math.min(timestamps.length - 1, currentTimeIndex + 1);
                            setTimestamp(timestamps[idx]);
                        }}
                        disabled={currentTimeIndex >= timestamps.length - 1}
                    >
                        <SkipForward size={16} />
                    </button>

                    <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="speed-select"
                    >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={5}>5x</option>
                    </select>

                    <div className="time-display">
                        {timestamp && formatTime(timestamp)}
                    </div>
                </div>

                {/* Time Slider */}
                <div className="time-slider-container">
                    <span className="time-label">{timestamps[0] && formatTime(timestamps[0])}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => {
                            const percent = Number(e.target.value);
                            const index = Math.round((percent / 100) * (timestamps.length - 1));
                            setTimestamp(timestamps[index]);
                        }}
                        className="time-slider"
                    />
                    <span className="time-label">
                        {timestamps[timestamps.length - 1] && formatTime(timestamps[timestamps.length - 1])}
                    </span>
                </div>

                <div className="quick-jumps">
                    <button onClick={() => setTimestamp(timestamps[0])}>Last 5m</button>
                    <button>Last 10m</button>
                    <button>Last 15m</button>
                    <button>Last 30m</button>
                    <button>Last 1hr</button>
                    <button>Last 2hr</button>
                    <button>Last 3hr</button>
                    <button className="active">Full Day</button>
                </div>
            </div>

            {/* EXPIRY TABS */}
            <div className="control-row-3">
                <div className="expiry-label">EXPIRIES:</div>
                <div className="expiry-tabs">
                    {expiries.map(exp => (
                        <button
                            key={exp}
                            className={`expiry-tab ${selectedExpiries.includes(exp) ? 'active' : ''}`}
                            onClick={() => handleExpiryToggle(exp)}
                        >
                            {formatDate(exp)}
                        </button>
                    ))}
                </div>

                <div className="expiry-info">
                    {selectedExpiries.length} selected
                </div>
            </div>

            {/* STRIKE WINDOW SELECTOR */}
            <div className="control-row-4">
                <div className="strike-label">Strikes around ATM:</div>
                <div className="strike-buttons">
                    {['All', 5, 10, 15, 20, 25].map(val => (
                        <button
                            key={val}
                            className={`strike-btn ${strikeWindow === val ? 'active' : ''}`}
                            onClick={() => setStrikeWindow(val)}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

```

## File: client\src\components\OptionChainSplitTable.tsx
```tsx
import { memo } from "react";
import { OptionRow } from "../hooks/useSnapshot";

type Props = {
    rows: OptionRow[];
    atmStrike: number | null;
    loading: boolean;
};

function OptionChainSplitTable({ rows, atmStrike, loading }: Props) {
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center opacity-60">
                Loading snapshot…
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="h-full flex items-center justify-center opacity-50">
                No data for selected time
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto text-xs">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-900 z-10">
                    <tr className="border-b border-slate-700">
                        {/* CE */}
                        <th className="px-2 py-1 text-right">OI</th>
                        <th className="px-2 py-1 text-right">ΔOI</th>
                        <th className="px-2 py-1 text-right">IV</th>
                        <th className="px-2 py-1 text-right">Δ</th>
                        <th className="px-2 py-1 text-right">Γ</th>
                        <th className="px-2 py-1 text-right">Θ</th>

                        {/* STRIKE */}
                        <th className="px-3 py-1 text-center">Strike</th>

                        {/* PE */}
                        <th className="px-2 py-1 text-right">Θ</th>
                        <th className="px-2 py-1 text-right">Γ</th>
                        <th className="px-2 py-1 text-right">Δ</th>
                        <th className="px-2 py-1 text-right">IV</th>
                        <th className="px-2 py-1 text-right">ΔOI</th>
                        <th className="px-2 py-1 text-right">OI</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => {
                        const isATM = atmStrike !== null && r.strike_price === atmStrike;

                        return (
                            <tr
                                key={r.strike_price}
                                className={
                                    isATM
                                        ? "bg-yellow-900/40 font-semibold"
                                        : "odd:bg-slate-800/40"
                                }
                            >
                                {/* CE */}
                                <td className="px-2 py-1 text-right">
                                    {r.ce_open_interest ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.ce_oi_change ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.ce_iv?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.ce_delta?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.ce_gamma?.toFixed(4) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.ce_theta?.toFixed(2) ?? "-"}
                                </td>

                                {/* STRIKE */}
                                <td className="px-3 py-1 text-center font-medium">
                                    {r.strike_price}
                                </td>

                                {/* PE */}
                                <td className="px-2 py-1 text-right">
                                    {r.pe_theta?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pe_gamma?.toFixed(4) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pe_delta?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pe_iv?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pe_oi_change ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pe_open_interest ?? "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default memo(OptionChainSplitTable);

```

## File: client\src\components\OptionChainTable.tsx
```tsx
import { memo } from "react";
import { OptionRow } from "../hooks/useSnapshot";

type Props = {
    rows: OptionRow[];
    atmStrike: number | null;
    loading: boolean;
};

function OptionChainTable({ rows, atmStrike, loading }: Props) {
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center opacity-60">
                Loading snapshot…
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="h-full flex items-center justify-center opacity-50">
                No data for selected time
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto text-xs">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-900 z-10">
                    <tr className="border-b border-slate-700">
                        <th className="px-2 py-1 text-right">OI</th>
                        <th className="px-2 py-1 text-right">OI Δ</th>
                        <th className="px-2 py-1 text-right">Vol</th>
                        <th className="px-2 py-1 text-right">IV</th>
                        <th className="px-2 py-1 text-right">Δ</th>
                        <th className="px-2 py-1 text-right">Γ</th>
                        <th className="px-2 py-1 text-right">Θ</th>

                        <th className="px-2 py-1 text-center">Strike</th>

                        <th className="px-2 py-1 text-right">LTP</th>
                        <th className="px-2 py-1 text-right">Chg</th>
                        <th className="px-2 py-1 text-right">%Chg</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => {
                        const isATM = atmStrike !== null && r.strike_price === atmStrike;

                        return (
                            <tr
                                key={r.strike_price}
                                className={
                                    isATM
                                        ? "bg-yellow-900/40 font-semibold"
                                        : "odd:bg-slate-800/40"
                                }
                            >
                                <td className="px-2 py-1 text-right">
                                    {r.open_interest ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.oi_change ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.volume ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.implied_volatility?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.delta?.toFixed(2) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.gamma?.toFixed(4) ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.theta?.toFixed(2) ?? "-"}
                                </td>

                                <td className="px-2 py-1 text-center font-medium">
                                    {r.strike_price}
                                </td>

                                <td className="px-2 py-1 text-right">
                                    {r.last_price ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.change ?? "-"}
                                </td>
                                <td className="px-2 py-1 text-right">
                                    {r.pct_change !== null
                                        ? `${r.pct_change.toFixed(2)}%`
                                        : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Memoized to avoid unnecessary re-renders during playback
 */
export default memo(OptionChainTable);

```

## File: client\src\components\Sidebar.tsx
```tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Play } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/chain', label: 'Option Chain', icon: TrendingUp },
        { path: '/playback', label: 'Playback', icon: Play },
    ];

    return (
        <aside className="w-64 bg-gray-800 flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                NSE Options
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

```

## File: client\src\components\Topbar.tsx
```tsx
import React from 'react';

export const Topbar: React.FC = () => {
    return (
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
            <h1 className="text-lg font-semibold">Options Trading Platform</h1>
        </header>
    );
};

```

## File: client\src\components\analytics\AnalyticsDashboard.tsx
```tsx
import React from 'react';
import { Activity, TrendingUp, DollarSign } from 'lucide-react';
import type { Analytics } from '../../types/analytics.types';
import { formatNumber } from '../../utils/formatters';

interface AnalyticsDashboardProps {
    analytics: Analytics;
    useCrores: boolean;
}

export function AnalyticsDashboard({ analytics, useCrores }: AnalyticsDashboardProps) {
    return (
        <div className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 min-w-[140px]">
                    <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center">
                        <Activity size={12} className="mr-1" /> PUT/CALL RATIO
                    </div>
                    <div className={`text-3xl font-bold font-mono ${Number(analytics.pcr) > 1 ? 'text-green-400' : 'text-red-400'}`}>
                        {analytics.pcr}
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 min-w-[140px]">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">PE-CE DIFFERENCE</div>
                    <div className={`text-2xl font-bold font-mono ${analytics.peCeDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatNumber(analytics.peCeDiff, useCrores)}
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 min-w-[140px]">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">MAX PAIN</div>
                    <div className="text-3xl font-bold text-yellow-400 font-mono">
                        {analytics.maxPain?.toLocaleString() || '---'}
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 min-w-[140px]">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">TOTAL CALL OI</div>
                    <div className="text-2xl font-bold text-red-400 font-mono">
                        {formatNumber(analytics.ceOi, useCrores)}
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 min-w-[140px]">
                    <div className="text-[10px] text-gray-500 uppercase mb-1">TOTAL PUT OI</div>
                    <div className="text-2xl font-bold text-green-400 font-mono">
                        {formatNumber(analytics.peOi, useCrores)}
                    </div>
                </div>
            </div>
        </div>
    );
}

```

## File: client\src\components\analytics\GreeksDashboard.tsx
```tsx
import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { safeNumber } from '../../utils/calculations';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface GreeksDashboardProps {
    dataByExpiry: Record<string, any[]>;
    selectedExpiries: string[];
    spotPrice: number;
}

interface GreeksData {
    strike: number;
    call: {
        price: number;
        delta: number;
        gamma: number;
        theta: number;
        vega: number;
        iv: number;
    };
    put: {
        price: number;
        delta: number;
        gamma: number;
        theta: number;
        vega: number;
        iv: number;
    };
}

// ==========================================
// HELPER: BLACK-SCHOLES GREEKS CALCULATION
// ==========================================

function calculateBlackScholesGreeks(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number, // in years
    volatility: number, // implied volatility (e.g., 0.20 for 20%)
    riskFreeRate: number, // e.g., 0.07 for 7%
    optionType: 'CE' | 'PE'
): {
    price: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
} {
    if (timeToExpiry <= 0 || spotPrice <= 0 || strikePrice <= 0) {
        return { price: 0, delta: 0, gamma: 0, theta: 0, vega: 0 };
    }

    const d1 =
        (Math.log(spotPrice / strikePrice) +
            (riskFreeRate + (volatility * volatility) / 2) * timeToExpiry) /
        (volatility * Math.sqrt(timeToExpiry));

    const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

    // Standard normal cumulative distribution
    const normCDF = (x: number): number => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp((-x * x) / 2);
        const prob =
            d *
            t *
            (0.3193815 +
                t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - prob : prob;
    };

    // Standard normal probability density
    const normPDF = (x: number): number => {
        return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
    };

    const Nd1 = normCDF(d1);
    const Nd2 = normCDF(d2);
    const nd1 = normPDF(d1);

    let price: number;
    let delta: number;

    if (optionType === 'CE') {
        price =
            spotPrice * Nd1 -
            strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * Nd2;
        delta = Nd1;
    } else {
        price =
            strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normCDF(-d2) -
            spotPrice * normCDF(-d1);
        delta = Nd1 - 1;
    }

    const gamma =
        nd1 / (spotPrice * volatility * Math.sqrt(timeToExpiry));

    const theta =
        optionType === 'CE'
            ? ((-spotPrice * nd1 * volatility) / (2 * Math.sqrt(timeToExpiry)) -
                riskFreeRate *
                strikePrice *
                Math.exp(-riskFreeRate * timeToExpiry) *
                Nd2) /
            365
            : ((-spotPrice * nd1 * volatility) / (2 * Math.sqrt(timeToExpiry)) +
                riskFreeRate *
                strikePrice *
                Math.exp(-riskFreeRate * timeToExpiry) *
                normCDF(-d2)) /
            365;

    const vega =
        (spotPrice * nd1 * Math.sqrt(timeToExpiry)) / 100;

    return { price, delta, gamma, theta, vega };
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function GreeksDashboard({
    dataByExpiry,
    selectedExpiries,
    spotPrice
}: GreeksDashboardProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    // ==========================================
    // CALCULATE GREEKS FOR ALL STRIKES
    // ==========================================

    const greeksData = useMemo<GreeksData[]>(() => {
        const combined: Record<number, any> = {};

        selectedExpiries.forEach(expiry => {
            const data = dataByExpiry[expiry] || [];

            // Calculate time to expiry in years
            const expiryDate = new Date(expiry);
            const now = new Date();
            const daysToExpiry = Math.max(
                (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                0.01
            );
            const timeToExpiry = daysToExpiry / 365;

            data.forEach(row => {
                const strike = safeNumber(row.strike_price);
                const optionType = row.option_type as 'CE' | 'PE';
                const ltp = safeNumber(row.last_price, 1);

                if (!combined[strike]) {
                    combined[strike] = {
                        strike,
                        call: { price: 0, delta: 0, gamma: 0, theta: 0, vega: 0, iv: 0 },
                        put: { price: 0, delta: 0, gamma: 0, theta: 0, vega: 0, iv: 0 }
                    };
                }

                // Use implied volatility or default 20%
                const iv = safeNumber(row.implied_volatility, 0.20);
                const riskFreeRate = 0.07; // 7% risk-free rate

                const greeks = calculateBlackScholesGreeks(
                    spotPrice,
                    strike,
                    timeToExpiry,
                    iv,
                    riskFreeRate,
                    optionType
                );

                if (optionType === 'CE') {
                    combined[strike].call = {
                        price: ltp > 0 ? ltp : greeks.price,
                        delta: greeks.delta,
                        gamma: greeks.gamma,
                        theta: greeks.theta,
                        vega: greeks.vega,
                        iv: iv * 100
                    };
                } else {
                    combined[strike].put = {
                        price: ltp > 0 ? ltp : greeks.price,
                        delta: greeks.delta,
                        gamma: greeks.gamma,
                        theta: greeks.theta,
                        vega: greeks.vega,
                        iv: iv * 100
                    };
                }
            });
        });

        return Object.values(combined).sort((a, b) => a.strike - b.strike);
    }, [dataByExpiry, selectedExpiries, spotPrice]);

    // ==========================================
    // AGGREGATE GREEKS
    // ==========================================

    const aggregateGreeks = useMemo(() => {
        return greeksData.reduce(
            (acc, row) => ({
                totalCallDelta: acc.totalCallDelta + row.call.delta,
                totalPutDelta: acc.totalPutDelta + row.put.delta,
                totalCallGamma: acc.totalCallGamma + row.call.gamma,
                totalPutGamma: acc.totalPutGamma + row.put.gamma,
                totalCallTheta: acc.totalCallTheta + row.call.theta,
                totalPutTheta: acc.totalPutTheta + row.put.theta,
                totalCallVega: acc.totalCallVega + row.call.vega,
                totalPutVega: acc.totalPutVega + row.put.vega
            }),
            {
                totalCallDelta: 0,
                totalPutDelta: 0,
                totalCallGamma: 0,
                totalPutGamma: 0,
                totalCallTheta: 0,
                totalPutTheta: 0,
                totalCallVega: 0,
                totalPutVega: 0
            }
        );
    }, [greeksData]);

    // ==========================================
    // RENDER
    // ==========================================

    if (greeksData.length === 0) {
        return (
            <div className="bg-gray-950 rounded-lg border border-gray-800 p-12 text-center">
                <Activity size={48} className="text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-2">No Greeks Data Available</div>
                <div className="text-gray-600 text-sm">Select expiries to view Greeks analysis</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <GreekCard
                    label="Total Call Delta"
                    value={aggregateGreeks.totalCallDelta.toFixed(2)}
                    icon={<TrendingUp size={20} />}
                    color="green"
                />
                <GreekCard
                    label="Total Put Delta"
                    value={aggregateGreeks.totalPutDelta.toFixed(2)}
                    icon={<TrendingDown size={20} />}
                    color="red"
                />
                <GreekCard
                    label="Total Gamma"
                    value={(aggregateGreeks.totalCallGamma + aggregateGreeks.totalPutGamma).toFixed(4)}
                    icon={<Activity size={20} />}
                    color="blue"
                />
                <GreekCard
                    label="Total Theta"
                    value={(aggregateGreeks.totalCallTheta + aggregateGreeks.totalPutTheta).toFixed(2)}
                    icon={<Zap size={20} />}
                    color="yellow"
                />
            </div>

            {/* Toggle Advanced View */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Greeks by Strike</h3>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition"
                >
                    {showAdvanced ? 'Simple View' : 'Advanced View'}
                </button>
            </div>

            {/* Greeks Table */}
            <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-center text-gray-400 font-semibold" colSpan={showAdvanced ? 6 : 5}>
                                    Call Options
                                </th>
                                <th className="px-4 py-3 text-center text-gray-400 font-semibold">Strike</th>
                                <th className="px-4 py-3 text-center text-gray-400 font-semibold" colSpan={showAdvanced ? 6 : 5}>
                                    Put Options
                                </th>
                            </tr>
                            <tr className="border-t border-gray-800">
                                <th className="px-3 py-2 text-right text-gray-500 text-xs">Price</th>
                                <th className="px-3 py-2 text-right text-gray-500 text-xs">Delta</th>
                                <th className="px-3 py-2 text-right text-gray-500 text-xs">Gamma</th>
                                <th className="px-3 py-2 text-right text-gray-500 text-xs">Theta</th>
                                <th className="px-3 py-2 text-right text-gray-500 text-xs">Vega</th>
                                {showAdvanced && <th className="px-3 py-2 text-right text-gray-500 text-xs">IV%</th>}
                                <th className="px-3 py-2 text-center text-gray-400 font-bold">Strike</th>
                                <th className="px-3 py-2 text-left text-gray-500 text-xs">Delta</th>
                                <th className="px-3 py-2 text-left text-gray-500 text-xs">Gamma</th>
                                <th className="px-3 py-2 text-left text-gray-500 text-xs">Theta</th>
                                <th className="px-3 py-2 text-left text-gray-500 text-xs">Vega</th>
                                {showAdvanced && <th className="px-3 py-2 text-left text-gray-500 text-xs">IV%</th>}
                                <th className="px-3 py-2 text-left text-gray-500 text-xs">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {greeksData.map(row => {
                                const isATM = Math.abs(row.strike - spotPrice) < 100;
                                return (
                                    <tr
                                        key={row.strike}
                                        className={`border-t border-gray-800 hover:bg-gray-900/50 transition ${isATM ? 'bg-yellow-500/5' : ''
                                            }`}
                                    >
                                        {/* Call Options */}
                                        <td className="px-3 py-2 text-right text-white font-mono">₹{row.call.price.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right text-green-400 font-mono">{row.call.delta.toFixed(4)}</td>
                                        <td className="px-3 py-2 text-right text-blue-400 font-mono">{row.call.gamma.toFixed(6)}</td>
                                        <td className="px-3 py-2 text-right text-red-400 font-mono">{row.call.theta.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right text-purple-400 font-mono">{row.call.vega.toFixed(2)}</td>
                                        {showAdvanced && (
                                            <td className="px-3 py-2 text-right text-yellow-400 font-mono">{row.call.iv.toFixed(1)}%</td>
                                        )}

                                        {/* Strike */}
                                        <td className={`px-3 py-2 text-center font-bold ${isATM ? 'text-yellow-400' : 'text-white'}`}>
                                            {row.strike}
                                            {isATM && <span className="ml-2 text-xs text-yellow-400">ATM</span>}
                                        </td>

                                        {/* Put Options */}
                                        <td className="px-3 py-2 text-left text-red-400 font-mono">{row.put.delta.toFixed(4)}</td>
                                        <td className="px-3 py-2 text-left text-blue-400 font-mono">{row.put.gamma.toFixed(6)}</td>
                                        <td className="px-3 py-2 text-left text-green-400 font-mono">{row.put.theta.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-left text-purple-400 font-mono">{row.put.vega.toFixed(2)}</td>
                                        {showAdvanced && (
                                            <td className="px-3 py-2 text-left text-yellow-400 font-mono">{row.put.iv.toFixed(1)}%</td>
                                        )}
                                        <td className="px-3 py-2 text-left text-white font-mono">₹{row.put.price.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Greeks Explanation */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="text-sm text-gray-400 space-y-2">
                    <div><strong className="text-white">Delta:</strong> Rate of change of option price with respect to underlying price (0-1 for calls, -1-0 for puts)</div>
                    <div><strong className="text-white">Gamma:</strong> Rate of change of delta with respect to underlying price</div>
                    <div><strong className="text-white">Theta:</strong> Rate of time decay per day (usually negative)</div>
                    <div><strong className="text-white">Vega:</strong> Sensitivity to 1% change in implied volatility</div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// GREEK CARD COMPONENT
// ==========================================

function GreekCard({
    label,
    value,
    icon,
    color
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: 'green' | 'red' | 'blue' | 'yellow';
}) {
    const colorClasses = {
        green: 'text-green-400 bg-green-500/10 border-green-500/30',
        red: 'text-red-400 bg-red-500/10 border-red-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    };

    return (
        <div className={`bg-gray-950 rounded-lg border ${colorClasses[color]} p-4`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
                <div className={colorClasses[color]}>{icon}</div>
            </div>
            <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
        </div>
    );
}

```

## File: client\src\components\analytics\OIAnalysisDashboard.tsx
```tsx
import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';
import { safeNumber } from '../../utils/calculations';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface OIAnalysisDashboardProps {
    dataByExpiry: Record<string, any[]>;
    selectedExpiries: string[];
    spotPrice: number;
}

interface OISpurt {
    timestamp: string;
    strike: number;
    optionType: 'CE' | 'PE';
    previousOI: number;
    currentOI: number;
    oiChange: number;
    oiChangePct: number;
    volume: number;
    significance: string;
}

interface BuildupData {
    strike: number;
    callOI: number;
    putOI: number;
    callChange: number;
    putChange: number;
    callPrice: number;
    putPrice: number;
    signal: string;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function OIAnalysisDashboard({
    dataByExpiry,
    selectedExpiries,
    spotPrice
}: OIAnalysisDashboardProps) {
    const [activeView, setActiveView] = useState<'buildup' | 'spurts'>('buildup');

    // ==========================================
    // CALCULATE OI BUILD-UP/UNWINDING
    // ==========================================

    const buildupData = useMemo<BuildupData[]>(() => {
        const combined: Record<number, any> = {};

        selectedExpiries.forEach(expiry => {
            const data = dataByExpiry[expiry] || [];

            data.forEach(row => {
                const strike = safeNumber(row.strike_price);

                if (!combined[strike]) {
                    combined[strike] = {
                        strike,
                        callOI: 0,
                        putOI: 0,
                        callChange: 0,
                        putChange: 0,
                        callPrice: 0,
                        putPrice: 0,
                        signal: ''
                    };
                }

                const oi = safeNumber(row.open_interest);
                const oiChange = safeNumber(row.oi_change);
                const price = safeNumber(row.last_price);

                if (row.option_type === 'CE') {
                    combined[strike].callOI += oi;
                    combined[strike].callChange += oiChange;
                    combined[strike].callPrice = price;
                } else {
                    combined[strike].putOI += oi;
                    combined[strike].putChange += oiChange;
                    combined[strike].putPrice = price;
                }
            });
        });

        // Determine signal based on OI change and price
        return Object.values(combined)
            .map((row: any) => {
                let signal = '';

                // Long Build-up: OI ↑ + Price ↑
                if (row.callChange > 0 && row.callPrice > 0) {
                    signal = 'Call Long Build-up';
                } else if (row.callChange < 0 && row.callPrice < 0) {
                    signal = 'Call Short Covering';
                }

                if (row.putChange > 0 && row.putPrice > 0) {
                    signal = signal ? `${signal} | Put Long Build-up` : 'Put Long Build-up';
                } else if (row.putChange < 0 && row.putPrice < 0) {
                    signal = signal ? `${signal} | Put Short Covering` : 'Put Short Covering';
                }

                return {
                    ...row,
                    signal: signal || 'Neutral'
                };
            })
            .sort((a, b) => a.strike - b.strike);
    }, [dataByExpiry, selectedExpiries]);

    // ==========================================
    // DETECT OI SPURTS (Significant Changes)
    // ==========================================

    const oiSpurts = useMemo<OISpurt[]>(() => {
        const spurts: OISpurt[] = [];

        selectedExpiries.forEach(expiry => {
            const data = dataByExpiry[expiry] || [];

            data.forEach(row => {
                const currentOI = safeNumber(row.open_interest);
                const oiChange = safeNumber(row.oi_change);
                const previousOI = currentOI - oiChange;

                if (previousOI > 0) {
                    const oiChangePct = (oiChange / previousOI) * 100;

                    // Flag significant changes (>15%)
                    if (Math.abs(oiChangePct) >= 15) {
                        let significance = '';
                        const absChangePct = Math.abs(oiChangePct);

                        if (absChangePct >= 50) {
                            significance = 'Critical';
                        } else if (absChangePct >= 25) {
                            significance = 'High';
                        } else {
                            significance = 'Medium';
                        }

                        spurts.push({
                            timestamp: row.timestamp || new Date().toISOString(),
                            strike: safeNumber(row.strike_price),
                            optionType: row.option_type,
                            previousOI,
                            currentOI,
                            oiChange,
                            oiChangePct,
                            volume: safeNumber(row.volume),
                            significance
                        });
                    }
                }
            });
        });

        // Sort by absolute change percentage
        return spurts.sort((a, b) => Math.abs(b.oiChangePct) - Math.abs(a.oiChangePct)).slice(0, 50);
    }, [dataByExpiry, selectedExpiries]);

    // ==========================================
    // SUMMARY STATS
    // ==========================================

    const summary = useMemo(() => {
        const totalCallOI = buildupData.reduce((sum, row) => sum + row.callOI, 0);
        const totalPutOI = buildupData.reduce((sum, row) => sum + row.putOI, 0);
        const totalCallChange = buildupData.reduce((sum, row) => sum + row.callChange, 0);
        const totalPutChange = buildupData.reduce((sum, row) => sum + row.putChange, 0);

        return {
            totalCallOI,
            totalPutOI,
            totalCallChange,
            totalPutChange,
            pcr: totalCallOI > 0 ? totalPutOI / totalCallOI : 0
        };
    }, [buildupData]);

    // ==========================================
    // RENDER
    // ==========================================

    if (buildupData.length === 0) {
        return (
            <div className="bg-gray-950 rounded-lg border border-gray-800 p-12 text-center">
                <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-2">No OI Data Available</div>
                <div className="text-gray-600 text-sm">Select expiries to view OI analysis</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
                <SummaryCard
                    label="Total Call OI"
                    value={summary.totalCallOI.toLocaleString()}
                    color="red"
                    icon={<TrendingDown size={20} />}
                />
                <SummaryCard
                    label="Total Put OI"
                    value={summary.totalPutOI.toLocaleString()}
                    color="green"
                    icon={<TrendingUp size={20} />}
                />
                <SummaryCard
                    label="Call OI Change"
                    value={`${summary.totalCallChange > 0 ? '+' : ''}${summary.totalCallChange.toLocaleString()}`}
                    color={summary.totalCallChange >= 0 ? 'blue' : 'red'}
                    icon={<Zap size={20} />}
                />
                <SummaryCard
                    label="Put OI Change"
                    value={`${summary.totalPutChange > 0 ? '+' : ''}${summary.totalPutChange.toLocaleString()}`}
                    color={summary.totalPutChange >= 0 ? 'blue' : 'green'}
                    icon={<Zap size={20} />}
                />
                <SummaryCard
                    label="PCR"
                    value={summary.pcr.toFixed(3)}
                    color="yellow"
                    icon={<AlertTriangle size={20} />}
                />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setActiveView('buildup')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeView === 'buildup'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Build-up Analysis
                </button>
                <button
                    onClick={() => setActiveView('spurts')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeView === 'spurts'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    OI Spurts ({oiSpurts.length})
                </button>
            </div>

            {/* Build-up Analysis Table */}
            {activeView === 'buildup' && (
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-auto max-h-[600px]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-center text-gray-400 font-semibold">Strike</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Call OI</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Call Change</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Put OI</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Put Change</th>
                                    <th className="px-4 py-3 text-left text-gray-400 font-semibold">Signal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buildupData.map(row => {
                                    const isATM = Math.abs(row.strike - spotPrice) < 100;
                                    return (
                                        <tr
                                            key={row.strike}
                                            className={`border-t border-gray-800 hover:bg-gray-900/50 transition ${isATM ? 'bg-yellow-500/5' : ''
                                                }`}
                                        >
                                            <td className={`px-4 py-3 text-center font-bold ${isATM ? 'text-yellow-400' : 'text-white'}`}>
                                                {row.strike}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-400 font-mono">
                                                {row.callOI.toLocaleString()}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-mono ${row.callChange > 0 ? 'text-green-400' : row.callChange < 0 ? 'text-red-400' : 'text-gray-500'
                                                }`}>
                                                {row.callChange > 0 ? '+' : ''}{row.callChange.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-400 font-mono">
                                                {row.putOI.toLocaleString()}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-mono ${row.putChange > 0 ? 'text-green-400' : row.putChange < 0 ? 'text-red-400' : 'text-gray-500'
                                                }`}>
                                                {row.putChange > 0 ? '+' : ''}{row.putChange.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-left text-gray-300">{row.signal}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* OI Spurts Table */}
            {activeView === 'spurts' && (
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="p-4 bg-gray-900 border-b border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            <span>Institutional activity tracker - Sudden OI changes indicate smart money movement</span>
                        </div>
                    </div>
                    <div className="overflow-auto max-h-[600px]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-400 font-semibold">Strike</th>
                                    <th className="px-4 py-3 text-center text-gray-400 font-semibold">Type</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Previous OI</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Current OI</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Change</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Change %</th>
                                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Volume</th>
                                    <th className="px-4 py-3 text-center text-gray-400 font-semibold">Significance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oiSpurts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                            No significant OI changes detected
                                        </td>
                                    </tr>
                                ) : (
                                    oiSpurts.map((spurt, idx) => (
                                        <tr key={idx} className="border-t border-gray-800 hover:bg-gray-900/50 transition">
                                            <td className="px-4 py-3 text-left text-white font-bold">{spurt.strike}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${spurt.optionType === 'CE' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {spurt.optionType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-400 font-mono">
                                                {spurt.previousOI.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right text-white font-mono">
                                                {spurt.currentOI.toLocaleString()}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-mono font-bold ${spurt.oiChange > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {spurt.oiChange > 0 ? '+' : ''}{spurt.oiChange.toLocaleString()}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-mono font-bold ${Math.abs(spurt.oiChangePct) >= 25
                                                    ? 'text-red-400'
                                                    : Math.abs(spurt.oiChangePct) >= 15
                                                        ? 'text-yellow-400'
                                                        : 'text-blue-400'
                                                }`}>
                                                {spurt.oiChangePct > 0 ? '+' : ''}{spurt.oiChangePct.toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-3 text-right text-purple-400 font-mono">
                                                {spurt.volume.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${spurt.significance === 'Critical'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : spurt.significance === 'High'
                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                            : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {spurt.significance}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="text-sm text-gray-400 space-y-2">
                    <div><strong className="text-white">Long Build-up:</strong> OI increases with price increase → Bullish/Bearish depending on CE/PE</div>
                    <div><strong className="text-white">Short Build-up:</strong> OI increases with price decrease → Bearish/Bullish depending on CE/PE</div>
                    <div><strong className="text-white">Short Covering:</strong> OI decreases with price increase → Exit of short positions</div>
                    <div><strong className="text-white">Long Unwinding:</strong> OI decreases with price decrease → Exit of long positions</div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// SUMMARY CARD COMPONENT
// ==========================================

function SummaryCard({
    label,
    value,
    color,
    icon
}: {
    label: string;
    value: string;
    color: 'green' | 'red' | 'blue' | 'yellow';
    icon: React.ReactNode;
}) {
    const colorClasses = {
        green: 'text-green-400 bg-green-500/10 border-green-500/30',
        red: 'text-red-400 bg-red-500/10 border-red-500/30',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    };

    return (
        <div className={`bg-gray-950 rounded-lg border ${colorClasses[color]} p-4`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
                <div className={colorClasses[color]}>{icon}</div>
            </div>
            <div className={`text-xl font-bold ${colorClasses[color]}`}>{value}</div>
        </div>
    );
}

```

## File: client\src\components\analytics\StrikeMetrics.tsx
```tsx
import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import type { StrikeTimelineData } from '../../types/option.types';
import { safeNumber } from '../../utils/calculations';

interface StrikeMetricsProps {
    data: StrikeTimelineData[];
    optionType: 'CE' | 'PE';
}

export function StrikeMetrics({ data, optionType }: StrikeMetricsProps) {
    if (data.length === 0) return null;

    const first = data[0];
    const last = data[data.length - 1];

    const firstPrice = safeNumber(first.ltp);
    const lastPrice = safeNumber(last.ltp);
    const priceChange = lastPrice - firstPrice;
    const priceChangePct = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

    const highPrice = Math.max(...data.map(d => safeNumber(d.ltp)));
    const lowPrice = Math.min(...data.map(d => safeNumber(d.ltp)));

    const firstOI = safeNumber(first.oi);
    const lastOI = safeNumber(last.oi);
    const oiChange = lastOI - firstOI;
    const oiChangePct = firstOI > 0 ? (oiChange / firstOI) * 100 : 0;

    const totalVolume = data.reduce((sum, d) => sum + safeNumber(d.volume), 0);

    const metrics = [
        {
            label: 'Current LTP',
            value: `₹${lastPrice.toFixed(2)}`,
            change: priceChange,
            changePct: priceChangePct,
            icon: DollarSign,
            color: priceChange >= 0 ? 'text-green-400' : 'text-red-400'
        },
        {
            label: 'Day High / Low',
            value: `₹${highPrice.toFixed(2)} / ₹${lowPrice.toFixed(2)}`,
            subValue: `Range: ₹${(highPrice - lowPrice).toFixed(2)}`,
            icon: Activity,
            color: 'text-blue-400'
        },
        {
            label: 'Open Interest',
            value: lastOI.toLocaleString('en-IN'),
            change: oiChange,
            changePct: oiChangePct,
            icon: oiChange >= 0 ? TrendingUp : TrendingDown,
            color: oiChange >= 0 ? 'text-green-400' : 'text-red-400'
        },
        {
            label: 'Total Volume',
            value: totalVolume.toLocaleString('en-IN'),
            subValue: `Avg: ${Math.round(totalVolume / data.length).toLocaleString('en-IN')}`,
            icon: Activity,
            color: 'text-purple-400'
        }
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                    <div
                        key={idx}
                        className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-sm text-gray-400 font-medium">
                                {metric.label}
                            </span>
                            <Icon className={`${metric.color} w-5 h-5`} />
                        </div>

                        <div className="text-2xl font-bold text-white mb-1">
                            {metric.value}
                        </div>

                        {metric.change !== undefined && (
                            <div className={`flex items-center space-x-2 text-sm ${metric.color}`}>
                                <span className="font-semibold">
                                    {metric.change > 0 ? '+' : ''}
                                    {metric.change.toFixed(2)}
                                </span>
                                <span className="text-gray-500">
                                    ({metric.changePct > 0 ? '+' : ''}
                                    {metric.changePct.toFixed(2)}%)
                                </span>
                            </div>
                        )}

                        {metric.subValue && (
                            <div className="text-sm text-gray-500 mt-1">
                                {metric.subValue}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

```

## File: client\src\components\analytics\StrikeTradesTable.tsx
```tsx
import React from 'react';
import type { StrikeTimelineData } from '../../types/option.types';
import { formatTime } from '../../utils/formatters';
import { safeNumber } from '../../utils/calculations';

interface StrikeTradesTableProps {
    data: StrikeTimelineData[];
}

export function StrikeTradesTable({ data }: StrikeTradesTableProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full">
                    <thead className="bg-gray-900 sticky top-0 z-10">
                        <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                            <th className="px-4 py-3 font-semibold">Time</th>
                            <th className="px-4 py-3 font-semibold text-right">LTP</th>
                            <th className="px-4 py-3 font-semibold text-right">Change</th>
                            <th className="px-4 py-3 font-semibold text-right">Bid</th>
                            <th className="px-4 py-3 font-semibold text-right">Ask</th>
                            <th className="px-4 py-3 font-semibold text-right">Spread</th>
                            <th className="px-4 py-3 font-semibold text-right">OI</th>
                            <th className="px-4 py-3 font-semibold text-right">OI Change</th>
                            <th className="px-4 py-3 font-semibold text-right">Volume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {data.map((row, idx) => {
                            const ltp = safeNumber(row.ltp);
                            const prevLtp = idx > 0 ? safeNumber(data[idx - 1].ltp) : ltp;
                            const ltpChange = ltp - prevLtp;
                            const bid = safeNumber(row.bid);
                            const ask = safeNumber(row.ask);
                            const spread = ask - bid;
                            const oi = safeNumber(row.oi);
                            const prevOI = idx > 0 ? safeNumber(data[idx - 1].oi) : oi;
                            const oiChange = oi - prevOI;

                            return (
                                <tr
                                    key={idx}
                                    className="text-sm hover:bg-gray-900/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-300 font-mono">
                                        {formatTime(row.timestamp)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-white">
                                        ₹{ltp.toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-semibold ${ltpChange > 0 ? 'text-green-400' :
                                            ltpChange < 0 ? 'text-red-400' : 'text-gray-500'
                                        }`}>
                                        {ltpChange > 0 ? '+' : ''}{ltpChange.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-400">
                                        ₹{bid.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-400">
                                        ₹{ask.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        ₹{spread.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-white">
                                        {oi.toLocaleString('en-IN')}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-semibold ${oiChange > 0 ? 'text-green-400' :
                                            oiChange < 0 ? 'text-red-400' : 'text-gray-500'
                                        }`}>
                                        {oiChange > 0 ? '+' : ''}{oiChange.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3 text-right text-purple-400">
                                        {safeNumber(row.volume).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

```

## File: client\src\components\charts\ChartLegend.tsx
```tsx
import React from 'react';

interface ChartLegendProps {
    showOIChange: boolean;
    strikeCount: number;
}

export function ChartLegend({ showOIChange, strikeCount }: ChartLegendProps) {
    return (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
            <div className="flex items-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-green-500 rounded" />
                    <span className="text-gray-400">Put OI</span>
                </div>
                {showOIChange && (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-green-400 opacity-60 rounded" />
                        <span className="text-gray-400">Put OI Δ</span>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-red-500 rounded" />
                    <span className="text-gray-400">Call OI</span>
                </div>
                {showOIChange && (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-red-400 opacity-60 rounded" />
                        <span className="text-gray-400">Call OI Δ</span>
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-500">
                Showing {strikeCount} strikes
            </div>
        </div>
    );
}

```

## File: client\src\components\charts\StrikePriceChart.tsx
```tsx
import React from 'react';
import type { StrikeTimelineData } from '../../types/option.types';
import { formatTime } from '../../utils/formatters';
import { safeNumber } from '../../utils/calculations';

interface StrikePriceChartProps {
    data: StrikeTimelineData[];
    metric?: 'ltp' | 'oi' | 'volume';
    color?: string;
}

export function StrikePriceChart({ data, metric = 'ltp', color = '#3B82F6' }: StrikePriceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center bg-gray-950 rounded border border-gray-800">
                <span className="text-gray-600">No data available</span>
            </div>
        );
    }

    const CHART_WIDTH = 1200;
    const CHART_HEIGHT = 320;
    const PADDING = { top: 20, right: 60, bottom: 40, left: 60 };

    // Extract values based on metric
    const values = data.map(d => {
        switch (metric) {
            case 'oi': return safeNumber(d.oi);
            case 'volume': return safeNumber(d.volume);
            default: return safeNumber(d.ltp);
        }
    });

    const minValue = Math.min(...values) * 0.95;
    const maxValue = Math.max(...values) * 1.05;
    const valueRange = maxValue - minValue;

    if (valueRange === 0) {
        return (
            <div className="h-96 flex items-center justify-center bg-gray-950 rounded border border-gray-800">
                <span className="text-gray-600">All values are identical</span>
            </div>
        );
    }

    const scaleX = (index: number) =>
        PADDING.left + (index / (data.length - 1)) * (CHART_WIDTH - PADDING.left - PADDING.right);

    const scaleY = (value: number) =>
        CHART_HEIGHT - PADDING.bottom - ((value - minValue) / valueRange) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);

    // Create path for line
    const pathData = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(values[i])}`)
        .join(' ');

    // Create area fill path
    const areaPath = pathData +
        ` L ${scaleX(data.length - 1)} ${CHART_HEIGHT - PADDING.bottom}` +
        ` L ${PADDING.left} ${CHART_HEIGHT - PADDING.bottom} Z`;

    // Format labels based on metric
    const formatValue = (val: number) => {
        if (metric === 'ltp') return `₹${val.toFixed(2)}`;
        return val.toLocaleString('en-IN');
    };

    return (
        <div className="h-80 bg-gray-950 rounded border border-gray-800">
            <svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                    const y = PADDING.top + ratio * (CHART_HEIGHT - PADDING.top - PADDING.bottom);
                    const value = maxValue - ratio * valueRange;
                    return (
                        <g key={ratio}>
                            <line
                                x1={PADDING.left}
                                y1={y}
                                x2={CHART_WIDTH - PADDING.right}
                                y2={y}
                                stroke="#374151"
                                strokeWidth="1"
                                strokeDasharray="4"
                            />
                            <text x={PADDING.left - 10} y={y + 5} fill="#9CA3AF" fontSize="12" textAnchor="end">
                                {formatValue(value)}
                            </text>
                        </g>
                    );
                })}

                {/* Area fill */}
                <path
                    d={areaPath}
                    fill={color}
                    fillOpacity="0.1"
                />

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {data.map((d, i) => {
                    if (i % Math.ceil(data.length / 50) !== 0 && i !== 0 && i !== data.length - 1) return null;
                    return (
                        <circle
                            key={i}
                            cx={scaleX(i)}
                            cy={scaleY(values[i])}
                            r="4"
                            fill={color}
                            stroke="#1F2937"
                            strokeWidth="2"
                        >
                            <title>
                                {formatTime(d.timestamp)}: {formatValue(values[i])}
                            </title>
                        </circle>
                    );
                })}

                {/* Time labels */}
                {[0, Math.floor(data.length / 2), data.length - 1].map(idx => (
                    <text
                        key={idx}
                        x={scaleX(idx)}
                        y={CHART_HEIGHT - 10}
                        fill="#9CA3AF"
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {formatTime(data[idx].timestamp)}
                    </text>
                ))}
            </svg>
        </div>
    );
}

```

## File: client\src\components\charts\VerticalStackedChart.tsx
```tsx
import React, { useMemo, useState } from 'react';
import { useModalContext } from '../../context/ModalContext';
import { safeNumber } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatters';

interface VerticalStackedChartProps {
    dataByExpiry: Record<string, any[]>;
    spotPrice?: number;
    maxPain?: number;
    selectedExpiries?: string[];
    useCrores?: boolean;
    strikeRange?: { min: number; max: number };
    atmRange?: number;
    showOIChange?: boolean;
}

export function VerticalStackedChart({
    dataByExpiry,
    selectedExpiries,
    useCrores = false,
    spotPrice = 0,
    strikeRange,
    atmRange = 20,
    showOIChange = false,
    maxPain
}: VerticalStackedChartProps) {
    const { openStrikeModal } = useModalContext();
    const [showTable, setShowTable] = useState(false);
    const [hoveredStrike, setHoveredStrike] = useState<number | null>(null);

    // ========================================== CHART DATA PROCESSING
    const chartData = useMemo(() => {
        const combined: Record<number, any> = {};

        const expiriesToShow = selectedExpiries && selectedExpiries.length > 0
            ? selectedExpiries
            : Object.keys(dataByExpiry);

        console.log('📊 [Chart] Processing expiries:', expiriesToShow);

        expiriesToShow.forEach(expiry => {
            const data = dataByExpiry[expiry];

            if (!data || !Array.isArray(data)) {
                console.warn(`⚠️ [Chart] No data for expiry: ${expiry}`);
                return;
            }

            console.log(`📊 [Chart] Processing ${data.length} rows for expiry ${expiry}`);

            if (data.length > 0) {
                console.log('📊 [Chart] Sample row:', {
                    strike_price: data[0].strike_price,
                    call_oi: data[0].call_oi,
                    put_oi: data[0].put_oi,
                    call_oi_change: data[0].call_oi_change,
                    put_oi_change: data[0].put_oi_change
                });
            }

            data.forEach(row => {
                const strike = safeNumber(row.strike_price);

                if (strike === 0) return;

                if (!combined[strike]) {
                    combined[strike] = {
                        strike,
                        ce: 0,
                        pe: 0,
                        ceChange: 0,
                        peChange: 0,
                        ceLTP: 0,
                        peLTP: 0,
                        ceVolume: 0,
                        peVolume: 0,
                        underlyingValue: safeNumber(row.underlying_value),
                        hasChangeData: false
                    };
                }

                const callOI = safeNumber(row.call_oi || 0);
                const putOI = safeNumber(row.put_oi || 0);
                const callOIChange = safeNumber(row.call_oi_change || 0);
                const putOIChange = safeNumber(row.put_oi_change || 0);

                if (callOIChange !== 0 || putOIChange !== 0) {
                    combined[strike].hasChangeData = true;
                }

                combined[strike].ce += callOI;
                combined[strike].pe += putOI;
                combined[strike].ceChange += callOIChange;
                combined[strike].peChange += putOIChange;
                combined[strike].ceLTP = safeNumber(row.call_ltp || 0);
                combined[strike].peLTP = safeNumber(row.put_ltp || 0);
                combined[strike].ceVolume = safeNumber(row.call_volume || 0);
                combined[strike].peVolume = safeNumber(row.put_volume || 0);
            });
        });

        const result = Object.values(combined).sort((a, b) => a.strike - b.strike);

        console.log(`📊 [Chart] Generated ${result.length} combined strikes`);

        if (result.length > 0) {
            const totalCE = result.reduce((sum, r) => sum + r.ce, 0);
            const totalPE = result.reduce((sum, r) => sum + r.pe, 0);
            console.log('📊 [Chart] Total OI:', {
                CE: formatNumber(totalCE / (useCrores ? 10000000 : 100000), useCrores),
                PE: formatNumber(totalPE / (useCrores ? 10000000 : 100000), useCrores),
                PCR: totalCE > 0 ? (totalPE / totalCE).toFixed(2) : 'N/A'
            });
        }

        return result;
    }, [dataByExpiry, selectedExpiries, useCrores]);

    const hasAnyChangeData = useMemo(() => {
        return chartData.some(d => d.hasChangeData);
    }, [chartData]);

    const filteredData = useMemo(() => {
        if (atmRange === 0) return chartData;
        if (chartData.length === 0) return [];

        const atmStrike = spotPrice || chartData[Math.floor(chartData.length / 2)]?.strike || 0;

        return chartData.filter(d => Math.abs(d.strike - atmStrike) <= atmRange * 100);
    }, [chartData, atmRange, spotPrice]);

    const maxOI = useMemo(() => {
        return Math.max(...filteredData.flatMap(d => [d.ce, d.pe]), 1);
    }, [filteredData]);

    const maxChange = useMemo(() => {
        if (!hasAnyChangeData) return 1;
        return Math.max(...filteredData.flatMap(d => [Math.abs(d.ceChange), Math.abs(d.peChange)]), 1);
    }, [filteredData, hasAnyChangeData]);

    const pcrData = useMemo(() => {
        return filteredData.map(d => ({
            strike: d.strike,
            pcr: d.ce > 0 ? d.pe / d.ce : 0
        }));
    }, [filteredData]);

    const maxPCR = Math.max(...pcrData.map(d => d.pcr), 1.5);

    const CHART_HEIGHT = 500;
    const SVG_WIDTH = 1000;
    const SVG_HEIGHT = 300;
    const divisor = useCrores ? 10000000 : 100000;
    const unit = useCrores ? 'Cr' : 'L';

    const pcrLinePoints = useMemo(() => {
        if (pcrData.length < 2) return '';
        return pcrData.map((d, i) => {
            const x = ((i / (pcrData.length - 1)) * 0.9 + 0.05) * SVG_WIDTH;
            const y = (0.1 + (1 - (d.pcr / maxPCR)) * 0.7) * SVG_HEIGHT;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(' ');
    }, [pcrData, maxPCR]);

    const pcrFillPoints = useMemo(() => {
        if (pcrData.length < 2) return '';
        const linePoints = pcrData.map((d, i) => {
            const x = ((i / (pcrData.length - 1)) * 0.9 + 0.05) * SVG_WIDTH;
            const y = (0.1 + (1 - (d.pcr / maxPCR)) * 0.7) * SVG_HEIGHT;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(' ');
        const rightBottom = `${SVG_WIDTH * 0.95},${SVG_HEIGHT * 0.8}`;
        const leftBottom = `${SVG_WIDTH * 0.05},${SVG_HEIGHT * 0.8}`;
        return `${linePoints} ${rightBottom} ${leftBottom}`;
    }, [pcrData, maxPCR]);

    if (filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg border border-gray-800">
                <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">📊 No data available</div>
                    <div className="text-gray-500 text-sm">Select an expiry to view option chain</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Spot Price and Toggle */}
            <div className="flex items-center justify-between">
                {spotPrice > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                        <span className="text-blue-400 font-semibold">Spot Price</span>
                        <span className="text-white text-lg font-bold">
                            ₹{spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                )}

                {/* Table Toggle Button */}
                <button
                    onClick={() => setShowTable(!showTable)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors flex items-center gap-2"
                >
                    {showTable ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Show Chart
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Show Table
                        </>
                    )}
                </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Put OI</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-300">Call OI</span>
                </div>

                {showOIChange && hasAnyChangeData && (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-400 rounded border border-green-600"></div>
                            <span className="text-gray-300">Put OI Δ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-400 rounded border border-red-600"></div>
                            <span className="text-gray-300">Call OI Δ</span>
                        </div>
                    </>
                )}

                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">PCR</span>
                </div>
            </div>

            {/* Chart or Table View */}
            {showTable ? (
                /* TABLE VIEW */
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-800 sticky top-0 z-10">
                                <tr className="text-gray-400">
                                    <th className="px-4 py-3 text-left font-semibold">Strike</th>
                                    <th className="px-4 py-3 text-right font-semibold">Call OI</th>
                                    <th className="px-4 py-3 text-right font-semibold">Call Δ</th>
                                    <th className="px-4 py-3 text-right font-semibold">Call LTP</th>
                                    <th className="px-4 py-3 text-right font-semibold">Put LTP</th>
                                    <th className="px-4 py-3 text-right font-semibold">Put Δ</th>
                                    <th className="px-4 py-3 text-right font-semibold">Put OI</th>
                                    <th className="px-4 py-3 text-right font-semibold">PCR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredData.map(row => {
                                    const isATM = spotPrice > 0 && Math.abs(row.strike - spotPrice) < 50;
                                    const pcr = row.ce > 0 ? row.pe / row.ce : 0;

                                    return (
                                        <tr
                                            key={row.strike}
                                            className={`hover:bg-gray-800/50 transition-colors ${isATM ? 'bg-yellow-500/10' : ''}`}
                                        >
                                            <td className={`px-4 py-2 font-mono ${isATM ? 'text-yellow-400 font-bold' : 'text-white'}`}>
                                                {row.strike}
                                            </td>
                                            <td className="px-4 py-2 text-right text-red-400">
                                                {formatNumber(row.ce / divisor, useCrores)} {unit}
                                            </td>
                                            <td className={`px-4 py-2 text-right text-xs ${row.ceChange > 0 ? 'text-green-400' : row.ceChange < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                                                {row.ceChange > 0 ? '+' : ''}{formatNumber(row.ceChange / divisor, useCrores)} {unit}
                                            </td>
                                            <td className="px-4 py-2 text-right text-gray-300">
                                                ₹{row.ceLTP.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-gray-300">
                                                ₹{row.peLTP.toFixed(2)}
                                            </td>
                                            <td className={`px-4 py-2 text-right text-xs ${row.peChange > 0 ? 'text-green-400' : row.peChange < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                                                {row.peChange > 0 ? '+' : ''}{formatNumber(row.peChange / divisor, useCrores)} {unit}
                                            </td>
                                            <td className="px-4 py-2 text-right text-green-400">
                                                {formatNumber(row.pe / divisor, useCrores)} {unit}
                                            </td>
                                            <td className="px-4 py-2 text-right text-purple-400 font-mono">
                                                {pcr.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* CHART VIEW */
                <div className="relative bg-gray-900 rounded-lg p-6 overflow-x-auto">
                    <div className="flex items-end justify-center gap-2 min-w-max" style={{ height: `${CHART_HEIGHT}px` }}>
                        {filteredData.map((row, idx) => {
                            const ceHeight = (row.ce / maxOI) * (CHART_HEIGHT * 0.8);
                            const peHeight = (row.pe / maxOI) * (CHART_HEIGHT * 0.8);

                            const ceChangeHeight = (showOIChange && hasAnyChangeData && row.ceChange !== 0)
                                ? (Math.abs(row.ceChange) / maxChange) * (CHART_HEIGHT * 0.2)
                                : 0;

                            const peChangeHeight = (showOIChange && hasAnyChangeData && row.peChange !== 0)
                                ? (Math.abs(row.peChange) / maxChange) * (CHART_HEIGHT * 0.2)
                                : 0;

                            const isATM = spotPrice > 0 && Math.abs(row.strike - spotPrice) < 50;
                            const isHovered = hoveredStrike === row.strike;

                            return (
                                <div
                                    key={row.strike}
                                    className="relative flex flex-col items-center group"
                                    onMouseEnter={() => setHoveredStrike(row.strike)}
                                    onMouseLeave={() => setHoveredStrike(null)}
                                >
                                    {/* Hover Tooltip */}
                                    {isHovered && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-2xl z-50 whitespace-nowrap">
                                            <div className="text-white font-bold text-center mb-2">{row.strike}</div>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-red-400">Call OI:</span>
                                                    <span className="text-white font-mono">{formatNumber(row.ce / divisor, useCrores)} {unit}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-green-400">Put OI:</span>
                                                    <span className="text-white font-mono">{formatNumber(row.pe / divisor, useCrores)} {unit}</span>
                                                </div>
                                                {row.ceChange !== 0 && (
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-red-300">Call Δ:</span>
                                                        <span className={row.ceChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                                            {row.ceChange > 0 ? '+' : ''}{formatNumber(row.ceChange / divisor, useCrores)} {unit}
                                                        </span>
                                                    </div>
                                                )}
                                                {row.peChange !== 0 && (
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-green-300">Put Δ:</span>
                                                        <span className={row.peChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                                            {row.peChange > 0 ? '+' : ''}{formatNumber(row.peChange / divisor, useCrores)} {unit}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between gap-4 pt-1 border-t border-gray-700">
                                                    <span className="text-purple-400">PCR:</span>
                                                    <span className="text-white font-mono">{(row.ce > 0 ? row.pe / row.ce : 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bars Container */}
                                    <div className="flex gap-1 items-end">
                                        {/* Put Bar (Green) */}
                                        <div
                                            className={`relative w-10 bg-green-500 rounded-t cursor-pointer transition-all ${isHovered ? 'bg-green-400 scale-105' : ''}`}
                                            style={{ height: `${peHeight}px`, minHeight: row.pe > 0 ? '2px' : '0px' }}
                                            onClick={() => openStrikeModal(row.strike, 'PE')}
                                        >
                                            {showOIChange && hasAnyChangeData && row.peChange !== 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    backgroundColor: row.peChange > 0 ? '#4ade80' : '#16a34a',
                                                    opacity: 0.6,
                                                    height: `${Math.min(peChangeHeight, peHeight)}px`,
                                                    borderRadius: '2px 2px 0 0'
                                                }} />
                                            )}
                                        </div>

                                        {/* Call Bar (Red) */}
                                        <div
                                            className={`relative w-10 bg-red-500 rounded-t cursor-pointer transition-all ${isHovered ? 'bg-red-400 scale-105' : ''}`}
                                            style={{ height: `${ceHeight}px`, minHeight: row.ce > 0 ? '2px' : '0px' }}
                                            onClick={() => openStrikeModal(row.strike, 'CE')}
                                        >
                                            {showOIChange && hasAnyChangeData && row.ceChange !== 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    backgroundColor: row.ceChange > 0 ? '#f87171' : '#dc2626',
                                                    opacity: 0.6,
                                                    height: `${Math.min(ceChangeHeight, ceHeight)}px`,
                                                    borderRadius: '2px 2px 0 0'
                                                }} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Strike Label */}
                                    <div className={`mt-2 text-xs font-mono ${isATM ? 'text-yellow-400 font-bold' : isHovered ? 'text-white' : 'text-gray-400'}`}>
                                        {row.strike}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* PCR Line Chart Overlay */}
                    {pcrData.length > 1 && (
                        <svg
                            className="absolute top-6 left-6 pointer-events-none opacity-70"
                            width={SVG_WIDTH}
                            height={SVG_HEIGHT}
                            style={{ mixBlendMode: 'screen' }}
                        >
                            <polygon points={pcrFillPoints} fill="url(#pcrGradient)" opacity="0.3" />
                            <polyline points={pcrLinePoints} fill="none" stroke="#a855f7" strokeWidth="2" />
                            <defs>
                                <linearGradient id="pcrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    )}
                </div>
            )}

            {/* Footer Info */}
            <div className="text-center text-sm text-gray-400">
                Showing {filteredData.length} strikes | Max OI: {formatNumber(maxOI / divisor, useCrores)} {unit}
            </div>
        </div>
    );
}

```

## File: client\src\components\common\EmptyState.tsx
```tsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EmptyStateProps {
    message: string;
    details?: string;
}

export function EmptyState({ message, details }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center h-full bg-gray-950 rounded-lg border border-gray-800">
            <div className="text-center">
                <BarChart3 size={48} className="text-gray-700 mx-auto mb-4" />
                <span className="text-gray-600">{message}</span>
                {details && (
                    <div className="text-xs text-gray-700 mt-2">{details}</div>
                )}
            </div>
        </div>
    );
}

```

## File: client\src\components\common\ErrorBoundary.tsx
```tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-screen bg-black text-white">
                    <div className="text-center max-w-md">
                        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Application Error</h1>
                        <p className="text-gray-400 mb-4 text-sm">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

```

## File: client\src\components\common\LoadingSpinner.tsx
```tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
                <Loader2 size={48} className="text-blue-500 animate-spin" />
            </div>
            <div className="text-gray-400 text-lg">Loading data...</div>
            <div className="text-gray-600 text-sm mt-2">Please wait while we fetch option chain</div>
        </div>
    );
}

```

## File: client\src\components\controls\ControlBar.css
```css
/* ============================================================================ */
/* CONTROL BAR STYLES */
/* ============================================================================ */

.control-bar {
    background: linear-gradient(180deg, #1a1a1a 0%, #161616 100%);
    border-bottom: 1px solid #2a2a2a;
    padding: 20px 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.control-bar-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.control-label svg {
    color: #0ea5e9;
}

.control-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-select {
    width: 100%;
    padding: 11px 14px;
    background: #232323;
    border: 1.5px solid #333;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
}

.control-select:hover:not(:disabled) {
    border-color: #0ea5e9;
    background-color: #2a2a2a;
}

.control-select:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.control-select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #1a1a1a;
}

.control-placeholder {
    padding: 11px 14px;
    background: #1f1f1f;
    border: 1.5px solid #2a2a2a;
    border-radius: 8px;
    color: #555;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.expiry-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 120px;
    overflow-y: auto;
}

.expiry-chip {
    padding: 9px 16px;
    background: #232323;
    border: 1.5px solid #333;
    border-radius: 7px;
    color: #aaa;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.expiry-chip:hover {
    border-color: #0ea5e9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.expiry-chip.selected {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    border-color: #0ea5e9;
    color: white;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.control-hint {
    font-size: 11px;
    color: #555;
    font-weight: 500;
    margin-top: -2px;
}

.loading-spinner {
    color: #0ea5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.retry-button {
    padding: 8px;
    background: #232323;
    border: 1.5px solid #333;
    border-radius: 6px;
    color: #0ea5e9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.retry-button:hover {
    background: #2a2a2a;
    border-color: #0ea5e9;
    transform: scale(1.05);
}

.control-debug {
    margin-top: 16px;
    padding: 12px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
}

.control-debug small {
    color: #666;
    font-size: 11px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .control-bar-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .control-bar-container {
        grid-template-columns: 1fr;
    }

    .control-bar {
        padding: 16px;
    }
}

/* Scrollbar styling for expiry chips */
.expiry-chips::-webkit-scrollbar {
    width: 6px;
}

.expiry-chips::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 3px;
}

.expiry-chips::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
}

.expiry-chips::-webkit-scrollbar-thumb:hover {
    background: #444;
}
```

## File: client\src\components\modals\StrikeModal.tsx
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatTime, formatDate } from '../../utils/formatters';
import { safeNumber } from '../../utils/calculations';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface StrikeModalProps {
    isOpen: boolean;
    onClose: () => void;
    strike: number;
    optionType: 'CE' | 'PE';
}

interface StrikeTimelineData {
    timestamp: string;
    ltp: number | string;
    bid: number | string;
    ask: number | string;
    oi: number | string;
    volume: number | string;
}

interface PriceStats {
    current: number;
    start: number;
    high: number;
    low: number;
    change: number;
    changePct: number;
    currentOI: number;
    maxOI: number;
    totalVolume: number;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function StrikeModal({ isOpen, onClose, strike, optionType }: StrikeModalProps) {
    const { state } = useAppContext();
    const [data, setData] = useState<StrikeTimelineData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accountingMethod, setAccountingMethod] = useState<'FIFO' | 'LIFO'>('FIFO');
    const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

    // ==========================================
    // DATA FETCHING
    // ==========================================

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('📊 Fetching strike timeline:', {
                    symbol: state.symbol,
                    strike,
                    optionType,
                    date: state.tradeDate,
                    expiry: state.selectedExpiries[0]
                });

                const result = await window.api.getStrikeTimeline({
                    symbol: state.symbol,
                    strike,
                    optionType,
                    date: state.tradeDate,
                    expiry: state.selectedExpiries[0] || ''
                });

                console.log('✅ Strike timeline loaded:', result.length, 'data points');
                setData(result);
            } catch (err) {
                console.error('❌ Strike timeline fetch error:', err);
                setError('Failed to load strike data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, strike, optionType, state.symbol, state.tradeDate, state.selectedExpiries]);

    // ==========================================
    // COMPUTED STATS - ALL SAFE CONVERSIONS
    // ==========================================

    const stats = useMemo<PriceStats>(() => {
        if (data.length === 0) {
            return {
                current: 0,
                start: 0,
                high: 0,
                low: 0,
                change: 0,
                changePct: 0,
                currentOI: 0,
                maxOI: 0,
                totalVolume: 0
            };
        }

        const prices = data.map(d => safeNumber(d.ltp));
        const ois = data.map(d => safeNumber(d.oi));
        const volumes = data.map(d => safeNumber(d.volume));

        const current = prices[prices.length - 1];
        const start = prices[0];
        const high = Math.max(...prices);
        const low = Math.min(...prices.filter(p => p > 0)); // Exclude zeros
        const change = current - start;
        const changePct = start > 0 ? (change / start) * 100 : 0;
        const currentOI = ois[ois.length - 1];
        const maxOI = Math.max(...ois);
        const totalVolume = volumes.reduce((sum, v) => sum + v, 0);

        return {
            current,
            start,
            high,
            low,
            change,
            changePct,
            currentOI,
            maxOI,
            totalVolume
        };
    }, [data]);

    // ==========================================
    // SAMPLING FOR PERFORMANCE
    // ==========================================

    const sampledData = useMemo(() => {
        if (data.length <= 1000) return data;

        // Sample to ~1000 points for smooth chart rendering
        const step = Math.ceil(data.length / 1000);
        return data.filter((_, i) => i % step === 0 || i === data.length - 1);
    }, [data]);

    // ==========================================
    // RENDER GUARDS
    // ==========================================

    if (!isOpen) return null;

    // ==========================================
    // JSX RENDER
    // ==========================================

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ==================== HEADER ==================== */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-lg ${optionType === 'CE' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
                                }`}>
                                {strike} {optionType}
                            </span>
                            Price Analysis
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">
                            {state.symbol} • {formatDate(state.tradeDate)} • Expiry: {formatDate(state.selectedExpiries[0])} • {data.length.toLocaleString()} ticks
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ==================== TABS ==================== */}
                <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('chart')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${activeTab === 'chart'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <BarChart3 size={16} />
                        Price Chart
                    </button>
                    <button
                        onClick={() => setActiveTab('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${activeTab === 'table'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <Activity size={16} />
                        Tick Data
                    </button>
                </div>

                {/* ==================== STATS CARDS ==================== */}
                <div className="grid grid-cols-6 gap-3 p-6 bg-gray-950/50">
                    <StatCard
                        label="Current LTP"
                        value={`₹${stats.current.toFixed(2)}`}
                        icon={<DollarSign size={16} />}
                        color="blue"
                    />
                    <StatCard
                        label="Change"
                        value={`${stats.change >= 0 ? '+' : ''}₹${stats.change.toFixed(2)}`}
                        subValue={`${stats.changePct >= 0 ? '+' : ''}${stats.changePct.toFixed(2)}%`}
                        icon={stats.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        color={stats.change >= 0 ? 'green' : 'red'}
                    />
                    <StatCard
                        label="High"
                        value={`₹${stats.high.toFixed(2)}`}
                        color="yellow"
                    />
                    <StatCard
                        label="Low"
                        value={`₹${stats.low.toFixed(2)}`}
                        color="orange"
                    />
                    <StatCard
                        label="Current OI"
                        value={stats.currentOI.toLocaleString()}
                        color="purple"
                    />
                    <StatCard
                        label="Total Volume"
                        value={stats.totalVolume.toLocaleString()}
                        color="indigo"
                    />
                </div>

                {/* ==================== CONTENT AREA ==================== */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : data.length === 0 ? (
                        <EmptyState />
                    ) : activeTab === 'chart' ? (
                        <ChartView data={sampledData} stats={stats} />
                    ) : (
                        <TableView data={data} />
                    )}
                </div>

                {/* ==================== FOOTER ==================== */}
                <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-950/50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAccountingMethod('FIFO')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${accountingMethod === 'FIFO'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            FIFO
                        </button>
                        <button
                            onClick={() => setAccountingMethod('LIFO')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${accountingMethod === 'LIFO'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            LIFO
                        </button>
                        <span className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm">
                            P&L Calculation: {accountingMethod}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-semibold transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function StatCard({ label, value, subValue, icon, color }: {
    label: string;
    value: string;
    subValue?: string;
    icon?: React.ReactNode;
    color: string;
}) {
    const colorClasses = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        red: 'text-red-400',
        yellow: 'text-yellow-400',
        orange: 'text-orange-400',
        purple: 'text-purple-400',
        indigo: 'text-indigo-400'
    };

    return (
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-500 uppercase">{label}</div>
                {icon && <div className={colorClasses[color as keyof typeof colorClasses]}>{icon}</div>}
            </div>
            <div className={`text-xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
                {value}
            </div>
            {subValue && <div className="text-xs text-gray-400 mt-1">{subValue}</div>}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <div className="text-gray-400">Loading chart data...</div>
            </div>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
                <div className="text-gray-400">{message}</div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">📊 No Data Available</div>
                <div className="text-gray-500 text-sm">No trading data found for this strike</div>
            </div>
        </div>
    );
}

// ==========================================
// CHART VIEW COMPONENT
// ==========================================

function ChartView({ data, stats }: { data: StrikeTimelineData[]; stats: PriceStats }) {
    if (data.length === 0) return null;

    const CHART_WIDTH = 1200;
    const CHART_HEIGHT = 400;
    const PADDING = 60;

    const prices = data.map(d => safeNumber(d.ltp));
    const minPrice = Math.min(...prices.filter(p => p > 0)) * 0.98;
    const maxPrice = Math.max(...prices) * 1.02;
    const priceRange = maxPrice - minPrice || 1;

    const scaleX = (index: number) =>
        PADDING + (index / (data.length - 1)) * (CHART_WIDTH - 2 * PADDING);

    const scaleY = (price: number) =>
        CHART_HEIGHT - PADDING - ((price - minPrice) / priceRange) * (CHART_HEIGHT - 2 * PADDING);

    const pathData = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(safeNumber(d.ltp))}`)
        .join(' ');

    return (
        <div className="bg-gray-950 rounded-lg border border-gray-800 p-4">
            <svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                    const y = PADDING + ratio * (CHART_HEIGHT - 2 * PADDING);
                    const price = maxPrice - ratio * priceRange;
                    return (
                        <g key={ratio}>
                            <line
                                x1={PADDING}
                                y1={y}
                                x2={CHART_WIDTH - PADDING}
                                y2={y}
                                stroke="#374151"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text x={10} y={y + 5} fill="#9CA3AF" fontSize="12">
                                ₹{price.toFixed(2)}
                            </text>
                        </g>
                    );
                })}

                {/* Price line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Gradient fill under line */}
                <defs>
                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`${pathData} L ${CHART_WIDTH - PADDING} ${CHART_HEIGHT - PADDING} L ${PADDING} ${CHART_HEIGHT - PADDING} Z`}
                    fill="url(#priceGradient)"
                />

                {/* Sample points */}
                {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 50)) === 0).map((d, idx) => {
                    const actualIndex = idx * Math.max(1, Math.floor(data.length / 50));
                    return (
                        <circle
                            key={actualIndex}
                            cx={scaleX(actualIndex)}
                            cy={scaleY(safeNumber(d.ltp))}
                            r="4"
                            fill="#3B82F6"
                            stroke="#1F2937"
                            strokeWidth="2"
                        >
                            <title>{formatTime(d.timestamp)}: ₹{safeNumber(d.ltp).toFixed(2)}</title>
                        </circle>
                    );
                })}

                {/* Time axis labels */}
                <text x={PADDING} y={CHART_HEIGHT - 20} fill="#9CA3AF" fontSize="12">
                    {formatTime(data[0].timestamp)}
                </text>
                <text x={CHART_WIDTH - PADDING - 60} y={CHART_HEIGHT - 20} fill="#9CA3AF" fontSize="12">
                    {formatTime(data[data.length - 1].timestamp)}
                </text>

                {/* Chart title */}
                <text x={CHART_WIDTH / 2} y={30} fill="#E5E7EB" fontSize="16" textAnchor="middle" fontWeight="bold">
                    Price Movement - {data.length.toLocaleString()} Ticks
                </text>
            </svg>
        </div>
    );
}

// ==========================================
// TABLE VIEW COMPONENT
// ==========================================

function TableView({ data }: { data: StrikeTimelineData[] }) {
    return (
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-auto max-h-[600px]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-900 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-400 font-semibold">Time</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">LTP</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">Bid</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">Ask</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">Spread</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">OI</th>
                            <th className="px-4 py-3 text-right text-gray-400 font-semibold">Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => {
                            const ltp = safeNumber(row.ltp);
                            const bid = safeNumber(row.bid);
                            const ask = safeNumber(row.ask);
                            const spread = ask - bid;

                            return (
                                <tr
                                    key={idx}
                                    className="border-t border-gray-800 hover:bg-gray-900/50 transition"
                                >
                                    <td className="px-4 py-2 text-gray-300">{formatTime(row.timestamp)}</td>
                                    <td className="px-4 py-2 text-right text-white font-mono font-semibold">
                                        ₹{ltp.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-green-400 font-mono">
                                        ₹{bid.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-red-400 font-mono">
                                        ₹{ask.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-yellow-400 font-mono">
                                        ₹{spread.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-blue-400 font-mono">
                                        {safeNumber(row.oi).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-right text-purple-400 font-mono">
                                        {safeNumber(row.volume).toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-900 px-4 py-2 text-xs text-gray-500 text-center">
                Showing {data.length.toLocaleString()} records
            </div>
        </div>
    );
}

```

## File: client\src\components\tables\OptionChainTable.tsx
```tsx
import React from 'react';
import type { OptionRow } from '../../types/option.types';
import { formatNumber } from '../../utils/formatters';
import { safeNumber } from '../../utils/calculations';

interface OptionChainTableProps {
    dataByExpiry: Record<string, OptionRow[]>;
    selectedExpiries: string[];
    useCrores: boolean;
    spotPrice: number;
}

export function OptionChainTable({ dataByExpiry, selectedExpiries, useCrores, spotPrice }: OptionChainTableProps) {
    const allData = selectedExpiries.flatMap(exp => dataByExpiry[exp] || []);

    // Combine by strike
    const strikeMap = new Map<number, OptionRow>();
    allData.forEach(row => {
        const strike = safeNumber(row.strike_price);
        const existing = strikeMap.get(strike);
        if (!existing) {
            strikeMap.set(strike, { ...row });
        } else {
            strikeMap.set(strike, {
                ...existing,
                ce_oi: safeNumber(existing.ce_oi) + safeNumber(row.ce_oi),
                pe_oi: safeNumber(existing.pe_oi) + safeNumber(row.pe_oi),
                ce_change_oi: safeNumber(existing.ce_change_oi) + safeNumber(row.ce_change_oi),
                pe_change_oi: safeNumber(existing.pe_change_oi) + safeNumber(row.pe_change_oi),
            });
        }
    });

    const sortedData = Array.from(strikeMap.values()).sort((a, b) =>
        safeNumber(a.strike_price) - safeNumber(b.strike_price)
    );

    return (
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-auto max-h-[600px]">
            <table className="w-full text-sm">
                <thead className="bg-gray-900 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-red-400 border-r border-gray-800" colSpan={3}>CALLS</th>
                        <th className="px-4 py-3 text-center text-yellow-400 border-r border-gray-800">STRIKE</th>
                        <th className="px-4 py-3 text-left text-green-400" colSpan={3}>PUTS</th>
                    </tr>
                    <tr className="text-xs text-gray-500">
                        <th className="px-4 py-2 text-right">OI</th>
                        <th className="px-4 py-2 text-right">OI Δ</th>
                        <th className="px-4 py-2 text-right border-r border-gray-800">LTP</th>
                        <th className="px-4 py-2 text-center border-r border-gray-800"></th>
                        <th className="px-4 py-2 text-left">LTP</th>
                        <th className="px-4 py-2 text-left">OI Δ</th>
                        <th className="px-4 py-2 text-left">OI</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, idx) => {
                        const strike = safeNumber(row.strike_price);
                        const isATM = Math.abs(strike - spotPrice) <= 50;

                        return (
                            <tr
                                key={idx}
                                className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${isATM ? 'bg-yellow-500/10' : ''
                                    }`}>
                                <td className="px-4 py-2 text-right text-red-400 font-mono">
                                    {formatNumber(safeNumber(row.ce_oi), useCrores)}
                                </td>
                                <td className={`px-4 py-2 text-right font-mono text-xs ${safeNumber(row.ce_change_oi) >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {safeNumber(row.ce_change_oi) >= 0 ? '+' : ''}{safeNumber(row.ce_change_oi).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-right font-mono text-red-300 border-r border-gray-800">
                                    ₹{safeNumber(row.ce_ltp).toFixed(2)}
                                </td>
                                <td className={`px-4 py-2 text-center font-bold border-r border-gray-800 ${isATM ? 'text-yellow-400' : 'text-gray-400'
                                    }`}>
                                    {strike}
                                </td>
                                <td className="px-4 py-2 text-left font-mono text-green-300">
                                    ₹{safeNumber(row.pe_ltp).toFixed(2)}
                                </td>
                                <td className={`px-4 py-2 text-left font-mono text-xs ${safeNumber(row.pe_change_oi) >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {safeNumber(row.pe_change_oi) >= 0 ? '+' : ''}{safeNumber(row.pe_change_oi).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-left text-green-400 font-mono">
                                    {formatNumber(safeNumber(row.pe_oi), useCrores)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

```

## File: client\src\context\AppContext.tsx
```tsx
﻿import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
    symbol: string;
    instruments: string[];        // 🔥 ADDED
    tradeDates: string[];          // 🔥 ADDED
    tradeDate: string;
    expiries: string[];            // 🔥 ADDED
    selectedExpiries: string[];
    timestamps: string[];          // 🔥 ADDED
    timestamp: string;
    viewMode: 'split' | 'combined'; // 🔥 ADDED
    strikeWindow: number;          // 🔥 ADDED
    atmRange: number;
    strikeRange: { min: number; max: number };
    useCrores: boolean;
    autoUpdate: boolean;
    showTable: boolean;
    showOIChange: boolean;
}

interface AppContextType {
    state: AppState;
    setSymbol: (symbol: string) => void;
    setTradeDate: (date: string) => void;
    setTimestamp: (timestamp: string) => void;
    toggleExpiry: (expiry: string) => void;
    setViewMode: (mode: 'split' | 'combined') => void;  // 🔥 ADDED
    setStrikeWindow: (window: number) => void;          // 🔥 ADDED
    setAtmRange: (range: number) => void;
    toggleUseCrores: () => void;
    toggleAutoUpdate: () => void;
    toggleShowTable: () => void;
    toggleShowOIChange: () => void;
    updateState: (updates: Partial<AppState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>({
        symbol: '',
        instruments: [],             // 🔥 ADDED
        tradeDates: [],              // 🔥 ADDED
        tradeDate: '',
        expiries: [],                // 🔥 ADDED
        selectedExpiries: [],
        timestamps: [],              // 🔥 ADDED
        timestamp: '',
        viewMode: 'split',           // 🔥 ADDED
        strikeWindow: 20,            // 🔥 ADDED
        atmRange: 10,
        strikeRange: { min: 0, max: 99999 },
        useCrores: true,
        autoUpdate: false,
        showTable: false,
        showOIChange: false
    });

    const setSymbol = (symbol: string) => setState(prev => ({ ...prev, symbol }));
    const setTradeDate = (tradeDate: string) => setState(prev => ({ ...prev, tradeDate }));
    const setTimestamp = (timestamp: string) => setState(prev => ({ ...prev, timestamp }));

    const toggleExpiry = (expiry: string) => {
        setState(prev => ({
            ...prev,
            selectedExpiries: prev.selectedExpiries.includes(expiry)
                ? prev.selectedExpiries.filter(e => e !== expiry)
                : [...prev.selectedExpiries, expiry]
        }));
    };

    const setViewMode = (viewMode: 'split' | 'combined') => setState(prev => ({ ...prev, viewMode }));  // 🔥 ADDED
    const setStrikeWindow = (strikeWindow: number) => setState(prev => ({ ...prev, strikeWindow }));     // 🔥 ADDED
    const setAtmRange = (atmRange: number) => setState(prev => ({ ...prev, atmRange }));
    const toggleUseCrores = () => setState(prev => ({ ...prev, useCrores: !prev.useCrores }));
    const toggleAutoUpdate = () => setState(prev => ({ ...prev, autoUpdate: !prev.autoUpdate }));
    const toggleShowTable = () => setState(prev => ({ ...prev, showTable: !prev.showTable }));
    const toggleShowOIChange = () => setState(prev => ({ ...prev, showOIChange: !prev.showOIChange }));

    const updateState = (updates: Partial<AppState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    return (
        <AppContext.Provider value={{
            state,
            setSymbol,
            setTradeDate,
            setTimestamp,
            toggleExpiry,
            setViewMode,        // 🔥 ADDED
            setStrikeWindow,    // 🔥 ADDED
            setAtmRange,
            toggleUseCrores,
            toggleAutoUpdate,
            toggleShowTable,
            toggleShowOIChange,
            updateState
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
}

```

## File: client\src\context\ModalContext.tsx
```tsx
﻿// client/src/context/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StrikeModalState {
    isOpen: boolean;
    strike: number;
    optionType: 'CE' | 'PE';
    symbol: string;
    date: string;
    expiry: string;
}

interface ModalContextType {
    strikeModal: StrikeModalState;
    openStrikeModal: (strike: number, optionType: 'CE' | 'PE', symbol: string, date: string, expiry: string) => void;
    closeStrikeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [strikeModal, setStrikeModal] = useState<StrikeModalState>({
        isOpen: false,
        strike: 0,
        optionType: 'CE',
        symbol: '',
        date: '',
        expiry: ''
    });

    const openStrikeModal = (strike: number, optionType: 'CE' | 'PE', symbol: string, date: string, expiry: string) => {
        setStrikeModal({ isOpen: true, strike, optionType, symbol, date, expiry });
    };

    const closeStrikeModal = () => {
        setStrikeModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ strikeModal, openStrikeModal, closeStrikeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModalContext must be used within ModalProvider');
    return context;
}

```

## File: client\src\hooks\useAsync.ts
```ts
import { useEffect, useState } from "react";
import { IPCResponse } from "../api/types";

export function useAsync<T>(
    fn: () => Promise<IPCResponse<T>>,
    deps: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);

            const res = await fn();

            if (cancelled) return;

            if (res.ok) {
                setData(res.data);
            } else {
                setError(res.error.message);
            }

            setLoading(false);
        }

        run();
        return () => {
            cancelled = true;
        };
    }, deps);

    return { data, error, loading };
}

```

## File: client\src\hooks\useDates.ts
```ts
import { useEffect, useState } from "react";

type DateRow = {
    trading_date: string; // normalized
};

export function useDates(symbol: string | null) {
    const [data, setData] = useState<DateRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!symbol) {
            setData([]);
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);

            const res = await window.api.getDates({ symbol });

            if (!cancelled && res.ok) {
                const normalized = res.data.map((r: any) => ({
                    trading_date:
                        r.trading_date instanceof Date
                            ? r.trading_date.toISOString().slice(0, 10)
                            : String(r.trading_date)
                }));

                setData(normalized);
            }

            setLoading(false);
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [symbol]);

    return { data, loading };
}

```

## File: client\src\hooks\useExpiries.ts
```ts
// ============================================================================
// HOOK: useExpiries - Fetch available expiry dates (COMPLETE FIXED VERSION)
// ============================================================================

import { useState, useEffect } from 'react';

export interface UseExpiriesReturn {
    expiries: string[];
    loading: boolean;
    error: string | null;
}

export function useExpiries(
    symbol: string,
    tradeDate: string
): UseExpiriesReturn {
    const [expiries, setExpiries] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset state
        setExpiries([]);
        setError(null);

        // Validate inputs
        if (!symbol || !tradeDate) {
            console.log('⏸️  [useExpiries] Skipping - missing parameters:', {
                hasSymbol: !!symbol,
                hasTradeDate: !!tradeDate
            });
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchExpiries = async () => {
            try {
                // Normalize tradeDate to YYYY-MM-DD
                let tradeDateStr = tradeDate;
                if (tradeDate instanceof Date) {
                    tradeDateStr = tradeDate.toISOString().split('T')[0];
                } else if (typeof tradeDate === 'string') {
                    tradeDateStr = tradeDate.split('T')[0];
                }

                console.log('🔄 [useExpiries] Fetching for:', { symbol, tradeDate: tradeDateStr });
                setLoading(true);

                if (!window.api?.getExpiries) {
                    throw new Error('window.api.getExpiries is not available');
                }

                // IMPORTANT: Use "tradingdate" not "tradeDate" - API expects this
                const data = await window.api.getExpiries({
                    symbol,
                    tradingdate: tradeDateStr
                });

                if (!isMounted) return;

                if (!Array.isArray(data)) {
                    throw new Error('Invalid response format - expected array');
                }

                // Convert to strings and normalize
                const expiryStrings = data.map((d: any) => {
                    if (d instanceof Date) {
                        return d.toISOString().split('T')[0];
                    }
                    if (typeof d === 'string') {
                        return d.split('T')[0];
                    }
                    return String(d);
                });

                // 🔥 Client-side filter: Only expiries >= tradeDate
                const tradeDateObj = new Date(tradeDateStr + 'T00:00:00');
                const validExpiries = expiryStrings.filter((exp: string) => {
                    const expiryDateObj = new Date(exp + 'T00:00:00');
                    return expiryDateObj >= tradeDateObj;
                });

                console.log(`✅ [useExpiries] Loaded ${validExpiries.length} VALID expiries for ${symbol} on ${tradeDateStr}`);
                console.log(`📊 [useExpiries] Expiries:`, validExpiries);

                setExpiries(validExpiries);
                setError(null);
            } catch (err: any) {
                if (!isMounted) return;
                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch expiries';
                console.error('❌ [useExpiries] Error:', errorMsg, err);
                setError(errorMsg);
                setExpiries([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchExpiries();

        return () => {
            isMounted = false;
        };
    }, [symbol, tradeDate]);

    return { expiries, loading, error };
}

```

## File: client\src\hooks\useInstruments.ts
```ts
// ============================================================================
// HOOK: useInstruments - FIXED VERSION
// ============================================================================

import { useState, useEffect } from 'react';

export interface UseInstrumentsReturn {
    instruments: string[];
    loading: boolean;
    error: string | null;
}

export function useInstruments(): UseInstrumentsReturn {
    const [instruments, setInstruments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchInstruments = async () => {
            try {
                console.log('🔄 [useInstruments] Fetching instruments...');
                setLoading(true);
                setError(null);

                // Check if API exists
                if (!window.api?.getInstruments) {
                    throw new Error('window.api.getInstruments is not available');
                }

                const data = await window.api.getInstruments();

                if (!isMounted) return;

                if (!Array.isArray(data)) {
                    throw new Error('Invalid response format - expected array');
                }

                console.log(`✅ [useInstruments] Loaded ${data.length} instruments`);
                setInstruments(data);
                setError(null);
            } catch (err: any) {
                if (!isMounted) return;

                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch instruments';
                console.error('❌ [useInstruments] Error:', errorMsg, err);

                setError(errorMsg);
                setInstruments([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchInstruments();

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - run once on mount

    return { instruments, loading, error };
}

```

## File: client\src\hooks\useOptionChain.ts
```ts
// ============================================================================
// HOOK: useOptionChain - Optimized Parallel Fetching with Type Safety
// ============================================================================

import { useState, useEffect } from 'react';

// Type for individual option row
export interface OptionRow {
  strike_price: number;
  call_ltp: number | null;
  call_oi: number | null;
  call_oi_change: number | null;
  call_iv: number | null;
  call_delta: number | null;
  call_gamma: number | null;
  call_theta: number | null;
  call_vega: number | null;
  put_ltp: number | null;
  put_oi: number | null;
  put_oi_change: number | null;
  put_iv: number | null;
  put_delta: number | null;
  put_gamma: number | null;
  put_theta: number | null;
  put_vega: number | null;
  underlying_value: number;
}

// Snapshot API parameters
interface GetSnapshotParams {
  symbol: string;
  expiry: string;
  timestamp: string;
}

// Hook return type
interface UseOptionChainReturn {
  dataByExpiry: Record<string, OptionRow[]>;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches option chain data for multiple expiries in parallel
 * Automatically converts Date objects to ISO strings
 */
export function useOptionChain(
  symbol: string,
  tradeDate: string,
  selectedExpiries: string[],
  timestamp: string
): UseOptionChainReturn {
  const [dataByExpiry, setDataByExpiry] = useState<Record<string, OptionRow[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate required parameters
    if (!symbol || !tradeDate || !timestamp || selectedExpiries.length === 0) {
      console.log('⏸️ [useOptionChain] Skipping - missing parameters:', {
        hasSymbol: !!symbol,
        hasTradeDate: !!tradeDate,
        hasTimestamp: !!timestamp,
        expiriesCount: selectedExpiries.length
      });
      setDataByExpiry({});
      return;
    }

    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Normalize timestamp to ISO string
        let timestampStr = timestamp;
        if (timestamp instanceof Date) {
          timestampStr = timestamp.toISOString();
        }

        console.log(`📤 [useOptionChain] Fetching ${selectedExpiries.length} expiries in parallel`);

        // PARALLEL FETCHING - All expiries at once!
        const fetchPromises = selectedExpiries.map(async (expiry) => {
          if (isCancelled) return null;

          // Normalize expiry to ISO date string (YYYY-MM-DD)
          let expiryStr = expiry;
          if (expiry instanceof Date) {
            expiryStr = expiry.toISOString().split('T')[0];
          } else if (typeof expiry === 'string' && expiry.includes('T')) {
            expiryStr = expiry.split('T')[0];
          }

          try {
            const params: GetSnapshotParams = {
              symbol,
              expiry: expiryStr,
              timestamp: timestampStr
            };

            // Call Electron IPC API
            const data: OptionRow[] = await window.api.getSnapshot(params);

            console.log(`✅ [useOptionChain] Loaded ${data.length} strikes for expiry ${expiryStr}`);
            return { expiry, data: data || [] };
          } catch (err: any) {
            console.error(`❌ [useOptionChain] Failed for expiry ${expiryStr}:`, err.message);
            return { expiry, data: [] };
          }
        });

        // Wait for all fetches to complete simultaneously
        const results = await Promise.all(fetchPromises);

        // Aggregate results by expiry
        if (!isCancelled) {
          const newData: Record<string, OptionRow[]> = {};
          results.forEach((res) => {
            if (res) {
              newData[res.expiry] = res.data;
            }
          });

          setDataByExpiry(newData);

          const totalStrikes = Object.values(newData).reduce((sum, arr) => sum + arr.length, 0);
          console.log(`✅ [useOptionChain] Loaded ${Object.keys(newData).length} expiries (${totalStrikes} total strikes) in parallel`);
        }
      } catch (err: any) {
        if (!isCancelled) {
          const errorMsg = err.message || 'Failed to fetch option chain';
          console.error('❌ [useOptionChain] Batch fetch failed:', errorMsg);
          setError(errorMsg);
          setDataByExpiry({});
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: prevent stale state updates
    return () => {
      isCancelled = true;
    };
  }, [symbol, tradeDate, timestamp, JSON.stringify(selectedExpiries)]);

  return { dataByExpiry, loading, error };
}

```

## File: client\src\hooks\usePlaybackEngine.ts
```ts
// client/src/hooks/usePlaybackEngine.ts
import { useEffect, useRef, useState } from "react";

export default function usePlaybackEngine({ currentTimestamp, setCurrentTimestamp }: { currentTimestamp: string | null; setCurrentTimestamp: (s: string) => void; }) {
    const intervalRef = useRef<number | null>(null);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const baseStepMs = 60_000;

    const toMs = (ts: string | null) => {
        if (!ts) return Date.now();
        const d = new Date(ts);
        return isNaN(d.getTime()) ? Date.now() : d.getTime();
    };

    const fmt = (ms: number) => {
        const d = new Date(ms);
        return d.toISOString().slice(0, 19);
    };

    const stepForward = () => {
        const next = toMs(currentTimestamp) + Math.round(baseStepMs * speed);
        setCurrentTimestamp(fmt(next));
    };
    const stepBackward = () => {
        const next = toMs(currentTimestamp) - Math.round(baseStepMs * speed);
        setCurrentTimestamp(fmt(next));
    };

    const play = () => {
        if (playing) return;
        setPlaying(true);
        intervalRef.current = window.setInterval(() => {
            const next = toMs(currentTimestamp) + Math.round(baseStepMs * speed);
            setCurrentTimestamp(fmt(next));
        }, Math.max(200, baseStepMs / speed));
    };

    const pause = () => {
        setPlaying(false);
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    return { playing, play, pause, stepForward, stepBackward, speed, setSpeed };
}

```

## File: client\src\hooks\usePortfolioGreeks.ts
```ts

import { useEffect, useState } from 'react';

export function usePortfolioGreeks(positions:any[]) {
  const [data,setData] = useState<any[]>([]);
  useEffect(()=>{
    if(!positions?.length) return;
    window.api.calculatePortfolioGreeks(positions).then(setData);
  },[JSON.stringify(positions)]);
  return data;
}

```

## File: client\src\hooks\useSnapshot.ts
```ts
// ============================================================================
// HOOK: useSnapshot - Fetch and normalize option chain snapshot
// ============================================================================

import { useEffect, useState } from 'react';

// Type for normalized option chain row
export type OptionRow = {
    strikeprice: number;
    // Call Option (CE)
    celastprice: number | null;
    ceopeninterest: number | null;
    ceoichange: number | null;
    ceiv: number | null;
    cedelta: number | null;
    cegamma: number | null;
    cetheta: number | null;
    // Put Option (PE)
    pelastprice: number | null;
    peopeninterest: number | null;
    peoichange: number | null;
    peiv: number | null;
    pedelta: number | null;
    pegamma: number | null;
    petheta: number | null;
    // Underlying
    underlyingvalue: number;
};

export interface UseSnapshotReturn {
    rows: OptionRow[];
    atmStrike: number | null;
    loading: boolean;
    error: string | null;
}

export function useSnapshot(
    symbol: string | null,
    expiry: string | null,
    time: string | null
): UseSnapshotReturn {
    const [rows, setRows] = useState<OptionRow[]>([]);
    const [atmStrike, setAtmStrike] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!symbol || !expiry || !time) {
            console.log('⏸️ [useSnapshot] Skipping - missing parameters:', {
                hasSymbol: !!symbol,
                hasExpiry: !!expiry,
                hasTime: !!time
            });
            setRows([]);
            setAtmStrike(null);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                console.log('🔄 [useSnapshot] Fetching snapshot:', { symbol, expiry, time });

                setLoading(true);
                setError(null);

                if (!window.api?.getSnapshot) {
                    throw new Error('window.api.getSnapshot is not available');
                }

                const res = await window.api.getSnapshot({
                    symbol,
                    expiry,
                    timestamp: time
                });

                if (cancelled) return;

                console.log('📦 [useSnapshot] Raw response:', {
                    length: res?.length || 0,
                    firstRow: res?.[0]
                });

                if (!Array.isArray(res)) {
                    throw new Error('Invalid response format - expected array');
                }

                if (res.length === 0) {
                    console.warn('⚠️ [useSnapshot] No data returned for:', { symbol, expiry, time });
                    setRows([]);
                    setAtmStrike(null);
                    setError('No data available for this timestamp');
                    return;
                }

                // NORMALIZATION: Convert Postgres NUMERIC (string) to JavaScript number
                const normalized: OptionRow[] = res.map((r: any) => ({
                    strikeprice: Number(r.strike_price),
                    // CE fields
                    celastprice: r.call_ltp !== null ? Number(r.call_ltp) : null,
                    ceopeninterest: r.call_oi !== null ? Number(r.call_oi) : null,
                    ceoichange: r.call_oi_change !== null ? Number(r.call_oi_change) : null,
                    ceiv: r.call_iv !== null ? Number(r.call_iv) : null,
                    cedelta: r.call_delta !== null ? Number(r.call_delta) : null,
                    cegamma: r.call_gamma !== null ? Number(r.call_gamma) : null,
                    cetheta: r.call_theta !== null ? Number(r.call_theta) : null,
                    // PE fields
                    pelastprice: r.put_ltp !== null ? Number(r.put_ltp) : null,
                    peopeninterest: r.put_oi !== null ? Number(r.put_oi) : null,
                    peoichange: r.put_oi_change !== null ? Number(r.put_oi_change) : null,
                    peiv: r.put_iv !== null ? Number(r.put_iv) : null,
                    pedelta: r.put_delta !== null ? Number(r.put_delta) : null,
                    pegamma: r.put_gamma !== null ? Number(r.put_gamma) : null,
                    petheta: r.put_theta !== null ? Number(r.put_theta) : null,
                    // Underlying
                    underlyingvalue: Number(r.underlying_value || r.spot_price || 0)
                }));

                console.log(`✅ [useSnapshot] Normalized ${normalized.length} rows`);
                console.log('📊 [useSnapshot] Sample strikes:', normalized.slice(0, 5).map(r => r.strikeprice));

                // Calculate ATM strike (closest to spot price)
                const spot = normalized[0]?.underlyingvalue;
                let atm: number | null = null;

                if (spot !== undefined && spot > 0) {
                    atm = normalized.reduce((prev, curr) => {
                        const prevDiff = Math.abs(prev.strikeprice - spot);
                        const currDiff = Math.abs(curr.strikeprice - spot);
                        return currDiff < prevDiff ? curr : prev;
                    }).strikeprice;

                    console.log(`📍 [useSnapshot] ATM Strike: ${atm} (Spot: ${spot})`);
                }

                setRows(normalized);
                setAtmStrike(atm);
                setError(null);
            } catch (err: any) {
                if (cancelled) return;

                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch snapshot';
                console.error('❌ [useSnapshot] Error:', errorMsg, err);

                setError(errorMsg);
                setRows([]);
                setAtmStrike(null);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [symbol, expiry, time]);

    return { rows, atmStrike, loading, error };
}

```

## File: client\src\hooks\useStrikeData.ts
```ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { StrikeTimelineData } from '../types/option.types';

interface UseStrikeDataParams {
    symbol: string;
    strike: number;
    optionType: 'CE' | 'PE';
    date: string;
    expiry: string;
    enabled: boolean;
}

export function useStrikeData({
    symbol,
    strike,
    optionType,
    date,
    expiry,
    enabled
}: UseStrikeDataParams) {
    const [data, setData] = useState<StrikeTimelineData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || !symbol || !strike || !date || !expiry) {
            return;
        }

        const fetchStrikeData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiService.getStrikeTimeline({
                    symbol,
                    strike,
                    optionType,
                    date,
                    expiry
                });
                setData(result);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load strike data';
                setError(message);
                console.error('useStrikeData error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStrikeData();
    }, [symbol, strike, optionType, date, expiry, enabled]);

    return { data, loading, error };
}

```

## File: client\src\hooks\useTimes.ts
```ts
import { useEffect, useState } from "react";

export function useTimes(
    symbol: string | null,
    expiry: string | null,
    date: string | null
) {
    const [times, setTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!symbol || !expiry || !date) {
            setTimes([]);
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);

            const res = await window.api.getTimes({ symbol, expiry, date });

            if (!cancelled && res.ok) {
                // 🔑 NORMALIZE Date → ISO string
                const normalized = res.data.map((row: any) => {
                    const d = row.time instanceof Date
                        ? row.time
                        : new Date(row.time);

                    return d.toISOString();
                });

                setTimes(normalized);
            }

            setLoading(false);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [symbol, expiry, date]);

    return { times, loading };
}

```

## File: client\src\hooks\useTimestamps.ts
```ts
// ============================================================================
// HOOK: useTimestamps - Fetch available timestamps (FIXED DATE FORMAT)
// ============================================================================

import { useState, useEffect } from 'react';

export interface UseTimestampsReturn {
    timestamps: string[];
    loading: boolean;
    error: string | null;
}

export function useTimestamps(
    symbol: string,
    date: string,
    expiry: string
): UseTimestampsReturn {
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Skip if any parameter is missing
        if (!symbol || !date || !expiry) {
            console.log('⏸️ [useTimestamps] Skipping - missing parameters:', {
                hasSymbol: !!symbol,
                hasDate: !!date,
                hasExpiry: !!expiry
            });
            setTimestamps([]);
            setLoading(false);
            setError(null);
            return;
        }

        let isMounted = true;

        const fetchTimestamps = async () => {
            try {
                // Convert to ISO strings if they're Date objects
                let dateStr = date;
                let expiryStr = expiry;

                if (date instanceof Date) {
                    dateStr = date.toISOString().split('T')[0];
                } else if (typeof date === 'string') {
                    dateStr = date.split('T')[0];
                }

                if (expiry instanceof Date) {
                    expiryStr = expiry.toISOString().split('T')[0];
                } else if (typeof expiry === 'string') {
                    expiryStr = expiry.split('T')[0];
                }

                console.log('🔄 [useTimestamps] Fetching with params:', {
                    symbol,
                    date: dateStr,
                    expiry: expiryStr
                });

                setLoading(true);
                setError(null);

                // Ensure window.api exists
                if (!window.api?.getTimestamps) {
                    throw new Error('window.api.getTimestamps is not available');
                }

                // Call API with correct parameter names
                const data = await window.api.getTimestamps({
                    symbol,
                    date: dateStr,
                    expiry: expiryStr
                });

                if (!isMounted) return;

                // Validate response
                if (!Array.isArray(data)) {
                    throw new Error('Invalid response format - expected array');
                }

                // Convert Date objects to ISO strings
                const timestampStrings = data.map((t: any) => {
                    if (t instanceof Date) {
                        return t.toISOString();
                    }
                    return String(t);
                });

                console.log(`✅ [useTimestamps] Loaded ${timestampStrings.length} timestamps`);
                console.log(`📊 [useTimestamps] First 3:`, timestampStrings.slice(0, 3));
                console.log(`📊 [useTimestamps] Last 3:`, timestampStrings.slice(-3));

                setTimestamps(timestampStrings);
                setError(null);
            } catch (err: any) {
                if (!isMounted) return;

                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch timestamps';
                console.error('❌ [useTimestamps] Error:', errorMsg, err);

                setError(errorMsg);
                setTimestamps([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTimestamps();

        return () => {
            isMounted = false;
        };
    }, [symbol, date, expiry]);

    return { timestamps, loading, error };
}

```

## File: client\src\hooks\useTradeDates.ts
```ts
// ============================================================================
// HOOK: useTradeDates - FIXED SORTING
// ============================================================================

import { useState, useEffect } from 'react';

export interface UseTradeDatesReturn {
    dates: string[];
    loading: boolean;
    error: string | null;
}

export function useTradeDates(symbol: string): UseTradeDatesReturn {
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!symbol) {
            setDates([]);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDates = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await window.api.getDates(symbol);

                if (!isMounted) return;

                // Convert to ISO strings
                const dateStrings = data.map((d: any) => {
                    if (d instanceof Date) {
                        return d.toISOString().split('T')[0];
                    }
                    if (typeof d === 'string') {
                        return d.split('T')[0];
                    }
                    return String(d);
                });

                // Sort DESCENDING (newest first) - FIXED!
                dateStrings.sort((a, b) => {
                    return new Date(b).getTime() - new Date(a).getTime();
                });

                console.log(`✅ [useTradeDates] Loaded ${dateStrings.length} dates for ${symbol}`);
                console.log(`📅 [useTradeDates] Latest: ${dateStrings[0]}, Oldest: ${dateStrings[dateStrings.length - 1]}`);

                setDates(dateStrings);
            } catch (err: any) {
                if (!isMounted) return;
                console.error('❌ [useTradeDates] Error:', err);
                setError(err.message);
                setDates([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDates();

        return () => {
            isMounted = false;
        };
    }, [symbol]);

    return { dates, loading, error };
}

```

## File: client\src\layout\Sidebar.tsx
```tsx
import { useInstruments } from "../hooks/useInstruments";
import { useDates } from "../hooks/useDates";
import { useExpiries } from "../hooks/useExpiries";

type Props = {
    symbol: string | null;
    date: string | null;
    expiry: string | null;
    onSymbolChange: (s: string | null) => void;
    onDateChange: (d: string | null) => void;
    onExpiryChange: (e: string | null) => void;
};

export default function Sidebar({
    symbol,
    date,
    expiry,
    onSymbolChange,
    onDateChange,
    onExpiryChange
}: Props) {
    const instruments = useInstruments();
    const dates = useDates(symbol);
    const expiries = useExpiries(symbol, date);

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-4">
            <h1 className="text-lg font-semibold">Options</h1>

            <select
                className="w-full bg-slate-800 p-2 rounded"
                value={symbol ?? ""}
                onChange={(e) => onSymbolChange(e.target.value || null)}
            >
                <option value="">Instrument</option>
                {instruments.data?.map((i) => (
                    <option key={i.underlying_symbol} value={i.underlying_symbol}>
                        {i.underlying_symbol}
                    </option>
                ))}
            </select>

            <select
                className="w-full bg-slate-800 p-2 rounded"
                value={date ?? ""}
                disabled={!symbol}
                onChange={(e) => onDateChange(e.target.value || null)}
            >
                <option value="">Date</option>
                {dates.data?.map((d) => (
                    <option key={d.trading_date} value={d.trading_date}>
                        {d.trading_date}
                    </option>
                ))}
            </select>

            <select
                className="w-full bg-slate-800 p-2 rounded"
                value={expiry ?? ""}
                disabled={!date}
                onChange={(e) => onExpiryChange(e.target.value || null)}
            >
                <option value="">Expiry</option>
                {expiries.data?.map((e) => (
                    <option key={e.expiry_date} value={e.expiry_date}>
                        {e.expiry_date}
                    </option>
                ))}
            </select>
        </aside>
    );
}

```

## File: client\src\layout\Topbar.tsx
```tsx
import { useEffect, useRef, useState } from "react";
import { useTimes } from "../hooks/useTimes";

type Props = {
    symbol: string | null;
    date: string | null;
    expiry: string | null;
    time: string | null;
    onTimeChange: (t: string | null) => void;
};

export default function Topbar({
    symbol,
    date,
    expiry,
    time,
    onTimeChange
}: Props) {
    const { times } = useTimes(symbol, expiry, date);

    const [playing, setPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(1000);

    const timerRef = useRef<number | null>(null);

    const index = time ? times.indexOf(time) : -1;

    function prev() {
        if (index > 0) onTimeChange(times[index - 1]);
    }

    function next() {
        if (index >= 0 && index < times.length - 1) {
            onTimeChange(times[index + 1]);
        } else {
            setPlaying(false); // stop at end
        }
    }

    // 🔁 AUTOPLAY LOOP
    useEffect(() => {
        if (!playing) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = window.setInterval(() => {
            next();
        }, speedMs);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [playing, speedMs, index, times]);

    return (
        <header className="h-12 border-b border-slate-800 px-4 flex items-center gap-3">
            <button
                className="px-2 py-1 bg-slate-800 rounded"
                onClick={prev}
                disabled={index <= 0}
            >
                ⏮
            </button>

            <button
                className="px-2 py-1 bg-slate-800 rounded"
                onClick={() => setPlaying((p) => !p)}
                disabled={!times.length}
            >
                {playing ? "⏸" : "▶"}
            </button>

            <button
                className="px-2 py-1 bg-slate-800 rounded"
                onClick={next}
                disabled={index === -1 || index === times.length - 1}
            >
                ⏭
            </button>

            <select
                className="ml-2 bg-slate-800 p-1 rounded"
                value={time ?? ""}
                disabled={!times.length}
                onChange={(e) => onTimeChange(e.target.value || null)}
            >
                <option value="">Time</option>
                {times.map((t) => (
                    <option key={t} value={t}>
                        {new Date(t).toLocaleTimeString("en-IN")}
                    </option>
                ))}
            </select>

            <select
                className="ml-2 bg-slate-800 p-1 rounded"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
            >
                <option value={500}>0.5s</option>
                <option value={1000}>1s</option>
                <option value={2000}>2s</option>
            </select>
        </header>
    );
}

```

## File: client\src\layouts\MainLayout.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useModalContext } from '../context/ModalContext';
import { useInstruments } from '../hooks/useInstruments';
import { useTradeDates } from '../hooks/useTradeDates';
import { useExpiries } from '../hooks/useExpiries';
import { useTimestamps } from '../hooks/useTimestamps';
import { useOptionChain } from '../hooks/useOptionChain';
import { analyticsService } from '../services/analytics.service';
import { ControlBar } from '../components/ControlBar';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { VerticalStackedChart } from '../components/charts/VerticalStackedChart';
import { StrikeModal } from '../components/modals/StrikeModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AlertCircle, BarChart3, Activity, TrendingUp } from 'lucide-react';
import { safeNumber } from '../utils/calculations';
import { OptionChainTable } from '../components/tables/OptionChainTable';
import { GreeksDashboard } from '../components/analytics/GreeksDashboard';
import { OIAnalysisDashboard } from '../components/analytics/OIAnalysisDashboard';

type TabType = 'chain' | 'greeks' | 'oi-analysis';

export function MainLayout() {
    const { state, setSymbol, setTradeDate, setTimestamp, toggleExpiry, updateState } = useAppContext();
    const { strikeModal, closeStrikeModal } = useModalContext();
    const [activeTab, setActiveTab] = useState<TabType>('chain');

    // 🔥 Fetch all data
    const { instruments, loading: loadingInstruments } = useInstruments();
    const { dates, loading: loadingDates } = useTradeDates(state.symbol);
    const { expiries, loading: loadingExpiries } = useExpiries(state.symbol, state.tradeDate);
    const { timestamps, loading: loadingTimestamps } = useTimestamps(
        state.symbol,
        state.tradeDate,
        state.selectedExpiries[0] || ''
    );
    const { dataByExpiry, loading: loadingChain, error } = useOptionChain(
        state.symbol,
        state.tradeDate,
        state.selectedExpiries,
        state.timestamp
    );


    // 🔥 Store fetched data in context
    useEffect(() => {
        if (instruments.length > 0) {
            updateState({ instruments });
        }
    }, [instruments]);

    useEffect(() => {
        if (dates.length > 0) {
            updateState({ tradeDates: dates });
        }
    }, [dates]);

    useEffect(() => {
        if (expiries.length > 0) {
            updateState({ expiries });
        }
    }, [expiries]);

    useEffect(() => {
        if (timestamps.length > 0) {
            updateState({ timestamps });
        }
    }, [timestamps]);

    // 🔥 Auto-select default instrument (NIFTY)
    useEffect(() => {
        if (instruments.length > 0 && !state.symbol) {
            const defaultSymbol = instruments.find(s => s === 'NIFTY') || instruments[0];
            console.log('🎯 [MainLayout] Auto-selecting instrument:', defaultSymbol);
            setSymbol(defaultSymbol);
        }
    }, [instruments, state.symbol, setSymbol]);

    // 🔥 Auto-select LATEST date (first in DESC sorted array)
    useEffect(() => {
        if (dates.length > 0 && !state.tradeDate) {
            console.log('🎯 [MainLayout] Auto-selecting LATEST date:', dates[0]);
            setTradeDate(dates[0]);
        }
    }, [dates, state.tradeDate, setTradeDate]);

    // 🔥 Auto-select first VALID expiry
    useEffect(() => {
        if (expiries.length > 0 && state.selectedExpiries.length === 0) {
            console.log('🎯 [MainLayout] Auto-selecting first expiry:', expiries[0]);
            updateState({ selectedExpiries: [expiries[0]] });
        }
    }, [expiries, state.selectedExpiries.length, updateState]);

    // 🔥 Auto-select first timestamp
    useEffect(() => {
        if (timestamps.length > 0 && !state.timestamp) {
            console.log('🎯 [MainLayout] Auto-selecting first timestamp:', timestamps[0]);
            updateState({ timestamp: timestamps[0] });
        }
    }, [timestamps, state.timestamp, updateState]);

    // Derived data
    const analytics = analyticsService.calculateAnalytics(dataByExpiry);
    const spotPrice = safeNumber(
        Object.values(dataByExpiry)[0]?.[0]?.underlying_value,
        0
    );

    // Check if we have actual data
    const hasData = Object.keys(dataByExpiry).length > 0 &&
        Object.values(dataByExpiry).some(arr => arr && arr.length > 0);

    // 🔥 Combined loading state
    const isLoading = loadingInstruments || loadingDates || loadingExpiries || loadingTimestamps || loadingChain;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#121212' }}>

            {/* 🔥 Control Bar - NO PROPS NEEDED (uses context) */}
            <ControlBar />

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '10px',
                padding: '10px 20px',
                background: '#1a1a1a',
                borderBottom: '1px solid #333'
            }}>
                <TabButton
                    active={activeTab === 'chain'}
                    onClick={() => setActiveTab('chain')}
                    icon={<BarChart3 size={16} />}
                    label="Option Chain"
                />
                <TabButton
                    active={activeTab === 'greeks'}
                    onClick={() => setActiveTab('greeks')}
                    icon={<Activity size={16} />}
                    label="Greeks Analytics"
                    badge="NEW"
                />
                <TabButton
                    active={activeTab === 'oi-analysis'}
                    onClick={() => setActiveTab('oi-analysis')}
                    icon={<TrendingUp size={16} />}
                    label="OI Analysis"
                    badge="NEW"
                />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {isLoading ? (
                    <LoadingSpinner message="Loading data..." />
                ) : error ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#ff6b6b',
                        gap: '10px'
                    }}>
                        <AlertCircle size={48} />
                        <h3>Error Loading Data</h3>
                        <p>{error}</p>
                    </div>
                ) : !hasData ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#888',
                        gap: '10px'
                    }}>
                        <AlertCircle size={48} />
                        <h3>No Data Available</h3>
                        <p>Select symbol, date, expiry, and timestamp to view data</p>
                    </div>
                ) : (
                    <>
                        {/* Option Chain Tab */}
                        {activeTab === 'chain' && (
                            <>
                                {state.showTable ? (
                                    <OptionChainTable
                                        data={dataByExpiry}
                                        spotPrice={spotPrice}
                                        maxPain={analytics.maxPain}
                                    />
                                ) : (
                                    <VerticalStackedChart
                                        dataByExpiry={dataByExpiry}
                                        selectedExpiries={state.selectedExpiries}
                                        spotPrice={spotPrice}
                                        maxPain={analytics.maxPain}
                                        useCrores={false}
                                        atmRange={state.strikeWindow || 20}
                                        showOIChange={false}
                                    />
                                )}
                            </>
                        )}

                        {/* Greeks Analytics Tab */}
                        {activeTab === 'greeks' && (
                            <GreeksDashboard
                                dataByExpiry={dataByExpiry}
                                spotPrice={spotPrice}
                            />
                        )}

                        {/* OI Analysis Tab */}
                        {activeTab === 'oi-analysis' && (
                            <OIAnalysisDashboard
                                dataByExpiry={dataByExpiry}
                                spotPrice={spotPrice}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Strike Modal */}
            {strikeModal.isOpen && (
                <StrikeModal
                    isOpen={strikeModal.isOpen}
                    strike={strikeModal.strike}
                    optionType={strikeModal.optionType}
                    onClose={closeStrikeModal}
                />
            )}
        </div>
    );
}

// Tab Button Component
function TabButton({
    active,
    onClick,
    icon,
    label,
    badge
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: string;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: active ? '#4a9eff' : '#2a2a2a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: active ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
            }}
        >
            {icon}
            {label}
            {badge && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ff6b6b',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                }}>
                    {badge}
                </span>
            )}
        </button>
    );
}

```

## File: client\src\pages\Dashboard.tsx
```tsx
import React, { useEffect, useState } from 'react';
import ipc from '../api/ipc';

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await ipc.getSnapshot({
                underlyingSymbol: 'NIFTY',
                expiryDate: '2026-01-30',
                timestamp: '2026-01-11T09:30:00',
            });
            setData(result);
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {loading && <p>Loading...</p>}
            {data && <pre className="bg-gray-800 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

```

## File: client\src\services\analytics.service.ts
```ts
import type { OptionRow } from '../types/option.types';
import type { Analytics } from '../types/analytics.types';
import { safeNumber } from '../utils/calculations';

/**
 * Analytics Service - Business logic for option chain analytics
 */
class AnalyticsService {
    /**
     * Calculate Max Pain strike price
     * Max Pain = Strike where option sellers have minimum loss
     */
    calculateMaxPain(data: OptionRow[]): number | null {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                return null;
            }

            const strikes = data.map(d => safeNumber(d.strike_price));
            if (strikes.length === 0) return null;

            let minPain = Infinity;
            let maxPainStrike = strikes[0];

            strikes.forEach(terminationStrike => {
                let currentPain = 0;

                data.forEach(option => {
                    const strike = safeNumber(option.strike_price);
                    const ceOi = safeNumber(option.ce_oi);
                    const peOi = safeNumber(option.pe_oi);

                    // Call sellers pain if strike > termination
                    if (terminationStrike > strike) {
                        currentPain += (terminationStrike - strike) * ceOi;
                    }

                    // Put sellers pain if strike < termination
                    if (terminationStrike < strike) {
                        currentPain += (strike - terminationStrike) * peOi;
                    }
                });

                if (currentPain < minPain) {
                    minPain = currentPain;
                    maxPainStrike = terminationStrike;
                }
            });

            console.log('📊 Max Pain calculated:', maxPainStrike);
            return maxPainStrike;
        } catch (err) {
            console.error('Max Pain calculation error:', err);
            return null;
        }
    }

    /**
     * Calculate comprehensive analytics
     */
    calculateAnalytics(dataByExpiry: Record<string, OptionRow[]>): Analytics {
        try {
            const allData = Object.values(dataByExpiry).flat();

            if (!Array.isArray(allData) || allData.length === 0) {
                return {
                    ceOi: 0,
                    peOi: 0,
                    pcr: '0.000',
                    peCeDiff: 0,
                    maxPain: null
                };
            }

            const ceTotal = allData.reduce((acc, r) => acc + safeNumber(r.ce_oi), 0);
            const peTotal = allData.reduce((acc, r) => acc + safeNumber(r.pe_oi), 0);
            const pcrValue = ceTotal > 0 ? peTotal / ceTotal : 0;

            return {
                ceOi: ceTotal,
                peOi: peTotal,
                pcr: pcrValue.toFixed(3),
                peCeDiff: peTotal - ceTotal,
                maxPain: this.calculateMaxPain(allData)
            };
        } catch (err) {
            console.error('Analytics calculation error:', err);
            return {
                ceOi: 0,
                peOi: 0,
                pcr: '0.000',
                peCeDiff: 0,
                maxPain: null
            };
        }
    }
}

export const analyticsService = new AnalyticsService();

```

## File: client\src\services\api.service.ts
```ts
// ✅ CORRECTED: api.service.ts
import type { OptionRow, StrikeTimelineData } from '../types/option.types';

class APIService {
    private checkAPI() {
        if (!window.api) {
            throw new Error('Electron API not available');
        }
    }

    async getInstruments(): Promise<Array<{ symbol: string; name: string }>> {
        this.checkAPI();
        console.log('📡 API: Fetching instruments...');

        try {
            const result = await window.api!.getInstruments();

            if (!Array.isArray(result)) {
                console.error('Invalid instruments format:', result);
                return [];
            }

            const formatted = result.map(item => {
                if (typeof item === 'string') {
                    return { symbol: item, name: item };
                }
                return {
                    symbol: (item as any).symbol || '',
                    name: (item as any).name || (item as any).symbol || ''
                };
            });

            console.log('✅ API: Instruments loaded:', formatted.length);
            return formatted;
        } catch (error) {
            console.error('❌ API: Failed to fetch instruments:', error);
            throw error;
        }
    }

    async getDates(symbol: string): Promise<string[]> {
        this.checkAPI();
        console.log('📡 API: Fetching dates for:', symbol);

        try {
            const result = await window.api!.getDates(symbol);
            const dates = Array.isArray(result) ? result : [];
            console.log('✅ API: Dates loaded:', dates.length);
            return dates;
        } catch (error) {
            console.error('❌ API: Failed to fetch dates:', error);
            throw error;
        }
    }

    async getExpiries(params: { symbol: string; tradingdate: string }): Promise<string[]> {
        this.checkAPI();
        console.log('📡 API: Fetching expiries for:', params);

        try {
            const result = await window.api!.getExpiries(params);
            const expiries = Array.isArray(result) ? result : [];
            console.log('✅ API: Expiries loaded:', expiries.length);
            return expiries;
        } catch (error) {
            console.error('❌ API: Failed to fetch expiries:', error);
            throw error;
        }
    }

    async getTimestamps(params: {
        symbol: string;
        date: string;
        expiry: string;
    }): Promise<string[]> {
        this.checkAPI();
        console.log('📡 API: Fetching timestamps for:', params);

        try {
            const result = await window.api!.getTimestamps(params);
            const timestamps = Array.isArray(result) ? result : [];
            console.log('✅ API: Timestamps loaded:', timestamps.length);
            return timestamps;
        } catch (error) {
            console.error('❌ API: Failed to fetch timestamps:', error);
            throw error;
        }
    }

    // ✅ FIXED: Correct parameter structure
    async getSnapshot(params: {
        symbol: string;
        expiry: string;
        timestamp: string;
    }): Promise<any[]> {
        this.checkAPI();
        console.log('📡 API: Fetching snapshot:', params);

        try {
            const result = await window.api.getSnapshot(params);
            console.log(`✅ API: Snapshot loaded (${result?.length || 0} rows)`);
            return result || [];
        } catch (error: any) {
            console.error('❌ API: Failed to fetch snapshot:', error);
            throw error;
        }
    }

    async getStrikeTimeline(params: {
        symbol: string;
        strike: number;
        optionType: string;
        date: string;
        expiry: string;
    }): Promise<StrikeTimelineData[]> {
        this.checkAPI();
        console.log('📡 API: Fetching strike timeline for:', params);

        try {
            const result = await window.api!.getStrikeTimeline(params);
            const data = Array.isArray(result) ? result : [];
            console.log('✅ API: Strike timeline loaded:', data.length, 'ticks');
            return data as StrikeTimelineData[];
        } catch (error) {
            console.error('❌ API: Failed to fetch strike timeline:', error);
            throw error;
        }
    }
}

export const apiService = new APIService();

```

## File: client\src\services\trading.service.ts
```ts
import type { Trade, PnLResult, AccountingMethod } from '../types/trading.types';

/**
 * Trading Service - FIFO/LIFO P&L calculations for option sellers
 */
class TradingService {
    /**
     * Calculate P&L using FIFO method (First In First Out)
     * Seller's perspective: SELL = Open short, BUY = Close/cover
     */
    calculateFIFO(trades: Trade[], currentPrice: number): PnLResult {
        const sellQueue: Trade[] = [];
        let realizedPnL = 0;

        for (const trade of trades) {
            if (trade.type === 'SELL') {
                // Add to queue (opening short position)
                sellQueue.push({ ...trade });
            } else if (trade.type === 'BUY') {
                // Cover positions (closing short)
                let remainingQty = trade.quantity;

                while (remainingQty > 0 && sellQueue.length > 0) {
                    const oldestSell = sellQueue[0];
                    const matchQty = Math.min(remainingQty, oldestSell.quantity);

                    // P&L = Sell Price - Buy Price (seller's perspective)
                    const pnl = (oldestSell.price - trade.price) * matchQty;
                    realizedPnL += pnl;

                    oldestSell.quantity -= matchQty;
                    remainingQty -= matchQty;

                    if (oldestSell.quantity === 0) {
                        sellQueue.shift();
                    }
                }
            }
        }

        // Calculate unrealized P&L for open positions
        const unrealizedPnL = sellQueue.reduce((sum, t) =>
            sum + ((t.price - currentPrice) * t.quantity), 0
        );

        return {
            realizedPnL,
            unrealizedPnL,
            totalPnL: realizedPnL + unrealizedPnL,
            openPositions: sellQueue.length,
            openTrades: [...sellQueue]
        };
    }

    /**
     * Calculate P&L using LIFO method (Last In First Out)
     * Last positions sold are first positions covered
     */
    calculateLIFO(trades: Trade[], currentPrice: number): PnLResult {
        const sellStack: Trade[] = [];
        let realizedPnL = 0;

        for (const trade of trades) {
            if (trade.type === 'SELL') {
                sellStack.push({ ...trade });
            } else if (trade.type === 'BUY') {
                let remainingQty = trade.quantity;

                // Process from end of stack (most recent sells first)
                while (remainingQty > 0 && sellStack.length > 0) {
                    const recentSell = sellStack[sellStack.length - 1];
                    const matchQty = Math.min(remainingQty, recentSell.quantity);

                    const pnl = (recentSell.price - trade.price) * matchQty;
                    realizedPnL += pnl;

                    recentSell.quantity -= matchQty;
                    remainingQty -= matchQty;

                    if (recentSell.quantity === 0) {
                        sellStack.pop();
                    }
                }
            }
        }

        const unrealizedPnL = sellStack.reduce((sum, t) =>
            sum + ((t.price - currentPrice) * t.quantity), 0
        );

        return {
            realizedPnL,
            unrealizedPnL,
            totalPnL: realizedPnL + unrealizedPnL,
            openPositions: sellStack.length,
            openTrades: [...sellStack]
        };
    }

    /**
     * Calculate P&L based on selected accounting method
     */
    calculate(trades: Trade[], currentPrice: number, method: AccountingMethod): PnLResult {
        return method === 'FIFO'
            ? this.calculateFIFO(trades, currentPrice)
            : this.calculateLIFO(trades, currentPrice);
    }
}

export const tradingService = new TradingService();

```

## File: client\src\state\playbackStore.js
```js
import { useEffect, useRef, useState } from 'react';

export function usePlaybackStore() {
    const [currentTime, setCurrentTime] = useState(
        '2025-05-15T03:45:00.000Z' // initial snapshot
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 5x, 10x etc.

    const timerRef = useRef(null);

    const STEP_SECONDS = 60; // one candle = one minute

    const stepForward = () => {
        setCurrentTime(t =>
            new Date(new Date(t).getTime() + STEP_SECONDS * 1000).toISOString()
        );
    };

    const stepBackward = () => {
        setCurrentTime(t =>
            new Date(new Date(t).getTime() - STEP_SECONDS * 1000).toISOString()
        );
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            return;
        }

        timerRef.current = setInterval(() => {
            stepForward();
        }, 1000 / speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [isPlaying, speed]);

    return {
        currentTime,
        isPlaying,
        speed,
        setSpeed,
        play,
        pause,
        stepForward,
        stepBackward
    };
}

```

## File: client\src\styles\index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
/* client/src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
}

#root {
    width: 100vw;
    height: 100vh;
}

code {
    font-family: "Courier New", monospace;
}
```

## File: client\src\types\analytics.types.ts
```ts
// Analytics calculation types
export interface Analytics {
    ceOi: number;
    peOi: number;
    pcr: string;
    peCeDiff: number;
    maxPain: number | null;
}

export interface StrikeRange {
    min: number;
    max: number;
}

```

## File: client\src\types\api.types.ts
```ts
// ============================================================================
// API TYPE DEFINITIONS - Matches Your Database Schema
// ============================================================================

export interface GetSnapshotParams {
    symbol: string;
    expiry: string;        // ISO date string YYYY-MM-DD
    timestamp: string;     // ISO datetime string
}

export interface GetTimestampsParams {
    symbol: string;
    date: string;          // ISO date string YYYY-MM-DD
    expiry: string;        // ISO date string YYYY-MM-DD
}

export interface GetExpiriesParams {
    symbol: string;
    tradingdate: string;   // ISO date string YYYY-MM-DD (matches backend)
}

export interface Instrument {
    symbol: string;
    name: string;
}

export interface OptionRow {
    strike_price: number;
    call_ltp: number | null;
    call_oi: number | null;
    call_oi_change: number | null;
    call_iv: number | null;
    call_delta: number | null;
    call_gamma: number | null;
    call_theta: number | null;
    call_vega: number | null;
    put_ltp: number | null;
    put_oi: number | null;
    put_oi_change: number | null;
    put_iv: number | null;
    put_delta: number | null;
    put_gamma: number | null;
    put_theta: number | null;
    put_vega: number | null;
    underlying_value: number;
}

```

## File: client\src\types\option.types.ts
```ts
// Core option data types
export interface OptionRow {
    strike_price: number;
    ce_oi: number | null;
    ce_change_oi: number | null;
    ce_ltp: number | string | null;
    pe_oi: number | null;
    pe_change_oi: number | null;
    pe_ltp: number | string | null;
    underlying_value: string | number;
}

export interface CombinedStrikeData {
    strike: number;
    ceoi: number;
    peoi: number;
    cechange: number;
    pechange: number;
}

export interface StrikeTimelineData {
    timestamp: string;
    ltp: number;
    bid: number;
    ask: number;
    oi: number;
    volume: number;
}

```

## File: client\src\types\trading.types.ts
```ts
// Trading calculation types
export interface Trade {
    timestamp: string;
    type: 'SELL' | 'BUY';
    quantity: number;
    price: number;
}

export interface PnLResult {
    realizedPnL: number;
    unrealizedPnL: number;
    totalPnL: number;
    openPositions: number;
    openTrades: Trade[];
}

export type AccountingMethod = 'FIFO' | 'LIFO';


```

## File: client\src\types\window.d.ts
```ts
// ============================================================================
// WINDOW TYPE DEFINITIONS - NSE OPTIONS PLATFORM
// ============================================================================
// Global type definitions for window.api
// This ensures TypeScript knows about the Electron API
// ============================================================================

export interface GetSnapshotParams {
  symbol: string;
  expiry: string;
  timestamp: string;
}

export interface GetTimestampsParams {
  symbol: string;
  date: string;
  expiry: string;
}

export interface GetExpiriesParams {
  symbol: string;
  tradingdate: string;
}

export interface GetStrikeTimelineParams {
  symbol: string;
  strike: number;
  optionType: 'CE' | 'PE';
  date: string;
  expiry: string;
}

export interface GreeksParams {
  spotPrice: number;
  strikes: number[];
  daysToExpiry: number;
  volatility?: number;
  riskFreeRate?: number;
}

export interface OISpurtParams {
  symbol: string;
  date: string;
  expiry: string;
  threshold?: number;
}

// ============================================================================
// WINDOW.API INTERFACE
// ============================================================================

declare global {
  interface Window {
    api: {
      // Data fetching
      getInstruments(): Promise<string[]>;
      getDates(symbol: string): Promise<string[]>;
      getExpiries(params: GetExpiriesParams): Promise<string[]>;
      getTimestamps(params: GetTimestampsParams): Promise<string[]>;
      getSnapshot(params: GetSnapshotParams): Promise<any[]>;
      getStrikeTimeline(params: GetStrikeTimelineParams): Promise<any[]>;

      // Analytics
      calculateGreeks(params: GreeksParams): Promise<any>;
      calculatePortfolioGreeks(positions: any[]): Promise<any>;
      detectOISpurts(params: OISpurtParams): Promise<any[]>;
      calculateMaxPain(chainData: any[]): Promise<any>;
    };
  }
}

export {};

```

## File: client\src\utils\calculations.ts
```ts
// Calculation utilities

export const safeNumber = (val: any, defaultVal: number = 0): number => {
    const num = parseFloat(String(val || 0));
    return isNaN(num) || !isFinite(num) ? defaultVal : num;
};

export const calculateOIChangePercent = (change: number, current: number): string => {
    if (current === 0) return '0.00%';
    return ((change / current) * 100).toFixed(2) + '%';
};

export const isStrikeATM = (strike: number, spotPrice: number, threshold: number = 100): boolean => {
    return Math.abs(strike - spotPrice) <= threshold;
};

```

## File: client\src\utils\formatters.ts
```ts
// client/src/utils/formatters.ts

/**
 * Format date string safely without timezone conversion
 * Input: "2025-12-03" from PostgreSQL
 * Output: "Dec 3, 2025"
 */
export function formatDate(dateString: string | null | undefined): string {
    try {
        if (!dateString) return '--------';

        // 🔥 FIX: Parse manually to avoid timezone issues
        const [year, month, day] = dateString.split('T')[0].split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateString || '--------'; // Return as-is if parsing fails
    }
}

/**
 * Format timestamp for display
 * Input: "2025-12-03T09:15:00.000Z"
 * Output: "09:15:00"
 */
export function formatTime(isoString: string | null | undefined): string {
    try {
        if (!isoString) return '------';

        return new Date(isoString).toLocaleTimeString('en-IN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
    } catch {
        return '------';
    }
}

/**
 * Format number with proper units
 */
export function formatNumber(num: number, useCrores: boolean): string {
    if (useCrores) {
        return (num / 10000000).toFixed(2) + ' Cr';
    }
    return (num / 100000).toFixed(1) + ' L';
}

```

## File: client\src\utils\safeProps.ts
```ts
// Safe prop helpers to prevent undefined errors

export const safeSpotPrice = (value: any): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export const safeStrikeRange = (range: any): { min: number; max: number } => {
    if (!range || typeof range !== 'object') {
        return { min: 0, max: 99999 };
    }
    return {
        min: typeof range.min === 'number' ? range.min : 0,
        max: typeof range.max === 'number' ? range.max : 99999
    };
};

```

## File: client\src\utils\validators.ts
```ts
// Validation utilities

export const isValidArray = <T,>(arr: any): arr is T[] => {
    return Array.isArray(arr) && arr.length > 0;
};

export const isValidNumber = (val: any): val is number => {
    return typeof val === 'number' && !isNaN(val) && isFinite(val);
};

export const isValidTimestamp = (timestamp: string): boolean => {
    try {
        const date = new Date(timestamp);
        return !isNaN(date.getTime());
    } catch {
        return false;
    }
};

```

## File: server\package-lock.json
```json
{
    "name": "nse-options-server",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
            "name": "nse-options-server",
            "version": "1.0.0",
            "dependencies": {
                "dotenv": "^16.3.1",
                "electron": "^28.0.0",
                "pg": "^8.11.3",
                "zod": "^4.3.5"
            },
            "devDependencies": {
                "@types/node": "^20.10.0",
                "@types/pg": "^8.10.9",
                "typescript": "^5.3.3"
            }
        },
        "node_modules/@electron/get": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/@electron/get/-/get-2.0.3.tgz",
            "integrity": "sha512-Qkzpg2s9GnVV2I2BjRksUi43U5e6+zaQMcjoJy0C+C5oxaKl+fmckGDQFtRpZpZV0NQekuZZ+tGz7EA9TVnQtQ==",
            "license": "MIT",
            "dependencies": {
                "debug": "^4.1.1",
                "env-paths": "^2.2.0",
                "fs-extra": "^8.1.0",
                "got": "^11.8.5",
                "progress": "^2.0.3",
                "semver": "^6.2.0",
                "sumchecker": "^3.0.1"
            },
            "engines": {
                "node": ">=12"
            },
            "optionalDependencies": {
                "global-agent": "^3.0.0"
            }
        },
        "node_modules/@sindresorhus/is": {
            "version": "4.6.0",
            "resolved": "https://registry.npmjs.org/@sindresorhus/is/-/is-4.6.0.tgz",
            "integrity": "sha512-t09vSN3MdfsyCHoFcTRCH/iUtG7OJ0CsjzB8cjAmKc/va/kIgeDI/TxsigdncE/4be734m0cvIYwNaV4i2XqAw==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sindresorhus/is?sponsor=1"
            }
        },
        "node_modules/@szmarczak/http-timer": {
            "version": "4.0.6",
            "resolved": "https://registry.npmjs.org/@szmarczak/http-timer/-/http-timer-4.0.6.tgz",
            "integrity": "sha512-4BAffykYOgO+5nzBWYwE3W90sBgLJoUPRWWcL8wlyiM8IB8ipJz3UMJ9KXQd1RKQXpKp8Tutn80HZtWsu2u76w==",
            "license": "MIT",
            "dependencies": {
                "defer-to-connect": "^2.0.0"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/@types/cacheable-request": {
            "version": "6.0.3",
            "resolved": "https://registry.npmjs.org/@types/cacheable-request/-/cacheable-request-6.0.3.tgz",
            "integrity": "sha512-IQ3EbTzGxIigb1I3qPZc1rWJnH0BmSKv5QYTalEwweFvyBDLSAe24zP0le/hyi7ecGfZVlIVAg4BZqb8WBwKqw==",
            "license": "MIT",
            "dependencies": {
                "@types/http-cache-semantics": "*",
                "@types/keyv": "^3.1.4",
                "@types/node": "*",
                "@types/responselike": "^1.0.0"
            }
        },
        "node_modules/@types/http-cache-semantics": {
            "version": "4.0.4",
            "resolved": "https://registry.npmjs.org/@types/http-cache-semantics/-/http-cache-semantics-4.0.4.tgz",
            "integrity": "sha512-1m0bIFVc7eJWyve9S0RnuRgcQqF/Xd5QsUZAZeQFr1Q3/p9JWoQQEqmVy+DPTNpGXwhgIetAoYF8JSc33q29QA==",
            "license": "MIT"
        },
        "node_modules/@types/keyv": {
            "version": "3.1.4",
            "resolved": "https://registry.npmjs.org/@types/keyv/-/keyv-3.1.4.tgz",
            "integrity": "sha512-BQ5aZNSCpj7D6K2ksrRCTmKRLEpnPvWDiLPfoGyhZ++8YtiK9d/3DBKPJgry359X/P1PfruyYwvnvwFjuEiEIg==",
            "license": "MIT",
            "dependencies": {
                "@types/node": "*"
            }
        },
        "node_modules/@types/node": {
            "version": "20.19.30",
            "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.30.tgz",
            "integrity": "sha512-WJtwWJu7UdlvzEAUm484QNg5eAoq5QR08KDNx7g45Usrs2NtOPiX8ugDqmKdXkyL03rBqU5dYNYVQetEpBHq2g==",
            "license": "MIT",
            "dependencies": {
                "undici-types": "~6.21.0"
            }
        },
        "node_modules/@types/pg": {
            "version": "8.16.0",
            "resolved": "https://registry.npmjs.org/@types/pg/-/pg-8.16.0.tgz",
            "integrity": "sha512-RmhMd/wD+CF8Dfo+cVIy3RR5cl8CyfXQ0tGgW6XBL8L4LM/UTEbNXYRbLwU6w+CgrKBNbrQWt4FUtTfaU5jSYQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@types/node": "*",
                "pg-protocol": "*",
                "pg-types": "^2.2.0"
            }
        },
        "node_modules/@types/responselike": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/@types/responselike/-/responselike-1.0.3.tgz",
            "integrity": "sha512-H/+L+UkTV33uf49PH5pCAUBVPNj2nDBXTN+qS1dOwyyg24l3CcicicCA7ca+HMvJBZcFgl5r8e+RR6elsb4Lyw==",
            "license": "MIT",
            "dependencies": {
                "@types/node": "*"
            }
        },
        "node_modules/@types/yauzl": {
            "version": "2.10.3",
            "resolved": "https://registry.npmjs.org/@types/yauzl/-/yauzl-2.10.3.tgz",
            "integrity": "sha512-oJoftv0LSuaDZE3Le4DbKX+KS9G36NzOeSap90UIK0yMA/NhKJhqlSGtNDORNRaIbQfzjXDrQa0ytJ6mNRGz/Q==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "@types/node": "*"
            }
        },
        "node_modules/boolean": {
            "version": "3.2.0",
            "resolved": "https://registry.npmjs.org/boolean/-/boolean-3.2.0.tgz",
            "integrity": "sha512-d0II/GO9uf9lfUHH2BQsjxzRJZBdsjgsBiW4BvhWk/3qoKwQFjIDVN19PfX8F2D/r9PCMTtLWjYVCFrpeYUzsw==",
            "deprecated": "Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.",
            "license": "MIT",
            "optional": true
        },
        "node_modules/buffer-crc32": {
            "version": "0.2.13",
            "resolved": "https://registry.npmjs.org/buffer-crc32/-/buffer-crc32-0.2.13.tgz",
            "integrity": "sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==",
            "license": "MIT",
            "engines": {
                "node": "*"
            }
        },
        "node_modules/cacheable-lookup": {
            "version": "5.0.4",
            "resolved": "https://registry.npmjs.org/cacheable-lookup/-/cacheable-lookup-5.0.4.tgz",
            "integrity": "sha512-2/kNscPhpcxrOigMZzbiWF7dz8ilhb/nIHU3EyZiXWXpeq/au8qJ8VhdftMkty3n7Gj6HIGalQG8oiBNB3AJgA==",
            "license": "MIT",
            "engines": {
                "node": ">=10.6.0"
            }
        },
        "node_modules/cacheable-request": {
            "version": "7.0.4",
            "resolved": "https://registry.npmjs.org/cacheable-request/-/cacheable-request-7.0.4.tgz",
            "integrity": "sha512-v+p6ongsrp0yTGbJXjgxPow2+DL93DASP4kXCDKb8/bwRtt9OEF3whggkkDkGNzgcWy2XaF4a8nZglC7uElscg==",
            "license": "MIT",
            "dependencies": {
                "clone-response": "^1.0.2",
                "get-stream": "^5.1.0",
                "http-cache-semantics": "^4.0.0",
                "keyv": "^4.0.0",
                "lowercase-keys": "^2.0.0",
                "normalize-url": "^6.0.1",
                "responselike": "^2.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/clone-response": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/clone-response/-/clone-response-1.0.3.tgz",
            "integrity": "sha512-ROoL94jJH2dUVML2Y/5PEDNaSHgeOdSDicUyS7izcF63G6sTc/FTjLub4b8Il9S8S0beOfYt0TaA5qvFK+w0wA==",
            "license": "MIT",
            "dependencies": {
                "mimic-response": "^1.0.0"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "license": "MIT",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/decompress-response": {
            "version": "6.0.0",
            "resolved": "https://registry.npmjs.org/decompress-response/-/decompress-response-6.0.0.tgz",
            "integrity": "sha512-aW35yZM6Bb/4oJlZncMH2LCoZtJXTRxES17vE3hoRiowU2kWHaJKFkSBDnDR+cm9J+9QhXmREyIfv0pji9ejCQ==",
            "license": "MIT",
            "dependencies": {
                "mimic-response": "^3.1.0"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/decompress-response/node_modules/mimic-response": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-3.1.0.tgz",
            "integrity": "sha512-z0yWI+4FDrrweS8Zmt4Ej5HdJmky15+L2e6Wgn3+iK5fWzb6T3fhNFq2+MeTRb064c6Wr4N/wv0DzQTjNzHNGQ==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/defer-to-connect": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/defer-to-connect/-/defer-to-connect-2.0.1.tgz",
            "integrity": "sha512-4tvttepXG1VaYGrRibk5EwJd1t4udunSOVMdLSAL6mId1ix438oPwPZMALY41FCijukO1L0twNcGsdzS7dHgDg==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/define-data-property": {
            "version": "1.1.4",
            "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
            "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "es-define-property": "^1.0.0",
                "es-errors": "^1.3.0",
                "gopd": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/define-properties": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
            "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "define-data-property": "^1.0.1",
                "has-property-descriptors": "^1.0.0",
                "object-keys": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/detect-node": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/detect-node/-/detect-node-2.1.0.tgz",
            "integrity": "sha512-T0NIuQpnTvFDATNuHN5roPwSBG83rFsuO+MXXH9/3N1eFbn4wcPjttvjMLEPWJ0RGUYgQE7cGgS3tNxbqCGM7g==",
            "license": "MIT",
            "optional": true
        },
        "node_modules/dotenv": {
            "version": "16.6.1",
            "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-16.6.1.tgz",
            "integrity": "sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==",
            "license": "BSD-2-Clause",
            "engines": {
                "node": ">=12"
            },
            "funding": {
                "url": "https://dotenvx.com"
            }
        },
        "node_modules/electron": {
            "version": "28.3.3",
            "resolved": "https://registry.npmjs.org/electron/-/electron-28.3.3.tgz",
            "integrity": "sha512-ObKMLSPNhomtCOBAxFS8P2DW/4umkh72ouZUlUKzXGtYuPzgr1SYhskhFWgzAsPtUzhL2CzyV2sfbHcEW4CXqw==",
            "hasInstallScript": true,
            "license": "MIT",
            "dependencies": {
                "@electron/get": "^2.0.0",
                "@types/node": "^18.11.18",
                "extract-zip": "^2.0.1"
            },
            "bin": {
                "electron": "cli.js"
            },
            "engines": {
                "node": ">= 12.20.55"
            }
        },
        "node_modules/electron/node_modules/@types/node": {
            "version": "18.19.130",
            "resolved": "https://registry.npmjs.org/@types/node/-/node-18.19.130.tgz",
            "integrity": "sha512-GRaXQx6jGfL8sKfaIDD6OupbIHBr9jv7Jnaml9tB7l4v068PAOXqfcujMMo5PhbIs6ggR1XODELqahT2R8v0fg==",
            "license": "MIT",
            "dependencies": {
                "undici-types": "~5.26.4"
            }
        },
        "node_modules/electron/node_modules/undici-types": {
            "version": "5.26.5",
            "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-5.26.5.tgz",
            "integrity": "sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA==",
            "license": "MIT"
        },
        "node_modules/end-of-stream": {
            "version": "1.4.5",
            "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.5.tgz",
            "integrity": "sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==",
            "license": "MIT",
            "dependencies": {
                "once": "^1.4.0"
            }
        },
        "node_modules/env-paths": {
            "version": "2.2.1",
            "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
            "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
            "license": "MIT",
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/es-define-property": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
            "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
            "license": "MIT",
            "optional": true,
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-errors": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
            "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
            "license": "MIT",
            "optional": true,
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es6-error": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/es6-error/-/es6-error-4.1.1.tgz",
            "integrity": "sha512-Um/+FxMr9CISWh0bi5Zv0iOD+4cFh5qLeks1qhAopKVAJw3drgKbKySikp7wGhDL0HPeaja0P5ULZrxLkniUVg==",
            "license": "MIT",
            "optional": true
        },
        "node_modules/escape-string-regexp": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
            "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
            "license": "MIT",
            "optional": true,
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/extract-zip": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/extract-zip/-/extract-zip-2.0.1.tgz",
            "integrity": "sha512-GDhU9ntwuKyGXdZBUgTIe+vXnWj0fppUEtMDL0+idd5Sta8TGpHssn/eusA9mrPr9qNDym6SxAYZjNvCn/9RBg==",
            "license": "BSD-2-Clause",
            "dependencies": {
                "debug": "^4.1.1",
                "get-stream": "^5.1.0",
                "yauzl": "^2.10.0"
            },
            "bin": {
                "extract-zip": "cli.js"
            },
            "engines": {
                "node": ">= 10.17.0"
            },
            "optionalDependencies": {
                "@types/yauzl": "^2.9.1"
            }
        },
        "node_modules/fd-slicer": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/fd-slicer/-/fd-slicer-1.1.0.tgz",
            "integrity": "sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==",
            "license": "MIT",
            "dependencies": {
                "pend": "~1.2.0"
            }
        },
        "node_modules/fs-extra": {
            "version": "8.1.0",
            "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-8.1.0.tgz",
            "integrity": "sha512-yhlQgA6mnOJUKOsRUFsgJdQCvkKhcz8tlZG5HBQfReYZy46OwLcY+Zia0mtdHsOo9y/hP+CxMN0TU9QxoOtG4g==",
            "license": "MIT",
            "dependencies": {
                "graceful-fs": "^4.2.0",
                "jsonfile": "^4.0.0",
                "universalify": "^0.1.0"
            },
            "engines": {
                "node": ">=6 <7 || >=8"
            }
        },
        "node_modules/get-stream": {
            "version": "5.2.0",
            "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-5.2.0.tgz",
            "integrity": "sha512-nBF+F1rAZVCu/p7rjzgA+Yb4lfYXrpl7a6VmJrU8wF9I1CKvP/QwPNZHnOlwbTkY6dvtFIzFMSyQXbLoTQPRpA==",
            "license": "MIT",
            "dependencies": {
                "pump": "^3.0.0"
            },
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/global-agent": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/global-agent/-/global-agent-3.0.0.tgz",
            "integrity": "sha512-PT6XReJ+D07JvGoxQMkT6qji/jVNfX/h364XHZOWeRzy64sSFr+xJ5OX7LI3b4MPQzdL4H8Y8M0xzPpsVMwA8Q==",
            "license": "BSD-3-Clause",
            "optional": true,
            "dependencies": {
                "boolean": "^3.0.1",
                "es6-error": "^4.1.1",
                "matcher": "^3.0.0",
                "roarr": "^2.15.3",
                "semver": "^7.3.2",
                "serialize-error": "^7.0.1"
            },
            "engines": {
                "node": ">=10.0"
            }
        },
        "node_modules/global-agent/node_modules/semver": {
            "version": "7.7.3",
            "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.3.tgz",
            "integrity": "sha512-SdsKMrI9TdgjdweUSR9MweHA4EJ8YxHn8DFaDisvhVlUOe4BF1tLD7GAj0lIqWVl+dPb/rExr0Btby5loQm20Q==",
            "license": "ISC",
            "optional": true,
            "bin": {
                "semver": "bin/semver.js"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/globalthis": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
            "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "define-properties": "^1.2.1",
                "gopd": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/gopd": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
            "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
            "license": "MIT",
            "optional": true,
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/got": {
            "version": "11.8.6",
            "resolved": "https://registry.npmjs.org/got/-/got-11.8.6.tgz",
            "integrity": "sha512-6tfZ91bOr7bOXnK7PRDCGBLa1H4U080YHNaAQ2KsMGlLEzRbk44nsZF2E1IeRc3vtJHPVbKCYgdFbaGO2ljd8g==",
            "license": "MIT",
            "dependencies": {
                "@sindresorhus/is": "^4.0.0",
                "@szmarczak/http-timer": "^4.0.5",
                "@types/cacheable-request": "^6.0.1",
                "@types/responselike": "^1.0.0",
                "cacheable-lookup": "^5.0.3",
                "cacheable-request": "^7.0.2",
                "decompress-response": "^6.0.0",
                "http2-wrapper": "^1.0.0-beta.5.2",
                "lowercase-keys": "^2.0.0",
                "p-cancelable": "^2.0.0",
                "responselike": "^2.0.0"
            },
            "engines": {
                "node": ">=10.19.0"
            },
            "funding": {
                "url": "https://github.com/sindresorhus/got?sponsor=1"
            }
        },
        "node_modules/graceful-fs": {
            "version": "4.2.11",
            "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
            "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
            "license": "ISC"
        },
        "node_modules/has-property-descriptors": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
            "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "es-define-property": "^1.0.0"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/http-cache-semantics": {
            "version": "4.2.0",
            "resolved": "https://registry.npmjs.org/http-cache-semantics/-/http-cache-semantics-4.2.0.tgz",
            "integrity": "sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==",
            "license": "BSD-2-Clause"
        },
        "node_modules/http2-wrapper": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/http2-wrapper/-/http2-wrapper-1.0.3.tgz",
            "integrity": "sha512-V+23sDMr12Wnz7iTcDeJr3O6AIxlnvT/bmaAAAP/Xda35C90p9599p0F1eHR/N1KILWSoWVAiOMFjBBXaXSMxg==",
            "license": "MIT",
            "dependencies": {
                "quick-lru": "^5.1.1",
                "resolve-alpn": "^1.0.0"
            },
            "engines": {
                "node": ">=10.19.0"
            }
        },
        "node_modules/json-buffer": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
            "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
            "license": "MIT"
        },
        "node_modules/json-stringify-safe": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz",
            "integrity": "sha512-ZClg6AaYvamvYEE82d3Iyd3vSSIjQ+odgjaTzRuO3s7toCdFKczob2i0zCh7JE8kWn17yvAWhUVxvqGwUalsRA==",
            "license": "ISC",
            "optional": true
        },
        "node_modules/jsonfile": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-4.0.0.tgz",
            "integrity": "sha512-m6F1R3z8jjlf2imQHS2Qez5sjKWQzbuuhuJ/FKYFRZvPE3PuHcSMVZzfsLhGVOkfd20obL5SWEBew5ShlquNxg==",
            "license": "MIT",
            "optionalDependencies": {
                "graceful-fs": "^4.1.6"
            }
        },
        "node_modules/keyv": {
            "version": "4.5.4",
            "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
            "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
            "license": "MIT",
            "dependencies": {
                "json-buffer": "3.0.1"
            }
        },
        "node_modules/lowercase-keys": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/lowercase-keys/-/lowercase-keys-2.0.0.tgz",
            "integrity": "sha512-tqNXrS78oMOE73NMxK4EMLQsQowWf8jKooH9g7xPavRT706R6bkQJ6DY2Te7QukaZsulxa30wQ7bk0pm4XiHmA==",
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/matcher": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/matcher/-/matcher-3.0.0.tgz",
            "integrity": "sha512-OkeDaAZ/bQCxeFAozM55PKcKU0yJMPGifLwV4Qgjitu+5MoAfSQN4lsLJeXZ1b8w0x+/Emda6MZgXS1jvsapng==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "escape-string-regexp": "^4.0.0"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/mimic-response": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-1.0.1.tgz",
            "integrity": "sha512-j5EctnkH7amfV/q5Hgmoal1g2QHFJRraOtmx0JpIqkxhBhI/lJSl1nMpQ45hVarwNETOoWEimndZ4QK0RHxuxQ==",
            "license": "MIT",
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/normalize-url": {
            "version": "6.1.0",
            "resolved": "https://registry.npmjs.org/normalize-url/-/normalize-url-6.1.0.tgz",
            "integrity": "sha512-DlL+XwOy3NxAQ8xuC0okPgK46iuVNAK01YN7RueYBqqFeGsBjV9XmCAzAdgt+667bCl5kPh9EqKKDwnaPG1I7A==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/object-keys": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
            "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
            "license": "MIT",
            "optional": true,
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/once": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
            "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
            "license": "ISC",
            "dependencies": {
                "wrappy": "1"
            }
        },
        "node_modules/p-cancelable": {
            "version": "2.1.1",
            "resolved": "https://registry.npmjs.org/p-cancelable/-/p-cancelable-2.1.1.tgz",
            "integrity": "sha512-BZOr3nRQHOntUjTrH8+Lh54smKHoHyur8We1V8DSMVrl5A2malOOwuJRnKRDjSnkoeBh4at6BwEnb5I7Jl31wg==",
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/pend": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/pend/-/pend-1.2.0.tgz",
            "integrity": "sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg==",
            "license": "MIT"
        },
        "node_modules/pg": {
            "version": "8.16.3",
            "resolved": "https://registry.npmjs.org/pg/-/pg-8.16.3.tgz",
            "integrity": "sha512-enxc1h0jA/aq5oSDMvqyW3q89ra6XIIDZgCX9vkMrnz5DFTw/Ny3Li2lFQ+pt3L6MCgm/5o2o8HW9hiJji+xvw==",
            "license": "MIT",
            "peer": true,
            "dependencies": {
                "pg-connection-string": "^2.9.1",
                "pg-pool": "^3.10.1",
                "pg-protocol": "^1.10.3",
                "pg-types": "2.2.0",
                "pgpass": "1.0.5"
            },
            "engines": {
                "node": ">= 16.0.0"
            },
            "optionalDependencies": {
                "pg-cloudflare": "^1.2.7"
            },
            "peerDependencies": {
                "pg-native": ">=3.0.1"
            },
            "peerDependenciesMeta": {
                "pg-native": {
                    "optional": true
                }
            }
        },
        "node_modules/pg-cloudflare": {
            "version": "1.2.7",
            "resolved": "https://registry.npmjs.org/pg-cloudflare/-/pg-cloudflare-1.2.7.tgz",
            "integrity": "sha512-YgCtzMH0ptvZJslLM1ffsY4EuGaU0cx4XSdXLRFae8bPP4dS5xL1tNB3k2o/N64cHJpwU7dxKli/nZ2lUa5fLg==",
            "license": "MIT",
            "optional": true
        },
        "node_modules/pg-connection-string": {
            "version": "2.9.1",
            "resolved": "https://registry.npmjs.org/pg-connection-string/-/pg-connection-string-2.9.1.tgz",
            "integrity": "sha512-nkc6NpDcvPVpZXxrreI/FOtX3XemeLl8E0qFr6F2Lrm/I8WOnaWNhIPK2Z7OHpw7gh5XJThi6j6ppgNoaT1w4w==",
            "license": "MIT"
        },
        "node_modules/pg-int8": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/pg-int8/-/pg-int8-1.0.1.tgz",
            "integrity": "sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==",
            "license": "ISC",
            "engines": {
                "node": ">=4.0.0"
            }
        },
        "node_modules/pg-pool": {
            "version": "3.10.1",
            "resolved": "https://registry.npmjs.org/pg-pool/-/pg-pool-3.10.1.tgz",
            "integrity": "sha512-Tu8jMlcX+9d8+QVzKIvM/uJtp07PKr82IUOYEphaWcoBhIYkoHpLXN3qO59nAI11ripznDsEzEv8nUxBVWajGg==",
            "license": "MIT",
            "peerDependencies": {
                "pg": ">=8.0"
            }
        },
        "node_modules/pg-protocol": {
            "version": "1.10.3",
            "resolved": "https://registry.npmjs.org/pg-protocol/-/pg-protocol-1.10.3.tgz",
            "integrity": "sha512-6DIBgBQaTKDJyxnXaLiLR8wBpQQcGWuAESkRBX/t6OwA8YsqP+iVSiond2EDy6Y/dsGk8rh/jtax3js5NeV7JQ==",
            "license": "MIT"
        },
        "node_modules/pg-types": {
            "version": "2.2.0",
            "resolved": "https://registry.npmjs.org/pg-types/-/pg-types-2.2.0.tgz",
            "integrity": "sha512-qTAAlrEsl8s4OiEQY69wDvcMIdQN6wdz5ojQiOy6YRMuynxenON0O5oCpJI6lshc6scgAY8qvJ2On/p+CXY0GA==",
            "license": "MIT",
            "dependencies": {
                "pg-int8": "1.0.1",
                "postgres-array": "~2.0.0",
                "postgres-bytea": "~1.0.0",
                "postgres-date": "~1.0.4",
                "postgres-interval": "^1.1.0"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/pgpass": {
            "version": "1.0.5",
            "resolved": "https://registry.npmjs.org/pgpass/-/pgpass-1.0.5.tgz",
            "integrity": "sha512-FdW9r/jQZhSeohs1Z3sI1yxFQNFvMcnmfuj4WBMUTxOrAyLMaTcE1aAMBiTlbMNaXvBCQuVi0R7hd8udDSP7ug==",
            "license": "MIT",
            "dependencies": {
                "split2": "^4.1.0"
            }
        },
        "node_modules/postgres-array": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/postgres-array/-/postgres-array-2.0.0.tgz",
            "integrity": "sha512-VpZrUqU5A69eQyW2c5CA1jtLecCsN2U/bD6VilrFDWq5+5UIEVO7nazS3TEcHf1zuPYO/sqGvUvW62g86RXZuA==",
            "license": "MIT",
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/postgres-bytea": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/postgres-bytea/-/postgres-bytea-1.0.1.tgz",
            "integrity": "sha512-5+5HqXnsZPE65IJZSMkZtURARZelel2oXUEO8rH83VS/hxH5vv1uHquPg5wZs8yMAfdv971IU+kcPUczi7NVBQ==",
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/postgres-date": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/postgres-date/-/postgres-date-1.0.7.tgz",
            "integrity": "sha512-suDmjLVQg78nMK2UZ454hAG+OAW+HQPZ6n++TNDUX+L0+uUlLywnoxJKDou51Zm+zTCjrCl0Nq6J9C5hP9vK/Q==",
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/postgres-interval": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/postgres-interval/-/postgres-interval-1.2.0.tgz",
            "integrity": "sha512-9ZhXKM/rw350N1ovuWHbGxnGh/SNJ4cnxHiM0rxE4VN41wsg8P8zWn9hv/buK00RP4WvlOyr/RBDiptyxVbkZQ==",
            "license": "MIT",
            "dependencies": {
                "xtend": "^4.0.0"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/progress": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/progress/-/progress-2.0.3.tgz",
            "integrity": "sha512-7PiHtLll5LdnKIMw100I+8xJXR5gW2QwWYkT6iJva0bXitZKa/XMrSbdmg3r2Xnaidz9Qumd0VPaMrZlF9V9sA==",
            "license": "MIT",
            "engines": {
                "node": ">=0.4.0"
            }
        },
        "node_modules/pump": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.3.tgz",
            "integrity": "sha512-todwxLMY7/heScKmntwQG8CXVkWUOdYxIvY2s0VWAAMh/nd8SoYiRaKjlr7+iCs984f2P8zvrfWcDDYVb73NfA==",
            "license": "MIT",
            "dependencies": {
                "end-of-stream": "^1.1.0",
                "once": "^1.3.1"
            }
        },
        "node_modules/quick-lru": {
            "version": "5.1.1",
            "resolved": "https://registry.npmjs.org/quick-lru/-/quick-lru-5.1.1.tgz",
            "integrity": "sha512-WuyALRjWPDGtt/wzJiadO5AXY+8hZ80hVpe6MyivgraREW751X3SbhRvG3eLKOYN+8VEvqLcf3wdnt44Z4S4SA==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/resolve-alpn": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/resolve-alpn/-/resolve-alpn-1.2.1.tgz",
            "integrity": "sha512-0a1F4l73/ZFZOakJnQ3FvkJ2+gSTQWz/r2KE5OdDY0TxPm5h4GkqkWWfM47T7HsbnOtcJVEF4epCVy6u7Q3K+g==",
            "license": "MIT"
        },
        "node_modules/responselike": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/responselike/-/responselike-2.0.1.tgz",
            "integrity": "sha512-4gl03wn3hj1HP3yzgdI7d3lCkF95F21Pz4BPGvKHinyQzALR5CapwC8yIi0Rh58DEMQ/SguC03wFj2k0M/mHhw==",
            "license": "MIT",
            "dependencies": {
                "lowercase-keys": "^2.0.0"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/roarr": {
            "version": "2.15.4",
            "resolved": "https://registry.npmjs.org/roarr/-/roarr-2.15.4.tgz",
            "integrity": "sha512-CHhPh+UNHD2GTXNYhPWLnU8ONHdI+5DI+4EYIAOaiD63rHeYlZvyh8P+in5999TTSFgUYuKUAjzRI4mdh/p+2A==",
            "license": "BSD-3-Clause",
            "optional": true,
            "dependencies": {
                "boolean": "^3.0.1",
                "detect-node": "^2.0.4",
                "globalthis": "^1.0.1",
                "json-stringify-safe": "^5.0.1",
                "semver-compare": "^1.0.0",
                "sprintf-js": "^1.1.2"
            },
            "engines": {
                "node": ">=8.0"
            }
        },
        "node_modules/semver": {
            "version": "6.3.1",
            "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
            "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
            "license": "ISC",
            "bin": {
                "semver": "bin/semver.js"
            }
        },
        "node_modules/semver-compare": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/semver-compare/-/semver-compare-1.0.0.tgz",
            "integrity": "sha512-YM3/ITh2MJ5MtzaM429anh+x2jiLVjqILF4m4oyQB18W7Ggea7BfqdH/wGMK7dDiMghv/6WG7znWMwUDzJiXow==",
            "license": "MIT",
            "optional": true
        },
        "node_modules/serialize-error": {
            "version": "7.0.1",
            "resolved": "https://registry.npmjs.org/serialize-error/-/serialize-error-7.0.1.tgz",
            "integrity": "sha512-8I8TjW5KMOKsZQTvoxjuSIa7foAwPWGOts+6o7sgjz41/qMD9VQHEDxi6PBvK2l0MXUmqZyNpUK+T2tQaaElvw==",
            "license": "MIT",
            "optional": true,
            "dependencies": {
                "type-fest": "^0.13.1"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/split2": {
            "version": "4.2.0",
            "resolved": "https://registry.npmjs.org/split2/-/split2-4.2.0.tgz",
            "integrity": "sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==",
            "license": "ISC",
            "engines": {
                "node": ">= 10.x"
            }
        },
        "node_modules/sprintf-js": {
            "version": "1.1.3",
            "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.1.3.tgz",
            "integrity": "sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA==",
            "license": "BSD-3-Clause",
            "optional": true
        },
        "node_modules/sumchecker": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/sumchecker/-/sumchecker-3.0.1.tgz",
            "integrity": "sha512-MvjXzkz/BOfyVDkG0oFOtBxHX2u3gKbMHIF/dXblZsgD3BWOFLmHovIpZY7BykJdAjcqRCBi1WYBNdEC9yI7vg==",
            "license": "Apache-2.0",
            "dependencies": {
                "debug": "^4.1.0"
            },
            "engines": {
                "node": ">= 8.0"
            }
        },
        "node_modules/type-fest": {
            "version": "0.13.1",
            "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.13.1.tgz",
            "integrity": "sha512-34R7HTnG0XIJcBSn5XhDd7nNFPRcXYRZrBB2O2jdKqYODldSzBAqzsWoZYYvduky73toYS/ESqxPvkDf/F0XMg==",
            "license": "(MIT OR CC0-1.0)",
            "optional": true,
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/typescript": {
            "version": "5.9.3",
            "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
            "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
            "dev": true,
            "license": "Apache-2.0",
            "bin": {
                "tsc": "bin/tsc",
                "tsserver": "bin/tsserver"
            },
            "engines": {
                "node": ">=14.17"
            }
        },
        "node_modules/undici-types": {
            "version": "6.21.0",
            "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
            "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
            "license": "MIT"
        },
        "node_modules/universalify": {
            "version": "0.1.2",
            "resolved": "https://registry.npmjs.org/universalify/-/universalify-0.1.2.tgz",
            "integrity": "sha512-rBJeI5CXAlmy1pV+617WB9J63U6XcazHHF2f2dbJix4XzpUF0RS3Zbj0FGIOCAva5P/d/GBOYaACQ1w+0azUkg==",
            "license": "MIT",
            "engines": {
                "node": ">= 4.0.0"
            }
        },
        "node_modules/wrappy": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
            "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
            "license": "ISC"
        },
        "node_modules/xtend": {
            "version": "4.0.2",
            "resolved": "https://registry.npmjs.org/xtend/-/xtend-4.0.2.tgz",
            "integrity": "sha512-LKYU1iAXJXUgAXn9URjiu+MWhyUXHsvfp7mcuYm9dSUKK0/CjtrUwFAxD82/mCWbtLsGjFIad0wIsod4zrTAEQ==",
            "license": "MIT",
            "engines": {
                "node": ">=0.4"
            }
        },
        "node_modules/yauzl": {
            "version": "2.10.0",
            "resolved": "https://registry.npmjs.org/yauzl/-/yauzl-2.10.0.tgz",
            "integrity": "sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==",
            "license": "MIT",
            "dependencies": {
                "buffer-crc32": "~0.2.3",
                "fd-slicer": "~1.1.0"
            }
        },
        "node_modules/zod": {
            "version": "4.3.5",
            "resolved": "https://registry.npmjs.org/zod/-/zod-4.3.5.tgz",
            "integrity": "sha512-k7Nwx6vuWx1IJ9Bjuf4Zt1PEllcwe7cls3VNzm4CQ1/hgtFUK2bRNG3rvnpPUhFjmqJKAKtjV576KnUkHocg/g==",
            "license": "MIT",
            "funding": {
                "url": "https://github.com/sponsors/colinhacks"
            }
        }
    }
}

```

## File: server\package.json
```json
{
    "name": "nse-options-server",
    "version": "1.0.0",
    "main": "dist/index.js",
    "scripts": {
        "build": "tsc",
        "dev": "tsc && electron .",
        "start": "electron ."
    },
    "dependencies": {
        "dotenv": "^16.3.1",
        "electron": "^28.0.0",
        "pg": "^8.11.3",
        "zod": "^4.3.5"
    },
    "devDependencies": {
        "@types/node": "^20.10.0",
        "@types/pg": "^8.10.9",
        "typescript": "^5.3.3"
    }
}
```

## File: server\tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "CommonJS",
        "moduleResolution": "node",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "sourceMap": true,
        "types": [
            "node"
        ]
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules",
        "dist"
    ]
}
```

## File: server\client\src\hooks\useOptionChain.ts
```ts
useEffect(() => {
    if (!symbol || !tradeDate || selectedExpiries.length === 0 || !timestamp) {
        console.log('useOptionChain: Skipping - missing params');
        setDataByExpiry({});
        setLoading(false);
        return;
    }

    const fetchSnapshots = async () => {
        try {
            setLoading(true);
            setError(null);
            const allData: Record<string, any[]> = {};

            for (const expiry of selectedExpiries) {  // ✅ Use expiry directly
                console.log('📊 Fetching snapshot:', { symbol, expiry, timestamp });

                try {
                    // ✅ Pass expiry (the date string), NOT index
                    const result = await window.api.getSnapshot({
                        symbol,
                        date: tradeDate,        // Trading date
                        expiry: expiry,         // ✅ Actual expiry date like '2025-12-30'
                        timestamp: timestamp    // ISO timestamp
                    });

                    allData[expiry] = result;
                    console.log(`✅ Loaded ${result.length} rows for ${expiry}`);
                } catch (err: any) {
                    console.error(`❌ Failed to fetch data for ${expiry}:`, err);
                    setError(err.message || `Failed to fetch ${expiry}`);
                }
            }

            setDataByExpiry(allData);
        } catch (err: any) {
            console.error('useOptionChain error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // At the top of fetchSnapshots:
    if (!timestamp || timestamp.length === 0) {
        console.log('⏸️ Waiting for timestamp selection');
        return;
    }

    fetchSnapshots();
}, [symbol, tradeDate, selectedExpiries, timestamp]);

```

## File: server\src\index.ts
```ts
// ============================================================================
// NSE OPTIONS PLATFORM - ELECTRON MAIN PROCESS
// ============================================================================

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

// Database services
import {
    getAvailableSymbols,
    getAvailableDates,
    getExpiriesByDate,
    getAvailableTimestamps,
    getSnapshot,
    getStrikeTimeline
} from './services/db.service';

// Analytics services
import { calculateMaxPain } from './services/analytics.service';

// ============================================================================
// CONSTANTS
// ============================================================================

const isDevelopment = process.env.NODE_ENV !== 'production';
const VITE_DEV_SERVER_URL = 'http://localhost:5173';

// ============================================================================
// GLOBAL STATE
// ============================================================================

let mainWindow: BrowserWindow | null = null;

// ============================================================================
// SAFE HANDLER WRAPPER
// ============================================================================

function safeHandle(channel: string, handler: (...args: any[]) => Promise<any>) {
    ipcMain.handle(channel, async (_event, ...args) => {
        const startTime = Date.now();
        try {
            console.log(`📡 IPC [${channel}]:`, JSON.stringify(args).slice(0, 150));

            const result = await handler(...args);

            const duration = Date.now() - startTime;
            const count = Array.isArray(result) ? result.length : 'N/A';
            console.log(`✅ IPC [${channel}]: ${count} items in ${duration}ms`);

            return result;
        } catch (error: any) {
            console.error(`❌ IPC [${channel}] Error:`, error.message || error);
            console.error('Stack:', error.stack);
            throw new Error(error.message || 'Unknown error occurred');
        }
    });
}

// ============================================================================
// WINDOW MANAGEMENT
// ============================================================================

function createWindow() {
    console.log('🪟 Creating main window...');

    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 1200,
        minHeight: 800,
        backgroundColor: '#1a1a1a',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: isDevelopment
        },
        show: false,
        titleBarStyle: 'default',
        autoHideMenuBar: !isDevelopment
    });

    if (isDevelopment) {
        console.log(`📡 Loading Vite dev server: ${VITE_DEV_SERVER_URL}`);
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools({ mode: 'right' });
    } else {
        console.log('📦 Loading production build');
        const indexPath = path.join(__dirname, '../../client/dist/index.html');
        mainWindow.loadFile(indexPath);
    }

    mainWindow.once('ready-to-show', () => {
        console.log('✅ Window ready to show');
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        console.log('❌ Window closed');
        mainWindow = null;
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('❌ Failed to load:', errorCode, errorDescription);
        if (isDevelopment && errorDescription.includes('ERR_CONNECTION_REFUSED')) {
            console.error('⚠️ Vite dev server not running! Start it with: npm run dev');
        }
    });

    console.log('✅ Main window created');
}

// ============================================================================
// IPC HANDLERS
// ============================================================================

function registerIpcHandlers() {
    console.log('🔌 Registering IPC handlers...');

    // Get all instruments
    safeHandle('get-instruments', async () => {
        return await getAvailableSymbols();
    });

    // Get dates for symbol
    safeHandle('get-dates', async (symbol: string) => {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Invalid symbol parameter');
        }
        return await getAvailableDates(symbol);
    });

    // Get expiries
    safeHandle('get-expiries', async (params: any) => {
        if (!params || !params.symbol || !params.tradingdate) {
            throw new Error('Missing required parameters: symbol and tradingdate');
        }
        console.log('  → Symbol:', params.symbol, 'Date:', params.tradingdate);
        return await getExpiriesByDate(params.symbol, params.tradingdate);
    });

    // Get timestamps
    safeHandle('get-timestamps', async (params: any) => {
        if (!params || !params.symbol || !params.date || !params.expiry) {
            throw new Error('Missing required parameters: symbol, date, and expiry');
        }
        console.log('  → Symbol:', params.symbol, 'Date:', params.date, 'Expiry:', params.expiry);
        return await getAvailableTimestamps(params.symbol, params.date, params.expiry);
    });

    // Get snapshot
    safeHandle('get-snapshot', async (params: any) => {
        if (!params || !params.symbol || !params.expiry || !params.timestamp) {
            throw new Error('Missing required parameters: symbol, expiry, and timestamp');
        }
        console.log('  → Symbol:', params.symbol, 'Expiry:', params.expiry, 'Time:', params.timestamp);
        return await getSnapshot(params.symbol, params.expiry, new Date(params.timestamp));
    });

    // Get strike timeline
    safeHandle('get-strike-timeline', async (params: any) => {
        if (!params || !params.symbol || !params.strike || !params.optionType || !params.date || !params.expiry) {
            throw new Error('Missing required parameters for strike timeline');
        }
        return await getStrikeTimeline(
            params.symbol,
            params.strike,
            params.optionType,
            params.date,
            params.expiry
        );
    });

    // Calculate max pain
    safeHandle('calculate-max-pain', async (chainData: any[]) => {
        if (!Array.isArray(chainData)) {
            throw new Error('Chain data must be an array');
        }
        return calculateMaxPain(chainData);
    });

    // Placeholder handlers for Phase 2
    ipcMain.handle('calculate-greeks', async () => {
        console.warn('⚠️ Greeks calculation not implemented yet');
        return { delta: {}, gamma: {}, theta: {}, vega: {}, rho: {} };
    });

    ipcMain.handle('calculate-portfolio-greeks', async () => {
        console.warn('⚠️ Portfolio Greeks not implemented yet');
        return { totalDelta: 0, totalGamma: 0, totalTheta: 0, totalVega: 0 };
    });

    ipcMain.handle('detect-oi-spurts', async () => {
        console.warn('⚠️ OI spurts detection not implemented yet');
        return [];
    });

    console.log('✅ All IPC handlers registered');
}

// ============================================================================
// APP LIFECYCLE
// ============================================================================

app.on('ready', async () => {
    console.log('🚀 Electron app ready');
    console.log(`📁 App path: ${app.getAppPath()}`);
    console.log(`🌍 Environment: ${isDevelopment ? 'development' : 'production'}`);

    try {
        console.log('🔌 Testing database connection...');
        const symbols = await getAvailableSymbols();
        console.log(`✅ Database connected. Found ${symbols.length} symbols`);
    } catch (error: any) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Stack:', error.stack);
    }

    registerIpcHandlers();
    createWindow();
});

app.on('window-all-closed', () => {
    console.log('🛑 All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    console.log('🔄 App activated');
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    console.log('👋 App quitting...');
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled rejection:', reason);
});

console.log('✅ Electron main process initialized');

```

## File: server\src\logger.ts
```ts
// server/src/logger.ts
export function info(...args: any[]) {
    console.log("[INFO]", ...args);
}

export function error(...args: any[]) {
    console.error("[ERROR]", ...args);
}

export function warn(...args: any[]) {
    console.warn("[WARN]", ...args);
}

export function debug(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
        console.log("[DEBUG]", ...args);
    }
}

```

## File: server\src\main.js
```js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const {
  playbackStep,
  getAvailableSymbols,
  getAvailableDates,
  getExpiriesByDate,
} = require('./services/db.service');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:3000');
  console.log('🪟 Electron window created');
}

app.whenReady().then(() => {
  createWindow();
  console.log('✅ Electron app ready');
});

ipcMain.handle('get-symbols', async () => getAvailableSymbols());

ipcMain.handle('get-dates', async (_, params) =>
  getAvailableDates(params.symbol)
);

ipcMain.handle('get-expiries-by-date', async (_, params) =>
  getExpiriesByDate(params.symbol, params.tradeDate)
);

ipcMain.handle('playback-step', async (_, params) =>
  playbackStep(params)
);

```

## File: server\src\preload.js
```js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSymbols: () => ipcRenderer.invoke('get-symbols'),
  getDates: (params) => ipcRenderer.invoke('get-dates', params),
  getExpiriesByDate: (params) =>
    ipcRenderer.invoke('get-expiries-by-date', params),
  playbackStep: (params) =>
    ipcRenderer.invoke('playback-step', params),
});

```

## File: server\src\preload.ts
```ts

import { contextBridge, ipcRenderer } from 'electron';

const api = {
  getInstruments: () => ipcRenderer.invoke('get-instruments'),
  getDates: (symbol: string) => ipcRenderer.invoke('get-dates', symbol),
  getExpiries: (params: any) => ipcRenderer.invoke('get-expiries', params),
  getTimestamps: (params: any) => ipcRenderer.invoke('get-timestamps', params),
  getSnapshot: (params: any) => ipcRenderer.invoke('get-snapshot', params),
};

contextBridge.exposeInMainWorld('api', api);

declare global {
  interface Window {
    api: typeof api;
  }
}

```

## File: server\src\types.ts
```ts
// server/src/types.ts
export interface OptionRow {
    strike_price: number;
    ce_oi: number | null;
    ce_change_oi: number | null;
    ce_ltp: number | string | null;
    pe_oi: number | null;
    pe_change_oi: number | null;
    pe_ltp: number | string | null;
    underlying_value: string | number;
}

```

## File: server\src\errors\dbErrors.ts
```ts
// server/src/errors/dbErrors.ts
export function translatePgError(err: any) {
    if (!err || !err.code) return { status: 500, message: "Unknown database error" };
    switch (err.code) {
        case "23505":
            return { status: 409, message: "Unique constraint violated", detail: err.detail };
        case "23503":
            return { status: 400, message: "Invalid reference (foreign key)", detail: err.detail };
        case "57P01":
            return { status: 503, message: "Database not available" };
        default:
            return { status: 500, message: "Database error", code: err.code, detail: err.detail };
    }
}

```

## File: server\src\ipc\index.ts
```ts
// ============================================================================
// IPC HANDLERS - Modular Version with Field Transformation
// ============================================================================

import { ipcMain } from 'electron';

import {
  getAvailableSymbols,
  getAvailableDates,
  getExpiriesByDate,
  getAvailableTimestamps,
  getSnapshot,
  getStrikeTimeline
} from '../services/db.service';

import { calculateMaxPain } from '../services/analytics.service';

// ============================================================================
// SAFE HANDLER WRAPPER
// ============================================================================

function safeHandle(channel: string, handler: (...args: any[]) => Promise<any>) {
  ipcMain.handle(channel, async (_event, ...args) => {
    const startTime = Date.now();
    try {
      console.log(`📡 IPC [${channel}]:`, JSON.stringify(args).slice(0, 150));
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      const count = Array.isArray(result) ? result.length : 'N/A';
      console.log(`✅ IPC [${channel}]: ${count} items in ${duration}ms`);
      return result;
    } catch (error: any) {
      console.error(`❌ IPC [${channel}] Error:`, error.message || error);
      throw new Error(error.message || 'Unknown error occurred');
    }
  });
}

// ============================================================================
// FIELD TRANSFORMER - Converts snake_case DB fields to camelCase
// ============================================================================

function transformFieldNames(row: any): any {
  return {
    strikePrice: row.strike_price,
    optionType: row.option_type,
    openInterest: row.open_interest,
    oiChange: row.oi_change,
    lastPrice: row.last_price,
    openPrice: row.open_price,
    highPrice: row.high_price,
    lowPrice: row.low_price,
    closePrev: row.close_prev,
    change: row.change,
    pctChange: row.pct_change,
    volume: row.volume,
    volumeChange: row.volume_change,
    totalTradedVolume: row.total_traded_volume,
    oiPctChange: row.oi_pct_change,
    bidPrice: row.bid_price,
    askPrice: row.ask_price,
    bidQty: row.bid_qty,
    askQty: row.ask_qty,
    totalBuyQty: row.total_buy_qty,
    totalSellQty: row.total_sell_qty,
    impliedVolatility: row.implied_volatility,
    delta: row.delta,
    gamma: row.gamma,
    theta: row.theta,
    vega: row.vega,
    underlyingValue: row.underlying_value,
    timestamp: row.time || row.timestamp,
    expiryDate: row.expiry_date
  };
}

// ============================================================================
// REGISTER ALL IPC HANDLERS
// ============================================================================

export function registerIpcHandlers() {
  console.log('🔌 Registering IPC handlers...');

  // Get all instruments
  safeHandle('get-instruments', async () => {
    return await getAvailableSymbols();
  });

  // Get dates for symbol
  safeHandle('get-dates', async (symbol: string) => {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol parameter');
    }
    return await getAvailableDates(symbol);
  });

  // Get expiries
  safeHandle('get-expiries', async (params: any) => {
    if (!params || !params.symbol || !params.tradingdate) {
      throw new Error('Missing required parameters: symbol and tradingdate');
    }
    return await getExpiriesByDate(params.symbol, params.tradingdate);
  });

  // Get timestamps
  safeHandle('get-timestamps', async (params: any) => {
    if (!params || !params.symbol || !params.date || !params.expiry) {
      throw new Error('Missing required parameters: symbol, date, and expiry');
    }
    return await getAvailableTimestamps(params.symbol, params.date, params.expiry);
  });

  // Get snapshot - WITH FIELD TRANSFORMATION ✅
  safeHandle('get-snapshot', async (params: any) => {
    if (!params || !params.symbol || !params.expiry || !params.timestamp) {
      throw new Error('Missing required parameters: symbol, expiry, and timestamp');
    }

    const rawData = await getSnapshot(params.symbol, params.expiry, new Date(params.timestamp));

    // ✅ Transform snake_case to camelCase for frontend
    const transformedData = rawData.map(transformFieldNames);

    console.log(`🔄 Transformed ${transformedData.length} rows to camelCase`);
    if (transformedData.length > 0) {
      console.log('📊 Sample transformed row:', {
        strikePrice: transformedData[0].strikePrice,
        optionType: transformedData[0].optionType,
        openInterest: transformedData[0].openInterest,
        oiChange: transformedData[0].oiChange
      });
    }

    return transformedData;
  });

  // Get strike timeline - WITH FIELD TRANSFORMATION ✅
  safeHandle('get-strike-timeline', async (params: any) => {
    if (!params || !params.symbol || !params.strike || !params.optionType || !params.date || !params.expiry) {
      throw new Error('Missing required parameters');
    }

    const rawData = await getStrikeTimeline(
      params.symbol,
      params.strike,
      params.optionType,
      params.date,
      params.expiry
    );

    // ✅ Transform fields
    return rawData.map(transformFieldNames);
  });

  // Calculate max pain
  safeHandle('calculate-max-pain', async (chainData: any[]) => {
    if (!Array.isArray(chainData)) {
      throw new Error('Chain data must be an array');
    }
    return calculateMaxPain(chainData);
  });

  // Placeholder handlers
  ipcMain.handle('calculate-greeks', async () => {
    console.warn('⚠️ Greeks calculation not implemented yet');
    return { delta: {}, gamma: {}, theta: {}, vega: {}, rho: {} };
  });

  ipcMain.handle('calculate-portfolio-greeks', async () => {
    console.warn('⚠️ Portfolio Greeks not implemented yet');
    return { totalDelta: 0, totalGamma: 0, totalTheta: 0, totalVega: 0 };
  });

  ipcMain.handle('detect-oi-spurts', async () => {
    console.warn('⚠️ OI spurts detection not implemented yet');
    return [];
  });

  console.log('✅ IPC handlers registered');
}

```

## File: server\src\services\analytics.service.ts
```ts
// ============================================================================
// ANALYTICS SERVICE - NSE OPTIONS PLATFORM
// ============================================================================
// Provides analytical calculations for options data
// Max Pain, Greeks, OI Analysis, etc.
// ============================================================================

/**
 * Calculate Max Pain - The strike price where option writers would lose the least money
 * @param chainData Array of option chain data with strikes and OI
 * @returns Max Pain strike price
 */
export function calculateMaxPain(chainData: any[]): number {
  if (!Array.isArray(chainData) || chainData.length === 0) {
    console.warn('⚠️  calculateMaxPain: Empty or invalid chain data');
    return 0;
  }

  // Extract unique strike prices
  const strikes = [...new Set(chainData.map(row => row.strike_price))].sort((a, b) => a - b);

  if (strikes.length === 0) {
    console.warn('⚠️  calculateMaxPain: No strikes found');
    return 0;
  }

  console.log(`📊 Calculating Max Pain for ${strikes.length} strikes`);

  let minPain = Infinity;
  let maxPainStrike = strikes[0];

  // For each strike, calculate total pain
  for (const testStrike of strikes) {
    let totalPain = 0;

    // Calculate pain from all strikes
    for (const row of chainData) {
      const strike = row.strike_price;
      const callOI = row.call_oi || 0;
      const putOI = row.put_oi || 0;

      // Call writers lose money if price > strike
      if (testStrike > strike) {
        totalPain += callOI * (testStrike - strike);
      }

      // Put writers lose money if price < strike
      if (testStrike < strike) {
        totalPain += putOI * (strike - testStrike);
      }
    }

    // Track minimum pain
    if (totalPain < minPain) {
      minPain = totalPain;
      maxPainStrike = testStrike;
    }
  }

  console.log(`✅ Max Pain calculated: ${maxPainStrike} (pain: ${minPain.toFixed(2)})`);
  return maxPainStrike;
}

/**
 * Calculate Portfolio Greeks
 * @param positions Array of position objects with quantities and greeks
 * @returns Aggregated portfolio greeks
 */
export function calculatePortfolioGreeks(positions: any[]) {
  if (!Array.isArray(positions) || positions.length === 0) {
    return {
      totalDelta: 0,
      totalGamma: 0,
      totalTheta: 0,
      totalVega: 0,
      totalRho: 0,
      positions: []
    };
  }

  const positionGreeks = positions.map(p => ({
    strike: p.strike,
    quantity: p.quantity || 0,
    delta: (p.quantity || 0) * (p.delta || 0),
    gamma: (p.quantity || 0) * (p.gamma || 0),
    theta: (p.quantity || 0) * (p.theta || 0),
    vega: (p.quantity || 0) * (p.vega || 0),
    rho: (p.quantity || 0) * (p.rho || 0)
  }));

  const totalDelta = positionGreeks.reduce((sum, p) => sum + p.delta, 0);
  const totalGamma = positionGreeks.reduce((sum, p) => sum + p.gamma, 0);
  const totalTheta = positionGreeks.reduce((sum, p) => sum + p.theta, 0);
  const totalVega = positionGreeks.reduce((sum, p) => sum + p.vega, 0);
  const totalRho = positionGreeks.reduce((sum, p) => sum + p.rho, 0);

  console.log(`📊 Portfolio Greeks: Delta=${totalDelta.toFixed(2)}, Gamma=${totalGamma.toFixed(2)}, Theta=${totalTheta.toFixed(2)}`);

  return {
    totalDelta,
    totalGamma,
    totalTheta,
    totalVega,
    totalRho,
    positions: positionGreeks
  };
}

/**
 * Calculate OI Change Percentage
 * @param currentOI Current open interest
 * @param previousOI Previous open interest
 * @returns Percentage change
 */
export function calculateOIChange(currentOI: number, previousOI: number): number {
  if (previousOI === 0) return currentOI > 0 ? 100 : 0;
  return ((currentOI - previousOI) / previousOI) * 100;
}

/**
 * Detect OI Spurts - Significant changes in open interest
 * @param chainData Array of option chain data with OI changes
 * @param threshold Percentage threshold for spurt detection (default 20%)
 * @returns Array of detected spurts
 */
export function detectOISpurts(chainData: any[], threshold: number = 20): any[] {
  if (!Array.isArray(chainData) || chainData.length === 0) {
    return [];
  }

  const spurts = chainData
    .filter(row => {
      const callOIChange = Math.abs(row.call_oi_change_pct || 0);
      const putOIChange = Math.abs(row.put_oi_change_pct || 0);
      return callOIChange >= threshold || putOIChange >= threshold;
    })
    .map(row => ({
      strike: row.strike_price,
      callOI: row.call_oi,
      callOIChange: row.call_oi_change_pct,
      putOI: row.put_oi,
      putOIChange: row.put_oi_change_pct,
      type: Math.abs(row.call_oi_change_pct || 0) >= threshold ? 'CALL' : 'PUT',
      significance: Math.max(
        Math.abs(row.call_oi_change_pct || 0),
        Math.abs(row.put_oi_change_pct || 0)
      )
    }))
    .sort((a, b) => b.significance - a.significance);

  console.log(`🔍 Detected ${spurts.length} OI spurts (threshold: ${threshold}%)`);
  return spurts;
}

/**
 * Calculate Put-Call Ratio
 * @param chainData Array of option chain data
 * @returns PCR object with different calculations
 */
export function calculatePutCallRatio(chainData: any[]): {
  pcrOI: number;
  pcrVolume: number;
  pcrValue: number;
} {
  if (!Array.isArray(chainData) || chainData.length === 0) {
    return { pcrOI: 0, pcrVolume: 0, pcrValue: 0 };
  }

  let totalPutOI = 0;
  let totalCallOI = 0;
  let totalPutVolume = 0;
  let totalCallVolume = 0;
  let totalPutValue = 0;
  let totalCallValue = 0;

  chainData.forEach(row => {
    totalPutOI += row.put_oi || 0;
    totalCallOI += row.call_oi || 0;
    totalPutVolume += row.put_volume || 0;
    totalCallVolume += row.call_volume || 0;
    totalPutValue += (row.put_oi || 0) * (row.put_ltp || 0);
    totalCallValue += (row.call_oi || 0) * (row.call_ltp || 0);
  });

  const pcrOI = totalCallOI > 0 ? totalPutOI / totalCallOI : 0;
  const pcrVolume = totalCallVolume > 0 ? totalPutVolume / totalCallVolume : 0;
  const pcrValue = totalCallValue > 0 ? totalPutValue / totalCallValue : 0;

  console.log(`📊 PCR: OI=${pcrOI.toFixed(2)}, Volume=${pcrVolume.toFixed(2)}, Value=${pcrValue.toFixed(2)}`);

  return { pcrOI, pcrVolume, pcrValue };
}

/**
 * Find support and resistance levels based on OI
 * @param chainData Array of option chain data
 * @param topN Number of top levels to return
 * @returns Object with support and resistance strikes
 */
export function findSupportResistance(chainData: any[], topN: number = 3): {
  support: number[];
  resistance: number[];
} {
  if (!Array.isArray(chainData) || chainData.length === 0) {
    return { support: [], resistance: [] };
  }

  // Sort by Put OI for support (descending)
  const supportStrikes = [...chainData]
    .sort((a, b) => (b.put_oi || 0) - (a.put_oi || 0))
    .slice(0, topN)
    .map(row => row.strike_price)
    .sort((a, b) => a - b);

  // Sort by Call OI for resistance (descending)
  const resistanceStrikes = [...chainData]
    .sort((a, b) => (b.call_oi || 0) - (a.call_oi || 0))
    .slice(0, topN)
    .map(row => row.strike_price)
    .sort((a, b) => a - b);

  console.log(`📊 Support: [${supportStrikes.join(', ')}], Resistance: [${resistanceStrikes.join(', ')}]`);

  return {
    support: supportStrikes,
    resistance: resistanceStrikes
  };
}

/**
 * Calculate ITM/ATM/OTM distribution
 * @param chainData Array of option chain data
 * @param spotPrice Current spot price
 * @returns Distribution object
 */
export function calculateMoneyness(chainData: any[], spotPrice: number): {
  itm: { calls: number; puts: number };
  atm: { calls: number; puts: number };
  otm: { calls: number; puts: number };
} {
  if (!Array.isArray(chainData) || chainData.length === 0 || !spotPrice) {
    return {
      itm: { calls: 0, puts: 0 },
      atm: { calls: 0, puts: 0 },
      otm: { calls: 0, puts: 0 }
    };
  }

  const distribution = chainData.reduce(
    (acc, row) => {
      const strike = row.strike_price;
      const atmRange = spotPrice * 0.02; // 2% range for ATM

      if (Math.abs(strike - spotPrice) <= atmRange) {
        // ATM
        acc.atm.calls += row.call_oi || 0;
        acc.atm.puts += row.put_oi || 0;
      } else if (strike < spotPrice) {
        // ITM Calls, OTM Puts
        acc.itm.calls += row.call_oi || 0;
        acc.otm.puts += row.put_oi || 0;
      } else {
        // OTM Calls, ITM Puts
        acc.otm.calls += row.call_oi || 0;
        acc.itm.puts += row.put_oi || 0;
      }

      return acc;
    },
    {
      itm: { calls: 0, puts: 0 },
      atm: { calls: 0, puts: 0 },
      otm: { calls: 0, puts: 0 }
    }
  );

  console.log(`📊 Moneyness calculated for spot: ${spotPrice}`);
  return distribution;
}

```

## File: server\src\services\db.service.ts
```ts
// ============================================================================
// DATABASE SERVICE - NSE OPTIONS PLATFORM (TIMEZONE-SAFE + DATA VALIDATION)
// ============================================================================

import pkg from 'pg';
const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '1234',
  database: process.env.PGDATABASE || 'options_platform',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

// ============================================================================
// QUERY FUNCTIONS (TIMEZONE-SAFE)
// ============================================================================

/**
 * Get all available instruments/symbols
 */
export async function getAvailableSymbols(): Promise<string[]> {
  const query = `
    SELECT DISTINCT underlying_symbol
    FROM options_data_ht
    ORDER BY underlying_symbol
  `;
  const { rows } = await pool.query(query);
  console.log(`📊 DB: Found ${rows.length} symbols`);
  return rows.map(r => r.underlying_symbol);
}

/**
 * 🔥 Get available trading dates (TIMEZONE-SAFE + FILTERED)
 */
export async function getAvailableDates(symbol: string): Promise<string[]> {
  const query = `
    SELECT 
      time_date,
      TO_CHAR(time_date, 'YYYY-MM-DD') as date_str,
      COUNT(*) as row_count
    FROM options_data_ht
    WHERE underlying_symbol = $1
      AND time_date IS NOT NULL
    GROUP BY time_date
    HAVING COUNT(*) > 1000
    ORDER BY time_date DESC
    LIMIT 200
  `;
  try {
    const { rows } = await pool.query(query, [symbol]);
    const dates = rows.map(r => r.date_str); // 🔥 Use string, not Date object!

    console.log(`📅 DB: Found ${dates.length} trading dates for ${symbol}`);
    if (dates.length > 0) {
      console.log(`📅 DB: Latest: ${dates[0]} (${rows[0]?.row_count?.toLocaleString()} rows)`);
      console.log(`📅 DB: Oldest: ${dates[dates.length - 1]} (${rows[rows.length - 1]?.row_count?.toLocaleString()} rows)`);
    }

    return dates;
  } catch (err: any) {
    console.error('❌ DB Error in getAvailableDates:', err.message);
    throw err;
  }
}

/**
 * 🔥 Get expiries (TIMEZONE-SAFE + FILTER EXPIRED)
 */
export async function getExpiriesByDate(symbol: string, tradingDate: string): Promise<string[]> {
  const query = `
    SELECT DISTINCT 
      expiry_date,
      TO_CHAR(expiry_date, 'YYYY-MM-DD') as expiry_str
    FROM options_data_ht
    WHERE underlying_symbol = $1
      AND time_date = $2::date
      AND expiry_date >= $2::date
    ORDER BY expiry_date ASC
  `;
  try {
    const { rows } = await pool.query(query, [symbol, tradingDate]);
    const expiries = rows.map(r => r.expiry_str); // 🔥 Use string!

    console.log(`📅 DB: Found ${expiries.length} VALID expiries for ${symbol} on ${tradingDate}`);
    console.log(`📅 DB: Expiries:`, expiries);

    return expiries;
  } catch (err: any) {
    console.error('❌ DB Error in getExpiriesByDate:', err.message);
    throw err;
  }
}

/**
 * Get timestamps (return as ISO strings)
 */
export async function getAvailableTimestamps(
  symbol: string,
  date: string,
  expiry: string
): Promise<string[]> {
  const query = `
    SELECT DISTINCT time
    FROM options_data_ht
    WHERE underlying_symbol = $1
      AND time_date = $2::date
      AND expiry_date = $3::date
    ORDER BY time ASC
  `;
  try {
    const { rows } = await pool.query(query, [symbol, date, expiry]);
    const timestamps = rows.map(r => r.time.toISOString());

    console.log(`🕐 DB: Found ${timestamps.length} timestamps for ${symbol} on ${date}, expiry ${expiry}`);
    if (timestamps.length > 0) {
      console.log(`🕐 DB: First: ${timestamps[0]}, Last: ${timestamps[timestamps.length - 1]}`);
    }

    return timestamps;
  } catch (err: any) {
    console.error('❌ DB Error in getAvailableTimestamps:', err.message);
    throw err;
  }
}

/**
 * Get snapshot
 */
export async function getSnapshot(
  symbol: string,
  expiry: string,
  timestamp: Date
): Promise<any[]> {
  const query = `
    SELECT
      strike_price,
      -- Call options (CE)
      MAX(CASE WHEN option_type = 'CE' THEN last_price END) as call_ltp,
      MAX(CASE WHEN option_type = 'CE' THEN open_interest END) as call_oi,
      MAX(CASE WHEN option_type = 'CE' THEN volume END) as call_volume,
      MAX(CASE WHEN option_type = 'CE' THEN implied_volatility END) as call_iv,
      MAX(CASE WHEN option_type = 'CE' THEN delta END) as call_delta,
      MAX(CASE WHEN option_type = 'CE' THEN gamma END) as call_gamma,
      MAX(CASE WHEN option_type = 'CE' THEN theta END) as call_theta,
      MAX(CASE WHEN option_type = 'CE' THEN vega END) as call_vega,
      MAX(CASE WHEN option_type = 'CE' THEN oi_change END) as call_oi_change,
      -- Put options (PE)
      MAX(CASE WHEN option_type = 'PE' THEN last_price END) as put_ltp,
      MAX(CASE WHEN option_type = 'PE' THEN open_interest END) as put_oi,
      MAX(CASE WHEN option_type = 'PE' THEN volume END) as put_volume,
      MAX(CASE WHEN option_type = 'PE' THEN implied_volatility END) as put_iv,
      MAX(CASE WHEN option_type = 'PE' THEN delta END) as put_delta,
      MAX(CASE WHEN option_type = 'PE' THEN gamma END) as put_gamma,
      MAX(CASE WHEN option_type = 'PE' THEN theta END) as put_theta,
      MAX(CASE WHEN option_type = 'PE' THEN vega END) as put_vega,
      MAX(CASE WHEN option_type = 'PE' THEN oi_change END) as put_oi_change,
      -- Underlying
      MAX(underlying_value) as underlying_value
    FROM options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2::date
      AND time = $3
    GROUP BY strike_price
    ORDER BY strike_price ASC
  `;
  try {
    const { rows } = await pool.query(query, [symbol, expiry, timestamp]);
    console.log(`📊 DB: Snapshot for ${symbol} expiry ${expiry} @ ${timestamp.toISOString()}: ${rows.length} strikes`);

    if (rows.length === 0) {
      console.warn(`⚠️ DB: No data found for ${symbol} expiry ${expiry} @ ${timestamp.toISOString()}`);
    }

    return rows;
  } catch (err: any) {
    console.error('❌ DB Error in getSnapshot:', err.message);
    throw err;
  }
}

/**
 * Get strike timeline
 */
export async function getStrikeTimeline(
  symbol: string,
  strike: number,
  optionType: 'CE' | 'PE',
  date: string,
  expiry: string
): Promise<any[]> {
  const query = `
    SELECT
      time as timestamp,
      last_price as ltp,
      open_interest,
      volume,
      bid_price,
      ask_price,
      implied_volatility as iv,
      delta,
      gamma,
      theta,
      vega
    FROM options_data_ht
    WHERE underlying_symbol = $1
      AND strike_price = $2
      AND option_type = $3
      AND time_date = $4::date
      AND expiry_date = $5::date
    ORDER BY time ASC
  `;
  try {
    const { rows } = await pool.query(query, [symbol, strike, optionType, date, expiry]);
    console.log(`📈 DB: Timeline for ${symbol} ${strike}${optionType} on ${date}: ${rows.length} points`);
    return rows;
  } catch (err: any) {
    console.error('❌ DB Error in getStrikeTimeline:', err.message);
    throw err;
  }
}

// Export pool for advanced queries
export { pool };

```

## File: server\src\services\greeks.service.ts
```ts
// server/src/services/greeks.service.ts

interface GreeksData {
    strike: number;
    optionType: 'CE' | 'PE';
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    price: number;
}

export class GreeksService {
    /**
     * Black-Scholes Greeks Calculator
     * No external dependencies - pure TypeScript implementation
     */
    static calculateGreeks(
        spotPrice: number,
        strikePrice: number,
        timeToExpiry: number, // in years (days/365)
        volatility: number, // as decimal (0.20 for 20%)
        riskFreeRate: number = 0.06,
        optionType: 'CE' | 'PE'
    ): GreeksData {
        // Prevent division by zero
        if (timeToExpiry <= 0 || volatility <= 0) {
            return {
                strike: strikePrice,
                optionType,
                delta: 0,
                gamma: 0,
                theta: 0,
                vega: 0,
                rho: 0,
                price: 0
            };
        }

        // Black-Scholes d1 and d2
        const d1 = (Math.log(spotPrice / strikePrice) +
            (riskFreeRate + (volatility ** 2) / 2) * timeToExpiry) /
            (volatility * Math.sqrt(timeToExpiry));

        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        // Standard normal cumulative distribution function
        const N = (x: number): number => {
            const t = 1 / (1 + 0.2316419 * Math.abs(x));
            const d = 0.3989423 * Math.exp(-x * x / 2);
            const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            return x > 0 ? 1 - prob : prob;
        };

        // Standard normal probability density function
        const n = (x: number): number => {
            return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
        };

        let price: number;
        let delta: number;
        let theta: number;
        let rho: number;

        if (optionType === 'CE') {
            // Call option
            price = spotPrice * N(d1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(d2);
            delta = N(d1);
            theta = ((-spotPrice * n(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) -
                riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(d2)) / 365;
            rho = strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * N(d2) / 100;
        } else {
            // Put option
            price = strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2) - spotPrice * N(-d1);
            delta = N(d1) - 1;
            theta = ((-spotPrice * n(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) +
                riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2)) / 365;
            rho = -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * N(-d2) / 100;
        }

        // Gamma and Vega are same for both calls and puts
        const gamma = n(d1) / (spotPrice * volatility * Math.sqrt(timeToExpiry));
        const vega = spotPrice * n(d1) * Math.sqrt(timeToExpiry) / 100;

        return {
            strike: strikePrice,
            optionType,
            delta: parseFloat(delta.toFixed(4)),
            gamma: parseFloat(gamma.toFixed(6)),
            theta: parseFloat(theta.toFixed(4)),
            vega: parseFloat(vega.toFixed(4)),
            rho: parseFloat(rho.toFixed(4)),
            price: parseFloat(price.toFixed(2))
        };
    }

    /**
     * Calculate Greeks for entire option chain
     */
    static calculateChainGreeks(
        spotPrice: number,
        strikes: number[],
        daysToExpiry: number,
        volatility: number = 0.20,
        riskFreeRate: number = 0.06
    ): { calls: GreeksData[], puts: GreeksData[] } {
        const timeToExpiry = daysToExpiry / 365;

        const calls = strikes.map(strike =>
            this.calculateGreeks(spotPrice, strike, timeToExpiry, volatility, riskFreeRate, 'CE')
        );

        const puts = strikes.map(strike =>
            this.calculateGreeks(spotPrice, strike, timeToExpiry, volatility, riskFreeRate, 'PE')
        );

        return { calls, puts };
    }

    /**
     * Calculate portfolio Greeks
     */
    static calculatePortfolioGreeks(positions: Array<{
        strike: number;
        optionType: 'CE' | 'PE';
        quantity: number;
        spotPrice: number;
        daysToExpiry: number;
        volatility: number;
    }>): {
        netDelta: number;
        netGamma: number;
        netTheta: number;
        netVega: number;
    } {
        let netDelta = 0, netGamma = 0, netTheta = 0, netVega = 0;

        for (const pos of positions) {
            const greeks = this.calculateGreeks(
                pos.spotPrice,
                pos.strike,
                pos.daysToExpiry / 365,
                pos.volatility,
                0.06,
                pos.optionType
            );

            netDelta += greeks.delta * pos.quantity;
            netGamma += greeks.gamma * pos.quantity;
            netTheta += greeks.theta * pos.quantity;
            netVega += greeks.vega * pos.quantity;
        }

        return {
            netDelta: parseFloat(netDelta.toFixed(4)),
            netGamma: parseFloat(netGamma.toFixed(6)),
            netTheta: parseFloat(netTheta.toFixed(2)),
            netVega: parseFloat(netVega.toFixed(2))
        };
    }
}

```

## File: server\src\services\oi-analysis.service.ts
```ts
// server/src/services/oi-analysis.service.ts

import { Pool } from 'pg';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface OISpurt {
    strike: number;
    optionType: 'CE' | 'PE';
    currentOI: number;
    previousOI: number;
    oiChange: number;
    oiChangePct: number;
    volume: number;
    timestamp: string;
    significance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MaxPainData {
    strike: number;
    totalPain: number;
    callPain: number;
    putPain: number;
}

// ==========================================
// OI ANALYSIS SERVICE
// ==========================================

export class OIAnalysisService {
    /**
     * Detect OI spurts from database
     * Uses LAG window function to compare with previous timestamp
     */
    static async detectOISpurts(
        pool: Pool,
        symbol: string,
        date: string,
        expiry: string,
        threshold: number = 10
    ): Promise<OISpurt[]> {
        const query = `
      WITH ranked_data AS (
        SELECT
          strike_price,
          option_type,
          time,
          open_interest,
          volume,
          LAG(open_interest, 1) OVER (
            PARTITION BY strike_price, option_type
            ORDER BY time
          ) as prev_oi
        FROM options_data_ht
        WHERE underlying_symbol = $1
          AND COALESCE(time_date, DATE(time)) = $2::date
          AND expiry_date = $3::date
        ORDER BY time DESC
        LIMIT 1000
      )
      SELECT
        strike_price as strike,
        option_type as "optionType",
        open_interest as "currentOI",
        prev_oi as "previousOI",
        (open_interest - prev_oi) as "oiChange",
        ROUND(
          ((open_interest - NULLIF(prev_oi, 0))::numeric / NULLIF(prev_oi, 0)::numeric * 100),
          2
        ) as "oiChangePct",
        volume,
        time as timestamp
      FROM ranked_data
      WHERE prev_oi IS NOT NULL
        AND ABS((open_interest - NULLIF(prev_oi, 0))::numeric / NULLIF(prev_oi, 0)::numeric * 100) >= $4
      ORDER BY ABS((open_interest - prev_oi)::numeric / NULLIF(prev_oi, 0)::numeric) DESC
      LIMIT 30;
    `;

        try {
            const result = await pool.query(query, [symbol, date, expiry, threshold]);

            return result.rows.map((row: any) => ({
                strike: row.strike,
                optionType: row.optionType,
                currentOI: row.currentOI || 0,
                previousOI: row.previousOI || 0,
                oiChange: row.oiChange || 0,
                oiChangePct: parseFloat(row.oiChangePct) || 0,
                volume: row.volume || 0,
                timestamp: row.timestamp,
                significance: this.classifySignificance(
                    Math.abs(parseFloat(row.oiChangePct) || 0),
                    row.volume || 0
                )
            }));
        } catch (err) {
            console.error('❌ OI Spurt detection error:', err);
            return [];
        }
    }

    /**
     * Classify OI change significance based on percentage and volume
     */
    private static classifySignificance(oiChangePct: number, volume: number): 'HIGH' | 'MEDIUM' | 'LOW' {
        if (oiChangePct >= 25 && volume > 10000) return 'HIGH';
        if (oiChangePct >= 15 || volume > 5000) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Calculate Max Pain
     * Strike where option writers have minimum loss
     */
    static calculateMaxPain(chainData: Array<{
        strike: number;
        ceoi: number;
        peoi: number;
    }>): MaxPainData[] {
        const results: MaxPainData[] = [];

        // Test each strike as potential max pain
        for (const testStrike of chainData) {
            let callPain = 0;
            let putPain = 0;

            // Calculate pain if market closes at testStrike
            for (const data of chainData) {
                if (data.strike > testStrike.strike) {
                    // Calls are ITM (in the money)
                    callPain += (data.strike - testStrike.strike) * data.ceoi;
                }

                if (data.strike < testStrike.strike) {
                    // Puts are ITM
                    putPain += (testStrike.strike - data.strike) * data.peoi;
                }
            }

            results.push({
                strike: testStrike.strike,
                totalPain: callPain + putPain,
                callPain,
                putPain
            });
        }

        // Sort by total pain (ascending - lowest pain = max pain strike)
        return results.sort((a, b) => a.totalPain - b.totalPain);
    }

    /**
     * Calculate PCR (Put-Call Ratio) for given chain data
     */
    static calculatePCR(chainData: Array<{
        strike: number;
        ceoi: number;
        peoi: number;
    }>): {
        pcrByOI: number;
        totalCallOI: number;
        totalPutOI: number;
    } {
        let totalCallOI = 0;
        let totalPutOI = 0;

        for (const data of chainData) {
            totalCallOI += data.ceoi || 0;
            totalPutOI += data.peoi || 0;
        }

        const pcrByOI = totalCallOI > 0 ? totalPutOI / totalCallOI : 0;

        return {
            pcrByOI: parseFloat(pcrByOI.toFixed(2)),
            totalCallOI,
            totalPutOI
        };
    }

    /**
     * Identify support and resistance levels based on OI concentration
     */
    static identifySupportResistance(
        chainData: Array<{
            strike: number;
            ceoi: number;
            peoi: number;
        }>,
        spotPrice: number,
        topN: number = 5
    ): {
        support: Array<{ strike: number; putOI: number }>;
        resistance: Array<{ strike: number; callOI: number }>;
    } {
        // Support: Strikes below spot with high PUT OI
        const support = chainData
            .filter(d => d.strike < spotPrice)
            .map(d => ({ strike: d.strike, putOI: d.peoi }))
            .sort((a, b) => b.putOI - a.putOI)
            .slice(0, topN);

        // Resistance: Strikes above spot with high CALL OI
        const resistance = chainData
            .filter(d => d.strike > spotPrice)
            .map(d => ({ strike: d.strike, callOI: d.ceoi }))
            .sort((a, b) => b.callOI - a.callOI)
            .slice(0, topN);

        return { support, resistance };
    }
}

```

## File: server\src\services\oi.service.ts
```ts

export function detectOISpurts(rows:any[], threshold=0.25) {
  return rows.filter(r => Math.abs(r.oi_change) / Math.max(r.open_interest,1) > threshold);
}

```

## File: server\src\utils\validateEnv.ts
```ts
// server/src/utils/validateEnv.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    ELECTRON_START_URL: process.env.ELECTRON_START_URL,
    PGHOST: process.env.PGHOST || "localhost",
    PGPORT: parseInt(process.env.PGPORT || "5432"),
    PGDATABASE: process.env.PGDATABASE || "options_platform",
    PGUSER: process.env.PGUSER || "postgres",
    PGPASSWORD: process.env.PGPASSWORD || "your_password_here",
};

// Validate critical env vars
if (!ENV.PGPASSWORD || ENV.PGPASSWORD === "your_password_here") {
    console.warn("⚠️  WARNING: Using default database password!");
}

```

## File: tests\ipc.test.js
```js

test('dummy test', () => {
  expect(true).toBe(true);
});

```

