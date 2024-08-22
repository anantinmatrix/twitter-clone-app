import './css/DeleteModal.css'
import { useRef, useEffect, useState } from 'react';


function DeleteModal({ show , closeFunc, deleteFunc}) {

    const [toggleShow, settoggleShow] = useState(show)
    const deleteModalRef = useRef()


    // Show and hide modal functions
    const handleClickOutside = (event) => {
        if (deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
            closeFunc()
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])
    // 

    // It will be visible when show prop is true
    useEffect(() => {
        settoggleShow(show)
    }, [show])
    // 


    return (
        <div id='deleteModal' style={{ display: toggleShow ? "flex" : "none" }}>
            <div ref={deleteModalRef} className="deleteModalBody">
                <h5>Are you sure you want to delete this post?</h5>
                <hr />
                <div className="deleteModalBtns">
                    <button className='btn btn-light' onClick={closeFunc}>Cancel</button>
                    <button className='btn btn-danger' onClick={deleteFunc}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal;