import { useNavigate } from 'react-router-dom'
import './css/ErrorPage.css'

const ErrorPage = ()=>{
    const Navigate = useNavigate()

    const handleBackBtn = () =>{
        Navigate('/home')
    }

    return(
        <>
            <div id="errorPage">
                <div id="leftSection">
                    <h1 className='errorText'>404 - error</h1>
                    <h2 className='errorText'>Page not found</h2>
                    <h6 className='errorText'>Oops! something wrong</h6>
                    <button onClick={handleBackBtn}>Back to Home</button>
                </div>
                <div id="rightSection">
                    <img src="/astronaut.png" alt="" />
                </div>
            </div>
        </>
    )
}

export default ErrorPage;