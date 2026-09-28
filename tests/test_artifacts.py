import json
import subprocess
import sys

import pytest
from pydantic import ValidationError

from nodd.artifacts import ModelCard
from nodd.runtime import Runtime


def test_model_card_rejects_incompatible_versions_and_label_order(spec):
    card = dict(model="test@v1", tier="encoder", labels=spec.labels, temperature=1, threshold=0.9, spec=spec)
    assert ModelCard.model_validate(card).artifact_version == 1  # legacy cards remain loadable
    with pytest.raises(ValidationError, match="artifact_version"):
        ModelCard.model_validate({**card, "artifact_version": 2})
    with pytest.raises(ValidationError, match="label order"):
        ModelCard.model_validate({**card, "labels": list(reversed(spec.labels))})


def test_runtime_validates_card_before_loading_weights(tmp_path):
    (tmp_path / "model_card.json").write_text(json.dumps({"tier": "encoder", "temperature": -1}))
    with pytest.raises(ValidationError, match="temperature"):
        Runtime.load(tmp_path)


def test_runtime_does_not_import_training():
    subprocess.run([sys.executable, "-c", "import sys; import nodd.runtime; assert 'nodd.train' not in sys.modules"], check=True)
