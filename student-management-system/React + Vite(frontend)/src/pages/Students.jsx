import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listStudents, deleteStudent } from '../api/studentApi';
import { useAuth } from '../context/AuthContext';

export default function Students() {
  const { hasRole } = useAuth();
  const [data, setData] = useState({ content: [], page: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const canDelete = hasRole('ADMIN');

  async function load(page = 0, searchTerm = search) {
    setLoading(true);
    try {
      const result = await listStudents(page, 10, searchTerm);
      setData(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(0, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(0, search);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student?')) return;
    await deleteStudent(id);
    load(data.page, search);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Students</h1>
        <Link to="/students/new" className="btn-primary">+ Add student</Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary" type="submit">Search</button>
      </form>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Courses</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.length === 0 && (
                <tr><td colSpan={5} className="muted">No students found.</td></tr>
              )}
              {data.content.map((s) => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || '—'}</td>
                  <td>{s.enrolledCourseIds?.length || 0}</td>
                  <td className="row-actions">
                    <Link to={`/students/${s.id}/edit`}>Edit</Link>
                    {canDelete && (
                      <button className="btn-link danger" onClick={() => handleDelete(s.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={data.page <= 0} onClick={() => load(data.page - 1, search)}>Prev</button>
            <span>Page {data.page + 1} of {Math.max(data.totalPages, 1)}</span>
            <button disabled={data.last} onClick={() => load(data.page + 1, search)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
