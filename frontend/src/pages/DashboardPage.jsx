import { useEffect, useState } from "react";

import api from "../api/client.js";
import useAuth from "../hooks/useAuth.js";

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      if (isAdmin) {
        const [usersResponse, issuedResponse] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/issued-books"),
        ]);

        setUsers(usersResponse.data);
        setIssuedBooks(issuedResponse.data);
      } else {
        const { data } = await api.get("/borrows/history");
        setHistory(data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [isAdmin]);

  const activeBorrows = history.filter((record) => record.status === "issued");

  const handleAdminReturn = async (recordId) => {
    try {
      await api.patch(`/admin/issued-books/${recordId}/return`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update borrow record");
    }
  };

  return (
    <main className="page-shell">
      <section className="container page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user?.name}</h1>
          <p>
            {isAdmin
              ? "Monitor users, issued books, and collection activity."
              : "Track your borrow history and current issues in one place."}
          </p>
        </div>
      </section>

      {error && (
        <section className="container">
          <p className="form-error">{error}</p>
        </section>
      )}

      {isAdmin ? (
        <section className="container dashboard-grid">
          <article className="dashboard-card">
            <h2>Users</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((account) => (
                    <tr key={account._id}>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>{account.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="dashboard-card">
            <h2>Issued Books</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((record) => (
                    <tr key={record._id}>
                      <td>{record.book?.title || "Deleted book"}</td>
                      <td>{record.user?.name || "Unknown user"}</td>
                      <td>{record.status}</td>
                      <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                      <td>
                        {record.status === "issued" ? (
                          <button
                            className="ghost-button"
                            onClick={() => handleAdminReturn(record._id)}
                          >
                            Mark Returned
                          </button>
                        ) : (
                          "Closed"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : (
        <section className="container dashboard-grid">
          <article className="dashboard-card stats-card">
            <span>Active borrows</span>
            <strong>{activeBorrows.length}</strong>
          </article>

          <article className="dashboard-card">
            <h2>Borrow History</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Issued</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id}>
                      <td>{record.book?.title || "Deleted book"}</td>
                      <td>{new Date(record.issuedAt).toLocaleDateString()}</td>
                      <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      )}
    </main>
  );
};

export default DashboardPage;
