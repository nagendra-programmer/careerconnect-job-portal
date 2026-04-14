import {useState,useEffect} from 'react'
import {ThreeDots} from 'react-loader-spinner'
import Cookies from 'js-cookie' 

import Header from '../Header'; 
import SavedJobCard  from '../SavedJobCard';

import Popup from 'reactjs-popup';

import './index.css'; 

const apiStatusContants={
    success:'SUCCESS',
    failure:'FAILURE',
    loading:'LOADING',
    initial:'INITIAL'
}

const Saved=(props)=>{

    const[apiStatus,setApiStatus]=useState(apiStatusContants.initial); 
    const[jobsList,setJobsList]=useState([]); 

    

     const getSavedJobs= async ()=>{
        setApiStatus(apiStatusContants.loading); 

        const jwtToken=Cookies.get('jwt_token')

        const url="https://careerconnect-backend-gx9j.onrender.com/saved-jobs"; 
        const options={
            method:'GET',
            headers:{
                Authorization:`Bearer ${jwtToken}`
            }
        }

        try{
            const response=await fetch(url,options); 
            if(response.ok){
                const data=await response.json(); 
                setJobsList(data.jobs); 
                console.log(data); 
                setApiStatus(apiStatusContants.success)

            }
            else{
                setApiStatus(apiStatusContants.failure)
            }

        }
        catch(err){
            setApiStatus(apiStatusContants.failure); 
        }
    }


    useEffect(()=>{
     getSavedJobs(); 
    },[]);

    const onRetry=()=>{
        getSavedJobs(); 
    }

    const onExploreJobs=()=>{
        const {history}=props 
        history.push('/jobs')
    }

    const updateJobsListOnDelete=(id)=>{
        setJobsList(prevJobs =>
            prevJobs.filter(job => job.id !== id)
        );
    }

    const onClearSavedJobs=async ()=>{
        const url='https://careerconnect-backend-gx9j.onrender.com/saved-jobs/'; 

        const options={
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${jwtToken}`
            }
        }

        const response=await fetch(url,options); 
        if(response.ok){
            setJobsList([]); 
        }
        
    }

    const ClearPopup = () => (
        <Popup
            trigger={
            <button className="clear-saved-jobs-button">
                Clear
            </button>
            }
            modal
            position="center center"
            overlayStyle={{ backdropFilter: "blur(6px)" }} 
        >
            {close => (
            <div className="popup-container">
                <p>Are you sure you want to delete all saved jobs?</p>

                <div className="popup-buttons">
                <button
                    onClick={() => {
                    close();
                    }}
                    className="cancel-btn"
                >
                    No
                </button>

                <button
                    onClick={() => {
                    onClearSavedJobs();
                    close();
                    }}
                    className="confirm-btn"
                >
                    Yes
                </button>
                </div>
            </div>
            )}
        </Popup>
    );

    const successView=()=>{
        if (jobsList.length === 0) {
            return (
                <div className="empty-saved-container">
                    <div className="empty-card">
                        <h2>No Saved Jobs</h2>
                        <p>You haven't saved any jobs yet.</p>
                        
                        <button className="explore-btn" onClick={onExploreJobs}>
                        Explore Jobs
                        </button>
                    </div>
                </div>
            )
        }
        else{
           return (
                <>
                    <div className="saved-jobs-count-bar">
                    <p className="saved-jobs-label">Saved Jobs:</p>

                    <span className="saved-jobs-count">
                        {jobsList.length}
                    </span>

                    <ClearPopup />
                    </div>

                    <ul className="saved-jobs-list">
                    {jobsList.map(each => (
                        <SavedJobCard data={each} key={each.id} updateJobsListOnDelete={updateJobsListOnDelete} />
                    ))}
                    </ul>
                </>
            )
        }
    }

    const failureView=()=>{
        return(
            <div className="saved-jobs-page-server-error-msg-container">
                <h1>Internal server Error</h1>
                <button type="button" onClick={onRetry}>Try again</button>
            </div>
        )
    }

    const loadingView=()=>{
        return (
            <div className="saved-jobs-loader">
                <ThreeDots
                    height="50"
                    width="50"
                    color="#ffffff"
                    visible={true}
                />
            </div>
        )
    }

    const renderSwitch=()=>{
        switch(apiStatus){
            case apiStatusContants.success:
                return successView(); 
            case apiStatusContants.failure:
                return failureView(); 
            case apiStatusContants.loading:
                return loadingView(); 
            default:
                return null; 
        }
    }

    return (
       <div className="saved-jobs-main-container">
         <Header />
         
         <div className="saved-jobs-container" > 
                {renderSwitch()}
         </div>
       </div>
    )

}

export default Saved; 
