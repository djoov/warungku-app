import React, { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Profile = () => {
  const { url, token, userProfile, setUserProfile } = useContext(StoreContext);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.name) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPreviewUrl(userProfile.avatarUrl || "");
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${url}/api/user/profile/update`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Profil berhasil diperbarui!");
        // Update context with new data
        setUserProfile(prev => ({
          ...prev,
          name: response.data.data.name || prev.name,
          avatarUrl: response.data.data.avatarUrl || prev.avatarUrl
        }));
        setImage(false); // reset image file
      } else {
        toast.error(response.data.message || "Gagal memperbarui profil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='profile-page'>
      <div className="profile-container">
        <h2>Profil Pengguna</h2>
        <p className="profile-subtitle">Kelola informasi pribadi Anda</p>

        <form onSubmit={onSubmitHandler} className="profile-form">
          <div className="profile-avatar-section">
            <label htmlFor="avatar-upload" className="avatar-label">
              <div className="avatar-preview">
                <img 
                  src={previewUrl ? previewUrl : assets.profile_icon} 
                  alt="Profile Avatar" 
                />
                <div className="avatar-overlay">
                  <span>📷 Ubah</span>
                </div>
              </div>
            </label>
            <input 
              type="file" 
              id="avatar-upload" 
              accept="image/*" 
              onChange={handleImageChange} 
              hidden 
            />
            <p className="avatar-hint">Klik gambar untuk mengubah foto profil (Max 2MB)</p>
          </div>

          <div className="profile-fields">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                disabled 
                title="Email tidak dapat diubah"
              />
            </div>

            <button type="submit" className="profile-submit-btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile;
