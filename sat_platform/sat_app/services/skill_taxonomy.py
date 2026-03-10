"""Canonical SAT skill taxonomy helpers and utilities."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Sequence


@dataclass(frozen=True)
class SkillDescriptor:
    tag: str
    label: str
    domain: str
    description: str
    order: int


_SKILL_TAXONOMY: List[SkillDescriptor] = [
    SkillDescriptor(
        tag="RW_InformationIdeas",
        label="Reading & Writing · Information & Ideas",
        domain="Reading & Writing",
        description="Understand passage meaning, infer viewpoints, find textual evidence, and interpret data.",
        order=10,
    ),
    SkillDescriptor(
        tag="RW_CraftStructure",
        label="Reading & Writing · Craft & Structure",
        domain="Reading & Writing",
        description="Analyze text structure, point of view, and how specific choices shape meaning.",
        order=20,
    ),
    SkillDescriptor(
        tag="RW_ExpressionOfIdeas",
        label="Reading & Writing · Expression of Ideas",
        domain="Reading & Writing",
        description="Revise text for precision, organization, cohesion, and rhetorical effectiveness.",
        order=30,
    ),
    SkillDescriptor(
        tag="RW_StandardEnglishConventions",
        label="Reading & Writing · Standard English Conventions",
        domain="Reading & Writing",
        description="Apply grammar, usage, agreement, and punctuation conventions.",
        order=40,
    ),
    SkillDescriptor(
        tag="M_Algebra",
        label="Math · Algebra",
        domain="Math",
        description="Create, interpret, and solve linear expressions and equations.",
        order=110,
    ),
    SkillDescriptor(
        tag="M_AdvancedMath",
        label="Math · Advanced Math",
        domain="Math",
        description="Manipulate nonlinear expressions, functions, and equations.",
        order=120,
    ),
    SkillDescriptor(
        tag="M_ProblemSolvingData",
        label="Math · Problem Solving & Data",
        domain="Math",
        description="Model real-world situations, analyze ratios/proportions, and interpret statistics.",
        order=130,
    ),
    SkillDescriptor(
        tag="M_GeometryTrigonometry",
        label="Math · Geometry & Trigonometry",
        domain="Math",
        description="Solve geometry and trigonometry problems involving shapes, circles, area/volume, coordinates, and trig ratios.",
        order=140,
    ),
]

SKILL_ORDERED_TAGS: Sequence[str] = tuple(entry.tag for entry in sorted(_SKILL_TAXONOMY, key=lambda entry: entry.order))
_SKILL_LOOKUP: Dict[str, SkillDescriptor] = {entry.tag: entry for entry in _SKILL_TAXONOMY}
_SKILL_LOWER_LOOKUP: Dict[str, str] = {entry.tag.lower(): entry.tag for entry in _SKILL_TAXONOMY}

_SKILL_SYNONYMS: Dict[str, str] = {
    # Legacy canonical tags
    "rw_mainidea": "RW_InformationIdeas",
    "rw_detailevidence": "RW_InformationIdeas",
    "rw_wordsincontext": "RW_CraftStructure",
    "rw_textstructure": "RW_CraftStructure",
    "rw_expressionofideas": "RW_ExpressionOfIdeas",
    "rw_standardenglish": "RW_StandardEnglishConventions",
    "rw_datainterpretation": "RW_InformationIdeas",
    "rw_informationideas": "RW_InformationIdeas",
    "rw_standardenglishconventions": "RW_StandardEnglishConventions",
    "m_algebra": "M_Algebra",
    "m_advancedmath": "M_AdvancedMath",
    "m_problemsolving": "M_ProblemSolvingData",
    "m_dataanalysis": "M_ProblemSolvingData",
    "m_geometry": "M_GeometryTrigonometry",
    "m_trigonometry": "M_GeometryTrigonometry",
    "m_geometrytrigonometry": "M_GeometryTrigonometry",
    # Free-form tags observed in legacy data
    "main-idea": "RW_InformationIdeas",
    "main idea": "RW_InformationIdeas",
    "reading-comprehension": "RW_InformationIdeas",
    "reading comprehension": "RW_InformationIdeas",
    "detail-evidence": "RW_InformationIdeas",
    "inference": "RW_InformationIdeas",
    "evidence": "RW_InformationIdeas",
    "data interpretation": "RW_InformationIdeas",
    "context-clues": "RW_CraftStructure",
    "contextual-vocabulary": "RW_CraftStructure",
    "vocabulary-in-context": "RW_CraftStructure",
    "vocabulary": "RW_CraftStructure",
    "literary-text": "RW_CraftStructure",
    "literary-fiction": "RW_CraftStructure",
    "precision": "RW_ExpressionOfIdeas",
    "rw_grammar": "RW_StandardEnglishConventions",
    "grammar": "RW_StandardEnglishConventions",
    "rw_grammarusage": "RW_StandardEnglishConventions",
    "science": "RW_InformationIdeas",
    "table-reading": "RW_InformationIdeas",
    "data-analysis": "RW_InformationIdeas",
    "vision": "RW_InformationIdeas",
    "rw_data": "RW_InformationIdeas",
    "m_statistics": "M_ProblemSolvingData",
    "algebra": "M_Algebra",
    "advanced math": "M_AdvancedMath",
    "advanced-math": "M_AdvancedMath",
    "problem solving": "M_ProblemSolvingData",
    "problem-solving": "M_ProblemSolvingData",
    "data analysis": "M_ProblemSolvingData",
    "geometry": "M_GeometryTrigonometry",
    "trigonometry": "M_GeometryTrigonometry",
    "geometry & trigonometry": "M_GeometryTrigonometry",
}


def iter_skill_tags() -> Sequence[str]:
    """Return canonical tags in display order."""
    return SKILL_ORDERED_TAGS


def describe_skill(tag: str) -> dict:
    descriptor = _SKILL_LOOKUP.get(tag)
    if descriptor is None:
        canonical = canonicalize_tag(tag)
        if canonical:
            descriptor = _SKILL_LOOKUP.get(canonical)
    if descriptor:
        return {
            "tag": descriptor.tag,
            "label": descriptor.label,
            "domain": descriptor.domain,
            "description": descriptor.description,
            "order": descriptor.order,
        }
    return {
        "tag": tag,
        "label": tag,
        "domain": "General",
        "description": "",
        "order": 999,
    }


def canonicalize_tag(value: str | None) -> str | None:
    if not value or not isinstance(value, str):
        return None
    normalized = value.strip()
    if not normalized:
        return None
    lowered = normalized.lower()
    if lowered in _SKILL_SYNONYMS:
        return _SKILL_SYNONYMS[lowered]
    return _SKILL_LOWER_LOOKUP.get(lowered)


def canonicalize_tags(values: Iterable[str] | None, *, limit: int | None = 2) -> List[str]:
    normalized: List[str] = []
    if not values:
        return normalized
    for raw in values:
        canonical = canonicalize_tag(raw)
        if canonical and canonical not in normalized:
            normalized.append(canonical)
            if limit is not None and len(normalized) >= limit:
                break
    return normalized


def infer_section_from_tag(tag: str) -> str:
    descriptor = _SKILL_LOOKUP.get(tag)
    if descriptor is None:
        canonical = canonicalize_tag(tag)
        if canonical:
            descriptor = _SKILL_LOOKUP.get(canonical)
    if descriptor:
        return "RW" if descriptor.domain == "Reading & Writing" else "Math"
    return "RW" if tag.lower().startswith("rw") else "Math"


