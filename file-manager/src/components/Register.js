import bg from '../assets/register-bg.svg'
import { useMoralis } from "react-moralis";

function setWalletAddress(walletAddress) {
    let walletText = document.querySelector('.wallet-text')
    walletText.innerHTML = `${walletAddress}`
    document.cookie = `walletAddress=${walletAddress}`
}

function Register() {
    const { authenticate, isAuthenticated, user } = useMoralis();
    return (
        <div className="register-container" style={{backgroundImage: `url(${bg})`}}>
            <div className="register-form-container">
                <div><h2 className="register-title">Interplanetary File Manager</h2></div>
                <div className="auth-button" onClick={() => {
                    authenticate();
                    setWalletAddress(user.get("ethAddress"))
                    }}>
                    <a href='#file-manager'>Authenticate Wallet</a>
                </div>
            </div>
        </div>
    )
}

export default Register;