import { useState } from 'react';
import './css/EditProfileImagesModal.css';

const EditCoverImagesModal = ({ show, closeFunction, editImageFunction, sendImage }) => {
    let [imagePreview, setimagePreview] = useState(null)

    function uploadImage(e) {
        let file = e.target.files[0];
        console.log(file)
        let url = URL.createObjectURL(file)
        setimagePreview(url)
        sendImage(file)
    }

    function handleClose() {
        closeFunction()
        setimagePreview(null)
        sendImage(null)
    }

    async function handleSubmit() {
        editImageFunction();
        closeFunction()
        setimagePreview(null)
        sendImage(null)

    }


    return (
        <>
            <div  id="editImageModal" style={show ? { display: 'block' } : { display: 'none' }}>
                <div className="editImageBody">
                    <h5>Edit Cover Image</h5>
                    <hr />
                    <div className="editImageForm">
                        <form>
                            {imagePreview ?
                                <>
                                    <div className='formImagePreview'>
                                        <img src={imagePreview} alt="preview_image" />
                                    </div>
                                    <div>
                                        <label htmlFor="editCoverImage">
                                            <div className="editImageLabel">
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        </label>
                                        <input type="file" accept='image/' onChange={(e) => { uploadImage(e) }} name="editCoverImage" id="editCoverImage" />
                                        <p className='text-center mt-2'>Change Image</p>
                                    </div>
                                </>
                                :
                                <>
                                    <label htmlFor="editCoverImage">
                                        <div className="editImageLabel">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </label>
                                    <input type="file" accept='image/' onChange={(e) => { uploadImage(e) }} name="editCoverImage" id="editCoverImage" />
                                    <p className='text-center mt-2'>Upload Image</p>
                                </>
                            }
                            <div className="buttonGroup">
                                <button type='button' onClick={handleClose} className='btn btn-light'>Close</button>
                                <button type='button' onClick={handleSubmit} className="btn btn-primary">Done</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditCoverImagesModal;