"""Research AI Backend Application Package."""

import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent.parent
_project_root = _backend_dir.parent
_agents_dir = _project_root / "agents"

for _p in [str(_backend_dir), str(_project_root), str(_agents_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)
