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


@app.command()
def train(
    spec: Path,
    runs: Path = RUNS,
    tier: str = typer.Option(None, help="static | encoder | decoder | auto (default: spec's model.tier)"),
) -> None:
    """Train a model version from runs/<task>/data/labeled.jsonl → runs/<task>/vN/."""
    from microdecide.train import train as train_model

    s = _load(spec)
    try:
        out = train_model(s, runs, tier)
    except (OSError, ValueError, NotImplementedError) as e:
        _fail(str(e))
    typer.echo(str(out))


@app.command("eval")
def eval_(run_dir: Path) -> None:
    """Evaluate a trained version on its test split → report.md + report.json."""
    from microdecide.evaluate import evaluate

    if not (run_dir / "model_card.json").is_file():
        _fail(f"{run_dir} is not a run directory (no model_card.json)")
    _summary(evaluate(run_dir))


def _summary(r: dict) -> None:
    t, e = r["test"], r["escalation"]
    typer.echo(
        f"{r['model']}: macro F1 {t['macro_f1']:.3f}, accuracy {t['accuracy']:.1%}, "
        f"coverage {e['coverage']:.1%} @ threshold {e['threshold']:.3f} "
        f"({e['accuracy_on_covered'] or 0:.1%} accurate), {r['size_mb']} MB, "
        f"p95 {r['latency']['p95_ms']:.2f} ms"
    )
    for rec in r["recommendations"]:
        typer.secho(f"  ! {rec}", fg=typer.colors.YELLOW)


@app.command()
def export(
    run_dir: Path,
    out: Path = typer.Option(None, help="Output folder (default: <run_dir>/export)"),
) -> None:
    """Export a trained version for the browser (static JS + ONNX) with a parity check."""
    from microdecide.export import ExportError
    from microdecide.export import export as export_model

    if not (run_dir / "model_card.json").is_file():
        _fail(f"{run_dir} is not a run directory (no model_card.json)")
    try:
        export_model(run_dir, out)
    except (ExportError, NotImplementedError) as e:
        _fail(str(e))


@app.command("export-base")
def export_base_(
    base: str = typer.Argument(..., help="model2vec static model id, e.g. minishlab/potion-base-8M"),
    out: Path = typer.Option(None, help="Output folder (default: web/public/bases/<name>)"),
) -> None:
    """Export a static embedding base (no head) for training in the browser playground."""
    from microdecide.export import export_base

    export_base(base, out or Path("web/public/bases") / base.split("/")[-1])


@app.command("compare")
def compare_(run_dirs: list[Path], out: Path = typer.Option(None, help="Write markdown here (default: runs/<task>/compare.md)")) -> None:
    """Compare model versions on the same test split (quality, coverage, size, latency)."""
    from microdecide.compare import compare

    for d in run_dirs:
        if not (d / "model_card.json").is_file():
            _fail(f"{d} is not a run directory (no model_card.json)")
    md, summary = compare(run_dirs)
    out = out or run_dirs[0].parent / "compare.md"
    out.write_text(md)
    typer.echo(md)
    typer.echo(f"→ {out}")
    if not summary["same_test_split"]:
        typer.secho("! test splits differ between versions", fg=typer.colors.YELLOW)


@app.command()
def run(spec: Path, runs: Path = RUNS, tier: str = typer.Option(None, help="Override model.tier")) -> None:
    """Full pipeline: collect → label → train → eval → export."""
    import time

    from microdecide.evaluate import evaluate
    from microdecide.export import ExportError
    from microdecide.export import export as export_model
    from microdecide.train import train as train_model

    s = _load(spec)
    t0 = time.perf_counter()
    try:
        _show("collect", data.collect(s, runs))
        _show("label", data.label(s, CachedTeacher(make_teacher(s)), runs, log=lambda _: None))
        out = train_model(s, runs, tier)
        report = evaluate(out)
        export_model(out)
    except (OSError, ValueError, TeacherError, NotImplementedError, ExportError) as e:
        _fail(str(e))
    _summary(report)
    typer.echo(f"done in {time.perf_counter() - t0:.1f}s → {out / 'report.md'}")
