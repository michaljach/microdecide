from pathlib import Path

import pytest
import yaml
from typer.testing import CliRunner

from nodd.cli import app
from nodd.spec import Decision, SpecError, load_spec, parse_spec, render_template

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / "examples" / "comment_moderation.yaml"


def example_raw() -> dict:
    return yaml.safe_load(EXAMPLE.read_text())


def parse(raw: dict):
    return parse_spec(yaml.safe_dump(raw, sort_keys=False))


def test_example_spec_loads():
    s = load_spec(EXAMPLE)
    assert s.task == "comment_moderation"
    assert s.labels == ["ok", "spam", "toxic"]
    assert s.model.tier == "encoder"
    assert s.targets.min_macro_f1 == 0.90


def test_missing_file():
    with pytest.raises(SpecError, match="file not found"):
        load_spec(ROOT / "nope.yaml")


def test_no_labels():
    raw = example_raw()
    raw["output"]["labels"] = {}
    with pytest.raises(SpecError, match=r"output\.labels: choice output needs at least 2 labels"):
        parse(raw)


def test_missing_labels_field():
    raw = example_raw()
    del raw["output"]["labels"]
    with pytest.raises(SpecError, match=r"output\.labels: Field required"):
        parse(raw)


def test_duplicate_label_key_in_yaml():
    text = EXAMPLE.read_text().replace("    toxic:", "    spam:")
    with pytest.raises(SpecError, match="duplicate key 'spam' at line"):
        parse_spec(text)


def test_duplicate_label_case_insensitive():
    raw = example_raw()
    raw["output"]["labels"]["SPAM"] = "shouting spam"
    with pytest.raises(SpecError, match="duplicate label 'SPAM'"):
        parse(raw)


def test_unknown_output_type():
    raw = example_raw()
    raw["output"]["type"] = "regression"
    with pytest.raises(SpecError, match=r"output\.type: Input should be 'choice' or 'boolean'"):
        parse(raw)


def test_unknown_tier():
    raw = example_raw()
    raw["model"]["tier"] = "huge"
    with pytest.raises(SpecError, match=r"model\.tier: Input should be"):
        parse(raw)


def test_unknown_field_rejected():
    raw = example_raw()
    raw["targets"]["min_f1"] = 0.9
    with pytest.raises(SpecError, match=r"targets\.min_f1: Extra inputs"):
        parse(raw)


def test_label_needs_description():
    raw = example_raw()
    raw["output"]["labels"]["ok"] = "  "
    with pytest.raises(SpecError, match="label 'ok' needs a description"):
        parse(raw)


def test_boolean_labels_from_yaml_keys():
    text = render_template("t").replace("type: choice", "type: boolean")
    text = text.replace("label_a:", "true:").replace("label_b:", "false:")
    assert parse_spec(text).labels == ["true", "false"]


def test_boolean_needs_true_false():
    raw = example_raw()
    raw["output"]["type"] = "boolean"
    with pytest.raises(SpecError, match="exactly labels 'true' and 'false'"):
        parse(raw)


def test_yes_no_labels_stay_strings():
    text = render_template("t").replace("label_a:", "yes:").replace("label_b:", "no:")
    assert parse_spec(text).labels == ["yes", "no"]


def test_bad_task_slug():
    raw = example_raw()
    raw["task"] = "Comment Moderation"
    with pytest.raises(SpecError, match=r"task: String should match pattern"):
        parse(raw)


def test_csv_teacher_needs_path():
    raw = example_raw()
    raw["teacher"] = {"kind": "csv"}
    with pytest.raises(SpecError, match="needs teacher.path"):
        parse(raw)


def test_not_a_mapping():
    with pytest.raises(SpecError, match="mapping at the top level"):
        parse_spec("- a\n- b\n")


def test_template_is_valid():
    s = parse_spec(render_template("my_task"))
    assert s.task == "my_task"


# --- Decision ---


def decision(**kw):
    base = dict(
        label="spam",
        probabilities={"ok": 0.04, "spam": 0.93, "toxic": 0.03},
        confidence=0.93,
        source="micro",
        model="comment_moderation@v3",
        latency_ms=0.4,
    )
    return Decision(**(base | kw))


def test_decision_valid_and_in_spec():
    s = load_spec(EXAMPLE)
    d = s.check_decision(decision())
    assert d.escalated is False


def test_decision_label_outside_spec():
    s = load_spec(EXAMPLE)
    d = decision(label="meh", probabilities={"ok": 0.5, "meh": 0.5})
    with pytest.raises(ValueError, match="don't match spec labels"):
        s.check_decision(d)


def test_decision_probabilities_must_sum_to_one():
    with pytest.raises(ValueError, match="sum to 1"):
        decision(probabilities={"ok": 0.5, "spam": 0.93, "toxic": 0.03})


def test_decision_label_must_be_in_probabilities():
    with pytest.raises(ValueError, match="not in probabilities"):
        decision(label="other")


# --- CLI ---


def test_cli_init_writes_valid_spec(tmp_path):
    out = tmp_path / "my_task.yaml"
    r = CliRunner().invoke(app, ["init", "my_task", "--out", str(out)])
    assert r.exit_code == 0, r.output
    assert load_spec(out).task == "my_task"


def test_cli_init_refuses_overwrite(tmp_path):
    out = tmp_path / "t.yaml"
    out.write_text("keep me")
    r = CliRunner().invoke(app, ["init", "t", "--out", str(out)])
    assert r.exit_code == 1
    assert out.read_text() == "keep me"


def test_cli_init_rejects_bad_slug(tmp_path):
    r = CliRunner().invoke(app, ["init", "Bad Name", "--out", str(tmp_path / "x.yaml")])
    assert r.exit_code == 1


def test_cli_check(tmp_path):
    r = CliRunner().invoke(app, ["check", str(EXAMPLE)])
    assert r.exit_code == 0 and "ok" in r.output
    bad = tmp_path / "bad.yaml"
    bad.write_text(EXAMPLE.read_text().replace("tier: encoder", "tier: huge"))
    r = CliRunner().invoke(app, ["check", str(bad)])
    assert r.exit_code == 1
    assert "model.tier" in r.output
