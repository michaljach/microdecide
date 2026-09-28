from nodd.spec import TaskSpec
from nodd.teachers.base import Teacher, TeacherError, make_decision
from nodd.teachers.cache import CachedTeacher, DiskCache
from nodd.teachers.csv import CSVTeacher
from nodd.teachers.fake import FakeTeacher
from nodd.teachers.llm import LLMTeacher


def make_teacher(spec: TaskSpec) -> Teacher:
    t = spec.teacher
    if t.kind == "csv":
        return CSVTeacher(t.path)
    if t.kind == "llm":
        return LLMTeacher(t.model)
    raise TeacherError(f"teacher.kind {t.kind!r} is not implemented yet (Jev lands in M7)")


__all__ = [
    "CSVTeacher",
    "CachedTeacher",
    "DiskCache",
    "FakeTeacher",
    "LLMTeacher",
    "Teacher",
    "TeacherError",
    "make_decision",
    "make_teacher",
]
