import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCourses, deleteCourse } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const { hasRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const canDelete = hasRole('ADMIN');

  function load() {
    setLoading(true);
    listCourses().then(setCourses).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Delete this course?')) return;
    await deleteCourse(id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Courses</h1>
        <Link to="/courses/new" className="btn-primary">+ Add course</Link>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Credits</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr><td colSpan={4} className="muted">No courses yet.</td></tr>
            )}
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.credits}</td>
                <td className="row-actions">
                  <Link to={`/courses/${c.id}/edit`}>Edit</Link>
                  {canDelete && (
                    <button className="btn-link danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
