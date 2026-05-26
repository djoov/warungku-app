import React, { useEffect, useState } from 'react'
import './Users.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Users = ({ url, token }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(url + "/api/user/list", { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (e) {
            toast.error("Error fetching users (Unauthorized?)");
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='users-page add'>
            <div className="users-header">
                <h3>Daftar Pengguna</h3>
                <div className="users-stats">
                    <span className="stat-badge">{users.length} pengguna terdaftar</span>
                </div>
            </div>

            <div className="users-search">
                <input 
                    type="text" 
                    placeholder="🔍 Cari nama atau email..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <h3>Tidak ada pengguna</h3>
                    <p>{search ? 'Hasil pencarian tidak ditemukan.' : 'Belum ada pengguna yang terdaftar.'}</p>
                </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Tipe Akun</th>
                                <th>Keranjang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="user-number">{index + 1}</td>
                                    <td className="user-name">
                                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                        {user.name}
                                    </td>
                                    <td className="user-email">{user.email}</td>
                                    <td>
                                        <span className={`account-badge ${user.isSSO ? 'sso' : 'email'}`}>
                                            {user.isSSO ? '🔗 Google' : '📧 Email'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`cart-badge ${user.cartItemCount > 0 ? 'active' : ''}`}>
                                            {user.cartItemCount > 0 ? `${user.cartItemCount} item` : 'Kosong'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Users
