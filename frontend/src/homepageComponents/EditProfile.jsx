import { useEffect, useRef, useState } from 'react';
import './css/EditProfile.css';
import axios from 'axios';
import { API_BASE_URL } from '../env';
import { useDispatch } from 'react-redux';
import { showNotification } from '../redux/slices/notificationSlice';

const EditProfile = () => {
    // State variables for the forms
    let [age, setage] = useState(0)
    let [phoneNo, setphoneNo] = useState(0)
    let [location, setlocation] = useState('')
    let [bio, setbio] = useState('')


    // Constants
    const bioRef = useRef()
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()


    function autoHeightTextarea(e) {
        e.target.style.height = `40px`;
        let autoHeight = e.target.scrollHeight;
        e.target.style.height = `${autoHeight}px`
    }


    function handleSubmitForDetails(e) {
        e.preventDefault()
        let formData = {
            age: age || null,
            phoneNo: phoneNo || null,
            location: location !== '' ? location : null
        }
        if (!age && !phoneNo && !location) {
            return dispatch(showNotification({ type: 'failed', content: 'Fill at least one field' }))
        }
        axios.put(`${API_BASE_URL}/api/user/edit`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                dispatch(showNotification({ type: 'success', content: 'Updated Details Successfully' }))
                setage(0)
                setphoneNo(0)
                setlocation('')
            })
            .catch((err) => {
                console.log(err)
                dispatch(showNotification({ type: 'failed', content: 'Error Updating Details' }))
            })
    }

    function handleSubmitForBio(e) {
        e.preventDefault()
        let formData = {
            bio: bio
        }
        if (bio !== '') {

            axios.put(`${API_BASE_URL}/api/user/updatebio`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    console.log(res.data)
                    dispatch(showNotification({ type: 'success', content: 'Updated Bio Successfully' }))
                    setbio('')

                })
                .catch((err) => {
                    console.log(err)
                    dispatch(showNotification({ type: 'failed', content: 'Error Updating Bio' }))
                })
        } else {
            dispatch(showNotification({ type: 'failed', content: 'Enter Bio First' }))
        }
    }


    useEffect(() => {

    }, [])

    return (
        <>
            <div id="editProfile">
                <h3 className='mb-5'>Edit Profile</h3>
                <div className="options">
                    <ul className='list-unstyled'>
                        <li>
                            <details name='accordion'>
                                <summary>Change Personal Information</summary>
                                <div className="editUserDetailsForm">
                                    <form onSubmit={handleSubmitForDetails}>
                                        <div className="formGroup">
                                            <label htmlFor="editAge">Age</label>
                                            <input onChange={(e) => setage(e.target.value)} type="number" value={age || ''} placeholder='Enter your age' name="editAge" id="editAge" />
                                        </div>
                                        <div className="formGroup">
                                            <label htmlFor="editPhone">Phone No.</label>
                                            <span>
                                                <input onChange={(e) => setphoneNo(e.target.value)} type="tel" value={phoneNo || ""} placeholder="Telephone Number" name='editPhone' id='editPhone' />
                                            </span>
                                        </div>
                                        <div className="formGroup">
                                            <label htmlFor="editLocation">Location</label>
                                            <input onChange={(e) => setlocation(e.target.value)} type="text" value={location} placeholder='Enter your location' name="editLocation" id="editLocation" />
                                        </div>
                                        <button className='btn btn-primary mt-3' type="submit">Submit</button>
                                    </form>
                                </div>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>Change Bio</summary>
                                <div className="editUserDetailsForm">
                                    <form onSubmit={handleSubmitForBio}>
                                        <div className="formGroup">
                                            <label htmlFor="editBio">Bio</label>
                                            <textarea ref={bioRef} className='bioTextarea' onChange={(e) => { setbio(e.target.value); autoHeightTextarea(e) }} name="editBio" id="editBio" placeholder='Enter a Bio' maxLength={100}></textarea>
                                            <button className='btn btn-primary mt-2' type="submit">Set Bio</button>
                                        </div>
                                    </form>
                                </div>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default EditProfile;