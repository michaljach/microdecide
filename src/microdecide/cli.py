"""`microdecide` command line (docs/SPEC.md §5)."""

from __future__ import annotations

import re
from pathlib import Path

import typer

from microdecide.spec import SLUG, SpecError, load_spec, render_template

app = typer.Typer(no_args_is_help=True, add_completion=False)


def _fail(msg: str) -> None:
    typer.secho(msg, fg=typer.colors.RED, err=True)
    raise typer.Exit(1)


@app.callback()
def main() -> None:
    """Turn a task spec into a tiny, calibrated, browser-runnable classifier."""


@app.command()
def init(
    task: str,
    out: Path = typer.Option(None, help="Output path (default: <task>.yaml)"),
    force: bool = typer.Option(False, help="Overwrite an existing file"),
) -> None:
    """Scaffold a task spec YAML."""
    if not re.match(SLUG, task):
        _fail(f"task {task!r} must match {SLUG} (lowercase letters, digits, _ or -)")
    out = out or Path(f"{task}.yaml")
    if out.exists() and not force:
        _fail(f"{out} already exists (use --force to overwrite)")
    out.write_text(render_template(task))
    typer.echo(f"wrote {out}")


@app.command()
def check(spec: Path) -> None:
    """Validate a task spec."""
    try:
        s = load_spec(spec)
    except SpecError as e:
        _fail(str(e))
    typer.echo(f"{spec}: ok — task {s.task!r}, {s.output.type} over {s.labels}")
