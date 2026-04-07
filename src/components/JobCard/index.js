import {Link} from 'react-router-dom'
import {FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import { TbBadge,TbBadgeFilled  } from "react-icons/tb";
import {useState,useEffect} from 'react' 
import Cookies from 'js-cookie'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails
  
  const lpa=parseInt(packagePerAnnum); 

  const emptyBadge=<TbBadge className="empty-badge" />
  const filledBadge=<TbBadgeFilled className='badge-filled' />

  const [isSaved,setIsSaved]=useState(false); 
  const [apiMessage,setApiMessage]=useState(''); 

  const saveIcon=isSaved ? filledBadge:emptyBadge

  const jwtToken = Cookies.get('jwt_token') 

  const onSaveJob=async ()=>{
    const url=`https://careerconnect-backend-gx9j.onrender.com/save-job/${id}`
    const options={
       method:'POST',
       headers:{
        'Content-Type':'application/json',
        Authorization: `Bearer ${jwtToken}`
       }
    };

    try{
      const response=await fetch(url,options)
      if(response.ok){
        setIsSaved(prevState=>!prevState); 

        const data=await response.json(); 
        setApiMessage(data.msg); 
        
      }
      else{
        const data=await response.json(); 
        const {err_msg}=data; 
        setApiMessage(err_msg); 
        
      }
    }
    catch(err){
      setApiMessage("Internal Server Error")
    }
  }

useEffect(()=>{
   
   if(apiMessage){
    const intervalId=setTimeout(()=>{
      setApiMessage('')
    },1000)
    return ()=>clearTimeout(intervalId); 
  }
  
},[apiMessage])

useEffect(() => {
  const jobSavedStatus = async () => {
    const url = `https://careerconnect-backend-gx9j.onrender.com/save-job/is-job-saved/${id}`;

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.job_status);
      } else {
        setIsSaved(false);
      }
    } catch (err) {
      setIsSaved(false);
    }
  };

  jobSavedStatus();
  }, [id, jwtToken]);
  return (   

    <li className="job-card">
  
      <div className="job-header">
        <Link to={`/jobs/${id}`} className="job-link job-header-link">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <FaStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </Link>

        <button onClick={onSaveJob} className="save-job-icon-container"  title={isSaved ? "Unsave Job" : "Save Job"}>
          {saveIcon}
        </button>
      </div>

     <div className="job-save-message-container">
      <p className="job-save-status-message">
          {apiMessage}
      </p>
    </div>

      <Link to={`/jobs/${id}`} className="job-link">
        <div className="job-details">
          <div className="location-employment">
            <div className="icon-text">
              <FaMapMarkerAlt />
              <p>{location}</p>
            </div>
            <div className="icon-text">
              <FaBriefcase />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{lpa} LPA</p>
        </div>

        <hr />

        <h1>Description</h1>
        <p>{jobDescription}</p>
      </Link>

    </li>
  )
}

export default JobCard  



