import {Component} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import {
FaStar,
FaMapMarkerAlt,
FaBriefcase,
FaExternalLinkAlt,
} from 'react-icons/fa'

import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'

import './index.css'

const apiStatusConstants = {
initial: 'INITIAL',
success: 'SUCCESS',
failure: 'FAILURE',
inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
state = {
jobDetails: {},
similarJobs: [],
apiStatus: apiStatusConstants.initial,
isApplied: false,
}

componentDidMount() {
this.getJobDetails()
this.checkAppliedStatus()
}

//  CHECK APPLY STATUS
checkAppliedStatus = async () => {
const jwtToken = Cookies.get('jwt_token')
const {match} = this.props
const {id} = match.params


const response = await fetch(
  `https://careerconnect-backend-gx9j.onrender.com/apply/status/${id}`,
  {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  },
)

if (response.ok) {
  const data = await response.json()
  this.setState({isApplied: data.applied})
}


}

//  APPLY JOB
applyJob = async () => {
const jwtToken = Cookies.get('jwt_token')
const {match} = this.props
const {id} = match.params


const response = await fetch(
  `https://careerconnect-backend-gx9j.onrender.com/apply/${id}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  },
)

if (response.ok) {
  this.setState({isApplied: true})
}


}

// GET JOB DETAILS
getJobDetails = async () => {
this.setState({apiStatus: apiStatusConstants.inProgress})


const jwtToken = Cookies.get('jwt_token')
const {match} = this.props
const {id} = match.params

const url = `https://careerconnect-backend-gx9j.onrender.com/jobs/${id}`

const options = {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  method: 'GET',
}

const response = await fetch(url, options)

if (response.ok) {
  const data = await response.json()

  const updatedJobDetails = {
    id: data.job_details.id,
    title: data.job_details.title,
    rating: data.job_details.rating,
    companyLogoUrl: data.job_details.company_logo_url,
    location: data.job_details.location,
    employmentType: data.job_details.employment_type,
    packagePerAnnum: data.job_details.package_per_annum,
    jobDescription: data.job_details.job_description,
    skills: data.job_details.skills,
    lifeAtCompany: data.job_details.life_at_company,
    companyUrl: data.job_details.company_website_url,
  }

  const updatedSimilarJobs = data.similar_jobs.map(each => ({
    id: each.id,
    title: each.title,
    rating: each.rating,
    companyLogoUrl: each.company_logo_url,
    location: each.location,
    employmentType: each.employment_type,
    jobDescription: each.job_description,
  }))

  this.setState({
    jobDetails: updatedJobDetails,
    similarJobs: updatedSimilarJobs,
    apiStatus: apiStatusConstants.success,
  })
} else {
  this.setState({apiStatus: apiStatusConstants.failure})
}


}

//  LOADER
renderLoader = () => ( <div className="loader-container"> <ThreeDots height="50" width="50" color="#ffffff" /> </div>
)

// FAILURE
renderFailureView = () => ( <div className="failure-container"> <h1>Something went wrong</h1> <button onClick={this.getJobDetails}>Retry</button> </div>
)

// MAIN UI
renderJobDetails = () => {
const {jobDetails, similarJobs, isApplied} = this.state


return (
  <div className="job-details-container">
    <div className="job-main-card">

      <div className="apply-btn-container">
        <button
          className="apply-btn"
          onClick={this.applyJob}
          disabled={isApplied}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </button>
      </div>

      {/* HEADER */}
      <div className="job-header">
        <img
          src={jobDetails.companyLogoUrl}
          alt="job details company logo"
          className="company-logo"
        />
        <div>
          <h1>{jobDetails.title}</h1>
          <div className="rating-container">
            <FaStar className="star-icon" />
            <p>{jobDetails.rating}</p>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="job-info">
        <div className="icon-text">
          <FaMapMarkerAlt />
          <p>{jobDetails.location}</p>
        </div>
        <div className="icon-text">
          <FaBriefcase />
          <p>{jobDetails.employmentType}</p>
        </div>
        <p>{jobDetails.packagePerAnnum}</p>
      </div>

      <hr />

      {/* DESCRIPTION */}
      <div className="description-visit">
        <h1>Description</h1>
        <a
          href={jobDetails.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-link"
        >
          Visit <FaExternalLinkAlt />
        </a>
      </div>

      <p>{jobDetails.jobDescription}</p>

      {/* SKILLS */}
      <h1>Skills</h1>
      <ul className="skills-list">
        {jobDetails.skills?.map(each => (
          <li key={each.name} className="skill-item">
            <img src={each.image_url} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>

      {/* LIFE AT COMPANY */}
      <h1>Life at Company</h1>
      <div className="life-at-company">
        <p>{jobDetails.lifeAtCompany?.description}</p>
        <img
          src={jobDetails.lifeAtCompany?.image_url}
          alt="life at company"
        />
      </div>
    </div>

    {/* SIMILAR JOBS */}
    <h1 className="similar-heading">Similar Jobs</h1>
    <ul className="similar-jobs-list">
      {similarJobs.map(each => (
        <SimilarJobCard key={each.id} jobDetails={each} />
      ))}
    </ul>
  </div>
)


}

render() {
const {apiStatus} = this.state


return (
  <>
    <Header />
    <div className="job-details-page">

      {apiStatus === apiStatusConstants.inProgress &&
        this.renderLoader()}

      {apiStatus === apiStatusConstants.failure &&
        this.renderFailureView()}

      {apiStatus === apiStatusConstants.success &&
        this.renderJobDetails()}

    </div>
  </>
)


}
}

export default JobItemDetails
