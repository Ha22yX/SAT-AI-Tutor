from __future__ import annotations

from sat_app.services.ai_explainer import (
    _prepare_responses_payload as _prepare_explainer_payload,
)
from sat_app.services.pdf_ingest_service import _prepare_responses_payload


def test_prepare_responses_payload_removes_temperature_for_gpt5_models() -> None:
    payload = {
        "model": "gpt-5.6-sol",
        "input": [{"role": "user", "content": [{"type": "input_text", "text": "hi"}]}],
        "temperature": 0.1,
    }

    prepared = _prepare_responses_payload(payload)

    assert "temperature" not in prepared
    assert "temperature" in payload


def test_prepare_responses_payload_keeps_temperature_for_legacy_models() -> None:
    payload = {
        "model": "gpt-4.1",
        "input": [{"role": "user", "content": [{"type": "input_text", "text": "hi"}]}],
        "temperature": 0.1,
    }

    prepared = _prepare_responses_payload(payload)

    assert prepared["temperature"] == 0.1


def test_ai_explainer_payload_removes_temperature_for_gpt5_models() -> None:
    payload = {
        "model": "gpt-5.6-sol",
        "input": [{"role": "user", "content": [{"type": "input_text", "text": "hi"}]}],
        "temperature": 0.2,
    }

    prepared = _prepare_explainer_payload(payload)

    assert "temperature" not in prepared
