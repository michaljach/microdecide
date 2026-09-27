"""`microdecide` command line (docs/SPEC.md §5)."""

from __future__ import annotations

import re
from pathlib import Path

import typer

from microdecide import data
from microdecide.spec import SLUG, SpecError, TaskSpec, load_spec, render_template
from microdecide.teachers import CachedTeacher, TeacherError, make_teacher

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


def _load(spec: Path) -> TaskSpec:
    try:
        return load_spec(spec)
    except SpecError as e:
        _fail(str(e))


def _show(title: str, stats: dict) -> None:
    typer.echo(title)
    for k, v in stats.items():
        typer.echo(f"  {k}: {v}")


RUNS = typer.Option(Path("runs"), help="Root directory for run artifacts")


@app.command()
def check(spec: Path) -> None:
    """Validate a task spec."""
    s = _load(spec)
    typer.echo(f"{spec}: ok — task {s.task!r}, {s.output.type} over {s.labels}")


@app.command()
def collect(spec: Path, runs: Path = RUNS) -> None:
    """Gather inputs (gold, seed, unlabeled, synthetic), dedup → runs/<task>/data/inputs.jsonl."""
    s = _load(spec)
    try:
        stats = data.collect(s, runs)
    except (OSError, ValueError, TeacherError) as e:
        _fail(str(e))
    _show(f"collected → {data.data_dir(s, runs) / 'inputs.jsonl'}", stats)


@app.command()
def label(spec: Path, runs: Path = RUNS) -> None:
    """Label collected inputs with the teacher (cached), split → runs/<task>/data/labeled.jsonl."""
    s = _load(spec)
    try:
        teacher = CachedTeacher(make_teacher(s))
        stats = data.label(s, teacher, runs)
    except (OSError, ValueError, TeacherError) as e:
        _fail(str(e))
    _show(f"labeled → {data.data_dir(s, runs) / 'labeled.jsonl'}", stats)
