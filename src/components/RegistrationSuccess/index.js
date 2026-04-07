import { TiTickOutline } from "react-icons/ti";
import './index.css' 

const RegistrationSuccess=(props)=>{

    const backToLogin=()=>{
        const {history}=props; 
        history.replace('/login'); 
    }
    return(
        <div className="register-success-bg-container">
            <div className="register-success-card">
               <TiTickOutline className="register-success-icon" />
                <h1 className="register-success-heading">User Registered Successfully</h1>
                <button className="back-to-login-button" onClick={backToLogin}>Back to Login</button>
            </div>
        </div>
    )
}
export default RegistrationSuccess; 



