import {FaUser} from 'react-icons/fa'
import './index.css'

const ProfileCard = props => {
  const {profileDetails} = props
  const {userName, email} = profileDetails

  return (
    <div className="profile-card">
      <div className="profle-image-container">
        <FaUser className="profile-icon" />
      </div>

      <h1 className="user-name">{userName}</h1>
      <p className="user-email">{email}</p>
    </div>
  )
}

export default ProfileCard