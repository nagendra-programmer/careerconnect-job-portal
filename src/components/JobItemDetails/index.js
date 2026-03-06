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
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
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

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <ThreeDots
        height="50"
        width="50"
        color="#ffffff"
        visible={true}
      />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <div className="job-details-container">
        <div className="job-main-card">
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

          <h1>Skills</h1>
          <ul className="skills-list">
            {jobDetails.skills.map(each => (
              <li key={each.name} className="skill-item">
                <img src={each.image_url} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div className="life-at-company">
            <p>{jobDetails.lifeAtCompany.description}</p>
            <img
              src={jobDetails.lifeAtCompany.image_url}
              alt="life at company"
            />
          </div>
        </div>

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
          {apiStatus === apiStatusConstants.inProgress && this.renderLoader()}

          {apiStatus === apiStatusConstants.failure && this.renderFailureView()}

          {apiStatus === apiStatusConstants.success && this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
