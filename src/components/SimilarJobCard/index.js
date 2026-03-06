import {FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <div className="similar-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-logo"
        />
        <div>
          <h1 className="similar-title">{title}</h1>
          <div className="rating-container">
            <FaStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="description-heading">Description</h1>
      <p>{jobDescription}</p>

      <div className="similar-footer">
        <div className="icon-text">
          <FaMapMarkerAlt />
          <p>{location}</p>
        </div>
        <div className="icon-text">
          <FaBriefcase />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
