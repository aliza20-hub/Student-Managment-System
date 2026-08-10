import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listStudents } from '../api/studentApi';
import { listCourses } from '../api/courseApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [studentCount, setStudentCount] = useState(null);
  const [courseCount, setCourseCount] = useState(null);

  useEffect(() => {
    listStudents(0, 1).then((data) => setStudentCount(data.totalElements)).catch(() => setStudentCount('—'));
    listCourses().then((data) => setCourseCount(data.length)).catch(() => setCourseCount('—'));
  }, []);

  return (
    <div className="page">
      <h1>Welcome, {user?.username}</h1>
      <p className="muted">Role: {user?.roles?.join(', ')}</p>

      <div className="stat-grid">
        <Link to="/students" className="stat-card">
          <span className="stat-number">{studentCount ?? '…'}</span>
          <span className="stat-label">Students</span>
        </Link>
        <Link to="/courses" className="stat-card">
          <span className="stat-number">{courseCount ?? '…'}</span>
          <span className="stat-label">Courses</span>
        </Link>
      </div>
    </div>
  );
}
