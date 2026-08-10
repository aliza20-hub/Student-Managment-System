import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, createStudent, updateStudent } from '../api/studentApi';
import { listCourses } from '../api/courseApi';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', enrolledCourseIds: [] };

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    listCourses().then(setCourses).catch(() => setCourses([]));
    if (isEdit) {
      getStudent(id).then((s) => {
        setForm({ ...s, enrolledCourseIds: s.enrolledCourseIds || [] });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCourse(courseId) {
    setForm((f) => {
      const set = new Set(f.enrolledCourseIds);
      set.has(courseId) ? set.delete(courseId) : set.add(courseId);
      return { ...f, enrolledCourseIds: Array.from(set) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, enrolledCourseIds: form.enrolledCourseIds };
      if (isEdit) {
        await updateStudent(id, payload);
      } else {
        await createStudent(payload);
      }
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save student.');
    }
  }

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit student' : 'Add student'}</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="error-banner">{error}</div>}

        <div className="form-row">
          <div>
            <label>First name</label>
            <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
          </div>
          <div>
            <label>Last name</label>
            <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
          </div>
        </div>

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />

        <div className="form-row">
          <div>
            <label>Phone</label>
            <input value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <label>Date of birth</label>
            <input type="date" value={form.dateOfBirth || ''} onChange={(e) => update('dateOfBirth', e.target.value)} />
          </div>
        </div>

        <label>Courses</label>
        <div className="checkbox-list">
          {courses.length === 0 && <p className="muted">No courses yet — add one first.</p>}
          {courses.map((c) => (
            <label key={c.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={form.enrolledCourseIds.includes(c.id)}
                onChange={() => toggleCourse(c.id)}
              />
              {c.code} — {c.name}
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">Save</button>
          <button className="btn-secondary" type="button" onClick={() => navigate('/students')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
