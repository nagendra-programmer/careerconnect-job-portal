import {Link} from 'react-router-dom'
import {FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'

import './index.css'

const AppliedJobCard = props => {
const {data} = props

const {
id,
title,
location,
employment_type,
package_per_annum,
company_logo_url   
} = data

return ( <li className="applied-job-card">
<Link to={`/jobs/${id}`} className="applied-job-link">


    {/* HEADER WITH LOGO */}
    <div className="applied-header">
      <img
        src={company_logo_url}
        alt="company logo"
        className="applied-logo"
      />

      <h2 className="applied-title">{title}</h2>
    </div>

    {/* DETAILS */}
    <div className="applied-details">
      <div className="icon-text">
        <FaMapMarkerAlt />
        <p>{location}</p>
      </div>

      <div className="icon-text">
        <FaBriefcase />
        <p>{employment_type}</p>
      </div>

      <p className="applied-salary">
        {package_per_annum} LPA
      </p>
    </div>

  </Link>
</li>


)
}

export default AppliedJobCard
