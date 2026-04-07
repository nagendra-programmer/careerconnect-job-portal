import {useState} from 'react' 
import {ThreeDots} from 'react-loader-spinner' 
import  './index.css'


const apiStatusConstants={
    initial:'INITIAL',
    loading:'LOADING',
    failure:'FAILURE'
};

const Register=(props)=>{

    const [fname,setFname]=useState(''); 
    const [fnameErrMsg,setFnameErrMsg]=useState(false)

    const [lname,setLname]=useState('')
    const [lnameErrMsg,setLnameErrMsg]=useState(false)

    const [uname,setUname]=useState('')
    const [unameErrMsg,setUnameErrMsg]=useState(false)

    const [email,setEmail]=useState('')
    const[emailErrMsg,setEmailErrMsg]=useState('') 

    const [password,setPassword]=useState('')
    const[passwordErrMsg,setPasswordErrMsg]=useState('') 

    const [confirmPassword,setConfirmPassword]=useState('')
    const[confirmPasswordErrMsg,setConfirmPasswordErrMsg]=useState('')

    const [apiStatus,setApiStatus]=useState({apiState:apiStatusConstants.initial,serverErrMsg:''})

    const onChangeFname=(event)=>{
        setFname(event.target.value); 
    }

    const onChangeLname=(event)=>{
        setLname(event.target.value); 
    }

    const onChangeUname=(event)=>{
        setUname(event.target.value); 
    }

    const onChangeEmail=(event)=>{
        setEmail(event.target.value); 
    }

    const onChangePassword=(event)=>{
        setPassword(event.target.value); 
    }

    const onChangeConfirmPassword=(event)=>{
        setConfirmPassword(event.target.value); 
    }

    
    const onFormSubmit= async (event)=>{
        event.preventDefault() 

        let hasError=false; 
        
        if(fname===''){
            setFnameErrMsg(true); 
            hasError=true; 
        }
        else{
            setFnameErrMsg(false); 
        }

        if(lname===''){
            setLnameErrMsg(true); 
            hasError=true; 
        }
        else{
            setLnameErrMsg(false); 
        }

        if(uname===''){
            setUnameErrMsg(true);
            hasError=true; 
        }
        else{
            setUnameErrMsg(false); 
        }

        if(email===''){
            setEmailErrMsg('Email can not be empty');
            hasError=true; 
        }
        else if(email.startsWith('@')|| !email.includes('@')|| !email.includes('.')){
            setEmailErrMsg('Enter a valid email')
            hasError=true; 
        }
        else{
            setEmailErrMsg(''); 
        }

        if(password===''){
            setPasswordErrMsg('Password can not be empty');
            hasError=true; 
        }
        else if(password.length<8){
            setPasswordErrMsg('Password should have atleast 8 characters')
            hasError=true; 
        }
        else{
            setPasswordErrMsg(''); 
            
        }

        if(confirmPassword===''){
            setConfirmPasswordErrMsg('Confirm Password can not be empty');
            hasError=true; 
        }
        else if(password!==confirmPassword){
            setConfirmPasswordErrMsg('Password and Confirm Password should be same')
            hasError=true; 
        }
        else{
            setConfirmPasswordErrMsg(""); 
        }

        if(hasError){
            return
        }
        else{
            //make api call 
            setApiStatus({apiState:apiStatusConstants.loading,serverErrMsg:''})

            const userDetails={
                fName:fname,
                lName:lname,
                username:uname,
                email:email,
                password:password
            }

            const url="https://careerconnect-backend-gx9j.onrender.com/auth/register";
            const options={
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(userDetails)

            };

            try{

            const response=await fetch(url,options);

            if(response.ok){
                const {history}=props; 
                history.replace('/register-success'); 
            }
            else{
                const data=await response.json(); 
                const errMsg=data.err_msg || "Something went wrong"; 
                setApiStatus({apiState:apiStatusConstants.failure,serverErrMsg:errMsg})
            }
            }
            catch(err){
                setApiStatus({apiState:apiStatusConstants.failure,serverErrMsg:'Internal server error'})
            }
        
        }
    }

    const loadingView=()=>{
        return(
            <div className="register-loader">
                <ThreeDots height="50" width="50" color="blue" />
            </div>
        )

    }

  
    const formView=()=>{
         return(
            <div className="register-page-main-container">
                <div className="register-page-logo-container">
                    <img
                    src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                    alt="website logo"
                    className="register-logo"
                    />
                </div>
                <form onSubmit={onFormSubmit} className="register-form">
                    <div className="register-input-fields-container">
                        <label className="register-page-label" htmlFor="firstName">First Name</label>
                        <input className="register-input-field" type="text" id="firstName" value={fname} placeholder="First Name" onChange={onChangeFname} />
                        <p className="err-msg">{fnameErrMsg ? "First Name can not be empty":""}</p>
                        
                        <label className="register-page-label" htmlFor="lastName">Last Name</label>
                        <input className="register-input-field" type="text" id="lastName" value={lname} placeholder="Last Name" onChange={onChangeLname} />
                        <p className="err-msg">{lnameErrMsg? "Last Name can not be empty":""}</p>
                    </div>

                    <div className="register-input-fields-container">
                        <label className="register-page-label" htmlFor="username">Username</label>
                        <input className="register-input-field" type="text" id="username" value={uname} placeholder="Username" onChange={onChangeUname} />
                        <p className="err-msg">{unameErrMsg? "Username can not be empty":""}</p>
                        
                        <label className="register-page-label" htmlFor="email">Email</label>
                        <input className="register-input-field" type="email" id="email" value={email} placeholder="Email" onChange={onChangeEmail} />
                        <p className="err-msg">{emailErrMsg}</p>
                    </div>

                    <div className="register-input-fields-container">
                        <label className="register-page-label" htmlFor="password">Password</label>
                        <input className="register-input-field" type="password" id="password" value={password} placeholder="Password" onChange={onChangePassword} />
                        <p className="err-msg">{passwordErrMsg}</p>
                        
                        <label className="register-page-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input className="register-input-field" type="password" id="confirmPassword" value={confirmPassword} placeholder="Confirm Password" onChange={onChangeConfirmPassword} />
                        <p className="err-msg">{confirmPasswordErrMsg}</p>
                    </div>
                    
                    
                <div className='register-button-container'>
                    <button type="submit" className="register-button">Register</button>
                </div>
                </form>
                <p className='server-err-msg'>{apiStatus.serverErrMsg}</p>
            </div>
        )
    }



    switch(apiStatus.apiState){
        case apiStatusConstants.initial:
            return formView();
        case apiStatusConstants.loading:
            return loadingView(); 
        case apiStatusConstants.failure:
            return formView(); 
        default:
            return null; 
    }
    
}
export default Register 