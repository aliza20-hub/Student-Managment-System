import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourse, createCourse, updateCourse } from '../api/courseApi';

const EMPTY = { code: '', name: '', description: '', credits: 3, teacherId: '' };

export default function CourseForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getCourse(id).then((c) => {
        setForm(c);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        await updateCourse(id, form);
      } else {
        await createCourse(form);
      }
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save course.');
    }
  }

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit course' : 'Add course'}</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="error-banner">{error}</div>}

        <div className="form-row">
          <div>
            <label>Code</label>
            <input value={form.code} onChange={(e) => update('code', e.target.value)} required placeholder="e.g. CS101" />
          </div>
          <div>
            <label>Credits</label>
            <input type="number" min="0" value={form.credits} onChange={(e) => update('credits', Number(e.target.value))} required />
          </div>
        </div>

        <label>Name</label>
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required />

        <label>Description</label>
        <textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} rows={4} />

        <label>Teacher ID (optional)</label>
        <input value={form.teacherId || ''} onChange={(e) => update('teacherId', e.target.value)} placeholder="User id of the teacher" />

        <div className="form-actions">
          <button className="btn-primary" type="submit">Save</button>
          <button className="btn-secondary" type="button" onClick={() => navigate('/courses')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
