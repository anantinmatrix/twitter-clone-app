import './css/ReportModal.css'
import { useRef, useEffect, useState } from 'react';


function ReportModal({ show , closeFunc, reportFunc}) {

    const [toggleShow, settoggleShow] = useState(show)
    const ReportModalRef = useRef()
    let [inputText, setinputText] = useState('')


    // Show and hide modal functions
    const handleClickOutside = (event) => {
        if (ReportModalRef.current && !ReportModalRef.current.contains(event.target)) {
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

    function handleSubmit(){
        setinputText('')
        reportFunc()
        closeFunc()
    }

    // It will be visible when show prop is true
    useEffect(() => {
        settoggleShow(show)
    }, [show])
    // 


    return (
        <div id='reportModal' style={{ display: toggleShow ? "flex" : "none" }}>
            <div ref={ReportModalRef} className="reportModalBody">
                <h5>Are you sure you want to Report this post?</h5>
                <hr />
                <p>Reason to Report</p>
                <form>
                    <textarea className='addThoughtInput' value={inputText}  name="reportTextarea" id="reportTextarea" maxLength={100} onChange={(e)=>{setinputText(e.target.value)}}></textarea>
                </form>
                <div className="reportModalBtns">
                    <button className='btn btn-light' onClick={closeFunc}>Cancel</button>
                    <button className='btn btn-danger' onClick={handleSubmit}>Report</button>
                </div>
            </div>
        </div>
    )
}

export default ReportModal;