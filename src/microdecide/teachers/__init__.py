from microdecide.spec import TaskSpec
from microdecide.teachers.base import Teacher, TeacherError, make_decision
from microdecide.teachers.cache import CachedTeacher, DiskCache
from microdecide.teachers.csv import CSVTeacher
from microdecide.teachers.fake import FakeTeacher
from microdecide.teachers.llm import LLMTeacher


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
