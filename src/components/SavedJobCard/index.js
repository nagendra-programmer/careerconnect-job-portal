import {Link} from 'react-router-dom'
import {FaTrash,FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import Cookies from 'js-cookie'; 

import './index.css'

const SavedJobCard = props => {
  const {data,updateJobsListOnDelete} = props

  const {
    id,
    title,
    rating,
    company_logo_url,
    location,
    employment_type,
    package_per_annum,
    job_description,
  } = data

  
  const onDeleteSavedJob=()=>{
    updateJobsListOnDelete(id); 
  }

  const handleDelete=async(id)=>{
    const jwtToken=Cookies.get('jwt_token'); 

    const url=`https://careerconnect-backend-gx9j.onrender.com/saved-jobs/${id}`; 

    const options={
      method:'DELETE',
      headers:{
        Authorization:`Bearer ${jwtToken}`
      }
    }
   
    const response=await fetch(url,options); 
    if(response.ok){
      onDeleteSavedJob();  
    }
  
  }

 return (
  <li className="saved-job-card">

    <div className="saved-job-header">

      {/* LEFT SIDE (Clickable) */}
      <Link to={`/jobs/${id}`} className="saved-job-link header-link">
        <img
          src={company_logo_url}
          alt="company logo"
          className="saved-job-logo"
        />

        <div>
          <h1 className="saved-job-title">{title}</h1>
          <div className="saved-job-rating">
            <FaStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </Link>

      {/* RIGHT SIDE DELETE BUTTON */}
      <button
        className="delete-btn"
        title="Remove Job"
        onClick={() => handleDelete(id)}
      >
        <FaTrash />
      </button>

    </div>

    {/* REST CLICKABLE AREA */}
    <Link to={`/jobs/${id}`} className="saved-job-link">
      <div className="saved-job-details">
        <div className="saved-job-info">
          <div className="icon-text">
            <FaMapMarkerAlt />
            <p>{location}</p>
          </div>
          <div className="icon-text">
            <FaBriefcase />
            <p>{employment_type}</p>
          </div>
        </div>

        <p className="saved-job-salary">
          {package_per_annum} LPA
        </p>
      </div>

      <hr />

      <h3>Description</h3>
      <p className="saved-job-description">{job_description}</p>
    </Link>

  </li>
)
}

export default SavedJobCard