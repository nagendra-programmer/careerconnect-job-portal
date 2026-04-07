import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import AppliedJobCard from '../AppliedJobCard'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  initial: 'INITIAL',
}

const Applied = () => {
  const [jobs, setJobs] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getAppliedJobs = async () => {
    setApiStatus(apiStatusConstants.loading)

    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(
        'https://careerconnect-backend-gx9j.onrender.com/apply/jobs',
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (err) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getAppliedJobs()
  }, [])

  const onRetry = () => {
    getAppliedJobs()
  }

  // SUCCESS VIEW
  const successView = () => {
    if (jobs.length === 0) {
        return (
          <div className="empty-applied-container">
            <div className="empty-card">
              <h2>No Applied Jobs</h2>
              <p>You haven't applied to any jobs yet.</p>

              <button
                className="explore-btn"
                onClick={() => (window.location.href = '/jobs')}
              >
                Explore Jobs
              </button>
            </div>
          </div>
        )
      }
    

    return (
      <ul className="applied-list">
        {jobs.map(job => (
          <AppliedJobCard key={job.id} data={job} />
        ))}
      </ul>
    )
  }

  //  LOADING VIEW
  const loadingView = () => (
    <div className="empty-applied">
      <h2>Loading...</h2>
    </div>
  )

  //  FAILURE VIEW
  const failureView = () => (
    <div className="empty-applied">
      <h2>Something went wrong</h2>
      <button className="retry-btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  )

  // SWITCH
  const renderSwitch = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return successView()
      case apiStatusConstants.failure:
        return failureView()
      case apiStatusConstants.loading:
        return loadingView()
      default:
        return null
    }
  }

 return (
  <div className="applied-main-container">
    <Header />

    <div className="applied-container">
      <div className="applied-count-bar">
        <p className="applied-label">Applied Jobs:</p>
        <span className="applied-count">{jobs.length}</span>
      </div>

      {renderSwitch()}
    </div>
  </div>
)
}

export default Applied