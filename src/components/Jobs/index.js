import {Component} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobCard from '../JobCard'
import ProfileCard from '../ProfileCard'

import {employmentTypesList, salaryRangesList} from '../../constants'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentTypes: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {employmentTypes} = this.state
    const {value, checked} = event.target

    if (checked) {
      this.setState(
        {employmentTypes: [...employmentTypes, value]},
        this.getJobs,
      )
    } else {
      const updatedList = employmentTypes.filter(each => each !== value)
      this.setState({employmentTypes: updatedList}, this.getJobs)
    }
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {searchInput, employmentTypes, salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentTypeString = employmentTypes.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedJobs = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        location: each.location,
        employmentType: each.employment_type,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobsList: updatedJobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots
        height="50"
        width="50"
        color="#ffffff"
        visible={true}
      />
    </div>
  )

  renderProfileSection = () => {
    const {profileApiStatus, profileDetails} = this.state

    if (profileApiStatus === apiStatusConstants.inProgress) {
      return this.renderLoader()
    }

    if (profileApiStatus === apiStatusConstants.failure) {
      return (
        <button type="button" onClick={this.getProfileDetails}>
          Retry
        </button>
      )
    }

    if (profileApiStatus === apiStatusConstants.success) {
      return <ProfileCard profileDetails={profileDetails} />
    }

    return null
  }

  renderJobsList = () => {
    const {jobsApiStatus, jobsList} = this.state

    if (jobsApiStatus === apiStatusConstants.inProgress) {
      return this.renderLoader()
    }

    if (jobsApiStatus === apiStatusConstants.failure) {
      return (
        <div className="failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button type="button" onClick={this.getJobs}>
            Retry
          </button>
        </div>
      )
    }

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(each => (
          <JobCard key={each.id} jobDetails={each} />
        ))}
      </ul>
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="sidebar">
            {this.renderProfileSection()}

            <hr />

            <h1 className="filter-heading">Type of Employment</h1>
            <ul className="filters-list">
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <hr />

            <h1 className="filter-heading">Salary Range</h1>
            <ul className="filters-list">
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-content">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <AiOutlineSearch />
              </button>
            </div>

            {this.renderJobsList()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
